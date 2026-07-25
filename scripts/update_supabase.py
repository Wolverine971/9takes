#!/usr/bin/env python3
# scripts/update_supabase.py
import urllib.request
import json
import os
import ssl
import sys

# Verify TLS. The previous CERT_NONE context silently accepted any certificate,
# which meant this script would happily hand a service-role key to a MITM.
ctx = ssl.create_default_context()

supabase_url = os.environ.get("PUBLIC_SUPABASE_URL", "").rstrip("/")
key = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not supabase_url or not key:
    sys.exit(
        "Set PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY before running.\n"
        "  export $(grep -E '^(PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_KEY)=' .env | xargs)"
    )

updates = [
    ("Jordan-Peterson", ["Joe-Rogan", "Ben-Shapiro", "Justin-Trudeau", "Donald-Trump"]),
    ("Hailey-Bieber", ["Justin-Bieber", "Selena-Gomez", "Kim-Kardashian", "Kylie-Jenner"]),
    ("Justin-Trudeau", ["Barack-Obama", "Kamala-Harris", "Donald-Trump", "Joe-Biden"]),
    ("Malcolm-Gladwell", ["Bill-Gates", "Robert-Greene", "Elon-Musk", "Sam-Altman"]),
    ("Sundar-Pichai", ["Bill-Gates", "Elon-Musk", "Mark-Zuckerberg", "Tim-Cook"]),
    ("Tucker-Carlson", ["Donald-Trump", "Vladimir-Putin", "Joe-Rogan", "Ben-Shapiro"]),
    ("Bad-Bunny", ["Doja-Cat", "Daddy-Yankee", "J-Balvin", "Shakira"]),
    ("Reed-Hastings", ["Steve-Jobs", "Mark-Zuckerberg", "Jeff-Bezos", "Elon-Musk"]),
    ("Xi-Jinping", ["Vladimir-Putin", "Donald-Trump", "Joe-Biden", "Kim-Jong-Un"]),
    ("Abraham-Lincoln", ["Martin-Luther-King-Jr", "Barack-Obama", "Ronald-Reagan", "George-Washington"]),
]

for person, suggestions in updates:
    url = f"{supabase_url}/rest/v1/blogs_famous_people?person=eq.{person}"
    data = json.dumps({"suggestions": suggestions}).encode('utf-8')

    req = urllib.request.Request(url, data=data, method='PATCH')
    req.add_header('apikey', key)
    req.add_header('Authorization', f'Bearer {key}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=minimal')

    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            print(f"✓ Updated {person}")
    except Exception as e:
        print(f"✗ Failed {person}: {e}")

print("\nDone!")
