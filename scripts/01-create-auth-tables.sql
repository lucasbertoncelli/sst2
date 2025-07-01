-- This script creates the necessary tables for authentication.

-- Create the 'usuarios' table
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Create policy for admins (assuming you have a role 'authenticated')
CREATE POLICY "Admins can do anything" ON usuarios TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Remove the problematic policy if it exists
DROP POLICY IF EXISTS "Users can update own data" ON usuarios;

-- Create the corrected policy without circular reference
CREATE POLICY "Users can update own data" ON usuarios 
  FOR UPDATE USING (id = auth.uid()) 
  WITH CHECK (id = auth.uid());

-- Fix any other problematic policies
DROP POLICY IF EXISTS "Users can view own data" ON usuarios;
CREATE POLICY "Users can view own data" ON usuarios 
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own data" ON usuarios;
CREATE POLICY "Users can insert own data" ON usuarios 
  FOR INSERT WITH CHECK (id = auth.uid());
