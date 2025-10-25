/*
  # Add skills_to_learn to profiles

  1. Changes
    - Add `skills_to_learn` column to profiles table
      - Type: text array
      - Default: empty array
      - Stores list of skills/topics the user wants to learn
    
  2. Notes
    - This field will be used to personalize AI recommendations
    - Users can select from predefined skills: Java, Python, HTML, CSS, etc.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'skills_to_learn'
  ) THEN
    ALTER TABLE profiles ADD COLUMN skills_to_learn text[] DEFAULT '{}';
  END IF;
END $$;
