<!-- docs/taskers/T-41-assets/visual-diff/README.md -->

# Full-corpus computed-style diff (reference scripts)

These scripts verified the 2026-10-02 blog CSS change: every published MDsvex post rendered identically, old build against new. A 3–4 post spot-check would have missed the regression they caught on about 15 posts.

They are reference only. Paths are hard-coded to a worktree that no longer exists, and `all-posts.json` was not kept. To reuse them:

1. Build the baseline and the candidate into separate checkouts, then serve both with `vite preview`: baseline on port 4181, candidate on port 4182.
2. Regenerate the list of published post URLs (`corpus.mjs` shows how it was built from frontmatter).
3. `detail-diff.mjs <baseline-url> <candidate-url> <width>` compares the computed style of every element on one page and prints `DIFF_PROPS <n>`.
4. `strict-all.mjs` runs it for every post at 412 px and 1280 px with JavaScript disabled. `compare.mjs` is the JavaScript-enabled pass.

Normalize ports and build hashes before comparing, and fix any random seed (for example, shuffled related posts) so both builds render the same lists.
