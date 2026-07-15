<!-- docs/development/question-answer-media-spec.md -->

# Question Answer Media Spec

**Status:** Proposed  
**Owner:** 9takes  
**Date:** 2026-07-14  
**Recommendation:** Ship authenticated voice notes first. Defer camera video until usage proves the demand.

## Decision

Voice notes are possible in the existing question-answering flow and are a reasonable Supabase Storage workload.

Camera video is also technically possible, including direct browser recording and Supabase Storage uploads. It should not be the first release. The storage bill is manageable; the costly part is producing a reliable and safe video product across browsers and mobile networks.

For both formats:

- Store the media object in Supabase Storage, never in Postgres and never as base64.
- Store only metadata and the storage path in Postgres.
- Upload directly from the browser to Supabase with a short-lived signed, resumable upload URL. Do not proxy media bytes through SvelteKit/Vercel.
- Use a private bucket so the existing “answer to unlock” rule cannot be bypassed with a public object URL.

## Why Voice First

| Concern             | Voice note                                                   | Camera video                                                                    |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Typical size        | About 0.5–1.1 MB for 90 seconds–3 minutes at 48 kbps         | About 17–23 MB for 90 seconds–2 minutes at 1.5 Mbps                             |
| Mobile upload       | Quick and usually reliable                                   | Noticeably slower; resumable upload is mandatory                                |
| Playback            | One compact player                                           | Larger UI, poster frame, orientation, and fullscreen behavior                   |
| Compatibility       | Two common recording families to test: WebM/Opus and MP4/AAC | Container, video codec, rotation, and cross-browser playback are more difficult |
| Processing          | Optional transcription                                       | Transcoding and poster generation are strongly recommended                      |
| Moderation          | Listen or use a transcript                                   | Watch the clip; visual and audio moderation are both needed                     |
| Privacy sensitivity | High                                                         | Very high because face, surroundings, and bystanders may be captured            |

The voice-note MVP validates the important product question: will people give richer answers when speaking is available? It does so without committing 9takes to being a video-hosting product.

## Storage Sizing

Approximate object size is:

```text
size in MB = bitrate in kilobits/second × seconds ÷ 8 ÷ 1000
```

Example planning assumptions:

| Scenario                           | Per answer | 10,000 retained answers |
| ---------------------------------- | ---------: | ----------------------: |
| Voice, 3 minutes at 48 kbps        |    1.08 MB |                 10.8 GB |
| Video, 2 minutes at 1.5 Mbps total |    22.5 MB |                  225 GB |

As of 2026-07-14, Supabase includes 1 GB of file storage on Free and 100 GB on Pro. Pro storage overage is $0.0213/GB-month. On those example assumptions, 225 GB of retained video would be about 125 GB above the included Pro storage, or roughly $2.66/month in storage overage before the rest of the project's usage. Delivery can matter more: Pro includes separate 250 GB cached and 250 GB uncached egress quotas, with overage currently listed at $0.03/GB cached and $0.09/GB uncached.

Therefore:

- Free tier is too small for a real media feature: roughly 925 maximum-length voice notes or 44 two-minute videos consume 1 GB before overhead.
- Pro is ample for a voice-note MVP.
- Pro can store short video clips, but video retention and repeat playback grow much faster than voice.
- Add usage alerts and a server-side kill switch before launch regardless of plan.

## Current 9takes Integration

The current top-level answer path is:

1. `src/lib/components/molecules/Interact.svelte` collects a required text `comment`.
2. It posts `FormData` to the `createCommentRando` action in `src/routes/questions/[slug]/+page.server.ts`.
3. `createCommentSchema` requires 1–5,000 text characters.
4. `create_comment_atomic` inserts the comment and preserves the give-first behavior.
5. `can_see_comments_3` considers that comment an answer and unlocks the thread.

Media should remain attached to a normal comment row. This preserves comment counts, likes, replies, flags, the existing thread unlock check, and most of the moderation flow.

Required structural changes:

- Allow an answer to contain text, one media attachment, or both. Replies remain text-only in the first release.
- Add media metadata to comment queries and the `Comment` TypeScript type.
- Render a media player inside `Comment.svelte`.
- Make flag/remove actions immediately block media playback in addition to updating the comment.

## Voice Note MVP Scope

### In scope

- Top-level question answers only; no audio replies.
- Authenticated users only for recording and posting media.
- Existing anonymous text answers remain unchanged.
- Record from the browser microphone.
- Maximum duration: 3 minutes.
- Maximum stored object size: 5 MB.
- Record, stop, preview, re-record, delete draft, upload, and post.
- Optional written caption/body, up to the existing 5,000-character limit.
- A voice-only answer unlocks the thread after finalization succeeds.
- Private playback that respects the give-first gate.
- Report, remove, and delete handling for media answers.
- Desktop and mobile Safari, Chrome, and Firefox QA.

### Out of scope

- Audio replies.
- Anonymous media uploads.
- Editing or replacing media after posting.
- Multiple attachments on one answer.
- Imported audio files.
- Waveform editing, trimming, noise removal, or effects.
- Automatic transcription in the first private beta.
- Video recording.

### Why require sign-in for media

The current anonymous text flow is intentionally low-friction, but anonymous binary uploads create a disproportionate spam, storage, moderation, ownership, and deletion burden. Sign-in gives every object a durable owner and makes a media MVP reversible. Anonymous voice can be reconsidered after abuse and conversion data exist.

## Composer UX

When `parentType === 'question'`, the open composer gains two modes:

- **Write** — the current text experience.
- **Record voice** — the voice-note experience.

The mode choice should not request microphone permission. Permission is requested only after the user presses **Start recording**.

Voice states:

1. **Idle** — explanation, 3:00 limit, privacy notice, Start recording.
2. **Requesting permission** — blocking but cancellable progress state.
3. **Recording** — elapsed timer, remaining time, live recording indicator, Stop.
4. **Preview** — player, duration, Re-record, Delete, optional caption, Post answer.
5. **Uploading** — byte progress and Cancel upload. Navigation warning while an upload is active.
6. **Finalizing** — upload is complete; the answer is being attached and posted.
7. **Posted** — normal optimistic answer state and comments unlock.
8. **Recoverable error** — retain the local Blob so the user can retry without recording again.

Required copy near Start recording:

> Your voice note will be posted with your answer. Do not record anyone who has not agreed to be included.

Permission-denied behavior must explain how to enable the microphone and keep the Write option available. Unsupported browsers keep the Write option and hide recording controls.

Do not add a decorative waveform in the MVP. A timer, recording indicator, upload progress, and usable player communicate the state with less code and less motion.

## Recording Format

Use `navigator.mediaDevices.getUserMedia({ audio: true })` and `MediaRecorder` in the client. These APIs require HTTPS (localhost also works for development) and explicit browser permission.

Choose the actual MIME type at runtime with `MediaRecorder.isTypeSupported(...)`; do not assume one format for every browser. Initial accepted families:

- `audio/mp4` with AAC where the browser supports recording it.
- `audio/webm` with Opus as the fallback.

Persist the MIME type returned by the recorder, not only the requested type. The bucket and finalization endpoint must use an allowlist. Cross-device recording/playback tests are an acceptance gate. If the originals are not reliably playable across the support matrix, add asynchronous normalization before public rollout rather than accumulating format-specific UI branches.

## Upload and Finalization Flow

```mermaid
sequenceDiagram
    participant U as User browser
    participant A as 9takes server
    participant S as Supabase Storage
    participant D as Postgres

    U->>A: Initialize upload (question, MIME, claimed bytes/duration)
    A->>A: Require session; validate question, rate, type, limits
    A->>D: Create pending media_upload
    A->>S: Create signed resumable upload token
    A-->>U: upload id, path, signed token
    U->>S: TUS upload directly in 6 MB chunks
    S-->>U: Upload complete
    U->>A: Finalize (upload id, optional text)
    A->>S: Verify object exists, size, MIME, and path
    A->>D: Atomically create comment + comment_media; attach upload
    A-->>U: Complete comment payload
    U->>U: Unlock comments and render answer
```

Supabase recommends resumable TUS uploads for files over 6 MB or unstable networks. Voice notes will usually be smaller, but using the same resumable path now avoids a second upload architecture if video is tested later and provides useful progress/retry behavior.

The media bytes must go directly to the Supabase Storage hostname. The SvelteKit server only authenticates, authorizes, creates signed tokens, validates completion, and writes metadata.

### Endpoints

Suggested SvelteKit routes:

- `POST /api/questions/[id]/answer-media/init`
  - Requires an authenticated session.
  - Accepts `kind`, `mimeType`, `sizeBytes`, `durationMs`, and a client-generated idempotency key.
  - Returns `uploadId`, `storagePath`, signed upload token, and expiry.
- `POST /api/questions/[id]/answer-media/finalize`
  - Requires the same user who initialized the upload.
  - Verifies the uploaded object from trusted Storage metadata.
  - Creates the comment and media record through one database RPC.
  - Is idempotent by `uploadId`.
- `GET /api/comments/[id]/media`
  - Reuses the question's existing answer gate.
  - Checks `comments.removed = false` and `comment_media.status = 'ready'`.
  - Redirects to a short-lived signed URL or returns one to the player.
- `DELETE /api/comments/[id]/media`
  - Owner/admin only.
  - Immediately marks the object unavailable, then deletes the Storage object.

### Failure rules

- Do not create or unlock a comment until upload finalization succeeds.
- Keep the recorded Blob in memory after a failed upload so Retry does not force a re-record.
- Pending uploads expire after 24 hours.
- A scheduled cleanup deletes expired pending objects and marks their upload rows `expired`.
- Finalization is idempotent so a retry cannot create duplicate comments.
- If comment creation succeeds but metadata response delivery fails, the idempotency key returns the existing comment.

## Storage Design

### Bucket

```text
answer-media
```

Configuration:

- Private bucket.
- Allowed types: the tested audio MIME allowlist.
- Bucket file-size limit: 5 MB for the voice MVP.
- No public read policy.
- Uploads use server-created signed upload tokens.
- Playback uses short-lived signed URLs only after the give-first check.

Suggested path:

```text
audio/{question_id}/{user_id}/{upload_id}.{extension}
```

Use immutable, random paths. Never overwrite a posted recording because CDN propagation can serve stale content.

## Database Design

Use a separate metadata table instead of adding media columns directly to `comments`. This keeps text comments cheap and allows a later video phase without turning the core comment row into a media lifecycle record.

### `media_uploads`

| Column         | Type          | Notes                                                |
| -------------- | ------------- | ---------------------------------------------------- |
| `id`           | `uuid`        | Primary key; also the idempotency key                |
| `question_id`  | `bigint`      | Target question                                      |
| `user_id`      | `uuid`        | Required in MVP; must equal `auth.uid()`             |
| `kind`         | `text`        | Check: `audio` or future `video`                     |
| `storage_path` | `text`        | Unique immutable object path                         |
| `mime_type`    | `text`        | Server allowlisted                                   |
| `size_bytes`   | `bigint`      | Trusted value set/confirmed at finalization          |
| `duration_ms`  | `integer`     | Client value initially; normalized probe value later |
| `status`       | `text`        | `pending`, `attached`, `expired`, `failed`           |
| `expires_at`   | `timestamptz` | Pending cleanup deadline                             |
| `created_at`   | `timestamptz` | Audit timestamp                                      |

### `comment_media`

| Column              | Type          | Notes                                                |
| ------------------- | ------------- | ---------------------------------------------------- |
| `id`                | `uuid`        | Primary key                                          |
| `comment_id`        | `bigint`      | Unique FK to `comments(id)` with cascade             |
| `upload_id`         | `uuid`        | Unique FK to `media_uploads(id)`                     |
| `kind`              | `text`        | `audio` now; `video` later                           |
| `storage_path`      | `text`        | Unique path; not a full URL                          |
| `mime_type`         | `text`        | Actual recorded MIME                                 |
| `size_bytes`        | `bigint`      | Enforced maximum                                     |
| `duration_ms`       | `integer`     | Player duration                                      |
| `status`            | `text`        | `ready`, `blocked`, `deleted`, future `processing`   |
| `transcript`        | `text`        | Nullable future accessibility/moderation field       |
| `transcript_status` | `text`        | `not_requested`, future `pending`, `ready`, `failed` |
| `created_at`        | `timestamptz` | Audit timestamp                                      |

The finalize RPC should:

1. Lock and validate the pending upload.
2. Verify the user and target question.
3. Create the comment with nullable/empty text only when a ready media attachment is supplied.
4. Create `comment_media`.
5. Mark `media_uploads.status = 'attached'`.
6. Preserve the current atomic comment count behavior.
7. Return the same public comment shape plus media metadata.

Demo mode should keep media disabled initially; do not create a parallel demo media lifecycle until it is needed.

## Access Control and Abuse Prevention

- Authenticated media uploads only in v1.
- Server-generated object paths; never accept an arbitrary client path.
- Validate question existence and media eligibility at both init and finalize.
- Rate limit upload initialization, finalization, and failed attempts by user and IP.
- Allow at most one pending upload per user/question and a small number per hour.
- Trust neither client MIME, duration, nor byte count. Verify Storage object metadata before attachment.
- Enforce the hard byte limit at the bucket and finalization layers.
- Never expose the service role key to the browser.
- Do not put object paths, signed URLs, or recording content into analytics or error telemetry.
- Add a configuration kill switch such as `voice_answers_enabled` and a storage-budget threshold.

## Playback and Give-First Privacy

The bucket must be private because community answers are intentionally hidden until the viewer contributes. A public Storage URL would bypass that rule even if the comment query remained gated.

The playback endpoint should determine the media's parent question, then apply the same session/fingerprint logic currently used by `can_see_comments_3`. Only then should it create a short-lived signed URL. It must also reject removed, blocked, deleted, pending, or expired media.

Signed URLs are bearer links until they expire. Keep their lifetime short (for example, 10 minutes) and do not persist them in Postgres.

## Moderation, Privacy, and Deletion

Voice is personal data and may contain sensitive information. The feature needs explicit recording/posting copy and a privacy-policy update before general availability.

Minimum moderation behavior:

- Existing comment Flag action flags the media answer as a unit.
- Admin comment review renders an authenticated audio preview and media metadata.
- Removing a comment immediately sets media status to `blocked`; playback fails even if physical deletion is delayed.
- Restoring a comment does not automatically restore media if an admin separately deleted the object.
- User deletion removes both metadata access and the Storage object.
- A daily reconciliation job finds unattached, missing, and unreferenced objects.

Automatic transcription is valuable for accessibility, search, and moderation, but it is not required to validate recording demand in a limited beta. Before a broad public launch, either provide a transcript workflow or require a useful text caption so audio is not the only way to consume the answer.

## Analytics

Add content-free events to the existing funnel system:

- `answer_mode_selected` with `mode = text | audio`
- `media_permission_result` with `granted | denied | unavailable`
- `media_recording_started`
- `media_recording_completed` with duration bucket only
- `media_recording_discarded`
- `media_upload_started`
- `media_upload_completed`
- `media_upload_failed` with coarse failure category
- `media_answer_finalized`
- `media_playback_started`
- `media_playback_completed` with completion bucket
- `media_answer_reported`

Primary product metric: completed answers per composer open, split by text and audio. Secondary metrics: average answer depth (text length or audio duration), upload completion, permission denial, re-record rate, reports, deletions, and play starts.

## Rollout

### Phase 0 — Instrument text baseline

- Confirm composer opens, started answers, completed answers, and give-first unlock conversion are measurable.
- Establish the current mobile completion rate.

### Phase 1 — Authenticated voice private beta

- Feature flag to selected users/admins.
- 3-minute/5 MB caps.
- Original-format playback after cross-browser validation.
- Manual admin moderation.
- Watch upload failure, report, and completion rates.

### Phase 2 — Voice general availability

- Add transcript/caption policy.
- Add orphan reconciliation and deletion verification dashboards.
- Enable for all authenticated users if beta completion and moderation metrics are healthy.

### Phase 3 — Short camera-video experiment

Only proceed if voice usage shows that spoken answers materially improve contribution.

Proposed experiment limits:

- Authenticated users only.
- 90 seconds.
- 720p target.
- Approximately 1.25 Mbps video plus 64 kbps audio.
- 25 MB hard limit.
- Front/rear camera switch where supported.
- Mandatory resumable upload.
- Asynchronous compatibility processing and poster creation before `ready`.

If video becomes a core engagement surface, evaluate a managed video pipeline rather than extending raw object storage into a homegrown transcoding/streaming system.

## Acceptance Criteria for Voice MVP

- A signed-in user can choose Write or Record voice on a top-level question.
- Microphone permission is requested only after an explicit user gesture.
- Recording stops automatically at 3:00.
- A user can preview, re-record, delete, retry, and post without losing the draft after a recoverable upload error.
- No accepted object can exceed 5 MB or the MIME allowlist.
- Media bytes do not pass through the SvelteKit server.
- Finalization creates exactly one comment and one attachment after retries.
- A voice-only answer unlocks comments only after finalization.
- A user who has not answered cannot retrieve another user's media URL.
- Removed/blocked media cannot be played.
- Storage objects are deleted when their answer is permanently deleted.
- The experience works in current mobile and desktop Safari, Chrome, and Firefox, or cleanly falls back to text.
- Keyboard controls, visible focus, status announcements, captions/labels, and reduced-motion behavior are verified.
- Analytics contain no audio, transcript, object path, or signed URL.

## Implementation Estimate

For one engineer familiar with this codebase:

- Storage, migrations, signed upload/finalize API, and cleanup: 2–3 days.
- Recorder/composer/player UI and optimistic integration: 2–3 days.
- Moderation, deletion, analytics, automated tests, and cross-browser QA: 2–4 days.

Expected voice MVP: roughly 6–10 engineering days. A credible camera-video release is a larger follow-on because it adds processing and a broader QA/moderation surface; estimate it separately after the voice beta.

## References

- [Supabase Storage pricing](https://supabase.com/docs/guides/storage/pricing)
- [Supabase egress pricing and usage](https://supabase.com/docs/guides/platform/manage-your-usage/egress)
- [Supabase resumable uploads](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
- [Supabase file limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [Supabase private buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [MDN: `getUserMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN: `MediaRecorder.mimeType`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/mimeType)
