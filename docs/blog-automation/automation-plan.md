<!-- docs/blog-automation/automation-plan.md -->

# 9takes Automated Blog Creation System

## Executive Summary

This document outlines a complete system for automating the creation of personality analysis blogs for 9takes. The system will:

1. **Manage a backlog** of unpublished celebrity blogs from the famousTypes.ts database
2. **Run daily cron jobs** that trigger the blog content creation workflow
3. **Automatically select** the next blog to write based on priority criteria
4. **Execute the full workflow** from research to production-ready draft

---

## Part 1: Backlog Management System

### 1.1 Source of Truth: famousTypes.ts Analysis

The `src/lib/components/molecules/famousTypes.ts` file is auto-generated from the Supabase database and contains all celebrity entries with their publication status.

**Key Fields for Backlog Identification:**

```typescript
{
	name: string; // URL slug (e.g., 'anne-hathaway')
	link: boolean; // true = published, false = unpublished
	hasImage: boolean; // Image availability
	lastmod: string | null; // Last modification date
	personaTitle: string | null; // Generated title
	contentGrade: number | null; // Quality score (null = not graded/not written)
}
```

### 1.2 Backlog Categories

**Priority 1: High-Value Unpublished (link: false, contentGrade: null)**

- Celebrities with high public interest
- Missing blogs that would drive traffic
- Strategic types (Type 3, Type 7) that perform well

**Priority 2: Low-Grade Published (link: true, contentGrade < 8.0)**

- Old blogs needing updates
- Low-quality content that hurts brand
- Outdated information

**Priority 3: Missing Images (link: true, hasImage: false)**

- Published blogs without images
- Blocks social distribution

### 1.3 Backlog Queue File

Create: `/Users/djwayne/9takes/docs/blog-automation/backlog-queue.json`

```json
{
	"lastUpdated": "2026-04-03T18:00:00Z",
	"queue": [
		{
			"name": "james-clear",
			"type": 1,
			"priority": 1,
			"reason": "High-value Type 1, productivity niche",
			"estimatedTraffic": "high",
			"addedToQueue": "2026-04-03"
		},
		{
			"name": "brené-brown",
			"type": 2,
			"priority": 1,
			"reason": "Type 2, vulnerability research niche",
			"estimatedTraffic": "high",
			"addedToQueue": "2026-04-03"
		}
	],
	"completed": [
		{
			"name": "anne-hathaway",
			"completedAt": "2026-03-27",
			"contentGrade": 9.1
		}
	],
	"inProgress": null
}
```

### 1.4 Backlog Generation Script

Create: `/Users/djwayne/9takes/scripts/generate-blog-backlog.js`

This script will:

1. Read `famousTypes.ts`
2. Parse all entries where `link: false` (unpublished)
3. Sort by priority algorithm:
   - Type popularity (Type 3, 7, 8 get priority)
   - Celebrity prominence (search volume proxy)
   - Strategic value (completes a cluster)
4. Generate `backlog-queue.json`
5. Run weekly to refresh queue

**Priority Scoring Algorithm:**

```javascript
function calculatePriority(celebrity) {
	let score = 0;

	// Type popularity multiplier
	const typeMultipliers = { 3: 1.5, 7: 1.4, 8: 1.3, 4: 1.2, 6: 1.1 };
	score += (typeMultipliers[celebrity.type] || 1.0) * 10;

	// Content grade potential (if partially written)
	if (celebrity.contentGrade) {
		score += celebrity.contentGrade * 0.5;
	}

	// Has persona title (indicates some research done)
	if (celebrity.personaTitle) {
		score += 5;
	}

	// Recency factor (newer celebrities trend higher)
	const daysSinceLastmod = calculateDays(celebrity.lastmod);
	score += Math.max(0, 30 - daysSinceLastmod) * 0.1;

	return score;
}
```

---

## Part 2: Daily Automation Workflow

### 2.1 Cron Job Architecture

**Schedule:** Daily at 2:00 AM (low traffic, fresh day)

**Cron Expression:** `0 2 * * *`

**Job Flow:**

```
1. Check if blog creation should run today
   - Skip if: manual override flag set
   - Skip if: previous blog still in progress
   - Skip if: rate limit hit (max 5 blogs/week)

2. Select next blog from queue
   - Read backlog-queue.json
   - Pick highest priority item
   - Mark as "inProgress"

3. Execute blog content creation
   - Trigger: claude --chrome /blog_content_creator_people <name>
   - Wait for completion (timeout: 30 min)
   - Capture output and status

4. Post-creation handling
   - If success: Move to "completed", trigger production workflow
   - If failure: Log error, keep in queue, retry tomorrow
   - Update backlog-queue.json

5. Notification
   - Send summary to Telegram
   - Include: blog name, status, grade if available
```

### 2.2 Cron Job Implementation

Create: `/Users/djwayne/9takes/.claude/commands/daily-blog-creator.md`

````markdown
# Daily Blog Creator - Automated Workflow

## Pre-Flight Checks

1. Check for manual override:
   - Read `/Users/djwayne/9takes/docs/blog-automation/override.json`
   - If `pause: true`, exit with "PAUSED_BY_OVERRIDE"

2. Check for in-progress blog:
   - Read `backlog-queue.json`
   - If `inProgress` is not null, exit with "BLOG_IN_PROGRESS"

3. Check rate limit:
   - Count blogs completed in last 7 days
   - If >= 5, exit with "RATE_LIMIT_HIT"

## Main Workflow

1. **Select Next Blog**
   - Read `backlog-queue.json`
   - Sort queue by priority (descending)
   - Pick first item
   - Update `inProgress` with selected blog
   - Write updated queue file

2. **Execute Content Creation**
   - Run: `claude --chrome --dangerously-skip-permissions "/blog_content_creator_people ${selectedBlog.name}"`
   - Capture all output to log file
   - Wait for completion (max 30 minutes)

3. **Process Results**
   - Check if draft file was created: `/src/blog/people/drafts/${name}.md`
   - If created:
     - Run grade_blog command to get content grade
     - Update queue: move to "completed"
     - Trigger production workflow (optional)
   - If failed:
     - Log error to `/logs/blog-automation/errors/YYYY-MM-DD.json`
     - Keep in queue
     - Add retry count

4. **Send Notification**
   - Format Telegram message:

     ```
     📚 Daily Blog Creator - ${date}

     Blog: ${name}
     Status: ${status}
     Grade: ${grade || 'N/A'}
     Duration: ${duration} min

     ${error ? '⚠️ Error: ' + error : '✅ Success!'}
     ```

## Error Handling

- Timeout: Mark as failed, retry tomorrow
- No draft created: Mark as failed, investigate
- Low grade (< 7.0): Flag for manual review
````

### 2.3 Actual Cron Job Setup

```bash
# Add to crontab (crontab -e)
0 2 * * * cd /Users/djwayne/9takes && /usr/local/bin/claude --chrome --dangerously-skip-permissions "/daily-blog-creator" 2>&1 | tee -a /logs/blog-automation/cron.log
```

Or via OpenClaw cron:

```javascript
{
  "name": "9takes Daily Blog Creator",
  "schedule": { "kind": "cron", "expr": "0 2 * * *", "tz": "America/New_York" },
  "payload": {
    "kind": "agentTurn",
    "message": "Execute in terminal: cd /Users/djwayne/9takes && claude --chrome --dangerously-skip-permissions '/daily-blog-creator' 2>&1 | tee -a /logs/blog-automation/cron-$(date +%Y-%m-%d).log"
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "announce" }
}
```

---

## Part 3: Command Reference

### 3.1 Required Commands

**1. `/daily-blog-creator`** (NEW)

- Orchestrates the daily automation
- Handles selection, execution, notification
- Location: `/Users/djwayne/9takes/.claude/commands/daily-blog-creator.md`

**2. `/blog_content_creator_people`** (EXISTS)

- Creates the actual blog content
- Already implemented
- Needs: person name as argument

**3. `/grade_blog`** (EXISTS)

- Grades the created blog
- Already implemented

**4. `/blog_content_production_people`** (EXISTS)

- Production workflow after creation
- Already implemented

### 3.2 Supporting Scripts

**1. `generate-blog-backlog.js`** (NEW)

- Generates queue from famousTypes.ts
- Run weekly via cron
- Location: `/Users/djwayne/9takes/scripts/generate-blog-backlog.js`

**2. `update-backlog-status.js`** (NEW)

- Updates queue status after blog completion
- Called by daily-blog-creator
- Location: `/Users/djwayne/9takes/scripts/update-backlog-status.js`

---

## Part 4: File Structure

```
/Users/djwayne/9takes/
├── .claude/commands/
│   ├── daily-blog-creator.md          # NEW: Main automation command
│   ├── blog_content_creator_people.md # EXISTS
│   ├── blog_content_production_people.md # EXISTS
│   └── grade_blog.md                  # EXISTS
├── docs/blog-automation/
│   ├── backlog-queue.json             # NEW: Queue state
│   ├── override.json                  # NEW: Pause/resume control
│   └── automation-plan.md             # NEW: This document
├── scripts/
│   ├── generate-blog-backlog.js       # NEW: Weekly queue generator
│   └── update-backlog-status.js       # NEW: Status updater
└── logs/blog-automation/              # NEW: Log directory
    ├── cron.log
    ├── errors/
    └── completions/
```

---

## Part 5: Implementation Checklist

### Phase 1: Backlog System (Week 1)

- [ ] Create `generate-blog-backlog.js` script
- [ ] Create initial `backlog-queue.json`
- [ ] Test backlog generation manually
- [ ] Set up weekly cron for backlog refresh

### Phase 2: Daily Automation (Week 2)

- [ ] Create `daily-blog-creator.md` command
- [ ] Create `update-backlog-status.js` script
- [ ] Create `override.json` control file
- [ ] Test daily workflow manually

### Phase 3: Cron Setup (Week 3)

- [ ] Add daily cron job via OpenClaw
- [ ] Set up Telegram notifications
- [ ] Test end-to-end flow
- [ ] Monitor for 1 week

### Phase 4: Optimization (Week 4)

- [ ] Tune priority algorithm based on results
- [ ] Add retry logic for failed blogs
- [ ] Create dashboard/monitoring
- [ ] Document troubleshooting guide

---

## Part 6: Monitoring & Alerts

### Daily Success Metrics

- Blog created: Yes/No
- Content grade: 0-10
- Time taken: minutes
- Errors: count

### Weekly Review

- Blogs created: count
- Average grade: number
- Success rate: percentage
- Queue depth: remaining blogs

### Alert Conditions

- 3 consecutive failures → Pause automation, notify
- Average grade < 7.0 → Manual review required
- Queue empty → Generate new backlog
- Rate limit hit → Normal, no alert

---

## Part 7: Manual Override

### Pause Automation

Create `/Users/djwayne/9takes/docs/blog-automation/override.json`:

```json
{
	"pause": true,
	"reason": "Manual review of recent blogs needed",
	"pausedBy": "djwayne",
	"pausedAt": "2026-04-03T18:00:00Z",
	"resumeAt": null
}
```

### Force Specific Blog

```json
{
	"pause": false,
	"forceNext": {
		"name": "james-clear",
		"reason": "Strategic priority"
	}
}
```

---

## Appendix: Sample Backlog Queue

```json
{
	"lastUpdated": "2026-04-03T18:00:00Z",
	"queue": [
		{
			"name": "james-clear",
			"displayName": "James Clear",
			"type": 1,
			"priority": 95,
			"reason": "High-value Type 1, Atomic Habits author, productivity niche",
			"estimatedTraffic": "very-high",
			"searchVolume": "high",
			"addedToQueue": "2026-04-03",
			"retryCount": 0
		},
		{
			"name": "brené-brown",
			"displayName": "Brené Brown",
			"type": 2,
			"priority": 92,
			"reason": "Type 2, vulnerability research, TED talk fame",
			"estimatedTraffic": "very-high",
			"searchVolume": "high",
			"addedToQueue": "2026-04-03",
			"retryCount": 0
		},
		{
			"name": "judge-judy",
			"displayName": "Judge Judy",
			"type": 1,
			"priority": 78,
			"reason": "Type 1, TV personality, strong public recognition",
			"estimatedTraffic": "medium",
			"searchVolume": "medium",
			"addedToQueue": "2026-04-03",
			"retryCount": 0
		}
	],
	"completed": [],
	"inProgress": null,
	"failed": []
}
```

---

**Next Steps:**

1. Review this plan
2. Approve approach
3. Begin Phase 1 implementation
4. Test manually before cron activation
