---
title: 'ANALYSIS — How to Sell Claude Code to Local Businesses (Eugene Kadzin)'
source_video: 'https://www.youtube.com/watch?v=V2yuIaE6q6Q'
upload_date: 2026-04-27
duration: '40:08'
analyzed_date: 2026-04-27
path: youtube-transcripts/2026-04-27-eugene-kadzin-sell-claude-code-local-businesses-ANALYSIS.md
---

# Analysis: How to Sell Claude Code to Local Businesses

**Speaker:** Eugene Kadzin (founder of "1Prompt Setter," an open-source appointment setter system)
**Audience:** Agency owners and entrepreneurs who have been learning Claude Code and want to monetize it
**Length:** 40 minutes

## Core Thesis

> "We're not selling AI, we're selling results."

Claude Code by itself is not a sellable product to local businesses (restaurants, med spas, dentists, gyms, auto shops). Instead, package Claude Code into **three stacked offers** that climb in price and lock-in. Use Claude Code as the *engine* — for infrastructure deployment and per-lead message personalization — never as the *pitch*.

Eugene is responding to backlash on a prior video titled "Claude Code is the worst thing you can learn." His clarification: he hates the *culture* around Claude Code (everyone trying to be a SaaS founder), not the tool. As a tool inside an agency workflow, it's powerful.

---

## The 3-Offer Stack (in order)

The whole framework hinges on entering a business stage-by-stage — earn trust cheap, then upsell into the recurring contract.

### Offer 1: Review Rebate — Foot in the Door

- **What it is:** Reach out to a client's *existing satisfied customers* and ask for a Google review (often in exchange for a coupon, discount, or upsell).
- **Why first:** Easiest sell. You're not touching leads (which makes business owners nervous), you're touching past customers who already liked the service.
- **Hook:** Offer the first 10–15 reviews for free to earn trust.
- **Then:** Charge per-rebated-review that lands on Google (or Facebook).
- **Cadence:** Run as a campaign, not a retainer.
- **Bonus benefit:** Warms up your SMS/voice infrastructure cheaply (more on this below).

### Offer 2: Lead Reactivation — Big One-Time Payout

- **What it is:** Reach out to the dead-leads database (people who inquired but never converted): "Hey, we talked before — are you still interested?"
- **Pricing:** $5K–$10K per campaign + commission per reactivated lead. Or pure performance: $100–$500 per reactivated/showed-up appointment.
- **Cadence:** Quarterly or every 6 months (unless the client generates hundreds of leads/day).
- **If starting out:** Run pure commission to build reputation and confidence.
- **Why these leads beat cold ad leads:** They're already in the pipeline and aware of the service, so close rates are higher even though the cost-per-lead may be higher than paid ads.

### Offer 3: Appointment Setter — The Recurring Retainer

- **What it is:** A full-time AI setter (text + voice) plugged in as the backbone of the business for inbound speed-to-lead and follow-ups.
- **Pricing:** $3K–$7K/month, especially when paired with lead-gen / marketing services as a holistic package.
- **Why this is "the offer that sticks":** Recurring revenue, deeply embedded in the business's sales flow.
- **Important:** Setters are also needed for Offers 1 and 2 — every outbound message gets a reply, and that reply needs an AI to converse with.

---

## Where Claude Code Actually Fits (Two Jobs)

Eugene's central reframe: Claude Code does two specific jobs in this workflow. It is **not** the product.

### Job 1: Deploy / Build the "Setter Operating System" (Infrastructure)

You need an OS containing:

- A lead CRM
- A conversations tab
- Tracking + analytics
- Text setters (SMS, iMessage, WhatsApp)
- Voice setters (built on Retell SDK)
- Channel connector (Eugene recommends GoHighLevel as the connector layer for business phone, calendar, WhatsApp, Instagram, Facebook)

**Three options, all involving Claude Code:**

1. **Build it yourself from scratch** with Claude Code (slow).
2. **Use his open-source files** (free): GitHub repo + Supabase schemas + voice AI config + n8n workflows + GoHighLevel snapshot. Claude Code helps you import, configure, and deploy locally or to Vercel.
3. **Use just GoHighLevel's built-in setter service** (still requires Claude Code time to configure/train).
4. **White-label Eugene's managed service** — small fee, his team is your back-end fulfillment, you focus on sales.

### Job 2: Personalize Every Outbound Message Per Lead

This is where Claude Code shines as a tool inside the daily campaign workflow:

- Take messy lead data exported from a client's CRM (or even **scanned paper from the front desk** — Eugene's team has uploaded scanned books of contacts and used Claude Code to OCR and extract them).
- Have Claude Code clean/normalize the data.
- Have Claude Code generate a personalized SMS/iMessage for every row of the CSV.
- Re-export the CSV with a new `personalization` column containing the per-lead message.
- Import into the OS, map the `personalization` field as the SMS variable, fire the campaign.

---

## Tips & Tricks (the practical playbook)

### Strategy & positioning

1. **Stack offers in order of buyer fear, low-to-high.** Reviews are zero-risk; lead reactivation triggers anxiety ("don't mess with my leads"); setter retainer requires deep trust. Earn each step.
2. **Lead with the result, not "AI."** Local business owners don't buy AI — they buy reviews, booked appointments, and reactivated revenue.
3. **Free first 10 reviews = trust mechanism.** Eat the upfront cost; bill on results from review #11+.
4. **Use the review rebate as infrastructure warmup.** Existing customers reply at high rates, so SMS/voice carriers see strong response rates and stop flagging your sender as spam — this protects deliverability for the more expensive lead-reactivation campaigns later.
5. **Performance-based deals build credibility fast** when you're new — work on commission until reputation is built, then layer in upfront fees.
6. **Decide when *not* to run the campaign.** If a business doesn't track which past customers were satisfied vs. unsatisfied, build that filter (or a "transfer concern to owner" branch) into the setter so you don't blast unhappy customers with review asks.

### Messaging & personalization with Claude Code

7. **Don't over-personalize.** Eugene's prompt to Claude Code: "Don't personalize the entire sentence because we don't have a lot of information about the lead. Keep it super short, the same size. Make it a question. Personalize the first name as well as the date, but in a human readable format."
8. **Always ask Claude Code to *show its output before generating the file*.** He explicitly says "Before doing anything, give me your output" so he can iterate on the message style before regenerating 100 rows.
9. **Output clean text — no parentheses, no placeholders.** Tell Claude Code: "Just super clean text that I will be sending directly to the leads."
10. **Filter the list before personalizing.** E.g., "Only leads served in the last 12 months." Do this in the prompt, not after.
11. **Add a single `personalization` column** to the CSV and map it as the entire SMS body in the campaign — don't rely on the OS's built-in `{first_name}` variables when you can let Claude Code own the whole message.

### Setter configuration (text)

12. **Use a fast model for short delays.** Eugene picks "Flash" (Gemini 2.5 Flash via OpenRouter) for the live response model and "2.5 Pro" only for setter *configuration generation*.
13. **Set a minimum response delay (~10 seconds, with replies in the 30-second to 2-minute range).** Instant replies feel robotic; you're trying to mimic human behavior.
14. **Configure 3 follow-ups, spaced 4h / 12h / 1 day.** That's his default cadence for ignored conversations.
15. **Generate the setter's master prompt with AI itself.** He uses the OS's "generate set configuration" button — which is just a Pro model assembling many mini-prompts (goal, tone filters, identity, ICP, knowledge base) into one master prompt.
16. **Always include an incentive in review-request setters.** "Since you're happy, here's 30% off your next service if you leave a Google review." Without an incentive, deliverability drops and tone reads as spam.
17. **Use "modify with AI" to refine a setter's behavior.** Example correction he gave: "Never use emojis. When the person is looking to leave a review, here is the review link: [paste link]." Then click "Analyze and generate."
18. **Voice setters use Retell SDK** under the hood — you paste a Retell API key into credentials and the voice setter deploys automatically.

### Channel & deliverability

19. **iMessage requires a separate plug-in** (Eugene didn't cover it but offered a follow-up video).
20. **WhatsApp is for non-US leads only** — in the US, default to SMS + iMessage.
21. **Don't test campaigns on your live Twilio number.** Use OpenPhone (or any throwaway) for demos so dummy numbers don't hurt your real number's deliverability score.
22. **Higher response rate = telcos see you as legitimate.** Unsatisfied/cold lists kill your sender reputation; warmed-up rebate campaigns protect it.

### Operational & data hygiene

23. **Local businesses are messy on the back end.** Expect paper books of contacts, half-filled CRMs, multiple disconnected systems. Treat data cleanup as part of the work — Claude Code is excellent for this.
24. **Use a `creator mode` / blur mode in your CRM during demos.** Eugene's OS has a built-in mode that blurs lead data so he can record videos without leaking real client contacts.
25. **Tag leads with internal notes + colors.** Use the lead-detail notes field to flag "follow up" / "concern" / "transferred" so the team can quickly identify state during a campaign.
26. **Separate the ICP definition from the agent identity** in the setter config: ICP = "previous tree-removal client we've already worked with," Identity = "John AI, friendly setter for [business name]."

### Pricing benchmarks (from the video)

| Offer                | Pricing                                                   |
| -------------------- | --------------------------------------------------------- |
| Review rebate        | First 10–15 free, then per-review pricing                 |
| Lead reactivation    | $5K–$10K per campaign + commission, or $100–$500/showed-up appointment |
| Appointment setter   | $3K–$7K/month, often bundled with marketing/lead-gen      |
| Total combined offer | $10K+ upfront + $1K–$3K/month retainers                   |

---

## Live Demo Walkthrough (Tree Removal Business)

This is what the back half of the video demonstrates — useful as a 9-step blueprint:

1. Generate dummy lead CSV (first name, last name, phone, email, address, service date) — Claude Code generated 100 rows.
2. Filter to "served in last 12 months" via Claude Code.
3. Draft a rough SMS in Claude Code. Iterate the prompt: short, question-format, personalize first name + date only.
4. Have Claude Code regenerate the CSV with a `personalization` column.
5. In the OS: create a custom field `personalized_message`, import the CSV mapping that column.
6. Create a setter named `tree_demo`: model = Flash, delay = 10s, 3 follow-ups, identity = "John AI," ICP = "previous tree-removal customer," knowledge base = pasted from intro.
7. Use "Generate setter configuration" with the prompt: "Reach out to previous clients, ask 1–2 questions, if satisfied ask for a Google review, if unsatisfied ask why and route to owner."
8. Create a campaign `tree_review_rebate`, attach the setter, use SMS, map the `personalization` field as the full message body, set a 5-second wait.
9. Add a test lead (with personal phone), launch the campaign, watch the SMS land, reply, and the AI setter handle the conversation through to a review request.

---

## Critical Notes & Caveats

- This is a heavily promotional video. The tactical advice is real, but the funnel pushes hard toward joining his Skool community and either using/white-labeling his "1Prompt Setter."
- The infrastructure ride-alongs (Retell, Twilio, GoHighLevel, n8n, Supabase, OpenRouter) add real cost and complexity that he glosses over.
- The "$10K + $1–3K/month" pricing assumes you can land local-business clients and deliver consistently — neither of which Claude Code itself solves.
- He doesn't show the *sales conversation* with the local business — the actual hard part. The framework assumes you already know how to pitch.
- The "free first 10 reviews" tactic depends on the client having a list of *satisfied* customers you can identify; many small businesses don't track this.

---

## One-Line Summary

**Don't sell Claude Code to local businesses — sell reviews → reactivated leads → AI setters as a stacked offer ladder, and use Claude Code privately to (1) deploy the setter OS and (2) generate per-lead personalized messages from messy CSVs.**
