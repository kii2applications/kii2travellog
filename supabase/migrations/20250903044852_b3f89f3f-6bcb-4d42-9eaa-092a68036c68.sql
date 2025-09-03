-- Fix RLS policies for reminders table
DROP POLICY IF EXISTS "Users can create their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can view their own reminders" ON public.reminders;

CREATE POLICY "Users can create their own reminders" 
ON public.reminders 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own reminders" 
ON public.reminders 
FOR DELETE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.reminders 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own reminders" 
ON public.reminders 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- Fix RLS policies for flights table
DROP POLICY IF EXISTS "Users can create their own flights" ON public.flights;
DROP POLICY IF EXISTS "Users can delete their own flights" ON public.flights;
DROP POLICY IF EXISTS "Users can update their own flights" ON public.flights;
DROP POLICY IF EXISTS "Users can view their own flights" ON public.flights;

CREATE POLICY "Users can create their own flights" 
ON public.flights 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own flights" 
ON public.flights 
FOR DELETE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own flights" 
ON public.flights 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own flights" 
ON public.flights 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- Fix RLS policies for country_targets table
DROP POLICY IF EXISTS "Users can create their own targets" ON public.country_targets;
DROP POLICY IF EXISTS "Users can delete their own targets" ON public.country_targets;
DROP POLICY IF EXISTS "Users can update their own targets" ON public.country_targets;
DROP POLICY IF EXISTS "Users can view their own targets" ON public.country_targets;

CREATE POLICY "Users can create their own targets" 
ON public.country_targets 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own targets" 
ON public.country_targets 
FOR DELETE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own targets" 
ON public.country_targets 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own targets" 
ON public.country_targets 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- Fix RLS policies for user_settings table
DROP POLICY IF EXISTS "Users can create their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;

CREATE POLICY "Users can create their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own settings" 
ON public.user_settings 
FOR DELETE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR ALL 
USING ((select auth.uid()) = id);