<!-- docs/youtube-transcript-cloud.md -->

# YouTube Transcript Extraction in the Cloud

A reference guide for replicating the local `youtube-transcript` skill in a cloud environment so an AI agent can download transcripts without a local machine.

---

## How the Local Skill Works

The local skill uses two CLI tools chained together:

| Tool                     | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `yt-dlp`                 | Fetches video metadata (title, description, duration, chapters, views) |
| `youtube-transcript-api` | Fetches the actual timed caption text                                  |

Neither tool requires YouTube API credentials. Both reverse-engineer YouTube's internal APIs.

---

## How youtube-transcript-api Works Under the Hood

This is the critical piece to understand before moving to the cloud. The library makes a sequence of unauthenticated HTTP requests:

### Step 1 — Fetch the video page

```
GET https://www.youtube.com/watch?v={videoId}
```

Parses the HTML response to extract the `INNERTUBE_API_KEY` embedded in the page JavaScript.

### Step 2 — Call the Innertube player API

```
POST https://www.youtube.com/youtubei/v1/player?key={INNERTUBE_API_KEY}
Body: { videoId, context: { client: { clientName: "WEB", ... } } }
```

Returns a JSON blob containing `captions.playerCaptionsTracklistRenderer.captionTracks[]` — a list of available caption tracks with their `baseUrl` values.

### Step 3 — Fetch the timedtext

```
GET {baseUrl from Step 2}
  └─ internally resolves to: https://www.youtube.com/api/timedtext
       ?v={videoId}&lang={langCode}&fmt=json3
       [&pot={proofToken}&c=WEB]  ← required on some videos as of late 2024
```

Returns XML or JSON with time-coded transcript segments.

### Key takeaway

This is plain HTTP — no browser, no DOM. It can run anywhere that can make outbound HTTPS requests: Lambda, Cloud Functions, containers, edge workers.

---

## The PO Token Problem (2024–2025 Breaking Change)

YouTube added a **Proof-of-Origin (PO) token** requirement for some subtitle downloads. The token is generated in a live browser session and tied to an IP + session.

**Impact:**

- Some videos succeed without a PO token
- Some videos fail with `PoTokenRequired`
- The library throws `youtube_transcript_api.TranscriptsDisabled` or `PoTokenRequired`

**In the cloud this is the biggest risk.** Serverless functions have no persistent browser state, so generating PO tokens is non-trivial. The most reliable mitigation is using a managed third-party API that handles this for you.

---

## Parsing the YouTube URL

Every transcript API takes a **video ID**, not a URL. If the website accepts pasted URLs from users, normalize first. YouTube ships links in at least six shapes:

| Shape       | Example                                         |
| ----------- | ----------------------------------------------- |
| Standard    | `https://www.youtube.com/watch?v=VIDEO_ID`      |
| Short       | `https://youtu.be/VIDEO_ID`                     |
| Mobile      | `https://m.youtube.com/watch?v=VIDEO_ID`        |
| Shorts      | `https://www.youtube.com/shorts/VIDEO_ID`       |
| Embed       | `https://www.youtube.com/embed/VIDEO_ID`        |
| Live        | `https://www.youtube.com/live/VIDEO_ID`         |
| With params | `…watch?v=VIDEO_ID&t=45s&list=…` (strip extras) |

A robust TypeScript extractor:

```ts
export function extractVideoId(input: string): string | null {
	// Already a bare 11-char ID
	if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;

	try {
		const url = new URL(input.trim());
		const host = url.hostname.replace(/^www\.|^m\./, '');

		if (host === 'youtu.be') {
			return url.pathname.slice(1).split('/')[0] || null;
		}
		if (host.endsWith('youtube.com')) {
			const v = url.searchParams.get('v');
			if (v) return v;
			const parts = url.pathname.split('/').filter(Boolean);
			// /shorts/ID, /embed/ID, /live/ID
			if (['shorts', 'embed', 'live', 'v'].includes(parts[0])) {
				return parts[1] ?? null;
			}
		}
	} catch {
		return null;
	}
	return null;
}
```

Validate against `/^[A-Za-z0-9_-]{11}$/` before sending downstream — it prevents SSRF-ish abuse where a user pastes an arbitrary URL and your backend happily fetches it.

---

## Cloud Deployment Options

### Option 1: Third-Party Transcript API (Recommended Starting Point)

Managed services that wrap YouTube transcript extraction and handle PO tokens, rate limits, and failover.

| Service                   | Price                       | Notes                                                    |
| ------------------------- | --------------------------- | -------------------------------------------------------- |
| **Supadata**              | $5/month (100 free/month)   | Has AI fallback if captions unavailable; Python + JS SDK |
| **YouTube-Transcript.io** | $9.99/month                 | Simple API, well-documented                              |
| **SocialKit**             | $13/month                   | Also fetches comments, video details                     |
| **Transcribr**            | Pay-as-you-go (~$5 credits) | No subscription                                          |
| **RapidAPI providers**    | $10–20/month                | Many options; quality varies                             |

**Request flow with Supadata:**

```
AI Agent
  → POST https://api.supadata.ai/v1/youtube/transcript
       { url: "https://youtube.com/watch?v=...", lang: "en" }
  ← { transcript: [...], title, duration, ... }
```

**Pros:** Zero infrastructure. Zero maintenance. PO tokens handled.  
**Cons:** Vendor dependency. Cost scales with volume.

---

### Option 2: Serverless Function with youtube-transcript-api

Deploy the Python library as a cloud function. Best for low-to-medium volume where you want control.

**Platforms:** AWS Lambda, Google Cloud Functions, Vercel serverless (not edge)

**Package size:** ~100KB — trivially small, no special handling needed.

**GCF example handler:**

```python
import functions_framework
from youtube_transcript_api import YouTubeTranscriptApi

ytt_api = YouTubeTranscriptApi()

@functions_framework.http
def get_transcript(request):
    data = request.get_json()
    video_id = data.get("videoId")

    try:
        transcript = ytt_api.fetch(video_id, languages=["en"])
        return {"transcript": transcript.to_raw_data()}, 200
    except Exception as e:
        return {"error": str(e)}, 500
```

> **API note:** As of `youtube-transcript-api` v1.0+, the static `YouTubeTranscriptApi.get_transcript()` method is deprecated. Use the instance method `YouTubeTranscriptApi().fetch(video_id)` which returns a `FetchedTranscript` object; call `.to_raw_data()` for the list-of-dicts shape the old API returned.

**Deploy:**

```bash
gcloud functions deploy get-transcript \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1
```

**Execution time:** 500ms–2s per video.  
**Cost:** ~$0.40/million invocations on GCF (practically free at low volume).

**Pros:** Cheap, fast cold starts, no server to manage.  
**Cons:** PO token failures will happen on some videos. Needs monitoring.

---

### Option 3: Containerized Service with yt-dlp (Full Metadata + Transcript)

When you need both yt-dlp metadata AND transcript text — replicating the full local skill.

**Platforms:** Google Cloud Run, Railway, Fly.io, Render

**Dockerfile:**

```dockerfile
FROM python:3.12-slim

# Install yt-dlp and FFmpeg
RUN apt-get update && apt-get install -y ffmpeg curl \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
       -o /usr/local/bin/yt-dlp && chmod +x /usr/local/bin/yt-dlp

# Install Python deps
COPY requirements.txt .
RUN pip install youtube-transcript-api flask

COPY app.py .
CMD ["python", "app.py"]
```

**requirements.txt:**

```
youtube-transcript-api
flask
```

**app.py skeleton:**

```python
import subprocess, json
from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
ytt_api = YouTubeTranscriptApi()

@app.route("/transcript", methods=["POST"])
def transcript():
    video_id = request.json["videoId"]

    # Get metadata via yt-dlp
    meta_result = subprocess.run(
        ["yt-dlp", "--dump-json", "--no-download",
         f"https://youtube.com/watch?v={video_id}"],
        capture_output=True, text=True
    )
    metadata = json.loads(meta_result.stdout)

    # Get transcript via youtube-transcript-api
    fetched = ytt_api.fetch(video_id, languages=["en"])
    segments = fetched.to_raw_data()
    text = " ".join(s["text"] for s in segments)

    return jsonify({
        "title": metadata.get("title"),
        "duration": metadata.get("duration"),
        "upload_date": metadata.get("upload_date"),
        "description": metadata.get("description"),
        "tags": metadata.get("tags", []),
        "chapters": metadata.get("chapters", []),
        "transcript": text,
        "segments": segments
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```

**Deploy to Cloud Run:**

```bash
gcloud run deploy youtube-transcript \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Container size:** ~300–500MB.  
**Cold start:** 2–5 seconds.  
**Cost on Cloud Run:** ~$0.02–0.05 per request at moderate volume; $0 when idle.

**Pros:** Full parity with local skill. Handles long videos. Configurable timeouts.  
**Cons:** Larger image, slower cold start, more infrastructure to maintain.

---

### Option 4: Hybrid (Recommended for Production AI Agent)

Use cheap primary + paid fallback. Handles PO token failures gracefully.

```
AI Agent
  │
  ├─ Try: youtube-transcript-api (Cloud Function, free)
  │     Success → return transcript
  │     PoTokenRequired or failure →
  │
  └─ Fallback: Supadata API (paid, reliable)
               Has AI fallback if no captions at all
```

This pattern costs nearly nothing on successful fetches and only spends money on edge cases.

---

## Rate Limits & Anti-Bot Behavior

| Behavior                 | Detail                                     |
| ------------------------ | ------------------------------------------ |
| Timedtext API rate limit | ~5 requests/10 seconds per IP (unofficial) |
| Rate limit response      | HTTP 429 with `Retry-After` header         |
| IP blocking              | Possible after sustained violations        |
| PO token scope           | Per-IP, per-session, expires periodically  |

**Mitigations for high volume:**

1. **Cache aggressively** — transcript for a given video ID never changes (or rarely does). Store in Redis/Supabase/KV.
2. **Exponential backoff** — respect the `Retry-After` header on 429s.
3. **Proxy rotation** — residential proxy pool distributes requests across IPs.
4. **Rate-limit locally** — add a configurable delay between requests in batch jobs.

---

## Output Format (Same as Local Skill)

Whether you use a self-hosted function or a third-party API, normalize the output to the same markdown format the local skill produces:

```yaml
---
title: "Video Title"
video_id: XXXXXXXXXXX
url: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
channel: Channel Name
upload_date: YYYY-MM-DD
duration: "HH:MM:SS"
views: 12345
tags:
  - tag1
transcribed_date: "YYYY-MM-DD"
---

# Video Title

## Metadata
- **Duration**: HH:MM:SS
- **Upload Date**: YYYY-MM-DD

## Transcript
Full transcript text here...
```

---

## Storing Transcripts in a Database

For a website where users paste a URL and the transcript is saved somewhere queryable, the database model matters more than the extraction method. A video ID never changes, so treat it as a natural primary key and make writes idempotent — a second request for the same video should return the cached row, not re-hit YouTube.

### Suggested Postgres / Supabase schema

```sql
create table youtube_transcripts (
  video_id         text primary key,          -- 11-char YouTube ID
  url              text not null,
  title            text,
  channel          text,
  channel_url      text,
  upload_date      date,
  duration_seconds integer,
  views            bigint,
  tags             text[] default '{}',
  chapters         jsonb  default '[]',       -- [{time, label}]
  description      text,
  transcript_text  text   not null,           -- joined plain text
  segments         jsonb  not null,           -- [{text, start, duration}]
  language         text   default 'en',
  is_generated     boolean,                   -- true if auto-captions
  source           text   not null,           -- 'youtube-transcript-api' | 'supadata' | ...
  fetched_at       timestamptz not null default now(),
  requested_by     uuid references auth.users(id),
  created_at       timestamptz not null default now()
);

-- Full-text search on transcripts
alter table youtube_transcripts
  add column search_vector tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || transcript_text)) stored;

create index youtube_transcripts_search_idx on youtube_transcripts using gin(search_vector);
create index youtube_transcripts_channel_idx on youtube_transcripts(channel);
```

### Why split `transcript_text` and `segments`

- `transcript_text` is what you feed to an LLM, search index, or UI preview — one joined string.
- `segments` preserves timestamps so the UI can deep-link to a moment (`?t=142`) or render a timestamped reader view.

Storing both costs a bit of disk but means you never need to re-fetch to reconstruct either shape.

### Idempotent upsert pattern

```ts
// SvelteKit / Supabase example
const existing = await supabase
	.from('youtube_transcripts')
	.select('video_id, transcript_text')
	.eq('video_id', videoId)
	.maybeSingle();

if (existing.data) return existing.data; // cache hit

const payload = await fetchFromExtractor(videoId); // cloud function or Supadata

const { data, error } = await supabase
	.from('youtube_transcripts')
	.upsert({ video_id: videoId, ...payload }, { onConflict: 'video_id' })
	.select()
	.single();
```

Treat every extraction as cache-first. The transcript for a video is effectively immutable; YouTube occasionally re-generates auto-captions, but for agent/LLM workflows that's rarely worth a refetch. If you need freshness, add a `stale_after interval` check on `fetched_at`.

---

## End-to-End Website Flow

Gluing the pieces together for a user-facing form:

```
Browser form (paste URL)
  │
  ▼
POST /api/youtube-transcript          (SvelteKit +server.ts)
  │  1. auth check (locals.safeGetSession)
  │  2. extractVideoId(url) → 11-char ID or 400
  │  3. cache lookup in youtube_transcripts by video_id
  │     └─ hit → return row, done
  │  4. call extractor (Cloud Function / Supadata / hybrid)
  │  5. upsert row, return it
  ▼
UI renders title, duration, transcript, deep-link timestamps
```

**Things to decide up front:**

- **Sync vs. background?** Transcripts for 2h+ videos can push past Vercel's 10s serverless timeout. Either run extraction on Cloud Run (longer timeout) or enqueue a background job and stream status back via SSE / polling.
- **Rate limiting.** Put a per-user limit on the endpoint — otherwise one user pasting 500 URLs drains your quota / hits YouTube's IP throttle.
- **Who can read what?** If transcripts are private per-user, add RLS on `youtube_transcripts` keyed on `requested_by`. If they're shared (the more useful default for a corpus), keep them public-read but gated-write.
- **Cost guardrail.** Even a free extractor is fronted by your serverless billing. Cap the per-user monthly count in code.

---

## Decision Matrix

| Your situation                                       | Recommended approach                                  |
| ---------------------------------------------------- | ----------------------------------------------------- |
| Just getting started, low volume (<500 videos/month) | Supadata API                                          |
| Budget-conscious, okay with occasional failures      | Cloud Function + youtube-transcript-api               |
| Need full metadata (chapters, tags, description)     | Cloud Run container (yt-dlp + youtube-transcript-api) |
| Production AI agent, reliability matters             | Hybrid: Cloud Function → Supadata fallback            |
| Own YouTube channel captions only                    | YouTube Data API v3 (official, free)                  |

---

## What the Official YouTube Data API v3 Cannot Do

Worth calling out explicitly: the official `https://www.googleapis.com/youtube/v3/captions` endpoint **only works for videos on your own channel**. It requires OAuth 2.0 and cannot access another creator's captions. It is not a solution for general transcript extraction.

---

## Quick Reference: Endpoints

| What                  | URL                                                              |
| --------------------- | ---------------------------------------------------------------- |
| Video page (metadata) | `https://www.youtube.com/watch?v={id}`                           |
| Innertube player API  | `https://www.youtube.com/youtubei/v1/player`                     |
| Timedtext / captions  | `https://www.youtube.com/api/timedtext?v={id}&lang=en&fmt=json3` |
| Supadata transcript   | `https://api.supadata.ai/v1/youtube/transcript`                  |

---

## JavaScript / Node.js Alternatives

If the agent runs in a Node.js environment, use one of these npm packages instead of the Python library:

```bash
npm install youtube-transcript           # basic
npm install youtube-transcript-plus      # proxy support
npm install ai-youtube-transcript        # multi-language, translation
```

All three use the same Innertube API flow. All face the same PO token risk.

---

## MCP Server Option

A pre-built remote MCP server exists specifically for this use case:

**`cloudflare-youtube-transcript-mcp-server`** — deploys on Cloudflare Workers and exposes a `get_transcript` tool that AI agents can call via the Model Context Protocol.

This is an excellent option if the target AI agent supports MCP tool calls and you want zero-infrastructure setup.

Deploy to Cloudflare Workers:

```bash
npx wrangler deploy
```

Then configure the AI agent to point at the deployed MCP endpoint.

---

## Implementation Checklist

A concrete build order for the website version, from cheapest to safest:

1. **Schema** — create the `youtube_transcripts` table (or equivalent) with `video_id` as primary key.
2. **URL parser** — ship `extractVideoId()` + a unit test that covers all six URL shapes above.
3. **Pick one extractor** — start with Supadata (Option 1) if you want zero ops, or a Cloud Function (Option 2) if you're cost-sensitive and okay monitoring failures.
4. **Server endpoint** — `POST /api/youtube-transcript` that does: auth → parse → cache lookup → extractor → upsert → return.
5. **Cache first** — wire the row lookup before the extractor call. This is what makes the feature cheap at steady state.
6. **Handle the long-video case** — decide sync vs. background before you discover the hard way that a 3h podcast times out.
7. **Rate limit** — per-user cap on the endpoint; cap total monthly spend on the extractor.
8. **Add fallback later** — once you see real PO-token failures in logs, wire the Option 4 hybrid (local extractor → Supadata fallback). Don't build it speculatively.
9. **Expose to agents** — if an LLM agent in this codebase should be able to trigger transcription, give it a tool that calls the same endpoint rather than bypassing to YouTube directly. That way cache + rate limits apply uniformly.

---

## Gaps vs. the Local Skill

The local `youtube-transcript` skill does more than just fetch text — worth deciding whether the cloud version should keep parity:

| Local skill capability                                | Cloud equivalent                                      |
| ----------------------------------------------------- | ----------------------------------------------------- |
| Extract chapters / timestamps from yt-dlp             | Requires Option 3 (Cloud Run + yt-dlp), not Option 1  |
| Save to filesystem as markdown                        | Replaced by DB row; render markdown on read           |
| Post-download analysis framework (10-section extract) | Run as a separate LLM step on `transcript_text`       |
| Batch download a channel                              | Loop over `yt-dlp --flat-playlist` output server-side |
| Naming convention `{nn}-{slug}.md`                    | Not needed — `video_id` is the identifier now         |

If the goal is strict parity, Option 3 (containerized yt-dlp + youtube-transcript-api) is the only one that covers chapters and rich metadata. If you can live without chapters, Option 1 or 2 is simpler.
