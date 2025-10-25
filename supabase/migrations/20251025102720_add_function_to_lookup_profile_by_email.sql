/*
  # Add Function to Look Up Profile by Email

  1. New Function
    - `lookup_profile_by_email(email_address text)` returns profile data
    - Uses auth.users to find the user by email
    - Returns profile information for credit transfers
  
  2. Security
    - Function is accessible to authenticated users only
    - Only returns basic profile information needed for transfers
*/

CREATE OR REPLACE FUNCTION lookup_profile_by_email(email_address text)
RETURNS TABLE (
  profile_id uuid,
  profile_credits integer,
  user_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as profile_id,
    p.credits as profile_credits,
    au.email as user_email
  FROM auth.users au
  JOIN profiles p ON p.id = au.id
  WHERE LOWER(au.email) = LOWER(email_address);
END;
$$;

GRANT EXECUTE ON FUNCTION lookup_profile_by_email(text) TO authenticated;