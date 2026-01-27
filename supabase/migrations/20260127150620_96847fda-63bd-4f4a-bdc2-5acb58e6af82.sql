-- Create metrics table for storing all startup metrics
CREATE TABLE public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  definition TEXT NOT NULL,
  formula TEXT NOT NULL,
  visualization_type TEXT NOT NULL DEFAULT 'bar',
  visualization_data JSONB NOT NULL DEFAULT '{"labels": [], "values": []}',
  example TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'human',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read, admin write)
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read metrics (public knowledge base)
CREATE POLICY "Anyone can read metrics"
ON public.metrics
FOR SELECT
USING (true);

-- Allow inserts from authenticated users or service role (for AI generation via edge function)
CREATE POLICY "Service role can insert metrics"
ON public.metrics
FOR INSERT
WITH CHECK (true);

-- Create index for faster searches
CREATE INDEX idx_metrics_slug ON public.metrics(slug);
CREATE INDEX idx_metrics_category ON public.metrics(category);
CREATE INDEX idx_metrics_title_search ON public.metrics USING gin(to_tsvector('english', title || ' ' || definition));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_metrics_updated_at
BEFORE UPDATE ON public.metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_metrics_updated_at();