/*
  # Task Management Database Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (varchar(255), required)
      - `description` (text, optional)
      - `status` (varchar(20), required) - pending, in_progress, completed
      - `priority` (varchar(10), required) - low, medium, high
      - `due_date` (timestamptz, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users (if needed)

  3. Indexes
    - Performance indexes on commonly queried columns

  4. Triggers
    - Auto-update `updated_at` timestamp
*/

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  description text,
  status varchar(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority varchar(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional - uncomment if you need user-based access control)
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - uncomment and modify based on your authentication needs)
-- CREATE POLICY "Users can read all tasks" ON tasks FOR SELECT TO authenticated USING (true);
-- CREATE POLICY "Users can insert tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
-- CREATE POLICY "Users can update tasks" ON tasks FOR UPDATE TO authenticated USING (true);
-- CREATE POLICY "Users can delete tasks" ON tasks FOR DELETE TO authenticated USING (true);

-- Insert sample data for testing
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
  ('Complete project documentation', 'Write comprehensive documentation for the API', 'pending', 'high', '2024-02-01 15:30:00+00'),
  ('Review code changes', 'Review and approve pending pull requests', 'in_progress', 'medium', '2024-01-25 10:00:00+00'),
  ('Setup CI/CD pipeline', 'Configure automated testing and deployment', 'pending', 'high', '2024-02-05 12:00:00+00'),
  ('Update dependencies', 'Update all npm packages to latest versions', 'completed', 'low', '2024-01-20 14:30:00+00'),
  ('Design database schema', 'Create ERD and design optimal database structure', 'completed', 'high', '2024-01-18 16:00:00+00')
ON CONFLICT (id) DO NOTHING;