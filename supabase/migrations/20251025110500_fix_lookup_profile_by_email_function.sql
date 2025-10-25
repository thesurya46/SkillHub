/*
  # Fix Lookup Profile By Email Function

  1. Updates
    - Drop and recreate function with correct return type
    - Returns a single row instead of table
*/

DROP FUNCTION IF EXISTS lookup_profile_by_email(text);

CREATE OR REPLACE FUNCTION lookup_profile_by_email(email_address text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'profile_id', p.id,
    'profile_credits', p.credits,
    'user_email', au.email
  )
  INTO result
  FROM auth.users au
  JOIN profiles p ON p.id = au.id
  WHERE LOWER(au.email) = LOWER(email_address);
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION lookup_profile_by_email(text) TO authenticated;