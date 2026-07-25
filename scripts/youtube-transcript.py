#!/usr/bin/env python3
# scripts/youtube-transcript.py
"""Download a YouTube video's metadata (yt-dlp) + transcript (youtube-transcript-api)
and emit structured markdown."""

import argparse
import json
import re
import subprocess
import sys
from datetime import date


def video_id_from(arg):
    m = re.search(r"(?:v=|youtu\.be/|/shorts/|/embed/)([A-Za-z0-9_-]{11})", arg)
    if m:
        return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", arg):
        return arg
    raise SystemExit(f"Could not parse a video id from: {arg}")


def fetch_metadata(vid):
    out = subprocess.run(
        ["yt-dlp", "--dump-single-json", "--no-warnings", "--skip-download",
         f"https://www.youtube.com/watch?v={vid}"],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        print(f"[warn] yt-dlp failed: {out.stderr.strip()[:500]}", file=sys.stderr)
        return {}
    return json.loads(out.stdout)


def hms(seconds):
    if not seconds:
        return ""
    seconds = int(seconds)
    return f"{seconds // 3600}:{(seconds % 3600) // 60:02d}:{seconds % 60:02d}"


def fetch_transcript(vid):
    from youtube_transcript_api import YouTubeTranscriptApi
    api = YouTubeTranscriptApi()
    try:
        fetched = api.fetch(vid, languages=["en", "en-US", "en-GB"])
    except Exception as e:
        print(f"[warn] transcript fetch failed: {e}", file=sys.stderr)
        return []
    return [{"start": s.start, "text": s.text} for s in fetched]


def stamp(t):
    t = int(t)
    if t >= 3600:
        return f"{t // 3600}:{(t % 3600) // 60:02d}:{t % 60:02d}"
    return f"{t // 60}:{t % 60:02d}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("video")
    p.add_argument("-o", "--output")
    p.add_argument("--metadata-only", action="store_true")
    p.add_argument("--timestamps", action="store_true",
                   help="prefix each ~30s block with a timestamp")
    args = p.parse_args()

    vid = video_id_from(args.video)
    meta = fetch_metadata(vid)

    if args.metadata_only:
        print(json.dumps({k: meta.get(k) for k in
                          ("title", "channel", "upload_date", "duration",
                           "view_count", "chapters", "description")}, indent=2))
        return

    segs = fetch_transcript(vid)

    upload = meta.get("upload_date") or ""
    if len(upload) == 8:
        upload = f"{upload[:4]}-{upload[4:6]}-{upload[6:]}"

    chapters = meta.get("chapters") or []
    chapter_lines = "\n".join(
        f'  - time: "{stamp(c.get("start_time", 0))}"\n    label: {json.dumps(c.get("title", ""))}'
        for c in chapters
    )

    desc = (meta.get("description") or "").strip()
    desc_block = "\n".join("  " + line for line in desc.splitlines()) or "  (none)"

    fm = [
        "---",
        f"title: {json.dumps(meta.get('title') or '')}",
        f"video_id: {vid}",
        f'url: "https://www.youtube.com/watch?v={vid}"',
        f"channel: {json.dumps(meta.get('channel') or meta.get('uploader') or '')}",
        f"channel_url: {json.dumps(meta.get('channel_url') or '')}",
        f"upload_date: {upload}",
        f'duration: "{hms(meta.get("duration"))}"',
        f"views: {meta.get('view_count') or 0}",
    ]
    if chapter_lines:
        fm.append("timestamps:")
        fm.append(chapter_lines)
    fm.append("description: |")
    fm.append(desc_block)
    fm.append(f'transcribed_date: "{date.today().isoformat()}"')
    fm.append("---")

    body = [f"\n# {meta.get('title') or vid}\n"]
    body.append("## Metadata")
    body.append(f"- **Channel**: {meta.get('channel') or ''}")
    body.append(f"- **Video**: https://www.youtube.com/watch?v={vid}")
    body.append(f"- **Duration**: {hms(meta.get('duration'))}")
    body.append(f"- **Upload Date**: {upload}")
    body.append(f"- **Views**: {meta.get('view_count') or 0}")
    body.append(f"- **Transcript segments**: {len(segs)}\n")

    if chapters:
        body.append("## Chapters")
        for c in chapters:
            body.append(f"- {stamp(c.get('start_time', 0))} — {c.get('title', '')}")
        body.append("")

    body.append("## Transcript\n")
    if not segs:
        body.append("_(no transcript available)_")
    elif args.timestamps:
        block, block_start, out = [], segs[0]["start"], []
        for s in segs:
            if s["start"] - block_start >= 30 and block:
                out.append(f"**[{stamp(block_start)}]** " + " ".join(block))
                block, block_start = [], s["start"]
            block.append(s["text"].replace("\n", " ").strip())
        if block:
            out.append(f"**[{stamp(block_start)}]** " + " ".join(block))
        body.append("\n\n".join(out))
    else:
        body.append(" ".join(s["text"].replace("\n", " ").strip() for s in segs))

    doc = "\n".join(fm) + "\n" + "\n".join(body) + "\n"

    if args.output:
        with open(args.output, "w") as f:
            f.write(doc)
        print(f"Wrote {args.output} ({len(doc)} chars, {len(segs)} segments)")
    else:
        print(doc)


if __name__ == "__main__":
    main()
