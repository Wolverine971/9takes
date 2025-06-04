# 🌐 Life OS: Master Context File

This document serves as the **core context engine** for David Wayne's Life Operating System (Life OS). It enables LLMs to help manage life, projects, goals, and personal content while maintaining alignment, organization, and congruence.

---

## 🎯 Core Objectives of the Life OS

1. **Stay Organized**  
   Track all tasks, routines, projects, and commitments across multiple domains.

2. **Stay Aligned**  
   Ensure that every task, post, project, and decision ladders up to defined personal and professional goals.

3. **Stay Congruent**  
   Maintain a unified voice, message, and identity across all public-facing platforms and channels.

---

## 🧠 System Architecture Overview

### 🔧 Centralized Context Engine

The Life OS is built around a centralized, queryable context system using Supabase + SvelteKit. It integrates LLMs to:

- Understand personal history, current goals, and working style
- Ingest raw notes and brain dumps to auto-populate structured fields
- Provide task generation, goal alignment, and daily briefing services
- Maintain project-wide consistency across time

---

### 🧩 Modular Context Blocks

Your life is structured into six key knowledge modules:

| Module                    | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| `Who I Am`                | Background, identity, values                    |
| `What I’m Building`       | Projects, companies, missions                   |
| `What I Believe`          | Core philosophies and worldviews                |
| `How I Work`              | Habits, workflows, tools, schedules             |
| `What I Need Help With`   | Ongoing prompts, blockers, collaboration wishes |
| `Task + Project Database` | All tasks, projects, context, and LLM hooks     |

---

## ✨ System Features

### 🔄 Brain Dump → Structured Context

Capture thoughts, notes, and updates in any form. The LLMs convert them into structured, queryable data models.

### 📆 Daily Brief Generator

Each morning or on demand, the LLMs generate:

- Key priorities for the day
- Project bottlenecks
- Task dependencies
- Suggestions for momentum

### 🔁 Multi-Project Coordination

Maintain oversight across multiple ventures. Ensure effort is not wasted. Prioritize what matters. Share assets across domains.

### 🎙 Writing Voice Guide

LLMs reflect a distinct writing style—bold, tactical, emotionally intelligent, and results-driven. Voice is based on David's brand personality (Enneagram Type 8).

---

## 🚀 Projects

### 1. **9takes** (`9takes`)

**Type**: Emotional intelligence platform  
**Mission**: Help people improve their EQ, resolve conflict, and understand personality through Enneagram-lensed group discussion.  
**Tagline**: "See the emotions behind every take."

**Core Features**:

- Comment-before-you-see mechanic (bias-free engagement)
- Situational prompts and crowd-sourced insight
- Threads and blogs on personality dynamics
- Coaching sessions and individual growth tools

---

### 2. **Tiny Tribe Adventures** (`tiny_tribe_adventures`)

**Type**: Family-friendly activity and travel platform  
**Mission**: Help families find magical, wholesome activities and plan trips with ease.  
**Tagline**: "Make magic memories, one tiny tribe adventure at a time."

**Core Features**:

- Map-based location and event search
- Taggable itineraries
- Reviews, bookmarks, and kid-tested experiences

---

### 3. **The Cadre** (`the_cadre`)

**Type**: Long-range precision rifle training  
**Mission**: Help civilians and professionals access elite-level marksmanship and fieldcraft.  
**Tagline**: "Sniper-grade coaching. Tactical clarity."

**Core Features**:

- In-person courses and sign-up flows
- Email automation and CRM integration
- Social media for audience trust-building

---

## 📱 Social Media Accounts

| Platform  | Account                      | Focus                                                           |
| --------- | ---------------------------- | --------------------------------------------------------------- |
| Instagram | `@djwayne3`                  | Family life and builder lifestyle                               |
| Instagram | `@dj_pew_pew`                | Long-range shooting journey                                     |
| Twitter   | `@djwayne3`                  | Tech, startup notes, OS experiments                             |
| Twitter   | `@StaxMeel`                  | Military/political takes, brand still forming                   |
| Twitter   | `@9takesdotcom`              | EQ content, Enneagram threads, conflict decoding                |
| TikTok    | `@unified_voice_exploration` | Merging tech, tactics, personality-maxing into single narrative |

---

## 🧬 Life OS: Data Models Reference

### 📁 `projects` Table

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name TEXT,
    slug TEXT UNIQUE,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'paused', 'completed')),
    start_date DATE,
    end_date DATE,
    tags TEXT[]
);
```

---

### 🧠 `project_context` Table

```sql
CREATE TABLE project_context (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id) UNIQUE,
    goals TEXT,
    vision TEXT,
    phases TEXT,
    target_users TEXT,
    growth_strategy TEXT,
    brand_voice TEXT,
    social_media_accounts TEXT,
    feelings_to_invoke TEXT,
    thoughts_to_think TEXT,
    actions_to_do TEXT,
    inspiration TEXT,
    differentiators TEXT,
    current_problems TEXT,
    assets TEXT,
    tech_stack TEXT,
    keywords TEXT,
    llm_prompt_examples TEXT,
    recent_updates TEXT,
    team_notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 📋 `tasks` Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    title TEXT,
    description TEXT,
    status TEXT CHECK (status IN ('backlog', 'in_progress', 'done', 'blocked')),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dependencies UUID[],
    notes TEXT
);
```

---

### 🧱 Keywords for Project Identification

- **9takes** → `9takes`
- **Tiny Tribe Adventures** → `tiny_tribe_adventures`
- **The Cadre** → `the_cadre`

LLMs should match notes, tasks, and prompts using these slugs.

---

## 🤖 LLM Usage Instructions

When reading this document:

- Use `project_context` for high-level vision, philosophy, and strategy
- Use `tasks` for atomic, actionable items tied to output
- Use `slug` identifiers to map content to the correct context
- Parse raw notes and brain dumps using prompt classification logic
- Always return Markdown-compatible output

---
