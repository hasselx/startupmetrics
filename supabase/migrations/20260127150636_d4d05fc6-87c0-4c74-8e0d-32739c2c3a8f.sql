-- Fix function search path for security
CREATE OR REPLACE FUNCTION public.update_metrics_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Service role can insert metrics" ON public.metrics;