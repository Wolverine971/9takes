<!-- docs/9takes-context.md -->

# 🧠 9takes: Master Context File

This document serves as the **core context engine** for 9takes - a personality-based Q&A platform. It enables LLMs to understand the platform's architecture, build features, and maintain alignment with the core mission while preserving the unique user experience.

---

## 🎯 Core Mission & Values

**Tagline**: _"See the emotions behind every take"_

**Secondary**: _"One situation, 9 ways to see it"_

### 🎲 Core Problem We Solve

Social media has become inauthentic, filled with echo chambers and performative behavior. 9takes aims to restore serendipity, playfulness, and realness by creating structure for productive online conversations.

### 🧩 Unique Value Propositions

1. **Give-First Mechanic**: Comments are revealed after you comment, not before. This ensures original, unbiased responses
2. **Personality-Based Context**: Users are anonymous except for their Enneagram type, providing meaningful context without divisive demographics
3. **Question-Centric Design**: Questions invite responses and create meaningful interactions, unlike posts that don't encourage dialogue
4. **Open Source Conflict Resolution**: Transform personal dilemmas into crowd-sourced wisdom through diverse personality perspectives

---

## 🏗️ System Architecture Overview

### 🔧 Technology Stack

- **Frontend**: SvelteKit + TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Search**: Elasticsearch integration
- **Styling**: TailwindCSS
- **Analytics**: Custom analytics system
- **Email**: Custom notification system

### 🌐 Platform Structure

```
9takes.com/
├── questions/           # Main Q&A platform
├── personality-analysis/# Celebrity Enneagram analyses
├── enneagram-corner/   # Educational content
├── how-to-guides/      # Practical advice content
├── community/          # Platform insights & philosophy
├── book-session/       # Individual coaching
└── admin/              # Platform management
```

---

## 🧠 Core Data Models & Relationships

### 🔑 Primary Tables

#### `questions` Table

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    author_id UUID REFERENCES profiles(id),
    question TEXT,
    question_formatted TEXT,
    context TEXT,
    url TEXT UNIQUE,
    img_url TEXT,
    comment_count INTEGER DEFAULT 0,
    last_comment_date TIMESTAMP,
    tagged BOOLEAN DEFAULT FALSE,
    flagged BOOLEAN DEFAULT FALSE,
    removed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `comments` Table

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author_id UUID REFERENCES profiles(id),
    parent_id INTEGER, -- question or comment ID
    parent_type TEXT, -- 'question' or 'comment'
    comment TEXT,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    fingerprint TEXT, -- for anonymous tracking
    ip TEXT,
    removed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP
);
```

#### `profiles` Table

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    enneagram TEXT, -- '1', '2', '3', etc.
    avatar_url TEXT,
    external_id TEXT UNIQUE,
    admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🎭 Content Tables

#### `blogs_famous_people` Table

Celebrity Enneagram analyses with rich metadata:

- `person`: Celebrity name
- `enneagram`: Their type
- `content`: Analysis content
- `suggestions`: Related people JSON
- Social media links (Instagram, Twitter, TikTok, Wikipedia)

#### `question_categories` & `question_tags`

Hierarchical categorization system for questions across topics like relationships, politics, technology, etc.

---

## ✨ Core Features & User Flows

### 🤔 Question Asking Flow

1. **Authentication Required**: Users must register to ask questions
2. **Question Composition**: Title, context, optional image, category tagging
3. **URL Generation**: Auto-generated SEO-friendly URLs
4. **Elasticsearch Indexing**: Questions indexed for search
5. **Community Notification**: Subscribers notified of new questions

### 💬 Commenting Flow (The Magic)

1. **Give-First Mechanic**: User must compose answer before seeing others
2. **Anonymous Context**: Only Enneagram type shown (if provided)
3. **Reveal System**: After commenting, all other responses become visible
4. **Engagement Features**: Like system, comment threading
5. **Personality Sorting**: Comments can be filtered by Enneagram type

### 🔍 Content Discovery

- **Question Categories**: Hierarchical browsing system
- **Personality Filtering**: Sort by Enneagram type
- **Search Integration**: Elasticsearch-powered search
- **Celebrity Analyses**: Gateway content for user acquisition

---

## 🎨 Brand Voice & Positioning

### 🎯 Target Audience

**Primary**: Young men seeking social/dating advantage, tactical psychology enthusiasts
**Secondary**: Anyone interested in personality psychology and authentic discourse

### 📝 Voice Attributes

- **Tactically Direct**: No fluff, actionable insights
- **Socially Savvy**: Connect insights to real-world social wins
- **Respectfully Provocative**: Challenge comfort zones without shaming
- **Pattern-Recognition Focused**: Show emotional logic behind behavior
- **Results-Driven**: Encouraging but focused on practical outcomes

### 🗣️ Key Messaging

- **Emotional Foundation Mapping**: "Understand WHY people see things differently"
- **Give-First Intelligence**: "Comment first, then see everyone else's take"
- **Personality-Maxing**: "Level up your EQ through tactical self-knowledge"
- **Open Source Conflict Resolution**: "Turn conflict into understanding through crowd-sourced wisdom"

---

## 🛠️ Component Architecture

### 📁 SvelteKit Structure

```
src/
├── routes/                 # Page components & API endpoints
│   ├── questions/         # Q&A platform routes
│   ├── personality-analysis/ # Celebrity analyses
│   ├── enneagram-corner/  # Educational content
│   ├── how-to-guides/     # Practical advice
│   ├── community/         # Platform philosophy
│   └── api/               # Server endpoints
├── lib/
│   ├── components/        # Reusable UI components
│   │   ├── atoms/         # Basic UI elements
│   │   ├── molecules/     # Composite components
│   │   └── icons/         # Icon components
│   ├── utils/             # Helper functions
│   └── supabase.ts        # Database client
└── app.html               # Root template
```

### 🧩 Key Components

#### Core UI Components

- `Card`: Flexible container component
- `Modal`: Overlay dialogs
- `QuestionItem`: Question display component
- `Comments`: Comment thread rendering
- `QuestionSearch`: Search interface

#### Specialized Components

- `Mermaid`: Diagram rendering
- `WordCloud`: Tag visualization
- `Toast`: Notification system
- `EmailSignup`: Lead capture

---

## 🔧 Key System Functions

### 🎭 Enneagram Integration

```javascript
// Personality type handling
const enneagramTypes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Type-specific content routing
function getTypeSpecificContent(type, category) {
	// Returns content tailored to specific Enneagram type
}

// Comment filtering by personality type
function filterCommentsByType(comments, types) {
	// Filters comments to show only specified types
}
```

### 🔐 Give-First Comment System

```sql
-- Core function: Check if user can see comments
CREATE OR REPLACE FUNCTION can_see_comments(
    questionid INTEGER,
    userid TEXT,
    userfingerprint TEXT
) RETURNS BOOLEAN;

-- User must have commented to see other responses
```

### 📊 Analytics & Engagement

```sql
-- Track user engagement
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    question_id INTEGER REFERENCES questions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment analytics
CREATE TABLE comment_like (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id),
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎯 Content Strategy Framework

### 📝 Content Pillars & SEO Strategy

**Primary Goal**: Drive organic search traffic to convert readers into platform users

1. **Celebrity Enneagram Analysis** (`/personality-analysis/[slug]`)
   - Gateway content for Enneagram discovery
   - High-volume search terms (celebrity names + personality)
   - Convert curiosity into platform engagement

2. **Enneagram Education** (`/enneagram-corner/[slug]`)
   - Core Enneagram concepts and applications
   - Target educational search queries
   - Build authority in personality psychology space

3. **How-To Guides** (`/how-to-guides/[slug]`)
   - Practical relationship and personal development advice
   - Long-tail SEO opportunities
   - Convert help-seekers into question-askers

4. **Community Insights** (`/community/[slug]`)
   - Platform philosophy and behind-the-scenes content
   - Brand building and user education
   - Convert readers into engaged community members

**Content Strategy**: All content routes serve as funnels back to the main Q&A platform, with clear CTAs encouraging users to ask questions or engage with the community.

---

## 🤖 LLM Usage Guidelines

### **When Building Features or Creating Content**

1. **SEO-First Approach**: Always optimize for organic search discovery
   - Target high-volume, relevant keywords in content creation
   - Structure content with clear H1/H2/H3 hierarchy
   - Include meta descriptions and structured data where applicable

2. **Enneagram Integration**: Consider personality psychology throughout
   - Offer type-specific insights when relevant
   - Use Enneagram as framework for understanding diverse perspectives
   - Include personality context in user-facing features

3. **Platform Funnel Strategy**: All content should drive platform engagement
   - Include clear CTAs to encourage question-asking
   - Cross-link between content types to increase time on site
   - Convert content consumers into active community participants

4. **Maintain Brand Voice**: Use tactical, socially-savvy language
   - Focus on practical applications over abstract theory
   - Emphasize pattern recognition and emotional intelligence
   - Keep tone respectfully provocative and results-driven

### **Content Creation Standards**

- **Celebrity Analyses**: Build mental models, target "[Celebrity Name] personality type" searches
- **Educational Content**: Answer common Enneagram questions, establish topical authority
- **How-To Guides**: Solve relationship/personal development problems, capture help-seeking searches
- **Community Posts**: Share platform philosophy, build brand recognition

---

## 🔗 Future Integration Points (Not Currently Prioritized)

### 📧 Email System (Future)

- Newsletter subscriptions via `signups` table
- Question notifications for subscribers
- Coaching waitlist management

### 🎨 Social Media (Future)

- Auto-generated quote cards from celebrity analyses
- Cross-platform content distribution
- Influencer collaboration tracking

### 📍 Location Features (Future)

- `addresses` table for potential local meetups
- Geographic question filtering
- Location-based community building

### 🎓 Coaching Integration (Future)

- `coaching_waitlist` with UTM tracking
- Session booking system
- Enneagram-based coaching matching

---

## 🎭 Enneagram Type Reference

### Quick Type Descriptions

- **Type 1 (Reformer)**: Principled, purposeful, self-controlled, perfectionistic
- **Type 2 (Helper)**: Generous, demonstrative, people-pleasing, possessive
- **Type 3 (Achiever)**: Adaptive, excelling, driven, image-conscious
- **Type 4 (Individualist)**: Expressive, dramatic, self-absorbed, temperamental
- **Type 5 (Investigator)**: Perceptive, innovative, secretive, isolated
- **Type 6 (Loyalist)**: Engaging, responsible, anxious, suspicious
- **Type 7 (Enthusiast)**: Spontaneous, versatile, acquisitive, scattered
- **Type 8 (Challenger)**: Self-confident, decisive, willful, confrontational
- **Type 9 (Peacemaker)**: Receptive, reassuring, complacent, resigned

### Type-Specific UX Considerations

- **Type 1**: Needs clear structure and quality content
- **Type 2**: Values community connection and helping others
- **Type 3**: Wants efficient, goal-oriented interactions
- **Type 4**: Seeks authentic, unique experiences
- **Type 5**: Prefers depth over breadth, minimal social pressure
- **Type 6**: Needs security and clear guidelines
- **Type 7**: Enjoys variety and quick engagement
- **Type 8**: Values directness and control
- **Type 9**: Appreciates gentle, non-confrontational interfaces

---

This context file serves as the foundation for understanding 9takes' mission, architecture, and unique approach to online discourse. When building features or creating content, always refer back to these core principles to maintain platform integrity and user experience.
