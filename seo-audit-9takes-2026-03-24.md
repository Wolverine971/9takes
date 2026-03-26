<!-- seo-audit-9takes-2026-03-24.md -->

# Technical SEO Audit — 9takes.com

**Date:** 2026-03-24
**URL:** https://9takes.com
**Stack:** SvelteKit (SSR) on Vercel

---

```
[Technical SEO]  Score: 58/100

CRITICAL
  x Missing H1 tag on homepage
  x 251 URLs in sitemap use uppercase letters (mixed-case slug problem)
  x Personality analysis pages (268 URLs) return 403 to non-Googlebot user agents
  x No llms.txt file (404)
  x Google-Extended blocked in robots.txt (blocks Gemini/AI training)

HIGH
  ! Homepage has zero H1 tags — heading hierarchy starts at H2
  ! Relative asset URLs used (href="./...") instead of absolute paths
  ! cache-control: public, max-age=0 on all HTML pages (no CDN edge caching)
  ! No security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  ! Image sitemap declares xmlns but uses only a subset of images

MEDIUM
  ! 1 URL exceeds 100 characters (112 chars)
  ! No WebSite schema with SearchAction (sitelinks search box)
  ! No standalone Organization schema on homepage
  ! robots.txt blocks /questions/categories/ but those paths are not in the sitemap (harmless but noisy)
  ! Homepage title uses pipe separator — dash is marginally preferred for SEO

PASSING
  . HTTPS active with 308 permanent redirects (HTTP -> HTTPS)
  . www -> non-www redirect via 308 (correct, single canonical origin)
  . HTML5 doctype present
  . lang="en" attribute present and valid BCP 47
  . charset declared as UTF-8
  . Viewport meta tag present (width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes)
  . Single canonical tag present, absolute URL, HTTPS, matches page URL
  . Sitemap.xml present, valid, referenced in robots.txt (461 URLs)
  . robots.txt accessible, correctly blocks /register, /login, /users, /admin
  . meta robots: index, follow
  . No X-Robots-Tag header (not blocking anything)
  . No redirect chains detected (single-hop redirects)
  . Hreflang tags present (x-default + en)
  . Complete OG tags (type, url, site_name, title, description, image with dimensions)
  . Complete Twitter Card tags (summary_large_image, site, creator, title, description, image, image:alt)
  . RSS feed present and linked in <head> (application/rss+xml)
  . PWA manifest configured (/site.webmanifest)
  . Apple touch icon configured
  . JSON-LD FAQPage schema on homepage (5 Q&As, valid structure)
  . JSON-LD WebPage schema on homepage
  . SvelteKit SSR — full content visible without JavaScript
  . Skip-to-content accessibility link present
  . Footer has structured navigation with internal links
  . Proper heading hierarchy on inner pages (e.g., enneagram-corner has H1 -> H2 -> H3)
  . No underscores in URLs
  . No excessive URL parameters
  . All URLs use hyphens as word separators
  . Strict-Transport-Security header present (max-age=63072000)
  . Image sitemap entries included (image:image namespace)
  . No duplicate canonical tags
  . No noindex/nofollow on public pages
  . Clean URL structure with keyword-rich slugs
```

---

## Detailed Findings

### CRITICAL: Missing H1 Tag on Homepage

The homepage (`https://9takes.com`) contains **zero H1 tags**. The heading hierarchy starts at H2:

```
H2: "Every Person Wants 3 Things"
  H3: "See It Coming"
  H3: "Know What To Do"
  H3: "Feel Understood"
H2: "Master the 9 Types"
H2: (feature section title via inline text, no heading tag)
H2: "Ready to Go Deeper?"
H2: "See. Act. Connect."
```

The page has a `<title>` of "9takes | See the Emotions Behind Every Take" but no corresponding H1 in the rendered HTML. The hero section appears to use a JS-injected animated element that renders as a `<div>`, not an `<h1>`.

**Impact:** Google explicitly states the H1 helps it understand page structure. Missing H1 is a fundamental on-page SEO failure for the most important page on the site.

**Fix:** Add `<h1>` to the hero section. Recommended: "See the Emotions Behind Every Take" or "Decode Social Dynamics Using the Enneagram".

---

### CRITICAL: 251 URLs with Uppercase Letters in Slugs

The `/personality-analysis/` section uses PascalCase names in URL slugs:

```
https://9takes.com/personality-analysis/Jordan-Peterson
https://9takes.com/personality-analysis/Taylor-Swift
https://9takes.com/personality-analysis/Elon-Musk
https://9takes.com/personality-analysis/Ruth-Bader-Ginsburg
https://9takes.com/personality-analysis/Friedrich-Nietzsche
```

251 out of 461 sitemap URLs contain uppercase letters. URLs are case-sensitive on most web servers. While Vercel may handle this consistently, it creates several problems:

- Google treats `Jordan-Peterson` and `jordan-peterson` as different URLs
- External links with wrong casing could split link equity
- Inconsistent with the rest of the site (all other URLs are lowercase)

**Fix:** Implement lowercase redirects (301) from current uppercase URLs to lowercase versions. Update sitemap, internal links, and canonical tags to use lowercase.

---

### CRITICAL: Personality Analysis Pages Return 403 to Non-Googlebot Agents

Testing with `curl` (default user-agent) against personality analysis URLs:

```
curl -sI https://9takes.com/personality-analysis/Jordan-Peterson
=> HTTP/2 403 (body: "Content access denied.")

curl -sI https://9takes.com/personality-analysis/Taylor-Swift
=> HTTP/2 403

curl -sI https://9takes.com/personality-analysis/Elon-Musk
=> HTTP/2 403
```

But with Googlebot user-agent:

```
curl -sI -A "Googlebot/2.1" https://9takes.com/personality-analysis/Jordan-Peterson
=> HTTP/2 200
```

This means:

- **Users sharing links** on social media, Slack, Discord will get 403 errors when link preview bots fetch the URL
- **Bing, DuckDuckGo, Yandex crawlers** (which don't use Googlebot UA) may be blocked
- **AI search crawlers** (PerplexityBot, OAI-SearchBot, ClaudeBot) are likely blocked despite robots.txt explicitly allowing them
- **SEO audit tools** (Ahrefs, Screaming Frog, SEMrush) will report these as errors
- **Social media preview bots** (Facebook, Twitter, LinkedIn, iMessage) cannot generate link previews

268 personality analysis URLs in the sitemap are affected. These are likely the site's highest-value SEO pages (celebrity name searches).

**Fix:** The user-agent gating logic needs to be broadened to allow all legitimate crawlers, or removed entirely in favor of rate limiting. At minimum, allow known social media and search engine bots.

---

### CRITICAL: No llms.txt File

`https://9takes.com/llms.txt` returns 404.

AI search engines (Perplexity, ChatGPT search, Claude search, Kagi) increasingly consume `llms.txt` for product/site context. This file helps AI models accurately describe and cite the site.

**Fix:** Create a `/static/llms.txt` with site definition, key features (Enneagram typing, personality analysis, coaching), content categories, and links to key pages.

---

### CRITICAL: Google-Extended Blocked in robots.txt

```
User-agent: Google-Extended
Disallow: /
```

`Google-Extended` is Google's crawler for AI training (Gemini, Bard, AI Overviews). Blocking it means:

- 9takes content will NOT appear in Google AI Overviews
- Google Gemini cannot reference 9takes content in responses
- This directly reduces visibility in the fastest-growing search surface

Meanwhile, the site explicitly allows GPTBot, ClaudeBot, PerplexityBot, and CCBot. The inconsistency suggests this may be unintentional.

**Impact:** Google AI Overviews now appear in ~30% of search results. Blocking Google-Extended while allowing competitors' crawlers is a significant strategic disadvantage.

**Fix:** If the intent is to participate in AI search, change to `Allow: /` for Google-Extended.

---

### HIGH: Relative Asset URLs

The homepage uses relative paths for CSS and JS assets:

```html
<link href="./_app/immutable/assets/Context.0bQxxxMP.css" rel="stylesheet" />
<link rel="icon" href="./favicon.ico" />
```

While SvelteKit resolves these correctly in practice, relative URLs can cause issues with:

- Proxy servers and CDNs that rewrite base paths
- Browser prefetch/prerender contexts
- SEO tools that parse HTML without executing JS

This is a SvelteKit default behavior (using `base` path), so it's low-risk in practice but worth noting.

---

### HIGH: No CDN Edge Caching on HTML

All pages return:

```
cache-control: public, max-age=0, must-revalidate
```

Every page request hits the Vercel serverless function. For a content-heavy site with 461 pages, adding `s-maxage` for CDN-level caching would significantly reduce TTFB:

```
cache-control: public, max-age=0, s-maxage=3600, must-revalidate
```

The personality analysis pages additionally return `cache-control: private, no-store` which prevents any caching.

---

### HIGH: No Security Headers

No security headers detected:

| Header                  | Status  |
| ----------------------- | ------- |
| Content-Security-Policy | Missing |
| X-Frame-Options         | Missing |
| X-Content-Type-Options  | Missing |
| Referrer-Policy         | Missing |
| Permissions-Policy      | Missing |

Only `strict-transport-security: max-age=63072000` is present (Vercel default).

While security headers don't directly affect search rankings, Google's Core Web Vitals and page experience signals do consider HTTPS, and a comprehensive security posture contributes to overall site trustworthiness.

---

### MEDIUM: 1 URL Exceeds 100 Characters

```
https://9takes.com/questions/why-people-2-phones-trying-find-answer-without-assuming-bf-anything-negative-people
(112 characters)
```

Google can handle long URLs, but URLs over 100 characters are harder to share, more likely to be truncated in SERPs, and less memorable. Several others are close to the limit (86-92 chars).

---

### MEDIUM: No WebSite or Organization Schema

The homepage has `FAQPage` and `WebPage` JSON-LD schemas but is missing:

- **WebSite schema with SearchAction**: Enables sitelinks search box in Google SERPs
- **Organization schema**: Enables Knowledge Panel eligibility, establishes entity identity

Both are high-value schemas for a content site with 461+ pages.

---

## Top 5 Fixes by Impact

| Priority | Fix                                                                                                                | Effort | Impact                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------- |
| 1        | **Fix 403 on personality analysis pages** — Broaden user-agent allowlist or remove gating for 268 high-value pages | 1-2 hr | Critical — 58% of sitemap URLs potentially invisible to non-Google crawlers and social preview bots |
| 2        | **Add H1 to homepage** — Wrap hero text in `<h1>` tag                                                              | 15 min | Critical — fundamental on-page SEO signal for the most important page                               |
| 3        | **Lowercase all URLs** — Add 301 redirects from uppercase to lowercase for 251 personality analysis URLs           | 2-3 hr | High — prevents link equity fragmentation, aligns with URL best practices                           |
| 4        | **Unblock Google-Extended** — Change `Disallow: /` to `Allow: /`                                                   | 5 min  | High — enables content to appear in Google AI Overviews                                             |
| 5        | **Create llms.txt** — Add structured site description for AI search engines                                        | 30 min | Medium — improves AI search citation accuracy                                                       |

---

## Summary Statistics

| Metric                             | Value                               |
| ---------------------------------- | ----------------------------------- |
| Total sitemap URLs                 | 461                                 |
| URLs with uppercase letters        | 251 (54%)                           |
| URLs returning 403 (non-Googlebot) | 268+ (personality-analysis section) |
| URLs exceeding 100 chars           | 1                                   |
| H1 tags on homepage                | 0                                   |
| Canonical tags (homepage)          | 1 (correct)                         |
| JSON-LD schemas (homepage)         | 2 (FAQPage, WebPage)                |
| HTTP -> HTTPS redirect             | 308 (correct)                       |
| www -> non-www redirect            | 308 (correct)                       |
| Sitemap referenced in robots.txt   | Yes                                 |
| HTML size (homepage)               | ~32 KB                              |
| SSR content visible                | Yes                                 |
