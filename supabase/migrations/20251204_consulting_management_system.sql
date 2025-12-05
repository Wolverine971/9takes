-- supabase/migrations/20251204_consulting_management_system.sql
-- Comprehensive consulting management system for personality maxing coaching

-- ============================================================================
-- CLIENTS TABLE
-- Core client information, linked to coaching waitlist entries
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to waitlist (if they came from there)
    -- Note: coaching_waitlist.id is likely an auto-increment integer, but we store as TEXT for flexibility
    waitlist_id TEXT,

    -- Basic Info
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,

    -- Enneagram Profile
    enneagram_type INTEGER CHECK (enneagram_type BETWEEN 1 AND 9),
    enneagram_wing INTEGER CHECK (enneagram_wing BETWEEN 1 AND 9),
    enneagram_confirmed BOOLEAN DEFAULT FALSE,
    tritype TEXT, -- e.g., "469"
    instinctual_variant TEXT CHECK (instinctual_variant IN ('sp', 'sx', 'so', 'sp/sx', 'sp/so', 'sx/sp', 'sx/so', 'so/sp', 'so/sx')),

    -- Client Status
    status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'intake_sent', 'intake_completed', 'active', 'completed', 'paused', 'churned')),

    -- Trust Onion Layer (from viral coach framework)
    trust_layer TEXT DEFAULT 'outer' CHECK (trust_layer IN ('outer', 'middle', 'inner')),

    -- Source Tracking
    source TEXT, -- how they found you
    referral_source TEXT,

    -- Financial
    lifetime_value DECIMAL(10,2) DEFAULT 0,

    -- Notes
    initial_goal TEXT, -- what they said they wanted
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    first_session_at TIMESTAMPTZ,
    last_session_at TIMESTAMPTZ
);

-- Index for common queries
CREATE INDEX idx_consulting_clients_status ON public.consulting_clients(status);
CREATE INDEX idx_consulting_clients_email ON public.consulting_clients(email);
CREATE INDEX idx_consulting_clients_enneagram ON public.consulting_clients(enneagram_type);

-- ============================================================================
-- INTAKE FORMS TABLE
-- Detailed intake questionnaire responses
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.consulting_clients(id) ON DELETE CASCADE,

    -- Form Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'reviewed')),
    sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,

    -- SECTION 1: Background
    age_range TEXT,
    occupation TEXT,
    relationship_status TEXT,
    living_situation TEXT,

    -- SECTION 2: Current Situation
    current_challenges TEXT, -- What's the main thing you're struggling with?
    desired_outcome TEXT, -- What would success look like?
    previous_attempts TEXT, -- What have you tried before?
    urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),

    -- SECTION 3: Personality Assessment
    suspected_type INTEGER,
    why_this_type TEXT, -- Why do you think you're this type?
    core_fear TEXT, -- What's your biggest fear?
    core_desire TEXT, -- What do you want most in life?
    childhood_message TEXT, -- What message did you get as a kid?

    -- SECTION 4: Emotional Patterns
    primary_emotion TEXT, -- anger, shame, or fear
    emotion_expression TEXT, -- How do you typically express this emotion?
    stress_response TEXT, -- What do you do when stressed?
    comfort_response TEXT, -- What do you do when relaxed?

    -- SECTION 5: Relationships
    relationship_patterns TEXT, -- Common issues in relationships
    communication_style TEXT, -- How do you communicate?
    conflict_style TEXT, -- How do you handle conflict?

    -- SECTION 6: Goals
    short_term_goals TEXT,
    long_term_goals TEXT,
    specific_scenarios TEXT, -- Specific situations to work on

    -- SECTION 7: Logistics
    preferred_session_time TEXT,
    timezone TEXT,
    how_heard_about_us TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consulting_intake_client ON public.consulting_intake_forms(client_id);
CREATE INDEX idx_consulting_intake_status ON public.consulting_intake_forms(status);

-- ============================================================================
-- SESSIONS TABLE
-- Track all coaching sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.consulting_clients(id) ON DELETE CASCADE,

    -- Session Details
    session_number INTEGER NOT NULL DEFAULT 1,
    session_type TEXT DEFAULT 'discovery' CHECK (session_type IN ('intro_call', 'discovery', 'follow_up', 'deep_dive', 'relationship', 'stress_test')),
    duration_minutes INTEGER DEFAULT 60,

    -- Scheduling
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')),

    -- Meeting Info
    meeting_link TEXT,
    recording_link TEXT,

    -- Session Content (pre-filled from playbook)
    agenda TEXT,

    -- Session Notes (filled during/after)
    pre_session_notes TEXT, -- Notes before the session
    session_notes TEXT, -- Notes during the session
    key_insights TEXT, -- Main takeaways
    action_items TEXT, -- What client should do

    -- Type-Specific Observations
    observed_patterns TEXT,
    stress_indicators TEXT,
    growth_indicators TEXT,

    -- Trust Onion Progress
    trust_layer_start TEXT,
    trust_layer_end TEXT,

    -- Follow-up
    follow_up_needed BOOLEAN DEFAULT TRUE,
    follow_up_notes TEXT,
    next_session_focus TEXT,

    -- Financials
    price DECIMAL(10,2),
    paid BOOLEAN DEFAULT FALSE,
    payment_date TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consulting_sessions_client ON public.consulting_sessions(client_id);
CREATE INDEX idx_consulting_sessions_scheduled ON public.consulting_sessions(scheduled_at);
CREATE INDEX idx_consulting_sessions_status ON public.consulting_sessions(status);

-- ============================================================================
-- CLIENT NOTES TABLE
-- Ongoing notes and observations about clients
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.consulting_clients(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.consulting_sessions(id) ON DELETE SET NULL,

    -- Note Content
    note_type TEXT DEFAULT 'observation' CHECK (note_type IN ('observation', 'insight', 'pattern', 'action_item', 'follow_up', 'breakthrough', 'concern')),
    title TEXT,
    content TEXT NOT NULL,

    -- Context
    is_private BOOLEAN DEFAULT TRUE, -- not shared with client
    is_flagged BOOLEAN DEFAULT FALSE, -- important to review

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consulting_notes_client ON public.consulting_client_notes(client_id);
CREATE INDEX idx_consulting_notes_type ON public.consulting_client_notes(note_type);

-- ============================================================================
-- DELIVERABLES TABLE
-- Documents and resources sent to clients
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.consulting_clients(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.consulting_sessions(id) ON DELETE SET NULL,

    -- Deliverable Info
    title TEXT NOT NULL,
    description TEXT,
    deliverable_type TEXT DEFAULT 'summary' CHECK (deliverable_type IN ('summary', 'blueprint', 'action_plan', 'type_profile', 'relationship_guide', 'custom')),

    -- Content
    content TEXT, -- markdown content

    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sent', 'viewed')),
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consulting_deliverables_client ON public.consulting_deliverables(client_id);

-- ============================================================================
-- TEMPLATES TABLE
-- Reusable templates for sessions, deliverables, emails
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Template Info
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('session_agenda', 'deliverable', 'email', 'intake_question')),

    -- For type-specific templates
    enneagram_type INTEGER CHECK (enneagram_type BETWEEN 1 AND 9), -- NULL means applies to all types

    -- Content
    content TEXT NOT NULL, -- markdown with {{placeholders}}

    -- Usage
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consulting_templates_type ON public.consulting_templates(template_type);

-- ============================================================================
-- RESOURCES TABLE
-- Playbooks, frameworks, and reference materials
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consulting_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Resource Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('playbook', 'framework', 'script', 'reference', 'exercise')),

    -- Content
    content TEXT NOT NULL, -- markdown

    -- Organization
    sort_order INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,

    -- Links to related resources
    related_blog_slug TEXT, -- link to blog post

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consulting_resources_category ON public.consulting_resources(category);
CREATE INDEX idx_consulting_resources_slug ON public.consulting_resources(slug);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Client overview with session stats
CREATE OR REPLACE VIEW public.consulting_clients_overview AS
SELECT
    c.*,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'completed') as completed_sessions,
    MAX(s.scheduled_at) as next_session,
    cw.session_goal as original_goal
FROM public.consulting_clients c
LEFT JOIN public.consulting_sessions s ON s.client_id = c.id
LEFT JOIN public.coaching_waitlist cw ON cw.id::TEXT = c.waitlist_id
GROUP BY c.id, cw.session_goal;

-- Upcoming sessions view
CREATE OR REPLACE VIEW public.consulting_upcoming_sessions AS
SELECT
    s.*,
    c.name as client_name,
    c.email as client_email,
    c.enneagram_type as client_type,
    c.trust_layer as client_trust_layer
FROM public.consulting_sessions s
JOIN public.consulting_clients c ON c.id = s.client_id
WHERE s.scheduled_at >= NOW()
AND s.status IN ('scheduled', 'confirmed')
ORDER BY s.scheduled_at ASC;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to promote waitlist entry to client
-- Note: waitlist_id_input is TEXT to handle both integer and UUID formats
CREATE OR REPLACE FUNCTION promote_waitlist_to_client(waitlist_id_input TEXT)
RETURNS UUID AS $$
DECLARE
    new_client_id UUID;
BEGIN
    INSERT INTO public.consulting_clients (
        waitlist_id,
        name,
        email,
        enneagram_type,
        initial_goal,
        source,
        status
    )
    SELECT
        cw.id::TEXT,
        cw.name,
        cw.email,
        CASE WHEN cw.enneagram_type ~ '^\d+$' THEN cw.enneagram_type::integer ELSE NULL END,
        cw.session_goal,
        cwm.source,
        'intake_sent'
    FROM public.coaching_waitlist cw
    LEFT JOIN public.coaching_waitlist_metadata cwm ON cwm.waitlist_id = cw.id
    WHERE cw.id::TEXT = waitlist_id_input
    RETURNING id INTO new_client_id;

    RETURN new_client_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update client stats after session
CREATE OR REPLACE FUNCTION update_client_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE public.consulting_clients
        SET
            last_session_at = NEW.ended_at,
            first_session_at = COALESCE(first_session_at, NEW.ended_at),
            updated_at = NOW()
        WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_client_session_stats
AFTER INSERT OR UPDATE ON public.consulting_sessions
FOR EACH ROW EXECUTE FUNCTION update_client_session_stats();

-- ============================================================================
-- SEED DATA: Initial Templates
-- ============================================================================

-- Discovery Session Agenda Template
INSERT INTO public.consulting_templates (name, description, template_type, content) VALUES
('Discovery Session Agenda', 'Standard 60-minute discovery session structure', 'session_agenda',
'# Discovery Session Agenda (60 min)

## Opening (5 min)
- Welcome and rapport building
- Review their intake form
- Set expectations for the session

## Type Exploration (20 min)
- Discuss their suspected type
- Explore core emotional driver (anger/shame/fear)
- Childhood message exploration
- Confirm or adjust type hypothesis

## Pattern Mapping (20 min)
- Arrow of security: When are you at your best?
- Arrow of stress: What triggers your worst self?
- Identify specific patterns in their life
- Connect patterns to type dynamics

## Blueprint Creation (15 min)
- Summarize key insights
- Identify 3 actionable next steps
- Discuss ongoing work (if applicable)
- Answer questions

## Notes for Follow-up:
- [ ] Send session summary
- [ ] Include type-specific resources
- [ ] Schedule next session (if applicable)
'),

-- Intro Call Script
('Intro Call Script', '15-20 minute intro call framework', 'session_agenda',
'# Intro Call Script (15-20 min)

## Opening (2 min)
"Thanks for booking this call. I''m curious - what prompted you to reach out?"

## Explore (5 min)
Listen for their Trust Onion layer:
- **Outer layer**: Blaming circumstances (time, money, situation)
- **Middle layer**: Blaming specific people (boss, partner, family)
- **Inner layer**: Taking self-responsibility

Use observation voice first: "Studies show that..." or "In my experience..."

## Educate (5 min)
Brief Enneagram intro matched to their layer:
- For outer layer: Quick win, validate external struggles
- For middle layer: Pattern recognition about relationships
- For inner layer: Deeper self-work opportunity

## Offer (3 min)
"Based on what you''ve shared, I think a Discovery Session would be really valuable. Here''s what we''d do..."

Present the 4-step process:
1. Set the Scenario
2. Type Verification
3. Blind-Spot Analysis
4. Action Blueprint

## Close (2 min)
"Does this sound like what you''re looking for?"
- If yes → Book the session
- If hesitant → "What questions do you have?"
'),

-- Type Profile Template
('Type Profile Template', 'Client type profile deliverable', 'deliverable',
'# Your Enneagram Profile: Type {{type}}

## Your Core Pattern

**Core Fear:** {{core_fear}}
**Core Desire:** {{core_desire}}
**Childhood Message:** {{childhood_message}}

## Your Superpowers (Arrow of Security → Type {{security_type}})

When you''re at your best, you naturally access:
{{security_traits}}

**Conditions that unlock this:**
{{security_conditions}}

## Your Stress Patterns (Arrow of Stress → Type {{stress_type}})

When stressed, you may exhibit:
{{stress_traits}}

**Common triggers:**
{{stress_triggers}}

## Your Personalized Action Plan

### This Week
1. {{action_1}}
2. {{action_2}}
3. {{action_3}}

### This Month
- {{monthly_focus}}

### Ongoing Practice
- {{ongoing_practice}}

---
*Generated from your session on {{session_date}}*
');

-- ============================================================================
-- SEED DATA: Initial Resources
-- ============================================================================

INSERT INTO public.consulting_resources (title, slug, description, category, content, is_pinned, sort_order) VALUES

('Intro Call Playbook', 'intro-call-playbook', 'Complete framework for intro/discovery calls', 'playbook',
'# Intro Call Playbook

## Overview
The intro call is your first real conversation with a potential client. Your goal is to:
1. Build rapport quickly
2. Identify their Trust Onion layer
3. Demonstrate value through insight
4. Present the Discovery Session offer

## Trust Onion Assessment

### Outer Layer (Blame Circumstances)
**Signs:**
- "I don''t have time for..."
- "If only my job wasn''t so..."
- "The economy/algorithm/system..."

**Your approach:**
- Validate the external struggle
- Offer a quick win or practical tip
- Use Observation voice: "Research shows..."

### Middle Layer (Blame Specific People)
**Signs:**
- "My boss/partner/parent always..."
- "If they would just..."
- "They don''t understand..."

**Your approach:**
- Pattern recognition: "That dynamic is actually really common"
- Strategic advice about the relationship
- Use Experience voice: "In my experience..."

### Inner Layer (Self-Responsibility)
**Signs:**
- "I know I need to work on..."
- "I realize my part in..."
- "I want to understand why I..."

**Your approach:**
- Full coaching conversation
- Direct insights about their patterns
- Use Expert voice: "What''s happening is..."

## EEO Voice Continuum

| Voice | Use When | Example |
|-------|----------|---------|
| Observation | New/cold audience | "Studies show Type 5s tend to..." |
| Experience | Warming audience | "In my experience with Type 5s..." |
| Expert | Trusted audience | "Type 5s do this because..." |

**Rule:** Start with Observation, earn your way to Expert.

## Common Objections

### "I need to think about it"
"Totally understand. What specifically would you want to think through? Maybe I can help clarify."

### "Is this like therapy?"
"No - therapy often focuses on the past. Coaching focuses on patterns and practical moves forward. Think of it as a strategy session for your personality."

### "How is this different from just reading about the Enneagram?"
"Reading describes the territory. Coaching gives you a guide who can point out what you can''t see yourself. Your blind spots are called blind spots for a reason."
', TRUE, 1),

('Session Delivery Framework', 'session-delivery-framework', 'How to run an effective coaching session', 'playbook',
'# Session Delivery Framework

## Before the Session

### 24 Hours Before
- [ ] Review client intake form
- [ ] Review any previous session notes
- [ ] Prepare type-specific questions
- [ ] Set up meeting link and test

### 30 Minutes Before
- [ ] Review agenda template
- [ ] Clear your mental space
- [ ] Have resources ready

## During the Session

### Opening (5 min)
- Start on time (demonstrates respect)
- Brief check-in: "How are you arriving today?"
- Set the container: "Here''s what we''ll cover..."

### Type Exploration (20 min)
Use the emotional driver framework:

**For Body Types (8, 9, 1):**
- Ask about anger patterns
- Explore: "When do you feel most in control?"
- Watch for: Physical tension, crossed arms, controlled speech

**For Heart Types (2, 3, 4):**
- Ask about identity and worth
- Explore: "When do you feel most valued?"
- Watch for: Performance, image management, emotional intensity

**For Head Types (5, 6, 7):**
- Ask about fear and security
- Explore: "When do you feel safest?"
- Watch for: Intellectualizing, future-focus, analysis

### Pattern Mapping (20 min)
Key questions:
- "Tell me about a time you were at your absolute best..."
- "What about your worst moment in the last year..."
- "What patterns keep showing up?"

Listen for:
- Arrow of security indicators
- Arrow of stress indicators
- Type-specific defense mechanisms

### Blueprint Creation (15 min)
- Summarize 3 key insights (not more)
- Create specific, actionable next steps
- Frame as experiments, not homework
- Plant seeds for ongoing work

## After the Session

### Immediately After
- [ ] Write key observations while fresh
- [ ] Note any breakthrough moments
- [ ] Capture exact phrases they used

### Within 24 Hours
- [ ] Send session summary
- [ ] Include relevant resources
- [ ] Confirm next steps/session
', TRUE, 2),

('Type-Specific Questions', 'type-specific-questions', 'Deep questions for each Enneagram type', 'reference',
'# Type-Specific Exploration Questions

## Type 1 - The Perfectionist

**Core exploration:**
- "What''s your relationship with the word ''should''?"
- "When was the last time you let something be ''good enough''?"
- "What happens in your body when you see a mistake?"

**Arrow of security (→7):**
- "When do you allow yourself to be spontaneous?"
- "What does fun look like when you''re not keeping score?"

**Arrow of stress (→4):**
- "When you''re overwhelmed, do you ever feel like no one appreciates your effort?"
- "What triggers self-pity for you?"

---

## Type 2 - The Helper

**Core exploration:**
- "When was the last time someone took care of YOU?"
- "What happens when you say no to someone?"
- "How do you know you matter if you''re not helping?"

**Arrow of security (→4):**
- "When do you create just for yourself?"
- "What are YOUR feelings, separate from others?''

**Arrow of stress (→8):**
- "When you''re depleted, do you ever explode at the people you''ve helped?"
- "What triggers that ''after all I''ve done for you'' feeling?"

---

## Type 3 - The Achiever

**Core exploration:**
- "Who are you when no one is watching?"
- "What would happen if you failed publicly?"
- "When do you feel like an imposter?"

**Arrow of security (→6):**
- "Who do you trust completely?"
- "When do you stop competing?"

**Arrow of stress (→9):**
- "When overwhelmed, do you ever just...check out?"
- "What makes you go through the motions without caring?"

---

## Type 4 - The Individualist

**Core exploration:**
- "What makes you feel ordinary? How do you react?"
- "What are you longing for that you''ve never had?"
- "When does melancholy become a choice?"

**Arrow of security (→1):**
- "When do you take practical action despite feelings?"
- "What helps you feel grounded?"

**Arrow of stress (→2):**
- "When you''re hurting, do you test people''s love for you?"
- "What triggers clingy behavior?"

---

## Type 5 - The Investigator

**Core exploration:**
- "When do you feel ready to engage?"
- "What happens when someone needs more from you than you have?"
- "How much is ever enough to know?"

**Arrow of security (→8):**
- "When do you take bold action?"
- "What makes you step into leadership?"

**Arrow of stress (→7):**
- "When overwhelmed, do you scatter into distraction?"
- "What makes you impulsive?"

---

## Type 6 - The Loyalist

**Core exploration:**
- "What would it feel like to fully trust yourself?"
- "How much certainty do you need to act?"
- "When does preparation become procrastination?"

**Arrow of security (→9):**
- "When do you feel genuinely calm?"
- "What helps you stop scanning for threats?"

**Arrow of stress (→3):**
- "When anxious, do you start performing for approval?"
- "What triggers competitive behavior?"

---

## Type 7 - The Enthusiast

**Core exploration:**
- "What pain are you running from?"
- "What happens when you stay with discomfort?"
- "When does optimism become denial?"

**Arrow of security (→5):**
- "When do you go deep instead of wide?"
- "What earns your sustained attention?"

**Arrow of stress (→1):**
- "When cornered, do you become critical and perfectionistic?"
- "What triggers your rigid side?"

---

## Type 8 - The Challenger

**Core exploration:**
- "When was the last time you let someone see you vulnerable?"
- "What does it cost you to always be strong?"
- "Who earned the right to your tenderness?"

**Arrow of security (→2):**
- "When do you care for others without controlling the outcome?"
- "What softens you?"

**Arrow of stress (→5):**
- "When hurt, do you withdraw and become secretive?"
- "What triggers isolation?"

---

## Type 9 - The Peacemaker

**Core exploration:**
- "What do YOU want? Not what''s easiest—what do you actually want?"
- "When was the last time you showed up fully?"
- "What are you angry about that you won''t admit?"

**Arrow of security (→3):**
- "When do you take decisive action?"
- "What makes you show up with energy?"

**Arrow of stress (→6):**
- "When pressured, do you become anxious and suspicious?"
- "What triggers worry?"
', TRUE, 3),

('90-Second Emotion Rule', 'emotion-rule-90-seconds', 'Key framework for emotional coaching', 'framework',
'# The 90-Second Emotion Rule

## The Science

Neuroscientist Jill Bolte Taylor discovered that emotions only last 90 seconds in the body. After that, we''re choosing to re-trigger them through our thoughts.

## What This Means for Coaching

That anger your client has been carrying for three years? They''re manually refreshing it every 90 seconds like a broken browser tab.

## Type-Specific Application

### Type 1
"Your resentment is a choice after 90 seconds. What thought keeps triggering it?"

### Type 2
"That martyrdom feeling? You''re hitting replay. What''s the story you tell yourself?"

### Type 3
"The shame of failure passes quickly—unless you feed it. How do you feed it?"

### Type 4
"Melancholy becomes a choice after the chemical wave passes. What makes you choose it?"

### Type 5
"Emotional withdrawal started as 90 seconds of overwhelm. What happened in those 90 seconds?"

### Type 6
"Anxiety loops are you re-triggering the same fear. What''s the thought that restarts the loop?"

### Type 7
"FOMO is manufactured after the initial pang. What story turns the pang into panic?"

### Type 8
"That need for revenge? You''re keeping it alive. What thought fuels it?"

### Type 9
"Numbing out started as 90 seconds of overwhelm. What overwhelmed you?"

## Coaching Exercise

1. Help them identify the triggering thought
2. Notice the 90-second chemical wave
3. Choose a different thought before the refresh
4. Practice interrupting the pattern
', FALSE, 10),

('Give-to-Ask Ratio', 'give-ask-ratio', 'Content and offering balance framework', 'framework',
'# Give-to-Ask Ratio

## The Principle

Every piece of content and every interaction either gives value or asks for something. The ratio determines brand equity.

## The Math

| Ratio | Effect |
|-------|--------|
| 80% give / 20% ask | Sweet spot for growth phase |
| 70% give / 30% ask | Maintenance mode |
| <70% give | Damages brand equity |

## Application to Consulting

### In Sessions
- Give: Insights, frameworks, validation
- Ask: Commitment to action, next session, referral

Aim for 90% give, 10% ask in sessions.

### In Follow-up
- Give: Summary, resources, check-in
- Ask: Testimonial (after results), referral

### In Content
- Give: Free insights from sessions (anonymized)
- Ask: Discovery session booking

## The Compounding Effect

When you give consistently, you build "brand equity" that compounds. People want to buy from you without you having to sell.

Short-term tricks might help now, but building genuine value creates bigger rewards later.
', FALSE, 11);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.consulting_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (using service role or admin check)
-- For now, we'll use service role key which bypasses RLS

-- Grant necessary permissions
GRANT ALL ON public.consulting_clients TO authenticated;
GRANT ALL ON public.consulting_intake_forms TO authenticated;
GRANT ALL ON public.consulting_sessions TO authenticated;
GRANT ALL ON public.consulting_client_notes TO authenticated;
GRANT ALL ON public.consulting_deliverables TO authenticated;
GRANT ALL ON public.consulting_templates TO authenticated;
GRANT ALL ON public.consulting_resources TO authenticated;
GRANT ALL ON public.consulting_clients_overview TO authenticated;
GRANT ALL ON public.consulting_upcoming_sessions TO authenticated;
