/*
  # Create Notifications Table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `type` (text, e.g., 'credit_received', 'credit_sent', 'message', 'booking')
      - `title` (text)
      - `message` (text)
      - `is_read` (boolean)
      - `created_at` (timestamptz)
      - `related_user_id` (uuid, foreign key to profiles, nullable)
      - `related_id` (uuid, nullable, for linking to transactions/bookings/etc)
  
  2. Security
    - Enable RLS
    - Users can only view their own notifications
    - System can create notifications for users
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  related_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  related_id uuid
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);