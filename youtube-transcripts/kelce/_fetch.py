# youtube-transcripts/kelce/_fetch.py
import sys, warnings
warnings.filterwarnings("ignore")
from youtube_transcript_api import YouTubeTranscriptApi

vid = sys.argv[1]
out = sys.argv[2]

def get_text(vid):
    # Try new (v1.x) instance API first, fall back to old classmethod API.
    try:
        api = YouTubeTranscriptApi()
        fetched = api.fetch(vid, languages=["en", "en-US"])
        return " ".join(s.text for s in fetched)
    except Exception as e_new:
        try:
            data = YouTubeTranscriptApi.get_transcript(vid, languages=["en", "en-US"])
            return " ".join(s["text"] for s in data)
        except Exception as e_old:
            raise SystemExit(f"FAILED {vid}: new={e_new!r} old={e_old!r}")

text = get_text(vid)
with open(out, "w") as f:
    f.write(text)
print(f"OK {vid} -> {out} ({len(text)} chars)")
