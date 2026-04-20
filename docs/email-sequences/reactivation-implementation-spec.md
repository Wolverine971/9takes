<!-- docs/email-sequences/reactivation-implementation-spec.md -->

# Reactivation Sequence — Implementation Spec

**Status:** Spec / Pre-build
**Created:** 2026-04-20
**Related:** [reactivation-sequence-plan.md](./reactivation-sequence-plan.md) · [reactivation-sequence-copy.md](./reactivation-sequence-copy.md)

This spec is what DJ needs to review before any code gets written. It documents the concrete implementation path, calls out the two blocking decisions, and lists the files that will change.

---

## 1. The two blocking decisions

### 1.1 — `signups` table contacts can't use the current enrollment pipeline

**Finding:** `email_sequence_enrollments.user_id` is `UUID NOT NULL` (migration `20260316_welcome_email_sequence.sql:32`). The `enroll_user_in_sequence` RPC takes `p_user_id UUID` as required. The 38 rows in `signups` don't have auth user IDs — they're email-only leads.

**Options:**

| Option                              | How                                                                                                                | Pros                                            | Cons                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| **A. Synthesize UUIDs for signups** | Use `gen_random_uuid()` at enrollment time, store back on `signups` as `auth_user_id`-style reference              | Reuses all existing sequence infra as-is        | Muddles semantics; `user_id` no longer points to `auth.users` for these enrollments |
| **B. Relax the schema**             | Migration: `user_id UUID NULL` + add check constraint requiring either `user_id` OR `recipient_source = 'signups'` | Clean semantics. Signups handled as first-class | Touches welcome sequence infra; slight risk of regressions                          |
| **C. Separate path for signups**    | Skip the sequence engine entirely for the 38 signups; use `scheduled_emails` table (one-off send per step)         | Zero risk to welcome sequence                   | Duplicates cadence logic. Harder to track engagement consistently                   |

**Recommendation: Option B.** It's the cleanest long-term. The welcome sequence only currently triggers on user registration (which always has a user_id), so the nullable change doesn't affect it. We can add the check constraint to make intent explicit. Blocker cost: one migration + one code change in the enroll RPC.

**Need from DJ:** pick A / B / C.

### 1.2 — One sequence with bucket tokens vs. three parallel sequences

The plan §8.2 flagged this. Now that we have concrete copy:

| Approach                                                         | Fit                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **One sequence, `{{bucket}}` token in templates**                | Email 1 needs 3 variant openers. The existing `email_sequence_steps` table has one `subject` and one `html_content` per step — no conditional rendering. Would require either (a) preprocessing the HTML in JS before insert, or (b) adding conditional logic to the template engine. |
| **Three sequences (`reactivation_cold`, `_dormant`, `_zombie`)** | Three rows in `email_sequences`, identical steps 2–5, different step 1 per sequence. Admin dashboard shows per-bucket metrics for free. Enrollment function picks the right sequence key based on age.                                                                                |

**Recommendation: three sequences.** The Email 1 variance is only in opener + subject; steps 2–5 are literally the same content. Duplication is 5 rows per sequence × 3 = 15 rows, trivial. Cleaner metrics, simpler template engine.

**Need from DJ:** confirm three-sequence approach or push back.

---

## 2. Migration plan

### 2.1 — New migration file

**Path:** `supabase/migrations/20260420_reactivation_email_sequence.sql`

**Contents (outline, not final SQL):**

1. If pursuing **Option B above**: `ALTER TABLE email_sequence_enrollments ALTER COLUMN user_id DROP NOT NULL;` plus a check constraint: `CHECK (user_id IS NOT NULL OR recipient_source = 'signups')`.
2. Insert three `email_sequences` rows:
   - `key = 'reactivation_cold'`, `display_name = 'Reactivation — Cold (30–90d)'`, `trigger_type = 'manual'`, `status = 'draft'` (flip to active when ready)
   - `key = 'reactivation_dormant'`, `display_name = 'Reactivation — Dormant (90–365d)'`, same
   - `key = 'reactivation_zombies'`, `display_name = 'Reactivation — Zombies (365+d)'`, same
3. Insert 5 `email_sequence_steps` per sequence (15 total). Delays:
   - Step 1: `delay_days_after_previous = 0`
   - Step 2: `5`
   - Step 3: `7`
   - Step 4: `7`
   - Step 5: `5`
4. RPC variants (mirror the welcome pattern):
   - `enroll_user_in_reactivation_sequence(p_user_id, p_email, p_bucket, p_recipient_source, p_recipient_source_id)` — routes to the right sequence key by bucket.
   - Alternatively: just reuse existing `enroll_user_in_sequence` and have JS pick the key. **Simpler. Prefer this.**
5. Re-permission support (see §5 below): new columns on `profiles` and `signups`, or a shared `email_repermission` table. Defer to §5 decision.

### 2.2 — What to NOT touch

- `email_sequences` existing welcome row — untouched
- `email_sequence_steps` for welcome — untouched
- Existing RPCs (`enroll_user_in_sequence`, `claim_pending_sequence_sends`, `exit_user_from_sequence`, `exit_email_from_sequence`) — untouched. They already work with arbitrary sequence keys.

**Low-risk migration.** Mostly inserts.

---

## 3. Content module

### 3.1 — New file

**Path:** `src/lib/email/reactivation-sequence-content.ts`

**Shape:**

```ts
export const REACTIVATION_COLD_KEY = 'reactivation_cold';
export const REACTIVATION_DORMANT_KEY = 'reactivation_dormant';
export const REACTIVATION_ZOMBIES_KEY = 'reactivation_zombies';

export type ReactivationSequenceContent = {
	sequenceKey: string;
	stepNumber: number;
	subject: string;
	preheader: string;
	htmlContent: string;
	plainText: string;
};

export const REACTIVATION_SEQUENCE_CONTENT: ReactivationSequenceContent[] = [
	// 15 entries: 3 sequences × 5 steps
	// Step 1 differs per sequence; steps 2–5 share content but are duplicated per sequence for simplicity.
];
```

### 3.2 — Integration with existing renderer

`src/lib/email/sequences.ts:getManagedSequenceContent()` currently only handles `WELCOME_SEQUENCE_KEY`. Extend it:

```ts
export function getManagedSequenceContent(
	sequenceKey: string,
	stepNumber: number
): WelcomeSequenceContent | ReactivationSequenceContent | null {
	if (sequenceKey === WELCOME_SEQUENCE_KEY) {
		return WELCOME_SEQUENCE_CONTENT_BY_STEP.get(stepNumber) ?? null;
	}
	if (REACTIVATION_KEYS.has(sequenceKey)) {
		return getReactivationStep(sequenceKey, stepNumber);
	}
	return null;
}
```

### 3.3 — New personalization tokens

Currently supported (from `src/lib/email/sequences.ts` token replacement): `{{first_name}}`, `{{questions_url}}`, `{{enneagram}}`.

**Need to add:**

- `{{signup_month_year}}` — e.g. "November 2024"
- `{{signup_year}}` — e.g. "2024"
- `{{signup_months_ago}}` — integer months since signup
- `{{hero_url}}` — configurable per send; default `https://9takes.com/community/enneagram-and-mental-illness`
- `{{re_permission_yes_url}}` — tracking-link to confirm endpoint
- `{{re_permission_no_url}}` — tracking-link to suppress endpoint

Token computation happens at send time in `prepareSequenceSend()`. Add a branch for reactivation sequences that computes these from the enrollment record's `enrolled_at` or from `profiles.created_at` / `signups.created_at`.

---

## 4. Enrollment function

**Path:** add to `src/lib/server/emailSequences.ts`

**Signature:**

```ts
export async function enrollDormantCandidatesInReactivationSequence(options: {
	dryRun?: boolean; // default true — return candidate counts without inserting
	limit?: number; // cap enrollments per run (warmup control)
	buckets?: Array<'cold' | 'dormant' | 'zombies'>; // default all three
}): Promise<{
	enrolled: { cold: number; dormant: number; zombies: number };
	skipped: { reason: string; count: number }[];
}>;
```

### 4.1 — Candidate selection logic

Mirror the SQL in `reactivation-bucket-breakdown.sql`:

1. Union `profiles` + `signups` (profiles wins on email collision)
2. Filter: non-null email, non-empty, email format valid
3. Exclude: in `email_unsubscribes`, `signups.unsubscribed_date` set, already-enrolled in any `welcome_sequence` OR any `reactivation_*` sequence
4. Bucket assignment: cold (30–89d), dormant (90–364d), zombies (365+d)
5. For each candidate, call `enroll_user_in_sequence` with the right key

### 4.2 — Safety guards

- **Default `dryRun = true`** — forces explicit opt-in to actually insert enrollments
- **Default `limit = 50`** — one run enrolls at most 50 users, supports warmup pacing
- **Respect bucket order** — cold first, then dormant, then zombies when limit constrains

### 4.3 — Exposure

Build a minimal admin route: `POST /admin/email-dashboard/reactivation-enroll` that accepts `{ dryRun, limit, buckets }` and calls this function. Admin-only via existing guard.

Alternative: invoke via a `pnpm` script that runs the function directly. Simpler. Either works.

---

## 5. Re-permission endpoint

### 5.1 — Storage

Add columns:

- `profiles.re_permissioned_at TIMESTAMPTZ NULL`
- `signups.re_permissioned_at TIMESTAMPTZ NULL`

(Simpler than a shared table; both row types already have all the identity we need.)

### 5.2 — Endpoints

| Route                                        | Method | Behavior                                                                                                                                                                          |
| -------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/email/re-permission/yes/[tracking_id]` | GET    | Set `re_permissioned_at = NOW()`. Exit user from their reactivation sequence with reason `re_permissioned`. Redirect to `9takes.com/thanks-for-staying` (or similar simple page). |
| `/api/email/re-permission/no/[tracking_id]`  | GET    | Insert into `email_unsubscribes`. Exit user from sequence with reason `unsubscribed_via_repermission`. Redirect to `9takes.com/goodbye`.                                          |

Both use the existing `email_tracking_links` / `email_sends` lookup pattern (whatever the welcome sequence uses for the unsubscribe link). Don't reinvent.

### 5.3 — Landing pages

Two tiny routes:

- `src/routes/thanks-for-staying/+page.svelte` — "Cool, see you around."
- `src/routes/goodbye/+page.svelte` — "You're off the list. Thanks for the time you gave."

Both minimal, inherit site layout.

---

## 6. File change summary

| Path                                                              | Action         | Purpose                                                      |
| ----------------------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| `supabase/migrations/20260420_reactivation_email_sequence.sql`    | NEW            | Schema (if Option B) + sequence rows + steps                 |
| `src/lib/email/reactivation-sequence-content.ts`                  | NEW            | Copy, token shape, exports                                   |
| `src/lib/email/sequences.ts`                                      | MODIFY         | Extend `getManagedSequenceContent` + add reactivation tokens |
| `src/lib/server/emailSequences.ts`                                | MODIFY         | Add `enrollDormantCandidatesInReactivationSequence`          |
| `src/routes/api/email/re-permission/yes/[tracking_id]/+server.ts` | NEW            | Confirm handler                                              |
| `src/routes/api/email/re-permission/no/[tracking_id]/+server.ts`  | NEW            | Unsubscribe handler                                          |
| `src/routes/thanks-for-staying/+page.svelte`                      | NEW            | Confirm landing                                              |
| `src/routes/goodbye/+page.svelte`                                 | NEW            | Unsub landing                                                |
| `src/routes/admin/email-dashboard/reactivation-enroll/+server.ts` | NEW (optional) | Admin-triggered enrollment                                   |
| `docs/email-sequences/README.md`                                  | MODIFY         | Link new sequence docs (done)                                |

**Total new files:** 6–7. **Modifications:** 3 code files + 1 doc. Manageable for one PR.

---

## 7. Execution order (once decisions are made)

1. DJ resolves blockers §1.1 and §1.2
2. DJ reviews copy (`reactivation-sequence-copy.md`), fills in Email 2 story, flags any voice issues
3. DJ runs bucket query (`reactivation-bucket-breakdown.sql`) → plug real counts into plan
4. DJ runs pre-launch deliverability action items from plan §9
5. Build migration + content module + enrollment function + re-permission endpoints (one PR)
6. Test in dev with a seed of ~3 test addresses DJ controls
7. Set sequence status `draft → active` in DB when ready
8. Run `enrollDormantCandidatesInReactivationSequence({ dryRun: false, limit: 10, buckets: ['cold'] })` — first warmup batch
9. Monitor complaint rate for 24h before next batch
10. Scale per plan §9 warmup schedule

---

## 8. Open questions

Carried over from the plan doc, still unresolved:

- **Email 2 story content** — DJ writes
- **Hero content for Email 1** — confirm `enneagram-and-mental-illness` or swap
- **Email 3 specific thread** — pick a real 9takes question to link (or keep generic `{{questions_url}}`)
- **Post-reactivation cadence** — what does "yes, keep me in" actually opt you into? See plan §10.4.
- **Re-permission flag usage** — does `re_permissioned_at` gate future non-transactional email, or is it informative only?

---

## 9. Changelog

- **2026-04-20** — Initial spec. Two blocking decisions identified. Ready for DJ review.
