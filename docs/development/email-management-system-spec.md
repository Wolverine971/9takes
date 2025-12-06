<!-- docs/development/email-management-system-spec.md -->

# Email Management System - Technical Specification

## Overview

A comprehensive email management system for 9takes that enables administrators to:

- Email users from multiple data sources (profiles, signups, coaching_waitlist)
- Compose emails with HTML preview and LLM-powered generation
- Schedule emails for future delivery
- Track email engagement (opens, clicks, unsubscribes, bounces)
- Manage drafts and view sent email history

**Location**: `/admin/email-dashboard`
**UI Style**: Gmail-like interface with minimal/clean email templates

---

## 1. Database Schema

### 1.1 New Tables

#### `email_campaigns`

Organizes emails into logical campaigns for tracking and analytics.

```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `email_templates`

Reusable email templates.

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `email_sends`

Records of all sent emails with tracking information.

```sql
CREATE TABLE email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES email_campaigns(id),

  -- Recipient info (polymorphic - can reference any user table)
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_source TEXT NOT NULL CHECK (recipient_source IN ('profiles', 'signups', 'coaching_waitlist')),
  recipient_source_id TEXT NOT NULL, -- ID from the source table

  -- Email content
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  plain_text_content TEXT,

  -- Tracking
  tracking_id UUID UNIQUE DEFAULT gen_random_uuid(), -- Used in tracking pixel/links
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),

  -- Engagement metrics
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  unsubscribed_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_reason TEXT,

  -- Metadata
  sent_at TIMESTAMPTZ,
  sent_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_email_sends_tracking_id ON email_sends(tracking_id);
CREATE INDEX idx_email_sends_recipient_email ON email_sends(recipient_email);
CREATE INDEX idx_email_sends_status ON email_sends(status);
CREATE INDEX idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX idx_email_sends_sent_at ON email_sends(sent_at DESC);
```

#### `email_tracking_events`

Granular tracking of all email interactions.

```sql
CREATE TABLE email_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_send_id UUID NOT NULL REFERENCES email_sends(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL CHECK (event_type IN ('open', 'click', 'unsubscribe', 'bounce', 'complaint')),

  -- Event details
  link_url TEXT, -- For click events
  ip_address TEXT,
  user_agent TEXT,

  -- Geolocation (optional, can be enriched later)
  country TEXT,
  city TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_tracking_events_send_id ON email_tracking_events(email_send_id);
CREATE INDEX idx_email_tracking_events_type ON email_tracking_events(event_type);
```

#### `email_drafts`

Saved email drafts.

```sql
CREATE TABLE email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Draft content
  subject TEXT,
  html_content TEXT,

  -- Recipients (stored as JSON for flexibility)
  recipients JSONB DEFAULT '[]'::jsonb,
  -- Format: [{"email": "...", "name": "...", "source": "profiles", "source_id": "..."}]

  -- Scheduling
  scheduled_for TIMESTAMPTZ,

  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `scheduled_emails`

Queue for emails scheduled to be sent in the future.

```sql
CREATE TABLE scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES email_drafts(id) ON DELETE SET NULL,

  -- Email content (copied from draft at schedule time)
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,

  -- Recipients
  recipients JSONB NOT NULL,
  -- Format: [{"email": "...", "name": "...", "source": "profiles", "source_id": "..."}]

  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- Processing info
  processed_at TIMESTAMPTZ,
  emails_sent INTEGER DEFAULT 0,
  emails_failed INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_emails_scheduled_for ON scheduled_emails(scheduled_for)
  WHERE status = 'pending';
```

#### `email_unsubscribes`

Unified unsubscribe list across all user sources.

```sql
CREATE TABLE email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT, -- Which table they originally came from
  source_id TEXT,
  reason TEXT,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_unsubscribes_email ON email_unsubscribes(email);
```

---

## 2. API Endpoints

### 2.1 User Management

#### `GET /api/admin/email-dashboard/users`

Fetch users from all sources with pagination and filtering.

**Query Parameters:**

- `source`: `'all' | 'profiles' | 'signups' | 'coaching_waitlist'`
- `search`: Search by email or name
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 50)
- `sortBy`: `'created_at' | 'email' | 'name'`
- `sortOrder`: `'asc' | 'desc'`

**Response:**

```typescript
{
	users: Array<{
		id: string;
		email: string;
		name: string | null;
		source: 'profiles' | 'signups' | 'coaching_waitlist';
		created_at: string;
		enneagram?: string;
		unsubscribed: boolean;
	}>;
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}
}
```

### 2.2 Email Composition & Sending

#### `POST /api/admin/email-dashboard/send`

Send email(s) immediately.

**Request Body:**

```typescript
{
  recipients: Array<{
    email: string;
    name?: string;
    source: 'profiles' | 'signups' | 'coaching_waitlist';
    source_id: string;
  }>;
  subject: string;
  html_content: string;
  campaign_id?: string; // Optional campaign association
}
```

**Response:**

```typescript
{
	success: boolean;
	sent: number;
	failed: number;
	results: Array<{
		email: string;
		success: boolean;
		error?: string;
		tracking_id: string;
	}>;
}
```

#### `POST /api/admin/email-dashboard/schedule`

Schedule email(s) for future delivery.

**Request Body:**

```typescript
{
  recipients: Array<{...}>;
  subject: string;
  html_content: string;
  scheduled_for: string; // ISO 8601 datetime
  campaign_id?: string;
}
```

### 2.3 Drafts

#### `GET /api/admin/email-dashboard/drafts`

List all drafts.

#### `POST /api/admin/email-dashboard/drafts`

Create or update a draft.

**Request Body:**

```typescript
{
  id?: string; // If updating existing draft
  subject?: string;
  html_content?: string;
  recipients?: Array<{...}>;
  scheduled_for?: string;
}
```

#### `DELETE /api/admin/email-dashboard/drafts/[id]`

Delete a draft.

### 2.4 Sent Emails & Analytics

#### `GET /api/admin/email-dashboard/sent`

List sent emails with analytics.

**Query Parameters:**

- `campaign_id`: Filter by campaign
- `status`: Filter by status
- `page`, `limit`: Pagination
- `from_date`, `to_date`: Date range

**Response:**

```typescript
{
  emails: Array<{
    id: string;
    recipient_email: string;
    recipient_name: string;
    subject: string;
    status: string;
    sent_at: string;
    opened_at: string | null;
    open_count: number;
    clicked_at: string | null;
    click_count: number;
    unsubscribed_at: string | null;
  }>;
  summary: {
    total_sent: number;
    total_opened: number;
    total_clicked: number;
    total_unsubscribed: number;
    total_bounced: number;
    open_rate: number;
    click_rate: number;
  };
  pagination: {...};
}
```

#### `GET /api/admin/email-dashboard/analytics`

Campaign-level analytics.

### 2.5 LLM Email Generation

#### `POST /api/admin/email-dashboard/generate`

Generate email content using LLM.

**Request Body:**

```typescript
{
  instructions: string; // User's instructions for the email
  context?: {
    recipient_count?: number;
    audience_type?: string; // e.g., "coaching waitlist", "new signups"
    tone?: 'professional' | 'friendly' | 'casual';
  };
}
```

**Response:**

```typescript
{
	subject: string;
	html_content: string;
	plain_text: string;
}
```

### 2.6 Tracking Endpoints

#### `GET /api/track/open/[tracking_id]`

Tracking pixel endpoint. Returns a 1x1 transparent GIF.

**Behavior:**

1. Look up `email_send` by `tracking_id`
2. Update `opened_at` (if first open) and increment `open_count`
3. Insert event into `email_tracking_events`
4. Return 1x1 transparent GIF

#### `GET /api/track/click/[tracking_id]/[encoded_url]`

Click tracking redirect.

**Behavior:**

1. Look up `email_send` by `tracking_id`
2. Decode the target URL
3. Update `clicked_at` (if first click) and increment `click_count`
4. Insert event into `email_tracking_events` with `link_url`
5. Redirect (302) to target URL

#### `GET /api/track/unsubscribe/[tracking_id]`

Unsubscribe endpoint.

**Behavior:**

1. Look up `email_send` by `tracking_id`
2. Insert into `email_unsubscribes`
3. Update `email_send.unsubscribed_at`
4. Show unsubscribe confirmation page

### 2.7 Templates

#### `GET /api/admin/email-dashboard/templates`

List available templates.

#### `POST /api/admin/email-dashboard/templates`

Create/update a template.

---

## 3. UI Components & Routes

### 3.1 Route Structure

```
/admin/email-dashboard/
├── +page.svelte              # Main dashboard (sent emails, analytics)
├── +page.server.ts           # Dashboard data loading
├── compose/
│   └── +page.svelte          # Full-page compose (optional)
├── drafts/
│   └── +page.svelte          # Drafts list
├── templates/
│   └── +page.svelte          # Template management
└── sent/
    └── +page.svelte          # Sent emails with analytics
```

### 3.2 Component Architecture

```
src/lib/components/email-dashboard/
├── UserList.svelte           # User selection table with multi-select
├── UserListItem.svelte       # Individual user row
├── ComposeModal.svelte       # Gmail-like compose modal
├── EmailPreview.svelte       # Email template preview
├── GenerateEmailModal.svelte # LLM generation interface
├── SentEmailsList.svelte     # Sent emails table
├── DraftsList.svelte         # Drafts table
├── EmailAnalytics.svelte     # Analytics charts/stats
├── SchedulePicker.svelte     # Date/time picker for scheduling
├── TemplateSelector.svelte   # Template dropdown
└── EmailEditor.svelte        # HTML editor with syntax highlighting
```

### 3.3 Main Dashboard Layout

```
+------------------------------------------------------------------+
|  Email Dashboard                                    [Compose +]   |
+------------------------------------------------------------------+
|                                                                   |
|  [Users] [Drafts] [Sent] [Templates] [Analytics]                 |
|                                                                   |
+------------------------------------------------------------------+
|  SOURCE: [All v] | SEARCH: [____________] | [Refresh]            |
+------------------------------------------------------------------+
|  [ ] Select All (showing 50 of 1,234)                            |
+------------------------------------------------------------------+
|  [ ] john@example.com    | John Doe    | profiles     | 2024-01  |
|  [ ] jane@example.com    | Jane Smith  | signups      | 2024-02  |
|  [ ] bob@example.com     | Bob Wilson  | coaching_... | 2024-03  |
|  ...                                                              |
+------------------------------------------------------------------+
|  [< Prev] Page 1 of 25 [Next >]        Selected: 3 [Email Selected]
+------------------------------------------------------------------+
```

### 3.4 Compose Modal

Gmail-style floating compose modal:

```
+-----------------------------------------------+
|  New Email                              [_ X] |
+-----------------------------------------------+
|  To: john@example.com, jane@example.com (+1)  |
+-----------------------------------------------+
|  Subject: [                                 ] |
+-----------------------------------------------+
|                                               |
|  [HTML Editor Toolbar]                        |
|  +-------------------------------------------+|
|  | <h1>Hello {name}!</h1>                    ||
|  | <p>Welcome to 9takes...</p>               ||
|  |                                           ||
|  +-------------------------------------------+|
|                                               |
|  [Generate with AI]                           |
|                                               |
+-----------------------------------------------+
|  Preview | HTML                               |
+-----------------------------------------------+
|  +-------------------------------------------+|
|  |        [Rendered Email Preview]           ||
|  |                                           ||
|  +-------------------------------------------+|
+-----------------------------------------------+
|  [Schedule v] [Save Draft]        [Send Now]  |
+-----------------------------------------------+
```

### 3.5 Generate Email Modal

```
+-----------------------------------------------+
|  Generate Email with AI                   [X] |
+-----------------------------------------------+
|                                               |
|  What would you like the email to say?        |
|  +-------------------------------------------+|
|  | Write a welcome email for new coaching    ||
|  | waitlist signups. Mention the Enneagram   ||
|  | personality system and encourage them to  ||
|  | explore the platform. Keep it friendly    ||
|  | and professional.                         ||
|  +-------------------------------------------+|
|                                               |
|  Tone: [Professional v]                       |
|  Audience: Coaching Waitlist (23 recipients)  |
|                                               |
+-----------------------------------------------+
|                               [Generate]      |
+-----------------------------------------------+
```

---

## 4. Email Template System

### 4.1 Base Template (Minimal/Clean)

The wrapper template that all emails use:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>{{subject}}</title>
		<!--[if mso]>
			<noscript>
				<xml>
					<o:OfficeDocumentSettings>
						<o:PixelsPerInch>96</o:PixelsPerInch>
					</o:OfficeDocumentSettings>
				</xml>
			</noscript>
		<![endif]-->
		<style>
			/* Reset styles */
			body,
			table,
			td,
			a {
				-webkit-text-size-adjust: 100%;
				-ms-text-size-adjust: 100%;
			}
			table,
			td {
				mso-table-lspace: 0pt;
				mso-table-rspace: 0pt;
			}
			img {
				-ms-interpolation-mode: bicubic;
				border: 0;
				height: auto;
				line-height: 100%;
				outline: none;
				text-decoration: none;
			}
			body {
				height: 100% !important;
				margin: 0 !important;
				padding: 0 !important;
				width: 100% !important;
				background-color: #f7f7f7;
			}

			/* Content styles */
			.email-container {
				max-width: 600px;
				margin: 0 auto;
			}
			.email-body {
				background-color: #ffffff;
				padding: 40px;
				font-family:
					-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
			}
			.email-content {
				color: #333333;
				font-size: 16px;
				line-height: 1.6;
			}
			.email-content h1 {
				font-size: 24px;
				margin: 0 0 20px;
				color: #111111;
			}
			.email-content h2 {
				font-size: 20px;
				margin: 20px 0 15px;
				color: #111111;
			}
			.email-content p {
				margin: 0 0 16px;
			}
			.email-content a {
				color: #6c5ce7;
				text-decoration: underline;
			}
			.email-footer {
				padding: 30px 40px;
				text-align: center;
				color: #888888;
				font-size: 12px;
			}
			.email-footer a {
				color: #888888;
				text-decoration: underline;
			}

			/* Button styles */
			.button {
				display: inline-block;
				padding: 14px 28px;
				background-color: #6c5ce7;
				color: #ffffff !important;
				text-decoration: none;
				border-radius: 6px;
				font-weight: 600;
			}
			.button:hover {
				background-color: #5b4cdb;
			}

			/* Responsive */
			@media screen and (max-width: 600px) {
				.email-body {
					padding: 24px !important;
				}
				.email-footer {
					padding: 20px 24px !important;
				}
			}
		</style>
	</head>
	<body>
		<!-- Preheader (hidden preview text) -->
		<div style="display: none; max-height: 0; overflow: hidden;">{{preheader}}</div>

		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
			<tr>
				<td style="padding: 20px 0;">
					<table
						role="presentation"
						class="email-container"
						cellspacing="0"
						cellpadding="0"
						border="0"
						width="600"
						align="center"
					>
						<!-- Logo -->
						<tr>
							<td style="padding: 20px 40px; text-align: center;">
								<img
									src="https://9takes.com/brand/aero.png"
									alt="9takes"
									width="120"
									style="max-width: 120px;"
								/>
							</td>
						</tr>

						<!-- Body -->
						<tr>
							<td class="email-body">
								<div class="email-content">{{content}}</div>
							</td>
						</tr>

						<!-- Footer -->
						<tr>
							<td class="email-footer">
								<p style="margin: 0 0 10px;">9takes - See the emotions behind every take</p>
								<p style="margin: 0 0 10px;">
									<a href="{{unsubscribe_url}}">Unsubscribe</a>
								</p>
								<p style="margin: 0;">&copy; {{year}} 9takes. All rights reserved.</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>

		<!-- Tracking Pixel -->
		<img
			src="{{tracking_pixel_url}}"
			width="1"
			height="1"
			style="display:block;width:1px;height:1px;border:0;"
			alt=""
		/>
	</body>
</html>
```

### 4.2 Template Variables

Available placeholders in email content:

- `{{name}}` - Recipient's name
- `{{email}}` - Recipient's email
- `{{enneagram}}` - Recipient's Enneagram type (if available)
- `{{unsubscribe_url}}` - Auto-generated unsubscribe link
- `{{tracking_pixel_url}}` - Auto-injected tracking pixel

---

## 5. LLM Integration

### 5.1 Email Generation Prompt

```typescript
// src/routes/api/admin/email-dashboard/generate/+server.ts

import { smartLLMService } from '$utils/server/smart-llm-service';

const SYSTEM_PROMPT = `You are an email copywriter for 9takes, a personality-based Q&A platform built on the Enneagram system.

Your task is to generate email content based on user instructions. The emails should:
- Be clean, professional, and engaging
- Match the requested tone (professional, friendly, or casual)
- Include a clear call-to-action when appropriate
- Be concise and scannable
- Use simple HTML formatting (h1, h2, p, a, ul/li)

Output format: Return valid JSON with:
{
  "subject": "Email subject line",
  "html_content": "<h1>Heading</h1><p>Content...</p>",
  "plain_text": "Plain text version of the email"
}

Important:
- Do NOT include <html>, <head>, <body> tags - just the inner content
- Use {{name}} placeholder for recipient's name
- Keep subject lines under 60 characters
- Make the first sentence compelling for email previews`;

export async function POST({ request, locals }) {
	const { instructions, context } = await request.json();

	const userPrompt = `
Generate an email based on these instructions:

${instructions}

Context:
- Audience: ${context?.audience_type || 'General subscribers'}
- Number of recipients: ${context?.recipient_count || 'Unknown'}
- Desired tone: ${context?.tone || 'professional'}

Generate the email content now.`;

	const result = await smartLLMService.getJSONResponse({
		systemPrompt: SYSTEM_PROMPT,
		userPrompt,
		userId: locals.session?.user?.id,
		profile: 'balanced',
		operationType: 'email_generation'
	});

	return json(result);
}
```

---

## 6. Tracking Implementation

### 6.1 Tracking Pixel Endpoint

```typescript
// src/routes/api/track/open/[tracking_id]/+server.ts

import { supabaseAdmin } from '$lib/supabase-admin';

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64'
);

export async function GET({ params, request }) {
	const { tracking_id } = params;

	// Non-blocking update
	updateOpenTracking(tracking_id, request).catch(console.error);

	return new Response(TRANSPARENT_GIF, {
		headers: {
			'Content-Type': 'image/gif',
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			Pragma: 'no-cache',
			Expires: '0'
		}
	});
}

async function updateOpenTracking(tracking_id: string, request: Request) {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	// Get the email send record
	const { data: emailSend } = await supabaseAdmin
		.from('email_sends')
		.select('id, opened_at, open_count')
		.eq('tracking_id', tracking_id)
		.single();

	if (!emailSend) return;

	// Update the email send record
	await supabaseAdmin
		.from('email_sends')
		.update({
			opened_at: emailSend.opened_at || new Date().toISOString(),
			open_count: (emailSend.open_count || 0) + 1
		})
		.eq('tracking_id', tracking_id);

	// Log the event
	await supabaseAdmin.from('email_tracking_events').insert({
		email_send_id: emailSend.id,
		event_type: 'open',
		ip_address: ip,
		user_agent: userAgent
	});
}
```

### 6.2 Click Tracking Endpoint

```typescript
// src/routes/api/track/click/[tracking_id]/[encoded_url]/+server.ts

export async function GET({ params, request }) {
	const { tracking_id, encoded_url } = params;

	// Decode the target URL
	const targetUrl = decodeURIComponent(atob(encoded_url));

	// Validate URL (prevent open redirect vulnerability)
	try {
		new URL(targetUrl);
	} catch {
		return new Response('Invalid URL', { status: 400 });
	}

	// Non-blocking update
	updateClickTracking(tracking_id, targetUrl, request).catch(console.error);

	// Redirect to target URL
	return new Response(null, {
		status: 302,
		headers: { Location: targetUrl }
	});
}
```

### 6.3 Link Rewriting

When sending emails, all links are rewritten to go through the click tracker:

```typescript
function rewriteLinks(html: string, trackingId: string): string {
	const baseUrl = 'https://9takes.com/api/track/click';

	return html.replace(/href="(https?:\/\/[^"]+)"/g, (match, url) => {
		// Don't rewrite unsubscribe links
		if (url.includes('/track/unsubscribe')) return match;

		const encodedUrl = btoa(encodeURIComponent(url));
		return `href="${baseUrl}/${trackingId}/${encodedUrl}"`;
	});
}
```

---

## 7. Scheduled Email Processing

### 7.1 Overview

Scheduled emails are processed using **Supabase pg_cron** which calls the SvelteKit API endpoint. This approach is more reliable than Vercel cron and doesn't require a Pro plan on Vercel.

### 7.2 Architecture

```
┌─────────────────┐     HTTP POST      ┌─────────────────────────────────────┐
│  pg_cron        │ ──────────────────▶│ /api/cron/send-scheduled-emails     │
│  (every minute) │                    │ (SvelteKit API on Vercel)           │
└─────────────────┘                    └─────────────────────────────────────┘
        │                                            │
        │ Uses pg_net extension                      │ Uses Gmail API
        │                                            │
        ▼                                            ▼
┌─────────────────┐                    ┌─────────────────────────────────────┐
│ email_cron_     │                    │ email_sends table                   │
│ config table    │                    │ (tracking records)                  │
└─────────────────┘                    └─────────────────────────────────────┘
```

### 7.3 Setup Instructions

**Step 1: Run the migration**

The migration `20251204_pg_cron_scheduled_emails.sql` creates:

- `email_cron_config` table for configuration
- `process_scheduled_emails()` function
- `email_cron_status` view for monitoring

**Step 2: Enable extensions in Supabase Dashboard**

1. Go to **Database > Extensions**
2. Enable **pg_cron** (requires Supabase Pro plan)
3. Enable **pg_net** (for HTTP requests)

**Step 3: Set the cron secret**

In Supabase SQL Editor, run:

```sql
UPDATE email_cron_config
SET cron_secret = 'your-PRIVATE_CRON_SECRET-value-here'
WHERE id = 1;
```

**Step 4: Schedule the cron job**

In Supabase SQL Editor, run:

```sql
-- Schedule to run every minute
SELECT cron.schedule(
  'process-scheduled-emails',
  '* * * * *',
  $$SELECT process_scheduled_emails()$$
);
```

### 7.4 Monitoring

**View scheduled jobs:**

```sql
SELECT * FROM cron.job;
```

**View job run history:**

```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

**View cron status in dashboard:**
The email dashboard shows a status indicator showing:

- `healthy` - Last run within 2 minutes
- `stale` - Last run 2-10 minutes ago
- `unhealthy` - Last run more than 10 minutes ago
- `never_run` - Job has never executed

### 7.5 Troubleshooting

**Cron not running:**

1. Check extensions are enabled
2. Verify the job is scheduled: `SELECT * FROM cron.job;`
3. Check job history for errors: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`

**Authentication errors:**

1. Verify `PRIVATE_CRON_SECRET` in your `.env` matches what's in `email_cron_config`
2. Check the API endpoint URL is correct

**To unschedule:**

```sql
SELECT cron.unschedule('process-scheduled-emails');
```

### 7.6 Alternative: External Cron Service

If pg_cron is not available (non-Pro Supabase plan), you can use a free external cron service:

1. Go to [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com)
2. Create a job that calls: `https://9takes.com/api/cron/send-scheduled-emails`
3. Set schedule to every 1-5 minutes
4. Add header: `Authorization: Bearer YOUR_CRON_SECRET`

---

## 8. Security Considerations

### 8.1 Access Control

- All `/admin/email-dashboard` routes require admin authentication
- API endpoints check `session.user` and `profiles.admin`

### 8.2 Input Validation

- Validate all email addresses before sending
- Sanitize HTML content to prevent XSS in preview
- Rate limit sending to prevent abuse

### 8.3 Unsubscribe Handling

- Always check `email_unsubscribes` before sending
- Provide one-click unsubscribe in all emails
- Honor unsubscribe requests immediately

### 8.4 Tracking Privacy

- Store minimal PII in tracking events
- IP addresses used for deduplication only
- Comply with email privacy regulations

---

## 9. Implementation Phases

### Phase 1: Foundation (Core Infrastructure)

1. Create database tables and migrations
2. Set up base email template
3. Create API routes for user fetching
4. Build UserList component with multi-select

### Phase 2: Compose & Send

1. Build ComposeModal component
2. Implement email sending with tracking
3. Add tracking pixel and click tracking endpoints
4. Create email preview functionality

### Phase 3: LLM Integration

1. Build GenerateEmailModal component
2. Integrate smart-llm-service
3. Add prompt templates for email generation

### Phase 4: Scheduling & Drafts

1. Implement draft save/load functionality
2. Add schedule picker UI
3. Set up Vercel cron job
4. Build scheduled email processor

### Phase 5: Analytics & Polish

1. Build sent emails list with analytics
2. Add campaign-level analytics dashboard
3. Implement unsubscribe page
4. Add template management

---

## 10. File Structure

```
src/
├── routes/
│   ├── admin/
│   │   └── email-dashboard/
│   │       ├── +page.svelte
│   │       ├── +page.server.ts
│   │       ├── +layout.svelte
│   │       ├── drafts/
│   │       │   └── +page.svelte
│   │       ├── sent/
│   │       │   └── +page.svelte
│   │       └── templates/
│   │           └── +page.svelte
│   └── api/
│       ├── admin/
│       │   └── email-dashboard/
│       │       ├── users/+server.ts
│       │       ├── send/+server.ts
│       │       ├── schedule/+server.ts
│       │       ├── drafts/+server.ts
│       │       ├── drafts/[id]/+server.ts
│       │       ├── sent/+server.ts
│       │       ├── generate/+server.ts
│       │       └── templates/+server.ts
│       ├── track/
│       │   ├── open/[tracking_id]/+server.ts
│       │   ├── click/[tracking_id]/[encoded_url]/+server.ts
│       │   └── unsubscribe/[tracking_id]/+server.ts
│       └── cron/
│           └── send-scheduled-emails/+server.ts
├── lib/
│   ├── components/
│   │   └── email-dashboard/
│   │       ├── UserList.svelte
│   │       ├── UserListItem.svelte
│   │       ├── ComposeModal.svelte
│   │       ├── EmailPreview.svelte
│   │       ├── EmailEditor.svelte
│   │       ├── GenerateEmailModal.svelte
│   │       ├── SentEmailsList.svelte
│   │       ├── DraftsList.svelte
│   │       ├── SchedulePicker.svelte
│   │       └── EmailAnalytics.svelte
│   ├── email/
│   │   ├── templates/
│   │   │   └── base-template.ts
│   │   ├── sender.ts
│   │   └── tracking.ts
│   └── types/
│       └── email.ts
└── emails/
    └── (existing email templates)
```

---

## 11. TypeScript Types

```typescript
// src/lib/types/email.ts

export interface EmailRecipient {
	email: string;
	name?: string;
	source: 'profiles' | 'signups' | 'coaching_waitlist';
	source_id: string;
	enneagram?: string;
}

export interface EmailDraft {
	id: string;
	subject?: string;
	html_content?: string;
	recipients: EmailRecipient[];
	scheduled_for?: string;
	created_at: string;
	updated_at: string;
}

export interface EmailSend {
	id: string;
	tracking_id: string;
	recipient_email: string;
	recipient_name?: string;
	recipient_source: string;
	recipient_source_id: string;
	subject: string;
	html_content: string;
	status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
	sent_at?: string;
	opened_at?: string;
	open_count: number;
	clicked_at?: string;
	click_count: number;
	unsubscribed_at?: string;
}

export interface EmailTrackingEvent {
	id: string;
	email_send_id: string;
	event_type: 'open' | 'click' | 'unsubscribe' | 'bounce' | 'complaint';
	link_url?: string;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
}

export interface ScheduledEmail {
	id: string;
	subject: string;
	html_content: string;
	recipients: EmailRecipient[];
	scheduled_for: string;
	status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
	created_at: string;
}

export interface EmailAnalytics {
	total_sent: number;
	total_opened: number;
	total_clicked: number;
	total_unsubscribed: number;
	total_bounced: number;
	open_rate: number;
	click_rate: number;
}
```

---

## 12. Environment Variables Required

```env
# Existing
PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
PRIVATE_gmail_private_key=...
PRIVATE_OPENROUTER_API_KEY=...

# New
CRON_SECRET=<random-string-for-cron-auth>
```

---

This specification provides a complete blueprint for implementing the email management system. Each component is designed to work with your existing infrastructure (Supabase, Gmail API, smart-llm-service) while adding the Gmail-like UI and full analytics capabilities you requested.
