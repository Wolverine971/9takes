<!-- docs/email-sequences/enneagram-launch-check-2026-09-10.md -->

# Enneagram campaign launch check — September 10, 2026

DJ approved the revised email and explicitly authorized sending it after deployment and preflight checks. No further send approval is needed. Delivery is currently blocked by the missing mailing address for `EMAIL_FOOTER_ADDRESS`; DJ was asked for that value during this task.

## Completed checks

- Vercel production deployment `dpl_2Lu2YkaG5rwc2wMnB1mJPgZYSoFU`, created at 15:10 EDT, is Ready and serves `9takes.com`.
- The authenticated production campaign page renders the approved subject **“Why we read people differently”**, preheader, complete body, button, and illustration. It also confirms `Provider: gmail` and the missing-footer delivery blocker.
- Production image returns HTTP 200, is 71,158 bytes, and exactly matches the approved local PNG. SHA-256: `af2db0eed0a0c06c8f724e8d3b0979a7f5269ab0c638d6c818f483d3be87ad48`.
- Logged-out account CTA returns 303 to login, preserving `/account` and campaign attribution in `returnTo`. Login and the beginner guide return HTTP 200.
- Live audience evaluated at 19:20 UTC with the repository's existing audience loader and production suppression RPC: 160 profiles, 21 with a valid type, 139 missing a type, **31 eligible**, 108 held. Every eligible profile also passed the database's delivery-time type/recent-email guard.
- Holds: 62 suppressed, 28 unconfirmed, 13 in another sequence, 4 with a stalled sequence, and 1 admin. No recent-signup, recent-email, invalid-email, or duplicate-email holds.
- Campaign `enneagram_type_prompt` (`211650a5-9bc3-4668-91ab-6e4a605165a0`) remains a manual, one-step draft, with zero enrollments and zero sends.
- Synchronized the database draft step's subject, HTML, and plain text to the approved canonical content and verified exact equality. The deployed resolver already used this canonical content; the database previously showed the older August subject.

## Remaining dependency and delivery verification

`EMAIL_FOOTER_ADDRESS` is absent from the Vercel production environment inventory and empty in both local environment files. The live admin page confirms the sender is blocked. No address was available in the checked prior marketing email either. Do not invent an address or bypass the existing sender guard.

Current DNS publishes Google SPF, a Google-selector DKIM key, and a DMARC record. The latest 9takes message found in DJ's connected Gmail inbox was July 29, and its receiving headers report DKIM failure, SPF pass, and DMARC pass. This is historical evidence, not a fresh deliverability result. Once the footer is configured, send the approved email as a test to DJ's known Gmail account and inspect current receiving authentication headers and rendering before releasing the audience.

Four welcome enrollments are stopped after footer failures. They are excluded from this campaign; this task has not restarted them or sent any unrelated sequence.

## Resume procedure

1. Use DJ's supplied mailing address to configure the production footer and redeploy the current approved deployment as needed. Verify the deployed configuration is ready.
2. Send and inspect a fresh test through the existing marketing sender. Resolve any observed authentication or delivery failure before the audience send.
3. Refresh the audience and prior campaign send records immediately before enrollment. Keep the existing suppression and seven-day email buffer.
4. Activate only this sequence, use the existing enrollment RPC and specific-enrollment processing function, and start with a controlled batch. Do not invoke a global queue processor to send unrelated programs. Verify provider acceptance and per-recipient records before continuing; never blindly retry an ambiguous Gmail result.
5. Complete the authorized eligible-audience send after the checks pass, and record accepted, failed, skipped, and remaining counts. Provider acceptance alone does not establish inbox delivery or saved personality types.

No campaign recipient or test recipient was emailed during this launch-check task. No enrollment, scheduling, campaign activation, or production environment change occurred.
