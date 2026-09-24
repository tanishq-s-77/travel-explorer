-- Travel Explorer: Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create the wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent duplicate wishlist entries for the same user and destination
    CONSTRAINT unique_user_destination UNIQUE (user_id, destination_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow authenticated users to view their own saved wishlist items
CREATE POLICY "Users can view their own wishlist items"
ON public.wishlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to insert items into their own wishlist
CREATE POLICY "Users can add items to their own wishlist"
ON public.wishlist
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete items from their own wishlist
CREATE POLICY "Users can remove items from their own wishlist"
ON public.wishlist
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Create an index on user_id for high-speed queries
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
