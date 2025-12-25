-- Fix RLS policies for vendor access to jobs, conversations, and messages

-- 1. Allow vendors to view jobs assigned to them
CREATE POLICY "Vendors can view jobs assigned to them"
ON public.jobs
FOR SELECT
USING (auth.uid() = vendor_id);

-- 2. Allow vendors to update jobs assigned to them (status, completion, etc.)
CREATE POLICY "Vendors can update jobs assigned to them"
ON public.jobs
FOR UPDATE
USING (auth.uid() = vendor_id);

-- 3. Allow vendors to view conversations they're part of
CREATE POLICY "Vendors can view their conversations"
ON public.conversations
FOR SELECT
USING (auth.uid() = vendor_id);

-- 4. Allow vendors to update conversations they're part of
CREATE POLICY "Vendors can update their conversations"
ON public.conversations
FOR UPDATE
USING (auth.uid() = vendor_id);

-- 5. Allow vendors to view messages in their conversations
CREATE POLICY "Vendors can view messages in their conversations"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.vendor_id = auth.uid()
  )
);

-- 6. Allow vendors to insert messages in their conversations
CREATE POLICY "Vendors can insert messages in their conversations"
ON public.messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.vendor_id = auth.uid()
  )
);