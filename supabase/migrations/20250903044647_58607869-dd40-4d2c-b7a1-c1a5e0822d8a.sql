-- Drop existing policies for user_events
DROP POLICY IF EXISTS "Users can create their own events" ON public.user_events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.user_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.user_events;
DROP POLICY IF EXISTS "Users can view their own events" ON public.user_events;

-- Create optimized policies with subqueries
CREATE POLICY "Users can create their own events" 
ON public.user_events 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own events" 
ON public.user_events 
FOR DELETE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own events" 
ON public.user_events 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own events" 
ON public.user_events 
FOR SELECT 
USING ((select auth.uid()) = user_id);