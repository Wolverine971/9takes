import json
import os

# Read .env file to get credentials
env_vars = {}
with open('.env', 'r') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"').strip("'")

supabase_url = env_vars.get('PUBLIC_SUPABASE_URL')
service_key = env_vars.get('SUPABASE_SERVICE_KEY')

# All the suggestions updates needed
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

# Create a shell script that will run all the updates
script_lines = ['#!/bin/bash', 'source .env', '']

for person, suggestions in updates:
    payload = {"suggestions": suggestions}
    json_file = f'/tmp/update_{person.lower().replace("-", "_")}.json'

    # Write the JSON file
    with open(json_file, 'w') as f:
        json.dump(payload, f)

    # Add curl command to script
    script_lines.append(f'echo "Updating {person}..."')
    script_lines.append(f'curl -s -X PATCH "${{PUBLIC_SUPABASE_URL}}/rest/v1/blogs_famous_people?person=eq.{person}" \\')
    script_lines.append(f'  -H "apikey: ${{SUPABASE_SERVICE_KEY}}" \\')
    script_lines.append(f'  -H "Authorization: Bearer ${{SUPABASE_SERVICE_KEY}}" \\')
    script_lines.append(f'  -H "Content-Type: application/json" \\')
    script_lines.append(f'  -H "Prefer: return=minimal" \\')
    script_lines.append(f'  -d @{json_file}')
    script_lines.append(f'echo " ✓ Done"')
    script_lines.append('')

script_lines.append('echo ""')
script_lines.append('echo "All updates complete!"')

# Write the shell script
with open('/tmp/run_updates.sh', 'w') as f:
    f.write('\n'.join(script_lines))

print("✓ Created JSON files for each update")
print("✓ Created /tmp/run_updates.sh")
print("\nRun: bash /tmp/run_updates.sh")
