# Portrait attribution revalidation — 2026-10-29

The editorial pipeline passed the article at 8.5/10 before its photo credit was appended. Removing that single credit from the current file restores the exact reviewed hash and body, including metadata.

Codex checked the Wikimedia Commons imageinfo metadata: Gage Skidmore is credited and the original is CC BY-SA 2.0. The installed portraits and recorded transformations match the credit. The added attribution claim and source are recorded in evidence-portrait.json; verification-portrait.json preserves the prior verification and scores and adds only this check. The original six reviews, evidence, verification, and release-before-portrait.json remain intact. This is a scoped attribution revalidation, not a new editorial review.

The release manifest and frontmatter hash now identify the complete article including the credit. No personality claims, scores, or prior findings were changed.

## Publication and links

Published through personBlogParser on October 29, 2026 (America/New_York), row 1181. The production content and grade were read back and matched the local draft. The release event records publish_date 2026-10-29.

Aubrey Plaza’s existing Chris Pratt mention was wrapped in an internal link. Amy Poehler’s Parks and Recreation section gained one Related reading line; removing that exact line restores the prior live content byte for byte. Only content was updated through the optimistic-concurrency RPC; publication dates, types, grades, and other fields were preserved. The explicit perspective-gate exception for Amy was limited to that navigation-only line, consistent with the user’s cross-link request.

All six outgoing internal article links returned HTTP 200 before deployment. Both portraits passed dimensions, alpha, and size checks.

Production deployment succeeded: https://9takes-ana76y2tr-djwayne35gmailcoms-projects.vercel.app, aliased to https://9takes.com. Live checks at 2026-10-30T02:10:23.834Z confirmed HTTP 200 for the article, both linked profiles, full portrait, thumbnail, and sitemap. The article includes the correct canonical URL, medium-confidence framing, attribution, and all six expected internal links. The sitemap contains the October 29 publication date. See publication-live-verification.json.
