# scripts/tests/test_youtube_transcript.py
"""Offline regression tests; no YouTube requests or model calls."""

import contextlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import types
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location(
    "youtube_transcript_script", Path(__file__).parents[1] / "youtube-transcript.py"
)
transcript = importlib.util.module_from_spec(spec)
spec.loader.exec_module(transcript)
VIDEO = "ABCDEFGHIJK"


def api_module(result=None, error=None):
    def fetch(*args, **kwargs):
        if error:
            raise error
        return result
    return types.SimpleNamespace(YouTubeTranscriptApi=lambda: types.SimpleNamespace(fetch=fetch))


class TranscriptTests(unittest.TestCase):
    def test_primary_success_does_not_call_fallback(self):
        api = api_module([types.SimpleNamespace(start=1.5, text="Hello")])
        with patch.dict(sys.modules, youtube_transcript_api=api), patch.object(
            transcript, "fetch_transcript_fallback"
        ) as fallback:
            self.assertEqual(transcript.fetch_transcript(VIDEO), [{"start": 1.5, "text": "Hello"}])
            fallback.assert_not_called()

    def test_transport_error_tries_fallback_once(self):
        api = api_module(error=ConnectionError("temporary transport failure"))
        with patch.dict(sys.modules, youtube_transcript_api=api), patch.object(
            transcript, "fetch_transcript_fallback", return_value=[{"start": 0, "text": "Recovered"}]
        ) as fallback, contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(transcript.fetch_transcript(VIDEO)[0]["text"], "Recovered")
            fallback.assert_called_once()

    def test_ip_block_stops_without_a_second_request(self):
        IpBlocked = type("IpBlocked", (Exception,), {})
        with patch.dict(sys.modules, youtube_transcript_api=api_module(error=IpBlocked())), patch.object(
            transcript, "fetch_transcript_fallback"
        ) as fallback:
            with self.assertRaises(transcript.TranscriptBlocked):
                transcript.fetch_transcript(VIDEO)
            fallback.assert_not_called()

    def test_metadata_rate_limit_stops_batch(self):
        response = subprocess.CompletedProcess([], 1, "", "HTTP Error 429: Too Many Requests")
        with patch.object(transcript.subprocess, "run", return_value=response):
            with self.assertRaises(transcript.TranscriptBlocked):
                transcript.fetch_metadata(VIDEO)

    def test_fallback_parses_json3_and_cleans_temporary_files(self):
        captured = []
        def run(command, **kwargs):
            self.assertIn("--skip-download", command)
            self.assertEqual(command[command.index("--retries") + 1], "0")
            directory = Path(command[command.index("-o") + 1]).parent
            captured.append(directory)
            (directory / f"{VIDEO}.en.json3").write_text(json.dumps({"events": [
                {"tStartMs": 0},
                {"tStartMs": 1500, "segs": [{"utf8": "Hello"}, {"utf8": " world\n"}]},
                {"tStartMs": 1500, "segs": [{"utf8": "Hello world"}]},
                {"tStartMs": 3000, "segs": [{"utf8": "Hello world"}]},
            ]}))
            return subprocess.CompletedProcess(command, 0, "", "")
        with patch.object(transcript.subprocess, "run", side_effect=run):
            self.assertEqual(transcript.fetch_transcript_fallback(VIDEO, ["en"]), [
                {"start": 1.5, "text": "Hello world"}, {"start": 3.0, "text": "Hello world"}
            ])
        self.assertFalse(captured[0].exists())

    def test_successful_fallback_without_captions_is_unavailable(self):
        with patch.object(transcript.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, "", "")):
            with self.assertRaises(transcript.TranscriptUnavailable):
                transcript.fetch_transcript_fallback(VIDEO, ["en"])

    def test_failed_fallback_is_error_not_unavailable(self):
        with patch.object(transcript.subprocess, "run", return_value=subprocess.CompletedProcess([], 1, "", "connection reset")):
            with self.assertRaises(transcript.TranscriptError) as error:
                transcript.fetch_transcript_fallback(VIDEO, ["en"])
            self.assertNotIsInstance(error.exception, transcript.TranscriptUnavailable)

    def test_malformed_caption_data_is_error(self):
        def run(command, **kwargs):
            directory = Path(command[command.index("-o") + 1]).parent
            (directory / f"{VIDEO}.en.json3").write_text('{"wrong": "shape"}')
            return subprocess.CompletedProcess(command, 0, "", "")
        with patch.object(transcript.subprocess, "run", side_effect=run):
            with self.assertRaises(transcript.TranscriptError) as error:
                transcript.fetch_transcript_fallback(VIDEO, ["en"])
            self.assertNotIsInstance(error.exception, transcript.TranscriptUnavailable)

    def test_failure_preserves_existing_output(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "existing.md"
            target.write_text("Reviewed transcript")
            with patch.object(sys, "argv", ["script", VIDEO, "-o", str(target)]), patch.object(
                transcript, "fetch_metadata", return_value={}
            ), patch.object(transcript, "fetch_transcript", side_effect=transcript.TranscriptError("failed")):
                with self.assertRaises(transcript.TranscriptError):
                    transcript.main()
            self.assertEqual(target.read_text(), "Reviewed transcript")

    def test_success_preserves_markdown_and_timestamp_contract(self):
        with patch.object(sys, "argv", ["script", VIDEO, "--timestamps"]), patch.object(
            transcript, "fetch_metadata", return_value={"title": "Test", "channel": "Example", "duration": 60}
        ), patch.object(transcript, "fetch_transcript", return_value=[
            {"start": 0, "text": "First"}, {"start": 31, "text": "Second"}
        ]), contextlib.redirect_stdout(io.StringIO()) as output:
            transcript.main()
        self.assertIn('title: "Test"', output.getvalue())
        self.assertIn("**[0:00]** First", output.getvalue())
        self.assertIn("**[0:31]** Second", output.getvalue())


if __name__ == "__main__":
    unittest.main()
