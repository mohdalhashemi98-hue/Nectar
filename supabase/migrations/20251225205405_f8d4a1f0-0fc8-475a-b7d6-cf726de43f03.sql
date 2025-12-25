-- 1. Allow vendors to insert conversations (initiate chats with customers)
CREATE POLICY "Vendors can insert their conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = vendor_id);

-- 2. Allow authenticated users to insert available jobs (when posting a job)
CREATE POLICY "Users can insert available jobs"
ON public.available_jobs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Allow users to update their available jobs
CREATE POLICY "Users can update available jobs"
ON public.available_jobs
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.jobs 
  WHERE jobs.id = available_jobs.job_id 
  AND jobs.user_id = auth.uid()
));

-- 4. Allow users to delete their available jobs
CREATE POLICY "Users can delete available jobs"
ON public.available_jobs
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.jobs 
  WHERE jobs.id = available_jobs.job_id 
  AND jobs.user_id = auth.uid()
));

-- 5. Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);