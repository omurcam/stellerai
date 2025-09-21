# Task Management API (Node.js)

A complete CRUD API built with Node.js, Express, and Supabase for managing tasks. This API provides endpoints to create, read, update, and delete tasks with proper validation, error handling, and pagination.

## Features

- ✅ Complete CRUD operations for tasks
- ✅ RESTful API design
- ✅ Supabase PostgreSQL integration
- ✅ Express.js framework
- ✅ Input validation and error handling
- ✅ Joi validation schemas
- ✅ Pagination support
- ✅ Filtering by status and priority
- ✅ CORS middleware
- ✅ Security headers with Helmet
- ✅ Request logging
- ✅ Proper HTTP status codes
- ✅ Clean architecture (controllers, services, repositories)
- ✅ UUID support for secure identifiers

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Client**: @supabase/supabase-js
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Project Structure

```
task-api/
├── server.js               # Application entry point
├── package.json            # Node.js dependencies
├── .env.example           # Environment variables template
├── README.md              # Project documentation
├── controllers/
│   └── taskController.js  # HTTP request controllers
├── models/
│   └── Task.js            # Data models and validation schemas
├── repositories/
│   └── taskRepository.js  # Data access layer
├── services/
│   └── taskService.js     # Business logic layer
├── routes/
│   └── taskRoutes.js      # Route definitions
├── middleware/
│   └── errorHandler.js    # Global error handling
├── utils/
│   └── validation.js      # Utility functions
└── database/
    └── migrations.sql     # Database schema and sample data
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account and project
- Git

### 2. Clone the Repository

```bash
git clone <repository-url>
cd task-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:

```env
# Get these from your Supabase project settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server configuration
PORT=8080
```

### 5. Database Setup

1. Connect to your Supabase project
2. Go to the SQL Editor
3. Run the migration script from `database/migrations.sql`

### 6. Run the Application

```bash
npm run dev
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tasks` | Create a new task |
| GET | `/api/v1/tasks` | Get all tasks (with pagination and filtering) |
| GET | `/api/v1/tasks/stats` | Get task statistics |
| GET | `/api/v1/tasks/:id` | Get a specific task by ID |
| PUT | `/api/v1/tasks/:id` | Update a specific task |
| DELETE | `/api/v1/tasks/:id` | Delete a specific task |

### Query Parameters for GET /api/v1/tasks

- `status` - Filter by task status (`pending`, `in_progress`, `completed`)
- `priority` - Filter by priority (`low`, `medium`, `high`)
- `page` - Page number (default: 1)
- `page_size` - Number of items per page (default: 10, max: 100)

## API Examples

### Create a Task

```bash
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the API",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-02-01T15:30:00Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the API",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-02-01T15:30:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Tasks

```bash
curl "http://localhost:8080/api/v1/tasks?status=pending&page=1&page_size=10"
```

**Response:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "status": "pending",
      "priority": "high",
      "due_date": "2024-02-01T15:30:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### Get Task Statistics

```bash
curl http://localhost:8080/api/v1/tasks/stats
```

### Get a Specific Task

```bash
curl http://localhost:8080/api/v1/tasks/123e4567-e89b-12d3-a456-426614174000
```

### Update a Task

```bash
curl -X PUT http://localhost:8080/api/v1/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "medium"
  }'
```

### Delete a Task

```bash
curl -X DELETE http://localhost:8080/api/v1/tasks/123e4567-e89b-12d3-a456-426614174000
```

## Data Models

### Task

```javascript
{
  id: "uuid",
  title: "string",
  description: "string | null",
  status: "pending | in_progress | completed",
  priority: "low | medium | high",
  due_date: "ISO 8601 datetime | null",
  created_at: "ISO 8601 datetime",
  updated_at: "ISO 8601 datetime"
}
```

### Validation Rules

- `title`: Required, 1-255 characters
- `status`: Required, must be one of: `pending`, `in_progress`, `completed`
- `priority`: Required, must be one of: `low`, `medium`, `high`
- `description`: Optional
- `due_date`: Optional, must be valid ISO 8601 datetime

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
NODE_ENV=production npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.