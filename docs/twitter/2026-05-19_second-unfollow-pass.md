<!-- docs/twitter/2026-05-19_second-unfollow-pass.md -->

# Second Unfollow Pass — @9takesdotcom

**Date opened:** 2026-05-19
**Status:** In progress — data-gathering step pending
**Goal:** Bring following count from 191 → <130 (audit goal) by cutting the ~120 off-topic / low-signal accounts that the original audit didn't reach.

---

## Why a second pass is needed

The original 2026-05-19 audit caught 7 obvious off-topic accounts (`@BrianMcGinnisNC`, `@saylor`, `@LifeMathMoney`, `@xrpjack718`, `@Fliktastic`, `@BBCWorld`, `@threadreaderapp`) — all now unfollowed. But the audit explicitly noted: _"There are 156 follows I didn't see — apply the same principles below."_

Since then, 16 P-tier follows were added (good additions). The current count is 191. That means ~167 of DJ's 191 follows have never been individually classified. The audit estimates that ~120 of those are off-topic dilution that's keeping the algorithm confused about who 9takesdotcom is.

---

## Why we don't have the full list yet

Programmatic scraping of `https://x.com/9takesdotcom/following` failed today: X's lazy-load only feeds 25–30 cells via the in-page script, then stops responding to programmatic scrolls (likely anti-automation throttling on this endpoint specifically). We captured 27 of 191.

**The 27 captured** (most-recent follows + a few "Who to follow" stragglers that accidentally got picked up):

All P-tier accounts we just followed are present and confirmed (P0–P2 follow queue items). Plus already-aligned celebrity/therapy accounts. None of the 27 are unfollow candidates — they're either fresh adds or aligned KEEP accounts. The ~164 older follows are what needs the audit pass.

---

## Recommended data-gathering options (pick one)

### Option A — X Data Export (cleanest, slowest)

1. Go to https://x.com/settings/your_twitter_data
2. Request your data archive ("Download an archive of your data")
3. X emails a download link in 24–48 hours
4. The archive contains `data/following.js` with all 191 handles as JSON
5. Paste that handle list into this doc, then we classify in one batch

**Pros:** Complete, accurate, no scraping. **Cons:** 24–48h wait.

### Option B — Manual scroll capture (fastest if patient)

While DJ manually scrolls his `/following` page, a paste-in script accumulates handles + bios into the browser's localStorage. After the bottom of the list, paste the export back into this doc.

**Paste this into the DevTools console** on `https://x.com/9takesdotcom/following`:

```js
(() => {
	window.__djFollows = window.__djFollows || new Map();
	const harvest = () => {
		document.querySelectorAll('[data-testid="UserCell"]').forEach((cell) => {
			const a = cell.querySelector('a[role="link"][href^="/"]');
			const m = a?.getAttribute('href')?.match(/^\/([A-Za-z0-9_]+)$/);
			if (!m) return;
			const handle = m[1];
			if (window.__djFollows.has(handle)) return;
			const t = cell.innerText
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean);
			const i = t.findIndex((s) => s === 'Follow' || s === 'Following');
			window.__djFollows.set(handle, {
				handle,
				name: t[0] || '',
				bio: (i >= 0 ? t.slice(i + 1).join(' ') : '').slice(0, 250)
			});
		});
		console.log(`captured: ${window.__djFollows.size}`);
	};
	if (window.__djInterval) clearInterval(window.__djInterval);
	window.__djInterval = setInterval(harvest, 800);
	console.log(
		'Collector running. Manually scroll the following list slowly. When done, run: copy(JSON.stringify(Array.from(window.__djFollows.values())))'
	);
})();
```

Then DJ scrolls slowly through the list (~2-3 minutes for 191 accounts). When done, in the console:

```js
copy(JSON.stringify(Array.from(window.__djFollows.values()), null, 2));
```

Paste the JSON into a comment block in this doc. Then we classify.

### Option C — Quick visual audit (if you don't want a complete list)

Open `/following` and scroll. Flag candidates as you go. Cut anyone matching the criteria below. This is faster but inevitably misses some.

---

## Classification criteria (apply consistently)

### CUT (unfollow) — high confidence

- **Political / electoral accounts** — politicians, campaigns, partisan commentary
- **Crypto / finance maximalists** — bitcoin, NFT, "make $X by Tuesday" accounts
- **Manosphere / dating-advice-for-men** — Andrew Tate-style, RedPill-adjacent
- **News organizations** — flood feed with off-topic news
- **Mass-celebrity creators that don't engage** — anyone with >500K followers that wouldn't reply to a 30-follower account (apply unless DJ actually reads them, e.g. tferriss/jayshetty if he doesn't)
- **Utility / bot accounts** — threadreaderapp-style. @-mention when needed, don't follow.
- **Sports / military / hobby-only accounts** unless DJ actively engages with that content
- **Dead accounts** — no posts in 30 days OR bio + recent posts don't match psychology / personality / attachment / typology / writing / coaching

### KEEP — high confidence

- **Psychology / psychiatry voices** — therapists, psychiatrists, attachment specialists
- **Enneagram / typology accounts** — Beth McCord, Big Hormone, etc.
- **Typology Twitter mutuals (sx/sp/so + type tags)** — they engage back
- **Writers / cognitive essayists in DJ's lane** — Gurwinder, Haidt, Pinker
- **Anyone DJ has interacted with in last 30 days** (replies received from, reposted by, replied to multiple times)
- **Mutuals (Follows you)** — never cut without checking

### THINK ABOUT IT (manual judgment call)

- **Adjacent self-help / personal-growth accounts** — Chris Williamson, Lewis Howes, Amanda Goetz. Keep if DJ reads them; cut if not.
- **Tangential but smart accounts** (philosophy, cognition, marketing) — cut unless DJ specifically engages with them
- **Accounts followed for one-time reasons** (e.g., a podcast guest he listened to once) — cut

---

## Already-confirmed KEEP list (don't cut these)

Pulled from `docs/twitter/follow-tracker.md` + this session's adds:

**Original KEEP (audit):**

- `@enneagram_coach`, `@bhenneagram`, `@juliemenanno`, `@ModernTherapist`, `@psychotherapian`, `@nilegomez`, `@JonHaidt`, `@sapinker`, `@G_S_Bhogal`

**P0–P2 follows from this session:**

- `@HeidiPriebe1`, `@Theholisticpsyc`, `@brianmaierhofer`, `@sunnkssdseraph`
- `@AllenFrancesMD`, `@drjenwolkin`, `@GrantHBrennerMD`, `@thegarybrecka`
- `@shug898`, `@bxnnysundae`, `@kamaz_jaja`, `@David_333_555`, `@telonator`, `@NENESHECHKA993`, `@Drwinarick`

**Earlier good adds (2026-05-19 batch):**

- `@thebeautyofsaas`, `@edgaralandough`, `@proud_penelope`, `@HeidiBriones`, `@ZorayaBlack_`, `@daatdarling`, `@DionysianAgent`, `@rahulpandita`, `@AdamLaneSmith`

That's **33 confirmed KEEP** accounts. The other ~158 need the second-pass review.

---

## After the data-gathering step

Once we have the full list (via Option A, B, or C):

1. Paste the full list into a `## Candidate Accounts` section below
2. Tag each with: KEEP / CUT / THINK
3. Run a `/twitter-followup` session that unfollows everyone tagged CUT — should be ~50-80 accounts
4. Update `docs/twitter/follow-tracker.md` counters
5. Goal: <130 following count, KEEP list intact

---

## Candidate Accounts (paste data here when collected)

_(Empty — fill in after Option A or B completes)_
