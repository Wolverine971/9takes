# update_supabase.py
#!/usr/bin/env python3
import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

supabase_url = "https://nhjjzcsnmyotyhykbajc.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oamp6Y3NubXlvdHloeWtiYWpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxODYzMCwiZXhwIjoyMDY3NDk0NjMwfQ.an8SVqD73nLrVe3wLL2XWCHgkemh6RlNFnD1aga0_9Q"

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
