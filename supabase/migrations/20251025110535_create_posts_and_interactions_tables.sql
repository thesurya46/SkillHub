/*
  # Create Posts and Interactions Tables

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text, post content)
      - `post_type` (text, e.g., 'qualification', 'certificate', 'general')
      - `attachment_url` (text, URL to certificate/document image)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `post_reactions`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to posts)
      - `user_id` (uuid, foreign key to profiles)
      - `reaction_type` (text, e.g., 'like', 'celebrate', 'support')
      - `created_at` (timestamptz)
    
    - `post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to posts)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can view all posts
    - Users can create/update/delete their own posts
    - Users can add reactions and comments
    - Users can delete their own reactions and comments
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  post_type text DEFAULT 'general' CHECK (post_type IN ('qualification', 'certificate', 'general')),
  attachment_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type text DEFAULT 'like' CHECK (reaction_type IN ('like', 'celebrate', 'support', 'love')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);