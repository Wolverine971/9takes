<!-- instagram-poster.md -->

The Instagram Saves Engine
The exact prompts, database schema, and scheduler to build a self-running save-to-idea pipeline with Claude Code. From scratch, with zero Python experience required.
You save Instagram posts for inspiration. Then you forget they exist.
Every "I'll come back to this later" save becomes dead weight the moment you swipe to the next reel. This guide turns that dead weight into a self-running content engine.
What You're Building
By the end of this guide, you will have a pipeline that automatically pulls your Instagram saves into Notion twice a day, then lets you run a single command to turn them into platform-ready content ideas. This is not a theory guide. Every step produces a working file.
The Three Pieces You'll Build
Piece
What It Does
sync.py (Python daemon)
Pulls your saved posts from Instagram and writes new ones into a Notion database, twice a day
Two Notion databases
Instagram Saves (raw saves) and Content Ideas (reframed content ready to shoot)
/instagram-sync slash command
Reads unprocessed saves and uses Claude to turn them into platform-ready content ideas
How the System Works
launchd fires sync.py at 9 AM and 9 PM.
sync.py calls the Instagram web API using your session cookies and pulls your saves.
New saves land in your Instagram Saves Notion database with Status = New.
You open Claude Code and run /instagram-sync ideate.
Claude reads the New saves, generates content ideas in your voice, and writes the ones you approve to your Content Ideas database.
Placeholders You'll Customize
Placeholder
Example
What It Is
{{your_niche}}
beginner AI solo founders
Who you're making content for
{{content_pillars}}
Teach, Proof, Tools, Process
Your content categories
{{instagram_collections}}
["Content Ideas", "Inspiration"]
The Instagram save collections to pull from
Initial Prompt for Claude Code
Paste this into a new project

# Build an Instagram Saves → Notion sync system with two parts:

## Part 1:

A Python background script that authenticates to Instagram's web API using browser session cookies, fetches all saved posts (with collection names), and syncs new ones into a Notion database. Each save gets stored with its author, caption, URL, content type (Post/Reel/Carousel), and which Instagram collection it came from. A state file prevents duplicates. The script runs automatically twice a day via macOS launchd.

## Part 2:

A Claude Code skill that reads unprocessed saves from Notion and turns them into content ideas. For each save, it reframes the original concept for an audience of beginner AI solo founders — generates 3 hook variations, a structured outline (Hook → Key Points → CTA), and platform-specific breakdowns for Instagram, TikTok, and YouTube. It presents the ideas for review, then saves approved ones to a separate Content Ideas Notion database and marks the original saves as processed.

## Goal/Desired Output

The goal is a zero-friction pipeline: save something on Instagram, and twice a day it automatically flows into Notion. Then on demand, those saves get transformed into actionable content ideas ready for production.
​
Step 1: Prerequisites & Installation
What You Need

Claude Code installed (claude.ai/claude-code)

A Mac (the scheduler section is Mac-specific; Linux users can adapt with cron)

Python 3.9 or newer

A Notion account with an internal integration token

An Instagram account with at least a few saved posts
Check Your Python Version
python3 --version
​
If it returns 3.9 or higher, you're set. If not:
brew install python3
​
Create a Notion Integration
Go to notion.so/profile/integrations
Click New integration
Name it something like "Instagram Saves Sync"
Under Capabilities, check Read content, Insert content, and Update content
Click Save. Copy the token that starts with ntn\_. You'll need it in Step 4.
Create Your Project Folder
mkdir instagram-saves-engine
cd instagram-saves-engine
​
Step 2: Build the Two Notion Databases
You need two databases. The first captures raw saves. The second holds polished content ideas. Keeping them separate means your content calendar stays clean while your save history accumulates in the background.
Paste this prompt into Claude Code:
Why two databases: Saves is your raw research feed. Content Ideas is where reframed, ready-to-shoot content lives. Keeping them separate means you can process saves in batches without cluttering your actual content calendar.
How to Find a Notion Database ID
Open your database in Notion and look at the URL:
https://www.notion.so/yourworkspace/YOUR-DATABASE-ID?v=...
The 32-character string before the ?v= is the database ID. Copy both IDs. You'll need them in Steps 4 and 7.
Then connect your integration to each database:
Open the database
Click the three-dot menu (top right corner)
Select Connect to and choose your integration
Repeat for the second database

Step 3: Get Your Instagram Session Cookies
Instagram has no public API for saved posts. We authenticate using the same session cookies your browser already sends with every request.
Open Chrome and sign in to instagram.com
Press Cmd+Option+I to open DevTools
Click Application in the top tab bar
In the left sidebar, expand Cookies and click https://www.instagram.com
Find sessionid. Copy the entire Value.
Find csrftoken. Copy the entire Value.
Find ds_user_id. Copy the entire Value (this is your Instagram user ID as a number).
Keep these three values on hand. You'll add them to your config file in Step 4.
Treat these cookies like a password. Anyone with your sessionid can access your Instagram account. Never commit them to git. We store them in a local config.json that stays on your machine only.
Cookies expire. Instagram rotates session cookies every few weeks. When your sync starts failing, come back to this step and grab fresh values. The /instagram-sync slash command has a built-in "Refresh session" action to walk you through it.

Step 4: Generate the Sync Daemon (sync.py)
We'll have Claude Code generate the entire Python file. You do not need to write a single line of Python yourself.
Open Claude Code in your project folder and paste this:
Why not instagrapi: The popular instagrapi library targets Instagram's mobile API and gets flagged faster. The web API we use here mimics exactly what your browser sends, which is lower-risk for a personal script running on your own account.
Once Claude generates the files, set up your Python environment:
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
​
Then copy the example config and fill it in:
cp config.example.json config.json
​
Open config.json and replace each placeholder:
ig*session_id, ig_csrftoken, ig_user_id: the cookie values from Step 3
notion_token: your ntn*... integration token from Step 1
notion_database_id: the Instagram Saves database ID from Step 2
collections_filter: a JSON array of collection names, or remove the key to pull all saves

Step 5: Run Your First Sync
.venv/bin/python3 sync.py
​
A successful run looks like this:
Instagram session valid for @yourusername
Fetching saved posts...
Found X collections
Sync complete: 47 new | 0 skipped | 47 total | 0 errors
​
Open your Instagram Saves database in Notion. You should see rows with Status = New and fields populated for each save.
Pro tip: If your first run pulls in more saves than expected, add a collections_filter to config.json listing only the collections you actually want. My setup only pulls from two: "Content Ideas" and "Claude Code." Everything else stays out.
Once you see rows in Notion with Status = New, the infrastructure is done. Everything from here is configuration.

Step 6: Schedule It With launchd
launchd is the Mac-native process scheduler. This job will run sync.py twice a day, every day, even when you're not at your desk.
Paste this prompt into Claude Code:
Run the two commands Claude gives you. Then verify:
launchctl list | grep instagram-saves
​
If you see an entry, the scheduler is running. It will fire at 9 AM and 9 PM even after you restart your Mac.
Why launchd and not cron: launchd is the official Mac scheduler. It starts on boot automatically, logs cleanly, and is how Apple intends background processes to run.
Pro tip: If the scheduler stops working after a macOS update, reload it with launchctl load ~/Library/LaunchAgents/com.myname.instagram-saves-sync.plist.
Step 7: Build the /instagram-sync Slash Command
The slash command is the creative layer. It reads your unprocessed saves, reframes each one for your audience, and generates platform-ready content ideas. Customize the placeholders below before pasting.
Paste this prompt into Claude Code:
Why this is separate from sync.py: sync.py is the dumb layer. It fetches, dedupes, and writes. The slash command is the smart layer. It reads, reframes, and adapts. The sync runs unattended on a schedule. The ideation runs on demand, when you're ready to think about content.
Step 8: Run Your First Ideation Cycle
Open Claude Code in your project folder and type:
/instagram-sync ideate
​
Claude will query your Saves database for Status = New rows, reframe each one for your audience, present the ideas with hook options and platform breakdowns, write the approved ones to your Content Ideas database, and flip each processed save to Used or Reviewed.
Open your Content Ideas database in Notion. Each approved idea is there, with its angle, outline, and platform-specific breakdown, ready for you to shoot.
Every save becomes a content idea, in your voice, with platform breakdowns. Your saves are no longer dead weight.
The Saves Engine Checklist
One-Time Setup

Two Notion databases created with correct properties

Notion integration connected to both databases

Instagram cookies captured from Chrome DevTools

Claude Code generated sync.py, config.example.json, requirements.txt, and .gitignore

Python venv created and dependencies installed

config.json filled in with real cookies, Notion token, and database ID

First manual sync successful (rows appear in Instagram Saves with Status = New)

launchd plist installed and loaded

Slash command created at .claude/commands/instagram-sync.md

Database IDs and niche placeholders updated in the slash command file
Every Week

Open Claude Code in your project folder

Run /instagram-sync ideate

Approve the ideas that fit your week

Check your Content Ideas database for new entries
When Sync Starts Failing

Run /instagram-sync refresh session

Open Chrome, go to instagram.com, open DevTools, Application, Cookies

Copy fresh sessionid, csrftoken, and ds_user_id

Update config.json with the new values

Run .venv/bin/python3 sync.py to confirm the fix
Pro tip: Your state.json is the only thing preventing duplicate Notion pages. Back it up occasionally. If it gets deleted, the next sync will re-create every previous save as a new row.
What to Do Next
Save with intention. Create Instagram collections for your content pillars before you start. Organized saves become organized ideas.
Process weekly, not daily. Batching is less cognitive load and your ideas will be sharper when you review a full week at once.
Tune the pillar mapping. The slash command's collection-to-pillar logic is where the engine gets your voice. Spend 10 minutes customizing it for your niche.
Expand to other platforms. The same pattern works for X bookmarks, YouTube watch-later, and TikTok saves. Same daemon, different API endpoints.
Follow @justyn.ai for more pipelines like this one.
Built by Justyn Berk (@justyn.ai). Follow for more on building AI systems for solo creators.
If you’re not already, follow me:
And if you want to dive deeper on how to make money with AI, Join the AI Dojo:
