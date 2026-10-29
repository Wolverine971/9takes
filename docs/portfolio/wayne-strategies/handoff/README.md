# 9takes → Wayne Strategies portfolio handoff

Completed October 29, 2026. Exact project slug: `9takes`.

This package replaces the generic 9takes portfolio treatment with seven source-backed stories, a portable Svelte 5 visual for each story, ten curated repository artworks, and two public product captures. Assets total **761,215 bytes (0.76 MB)**. No new images were generated, no member records were exported, and no production content was changed.

## Integration

Copy these files without changing their names:

| Source in this handoff | Destination in Wayne Strategies                                |
| ---------------------- | -------------------------------------------------------------- |
| `assets/*`             | `static/assets/work/projects/9takes/*`                         |
| `ProjectVisual.svelte` | `src/lib/components/work-projects/9takes/ProjectVisual.svelte` |
| `layers.json`          | `src/lib/components/work-projects/9takes/layers.json`          |

The first layer is `kind: "site"`, preserving the shell’s existing homepage screenshot as the closed card face. The component also supplies a public-site capture when rendering that layer directly.

```svelte
<ProjectVisual layerId={layer.id} compact={isSheet} animated={isActive} />
```

Give the parent a width and a 16:10 aspect ratio. The component fills the parent, contains its own styles, scales through a local CSS container, and has no application imports, remote font loads, APIs, or new runtime dependencies. It uses Inter/JetBrains Mono when the host provides them and system fallbacks otherwise. An unknown layer ID renders the nine-mask identity. The artwork has no interactive controls; the parent owns interaction.

`animated` affects only the illustrative voice waveform. It defaults to false and its animation is disabled by `prefers-reduced-motion: reduce`. The illustrations do not record, submit, or request microphone access.

## Story and design choices

| Layer ID       | What the client sees                                                | Why this is revealing                                                                                                         |
| -------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `site`         | Actual public homepage                                              | The product ritual is already on the front door: a question and an anonymous answer path.                                     |
| `answer-first` | An illustrated question, voice composer, and reveal                 | Participation order is the product’s distinguishing behavior. Voice is shown as transcript capture, not an audio social feed. |
| `discover`     | The actual three-emotion / nine-type map and friend-read route      | The flow preserves uncertainty, permits two types, and delays revealing a person’s own choice to a friend.                    |
| `profiles`     | Actual Jack Black, Dario Amodei, and Sydney Sweeney portrait assets | The personality library is a recognizable editorial product with hundreds of entries.                                         |
| `editorial`    | Real sculptural article covers beside the publishing process        | Research, claim-level evidence, multiple review lenses, revision, and verification support the content operation.             |
| `operations`   | A sanitized flag-review lifecycle                                   | Administration is implemented work, including pending-state checks and recovery paths.                                        |
| `brand`        | The actual nine-mask identity and original scene artwork            | Human expression, marble, and lamplight connect brand identity, editorial art, and product design.                            |

The visual direction follows `docs/design-system.md`: warm stone, sodium amber, marble, Inter, and monospaced annotations. Warm-paper layouts break up the sequence for the test and editorial layers. Purple is confined to the existing personality portraits, where the design system explicitly permits it. Historical purple interface styles and rejected logo concepts were not reused.

Compact variants suppress secondary footnotes and preserve the large headline, faces, type numbers, and workflow decisions. The portrait and editorial compositions use the real work as their main visual element. Galleries expose the larger source artwork and public captures for closer inspection.

## Source-to-export asset manifest

All source paths below are relative to `/Users/djwayne/9takes`. Existing artwork was only resized and encoded as WebP at quality 85, without upscaling, retouching, compositing, or changing its visual content. Screenshot files are the browser’s original JPEG exports.

| Export file             | Source                                                                         | Export size | Use                                                   |
| ----------------------- | ------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------- |
| `nine-masks.webp`       | `static/brand/9takes-nine-mask-logo-512.png`                                   | 512 × 512   | Brand, operations, fallback, gallery                  |
| `symposium.webp`        | `static/images/home-reimagined/circle-variations/03-athens-statues-small.webp` | 888 × 444   | Brand and gallery                                     |
| `community-circle.webp` | `static/images/home-reimagined/community-circle-neo-noir-v2-small.webp`        | 888 × 444   | Answer-first artwork                                  |
| `jack-black.webp`       | `static/types/7s/Jack-Black.webp`                                              | 640 × 640   | Personality series and gallery                        |
| `dario-amodei.webp`     | `static/types/5s/Dario-Amodei.webp`                                            | 480 × 480   | Personality series                                    |
| `sydney-sweeney.webp`   | `static/types/3s/Sydney-Sweeney.webp`                                          | 480 × 480   | Personality series                                    |
| `relationships.webp`    | `static/blogs/greek-statues-in-relationships.webp`                             | 900 × 502   | Publishing visual and gallery                         |
| `conflict.webp`         | `static/blogs/greek-statues-harmonic-conflict-styles.webp`                     | 900 × 502   | Publishing gallery                                    |
| `teamwork.webp`         | `static/blogs/greek-statues-building-a-boat.webp`                              | 900 × 900   | Publishing visual and gallery                         |
| `mercy.webp`            | `static/blogs/greek-statue-offering-mercy-under-streetlamp.webp`               | 900 × 514   | Brand visual and gallery                              |
| `home-public.jpg`       | [Public 9takes homepage](https://9takes.com/)                                  | 1280 × 720  | Site layer and gallery; October 29, 2026 capture      |
| `test-public.jpg`       | [Public Enneagram test](https://9takes.com/enneagram-test)                     | 1280 × 720  | Test gallery; October 29, 2026 emotion-selection step |

The homepage capture is an unsigned public page. Its activity totals are historical pixels, not outcome claims or live metrics. The test capture involved only Start → Got it; no personal answers, result, friend link, email, or form submission was saved. Public-figure portraits are editorial assets, not endorsements. The artwork manifest with per-file byte counts is also saved one level up as `asset-manifest.json`.

## Evidence and status boundaries

Every layer in `layers.json` includes internal repository evidence. Keep those paths out of client-facing copy.

- **Publicly verified:** homepage, answer-first positioning, anonymous answer path, test landing page and emotion-selection interface. Read-only public browser inspection confirmed these on October 29, 2026. No answer was posted and the end-to-end production flow was not exercised.
- **Test implementation:** inspected the pure state machine, content map, test component, result page, and friend-read source. `docs/taskers/T-42-scored-enneagram-test.md` records the October 6 implementation and deployment. Its earlier planning language and an old residual “deploy” checklist item conflict with that later completion entry; the public test was independently observed. Despite the historical tasker name, this is a self-pick flow, not a numeric-scoring or scientifically validated assessment.
- **Voice and reply return:** verified in `Interact.svelte`, `VoiceRecorder.svelte`, reply components, and associated routes. No microphone, transcription provider, notification, or delivery operation was invoked. Source implementation is the basis for these capability descriptions; this package is not a production service-health test.
- **Profiles:** the three chosen figures are featured by the public homepage and their assets exist in the repository. The claim of 462 published entries is explicitly tied to `src/lib/data/corpus-stats.json`, generated October 28, 2026. It is a repository snapshot, not a fresh database census, traffic metric, or clinical claim.
- **Publishing:** the inspected pipeline implements research, drafting, standard evidence/reader reviews, optional expanded reviews, editing, and verification. No pipeline was run, no review was paid for, and no draft was published. Quality gates express the tooling’s behavior; they do not assert that every historical article already passed the current standard.
- **Administration:** the workflow is reconstructed from server actions and navigation. No private administrator page, database row, email address, member answer, moderation case, or queue count was accessed or copied. Clear/remove are schematic decisions, not clickable controls or fabricated cases.
- **Future work:** this package makes no claim about a native app or unimplemented roadmap. The stories describe existing public surfaces and repository implementation. No planned feature is presented as shipped.

The question in the answer-first visual is an intentionally shortened version of the public homepage’s friendship question. The waveform is decorative and contains no recorded audio. The nine numbers represent the Enneagram framework, not a claim that a particular question has responses from all nine types.

## Validation

Validation is isolated to this presentation package; unrelated application tests and builds were not run.

- Official Svelte MCP autofixer against installed **Svelte 5.57.1**: no issues or suggestions.
- Svelte compiler, both server and client output: zero warnings.
- Server-rendered all **28 variants**: 7 IDs × compact on/off × animated on/off.
- Checked required JSON fields, allowed kinds, unique IDs, branch counts, first-layer kind, implementation coverage, evidence-path existence, gallery paths, and component asset references.
- Checked that the component contains no app imports, network calls, or interactive controls.
- Browser inspected all seven layers at **600, 300, and 150 px**, including final image-load and text-bound checks. Captures and machine-readable results are in `output/playwright/9takes-portfolio/`.
- Checked the reduced-motion media rule and default-off animation behavior. OS-level reduced-motion emulation was not available in the browser interface; the final compiled CSS contains the disabling rule.
- Scoped Prettier formatting and isolated `svelte-check` complete the handoff checks.

Repeat the contract/compiler checks from the 9takes repository root:

```sh
node docs/portfolio/wayne-strategies/validate.mjs
node node_modules/svelte-check/bin/svelte-check --workspace docs/portfolio/wayne-strategies/handoff --no-tsconfig --fail-on-warnings
```

To inspect the same fixture locally:

```sh
node docs/portfolio/wayne-strategies/validate.mjs --serve
```

Then open `http://127.0.0.1:4179/?layer=brand`. The fixture serves only this package’s assets and rendered examples. Integration into the shared `/work` shell, its motion/transforms, and its gallery viewer remain the coordinator’s checks.

## Details worth emphasizing

1. Answer-first is enforced in the response payload, not only by hiding the rendered comments.
2. The test preserves mismatches and two-type uncertainty, then repeats the independent-answer principle in its friend flow.
3. Editorial evidence classifies what is observed, inferred, disputed, or unknown and attaches reviews to specific draft content.
4. Moderation handles already-reviewed flags and attempts recovery when a multi-step update fails.
5. The brand has both original sculptural artwork and a distinct public-figure portrait series, with enough consistency to carry a large library.

## Absolute handoff paths

- Directory: `/Users/djwayne/9takes/docs/portfolio/wayne-strategies/handoff/`
- Layer data: `/Users/djwayne/9takes/docs/portfolio/wayne-strategies/handoff/layers.json`
- Component: `/Users/djwayne/9takes/docs/portfolio/wayne-strategies/handoff/ProjectVisual.svelte`
- Assets: `/Users/djwayne/9takes/docs/portfolio/wayne-strategies/handoff/assets/`
- Tasker: `/Users/djwayne/9takes/docs/portfolio/wayne-strategies/TASKER.md`

No handoff blockers. Integration and deployment belong to the coordinator.
