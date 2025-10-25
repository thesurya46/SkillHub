/*
  # Create Messages Table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to profiles)
      - `recipient_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `is_read` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Users can view messages they sent or received
    - Users can send messages
    - Users can mark their received messages as read
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);