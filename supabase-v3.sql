-- Phase 3: Analytics & Automation Schema

-- Workflows Table
CREATE TABLE public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL,
    trigger_conditions JSONB,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Workflow Runs Table
CREATE TABLE public.workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    trigger_data JSONB,
    logs JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS setup for Workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all authenticated users on workflows"
ON public.workflows FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Enable all access for authenticated users on workflows"
ON public.workflows FOR ALL
TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for all authenticated users on workflow runs"
ON public.workflow_runs FOR ALL
TO authenticated USING (true);
