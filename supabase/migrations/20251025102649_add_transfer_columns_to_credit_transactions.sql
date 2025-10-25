/*
  # Add Transfer Support to Credit Transactions

  1. Changes
    - Add sender_id column for credit transfers
    - Add recipient_id column for credit transfers
    - Update RLS policies to support transfers
    
  2. Notes
    - For backward compatibility, these columns are nullable
    - Existing transactions remain valid
    - Transfer transactions must have both sender and recipient
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_transactions' AND column_name = 'sender_id'
  ) THEN
    ALTER TABLE credit_transactions ADD COLUMN sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_transactions' AND column_name = 'recipient_id'
  ) THEN
    ALTER TABLE credit_transactions ADD COLUMN recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can view transfer transactions" ON credit_transactions;
CREATE POLICY "Users can view transfer transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    sender_id = auth.uid() OR 
    recipient_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can insert transfer transactions" ON credit_transactions;
CREATE POLICY "Users can insert transfer transactions"
  ON credit_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR sender_id = auth.uid()
  );