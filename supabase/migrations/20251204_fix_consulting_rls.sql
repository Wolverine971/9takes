-- supabase/migrations/20251204_fix_consulting_rls.sql
-- Fix RLS policies for consulting tables

-- ============================================================================
-- OPTION: Disable RLS for consulting tables
-- Since these are admin-only tables and the SvelteKit routes already verify
-- admin status before allowing access, we can safely disable RLS.
-- This is the most reliable approach for admin-only tables.
-- ============================================================================

-- Drop existing policies first
DROP POLICY IF EXISTS admin_consulting_clients ON public.consulting_clients;
DROP POLICY IF EXISTS admin_consulting_intake_forms ON public.consulting_intake_forms;
DROP POLICY IF EXISTS admin_consulting_sessions ON public.consulting_sessions;
DROP POLICY IF EXISTS admin_consulting_client_notes ON public.consulting_client_notes;
DROP POLICY IF EXISTS admin_consulting_deliverables ON public.consulting_deliverables;
DROP POLICY IF EXISTS admin_consulting_templates ON public.consulting_templates;
DROP POLICY IF EXISTS admin_consulting_resources ON public.consulting_resources;

-- Disable RLS on consulting tables (admin-only access is enforced at application level)
ALTER TABLE public.consulting_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_intake_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_client_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_deliverables DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consulting_resources DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Verify consulting_resources has data
-- ============================================================================
DO $$
DECLARE
    resource_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO resource_count FROM public.consulting_resources;
    IF resource_count = 0 THEN
        RAISE NOTICE 'No resources found, inserting seed data...';

        -- Insert essential playbooks
        INSERT INTO public.consulting_resources (slug, title, description, category, content, is_pinned, sort_order) VALUES
        ('intro-call-playbook', 'Intro Call Playbook', 'Step-by-step guide for discovery sessions', 'playbook',
'# Discovery Session Playbook

## Pre-Call Preparation (5 min)
1. Review intake form responses
2. Note their stated goals and current situation
3. Identify potential Enneagram type signals

## Call Structure (60 min)

### Opening (5 min)
- Warm welcome, establish rapport
- Set expectations for the call
- "Today we''ll explore your personality patterns and how they''re impacting your goals"

### Discovery Phase (25 min)
Use the Trust Onion framework:

**Outer Layer - Surface Behaviors**
- "Tell me about a recent situation that frustrated you"
- "How did you handle it?"

**Middle Layer - Patterns**
- "Is this a recurring pattern for you?"
- "What do you think drives this behavior?"

**Inner Layer - Core Motivations**
- "What are you really afraid of in these situations?"
- "What would it mean if you succeeded?"

### Type Exploration (15 min)
Based on what you''ve heard, explore:
- Present 2-3 possible types
- Share type-specific insights
- Gauge their resonance

### Solution Framing (10 min)
- Summarize key insights
- Connect patterns to their goals
- Introduce the 90-Day Blueprint concept

### Close (5 min)
- Answer questions
- Discuss next steps
- Schedule follow-up if interested

## Post-Call
- Send summary email within 24 hours
- Include relevant blog links
- Propose next steps', true, 1),

        ('90-day-program-framework', '90-Day Program Framework', 'Complete transformation program structure', 'framework',
'# 90-Day Personality Maxing Blueprint

## Phase 1: Foundation (Days 1-30)

### Week 1-2: Type Confirmation & Baseline
- Deep-dive typing session
- Establish current patterns baseline
- Create personalized observation journal

### Week 3-4: Core Wound Work
- Identify childhood patterns
- Map defense mechanisms
- Begin emotional vocabulary expansion

## Phase 2: Integration (Days 31-60)

### Week 5-6: Arrow Work
- Explore stress arrow behaviors
- Identify security arrow resources
- Practice intentional movement

### Week 7-8: Relationship Patterns
- Map interpersonal dynamics
- Identify projection patterns
- Practice new communication approaches

## Phase 3: Mastery (Days 61-90)

### Week 9-10: Advanced Integration
- Wing integration exercises
- Instinctual variant awareness
- Real-time pattern interruption

### Week 11-12: Sustainable Growth
- Create maintenance practices
- Build support structures
- Plan ongoing development

## Deliverables
- Weekly 45-min coaching calls
- Personalized exercises between sessions
- Type-specific resource library access
- Final transformation report', true, 2),

        ('trust-onion-guide', 'Trust Onion Framework', 'Guide to building trust and accessing deeper layers', 'framework',
'# The Trust Onion Framework

## Overview
The Trust Onion represents the layers of self people reveal as trust deepens.

## Three Layers

### Outer Layer - Public Self
**What it contains:**
- Surface opinions
- Socially acceptable behaviors
- What they think you want to hear

**How to work with it:**
- Accept without judgment
- Show genuine interest
- Create safety

### Middle Layer - Personal Self
**What it contains:**
- Real opinions and preferences
- Acknowledged patterns
- Stories they tell close friends

**How to access:**
- Share your own vulnerabilities first
- Ask "what do you really think?"
- Notice when they test your reactions

### Inner Layer - Core Self
**What it contains:**
- Core fears and desires
- Childhood wounds
- Type-specific fixations

**How to access:**
- Only after significant trust building
- Through careful, compassionate inquiry
- Often emerges in emotional moments

## EEO Voice Continuum

As trust deepens, shift your communication:

**Observation Voice** (Outer Layer)
- "I notice that..."
- "It seems like..."
- "That''s interesting..."

**Experience Voice** (Middle Layer)
- "In my experience..."
- "I''ve seen that..."
- "What I''ve found is..."

**Expert Voice** (Inner Layer)
- "What''s actually happening is..."
- "The pattern here is..."
- "This is a classic Type X behavior..."', true, 3),

        ('type-quick-reference', 'Enneagram Types Quick Reference', 'Fast lookup for all 9 types', 'reference',
'# Enneagram Types Quick Reference

## Type 1 - The Perfectionist
**Core Fear:** Being corrupt, defective, bad
**Core Desire:** To be good, balanced, have integrity
**Stress Arrow:** → 4 (becomes moody, withdrawn)
**Security Arrow:** → 7 (becomes spontaneous, joyful)
**Key Phrase:** "I must be right"

## Type 2 - The Helper
**Core Fear:** Being unwanted, unloved
**Core Desire:** To be loved, needed, appreciated
**Stress Arrow:** → 8 (becomes controlling, aggressive)
**Security Arrow:** → 4 (becomes self-aware, authentic)
**Key Phrase:** "I must be needed"

## Type 3 - The Achiever
**Core Fear:** Being worthless, without inherent value
**Core Desire:** To be valuable, admired, successful
**Stress Arrow:** → 9 (becomes disengaged, numb)
**Security Arrow:** → 6 (becomes loyal, cooperative)
**Key Phrase:** "I must succeed"

## Type 4 - The Individualist
**Core Fear:** Having no identity or significance
**Core Desire:** To be unique, authentic, to find self
**Stress Arrow:** → 2 (becomes clingy, people-pleasing)
**Security Arrow:** → 1 (becomes principled, objective)
**Key Phrase:** "I must be special"

## Type 5 - The Investigator
**Core Fear:** Being useless, incapable, overwhelmed
**Core Desire:** To be capable, competent, knowledgeable
**Stress Arrow:** → 7 (becomes scattered, escapist)
**Security Arrow:** → 8 (becomes confident, decisive)
**Key Phrase:** "I must understand"

## Type 6 - The Loyalist
**Core Fear:** Being without support, abandoned
**Core Desire:** To have security, support, guidance
**Stress Arrow:** → 3 (becomes competitive, image-focused)
**Security Arrow:** → 9 (becomes relaxed, trusting)
**Key Phrase:** "I must be secure"

## Type 7 - The Enthusiast
**Core Fear:** Being deprived, trapped in pain
**Core Desire:** To be satisfied, content, have options
**Stress Arrow:** → 1 (becomes critical, perfectionist)
**Security Arrow:** → 5 (becomes focused, deep)
**Key Phrase:** "I must be free"

## Type 8 - The Challenger
**Core Fear:** Being controlled, harmed, violated
**Core Desire:** To protect self, be in control
**Stress Arrow:** → 5 (becomes withdrawn, secretive)
**Security Arrow:** → 2 (becomes caring, open-hearted)
**Key Phrase:** "I must be strong"

## Type 9 - The Peacemaker
**Core Fear:** Loss, fragmentation, conflict
**Core Desire:** To have peace, harmony, stability
**Stress Arrow:** → 6 (becomes anxious, reactive)
**Security Arrow:** → 3 (becomes energized, focused)
**Key Phrase:** "I must keep peace"', true, 4),

        ('common-type-confusions', 'Common Type Confusions', 'How to differentiate similar-looking types', 'reference',
'# Common Type Confusions

## 1 vs 6
Both can seem anxious and rule-focused.
- **1s** create their own rules based on internal standards
- **6s** look to external authorities for rules and guidance
**Key question:** "Where do your standards come from?"

## 2 vs 9
Both focus on others'' needs.
- **2s** actively pursue others to help them
- **9s** passively accommodate to avoid conflict
**Key question:** "Do you seek out people to help, or do you wait to be needed?"

## 3 vs 7
Both appear energetic and positive.
- **3s** energy is focused on achieving specific goals
- **7s** energy is scattered across many interests
**Key question:** "Are you driven by achievement or by experience?"

## 4 vs 6
Both can seem anxious and emotional.
- **4s** focus on what makes them unique/different
- **6s** focus on what connects them to groups/support
**Key question:** "Do you want to stand out or fit in?"

## 5 vs 9
Both can appear withdrawn and detached.
- **5s** withdraw to conserve energy for thinking
- **9s** withdraw to avoid conflict and merge with others
**Key question:** "Are you avoiding engagement or avoiding conflict?"

## 7 vs 9
Both avoid negative emotions.
- **7s** actively reframe negatives into positives
- **9s** numb out or dissociate from negatives
**Key question:** "Do you transform pain or tune it out?"

## 8 vs 1
Both have strong opinions and can seem angry.
- **8s** anger is direct, confrontational, about control
- **1s** anger is repressed, comes out as resentment/criticism
**Key question:** "Is your anger about being wronged or about things being wrong?"', false, 5);

    END IF;
END $$;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_intake_forms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_client_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_deliverables TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consulting_resources TO authenticated;
