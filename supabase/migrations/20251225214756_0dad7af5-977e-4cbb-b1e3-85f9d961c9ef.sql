-- Create quotes table for vendor bids on jobs
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT DEFAULT '',
  estimated_duration TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own quotes
CREATE POLICY "Vendors can view their own quotes"
ON public.quotes
FOR SELECT
USING (auth.uid() = vendor_id);

-- Vendors can insert their own quotes
CREATE POLICY "Vendors can insert their own quotes"
ON public.quotes
FOR INSERT
WITH CHECK (auth.uid() = vendor_id);

-- Vendors can update their own pending quotes
CREATE POLICY "Vendors can update their own quotes"
ON public.quotes
FOR UPDATE
USING (auth.uid() = vendor_id AND status = 'pending');

-- Vendors can delete their own pending quotes
CREATE POLICY "Vendors can delete their own quotes"
ON public.quotes
FOR DELETE
USING (auth.uid() = vendor_id AND status = 'pending');

-- Job owners can view quotes on their jobs
CREATE POLICY "Job owners can view quotes on their jobs"
ON public.quotes
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.jobs
  WHERE jobs.id = quotes.job_id
  AND jobs.user_id = auth.uid()
));

-- Job owners can update quote status (accept/reject)
CREATE POLICY "Job owners can update quote status"
ON public.quotes
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.jobs
  WHERE jobs.id = quotes.job_id
  AND jobs.user_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update job offers_count when quote is added
CREATE OR REPLACE FUNCTION public.update_job_offers_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs
    SET offers_count = COALESCE(offers_count, 0) + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs
    SET offers_count = GREATEST(COALESCE(offers_count, 0) - 1, 0)
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to auto-update offers_count
CREATE TRIGGER update_offers_count_trigger
AFTER INSERT OR DELETE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_job_offers_count();

-- Enable realtime for quotes
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;