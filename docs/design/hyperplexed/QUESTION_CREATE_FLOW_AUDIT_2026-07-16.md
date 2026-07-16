<!-- docs/design/hyperplexed/QUESTION_CREATE_FLOW_AUDIT_2026-07-16.md -->
# Question Create Flow Audit — 2026-07-16

## Scope

Audited `/questions/create` from input validation through slug preparation, confirmation, database
creation, social-card capture/upload, navigation to `/questions/[slug]`, and navigation-failure
recovery. This pass stacks with the existing questions index and question-thread audits.

## Findings and shipped fixes

| Priority | Finding                                                                                                  | Pattern  | Resolution                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| P0       | A stale modal controller could touch a destroyed DOM node during the create-to-thread handoff.           | P13      | Modal teardown and cached-controller calls are lifecycle-safe.                                               |
| P1       | Closing the modal before `goto` completed exposed the old form and produced a broken-looking transition. | P13      | The creation screen now remains the sole visual owner until the destination route is ready.                  |
| P1       | The loading screen referenced an undefined `.loader`, so its primary progress indicator was missing.     | P11, P13 | Added a token-aligned spinner, a static reduced-motion fallback, and explicit save/card/open progress.       |
| P1       | Social-card capture could race the render of the server-returned collision-safe URL.                     | P13      | Added a render boundary before capture so the final URL and card node are present.                           |
| P2       | Font, image, or canvas work could hold the handoff indefinitely.                                         | P13      | Added a bounded best-effort capture timeout; card failure never blocks opening the created question.         |
| P2       | A failed destination load needed a durable, duplicate-safe recovery path.                                | P13      | The modal closes only on failure, exposes “View Your Question,” and retries navigation without resubmitting. |

No signature effect was added. This is a utility flow; clear state ownership and fast recovery provide
more value than decorative motion.

## Verification

- Targeted create-flow, modal-lifecycle, server-action, and image-upload tests pass.
- The client test holds each asynchronous boundary open and verifies saving, card preparation,
  redirect, focus, scroll lock, final slug use, and duplicate-safe retry behavior.
- Svelte check passes with 0 errors; the repository's existing warning backlog is unchanged.
- Live local verification reached the expected login redirect. The available signed-in browser bridge
  blocks local development URLs, so no production question was created for visual testing.
