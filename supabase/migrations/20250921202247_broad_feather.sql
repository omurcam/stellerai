-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on priority for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Create index on due_date for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Setup project structure', 'Create the basic folder structure for the Go API project', 'completed', 'high', '2024-01-15 10:00:00+00'),
('Implement CRUD operations', 'Create all the CRUD endpoints for task management', 'in_progress', 'high', '2024-01-20 15:30:00+00'),
('Add authentication', 'Implement JWT-based authentication system', 'pending', 'medium', '2024-01-25 12:00:00+00'),
('Write documentation', 'Create comprehensive API documentation', 'pending', 'low', '2024-01-30 09:00:00+00')
ON CONFLICT (id) DO NOTHING;