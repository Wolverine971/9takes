-- supabase/migrations/20251204_consulting_rls_policies.sql
-- Add RLS policies for consulting tables (admin-only access)

-- ============================================================================
-- POLICIES FOR CONSULTING TABLES
-- These tables are admin-only, so we check for admin status
-- ============================================================================

-- Helper: Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- consulting_clients policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_clients ON public.consulting_clients;
CREATE POLICY admin_consulting_clients ON public.consulting_clients
    FOR ALL USING (is_admin());

-- ============================================================================
-- consulting_intake_forms policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_intake_forms ON public.consulting_intake_forms;
CREATE POLICY admin_consulting_intake_forms ON public.consulting_intake_forms
    FOR ALL USING (is_admin());

-- ============================================================================
-- consulting_sessions policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_sessions ON public.consulting_sessions;
CREATE POLICY admin_consulting_sessions ON public.consulting_sessions
    FOR ALL USING (is_admin());

-- ============================================================================
-- consulting_client_notes policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_client_notes ON public.consulting_client_notes;
CREATE POLICY admin_consulting_client_notes ON public.consulting_client_notes
    FOR ALL USING (is_admin());

-- ============================================================================
-- consulting_deliverables policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_deliverables ON public.consulting_deliverables;
CREATE POLICY admin_consulting_deliverables ON public.consulting_deliverables
    FOR ALL USING (is_admin());

-- ============================================================================
-- consulting_templates policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_templates ON public.consulting_templates;
CREATE POLICY admin_consulting_templates ON public.consulting_templates
    FOR ALL USING (is_admin());

-- ============================================================================
-- consulting_resources policies
-- ============================================================================
DROP POLICY IF EXISTS admin_consulting_resources ON public.consulting_resources;
CREATE POLICY admin_consulting_resources ON public.consulting_resources
    FOR ALL USING (is_admin());
