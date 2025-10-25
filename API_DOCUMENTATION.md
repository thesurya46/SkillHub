# Open API Documentation

## Overview

This API provides third-party access to the platform's skills exchange, user profiles, and community projects data. Perfect for local NGOs, educational institutions, and community organizations to integrate with the platform.

**Base URL**: `https://YOUR_PROJECT_URL.supabase.co/functions/v1`

## Authentication

All API requests require authentication using a Supabase API key in the Authorization header:

```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

## Rate Limiting

- 100 requests per minute per API key
- 1000 requests per hour per API key

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Skills API

### Get Skills List

Retrieve a list of available skills in the community.

**Endpoint**: `GET /api-skills`

**Query Parameters**:
- `category` (optional): Filter by skill category (e.g., "Technology", "Arts", "Education")
- `is_offering` (optional): Filter by offering status (true/false)
- `location_city` (optional): Filter by city
- `skill_level` (optional): Filter by skill level ("beginner", "intermediate", "advanced", "expert")
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-skills?category=Technology&is_offering=true&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Web Development",
      "description": "Full-stack web development using React and Node.js",
      "category": "Technology",
      "is_offering": true,
      "skill_level": "advanced",
      "hourly_rate_credits": 50,
      "created_at": "2024-10-25T10:30:00Z",
      "profiles": {
        "id": "user-id",
        "full_name": "John Doe",
        "location_city": "New York"
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150
  }
}
```

### Get Skill Categories

Retrieve all available skill categories.

**Endpoint**: `GET /api-skills/categories`

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-skills/categories" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    "Technology",
    "Arts",
    "Education",
    "Healthcare",
    "Business"
  ]
}
```

---

## Profiles API

### Get Profile by ID

Retrieve detailed information about a specific user profile.

**Endpoint**: `GET /api-profiles/{profileId}`

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-profiles/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "John Doe",
    "bio": "Software developer passionate about community building",
    "location_city": "New York",
    "location_state": "NY",
    "location_country": "USA",
    "credits": 150,
    "created_at": "2024-01-15T10:00:00Z",
    "skills": [
      {
        "id": "skill-id",
        "name": "Web Development",
        "description": "Full-stack development",
        "category": "Technology",
        "is_offering": true,
        "skill_level": "advanced"
      }
    ]
  }
}
```

### Get Profiles List

Retrieve a list of user profiles.

**Endpoint**: `GET /api-profiles`

**Query Parameters**:
- `location_city` (optional): Filter by city
- `location_state` (optional): Filter by state
- `location_country` (optional): Filter by country
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-profiles?location_city=Boston&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "full_name": "Jane Smith",
      "bio": "Teacher and community organizer",
      "location_city": "Boston",
      "location_state": "MA",
      "location_country": "USA",
      "created_at": "2024-02-20T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 45
  }
}
```

### Get Platform Statistics

Retrieve overall platform statistics.

**Endpoint**: `GET /api-profiles/stats`

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-profiles/stats" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "total_profiles": 1250,
    "total_skills": 3400,
    "total_projects": 89
  }
}
```

---

## Projects API

### Get Project by ID

Retrieve detailed information about a specific community project.

**Endpoint**: `GET /api-projects/{projectId}`

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-projects/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Community Garden Website",
    "description": "Build a website to coordinate our community garden activities",
    "status": "active",
    "required_skills": ["Web Development", "Design"],
    "estimated_credits": 200,
    "location_city": "Portland",
    "created_at": "2024-10-01T10:00:00Z",
    "profiles": {
      "id": "creator-id",
      "full_name": "Maria Garcia"
    }
  }
}
```

### Get Projects List

Retrieve a list of community projects.

**Endpoint**: `GET /api-projects`

**Query Parameters**:
- `status` (optional): Filter by status ("proposed", "active", "completed")
- `location_city` (optional): Filter by city
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request**:
```bash
curl -X GET "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-projects?status=active&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Youth Coding Workshop",
      "description": "Teaching coding to local youth",
      "status": "active",
      "required_skills": ["Teaching", "Programming"],
      "estimated_credits": 150,
      "location_city": "Seattle",
      "created_at": "2024-09-15T10:00:00Z",
      "profiles": {
        "id": "creator-id",
        "full_name": "Alex Johnson"
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 89
  }
}
```

### Create Project

Create a new community project (requires authentication).

**Endpoint**: `POST /api-projects`

**Request Body**:
```json
{
  "title": "Project Title",
  "description": "Project description",
  "required_skills": ["Skill 1", "Skill 2"],
  "estimated_credits": 100,
  "location_city": "City Name",
  "creator_id": "user-id"
}
```

**Example Request**:
```bash
curl -X POST "https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-projects" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Community Project",
    "description": "Help organize local food drive",
    "required_skills": ["Event Planning", "Communication"],
    "estimated_credits": 80,
    "location_city": "Austin",
    "creator_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": "new-project-id",
    "title": "New Community Project",
    "description": "Help organize local food drive",
    "status": "proposed",
    "required_skills": ["Event Planning", "Communication"],
    "estimated_credits": 80,
    "location_city": "Austin",
    "creator_id": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2024-10-25T15:30:00Z"
  }
}
```

---

## Use Cases for Third-Party Integration

### For Educational Institutions

**Use Case**: Display available tutoring skills on school website

```javascript
// Fetch all tutoring-related skills
const response = await fetch(
  'https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-skills?category=Education&is_offering=true',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);

const { data } = await response.json();
// Display skills on your website
```

### For Local NGOs

**Use Case**: Find volunteers for community projects

```javascript
// Create a new project and find matching skills
const project = await fetch(
  'https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-projects',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Community Cleanup',
      description: 'Organize neighborhood cleanup event',
      required_skills: ['Event Planning', 'Community Organizing'],
      estimated_credits: 50,
      location_city: 'Your City',
      creator_id: 'your-user-id'
    })
  }
);
```

### For Community Organizations

**Use Case**: Display community statistics on dashboards

```javascript
// Get platform statistics
const stats = await fetch(
  'https://YOUR_PROJECT_URL.supabase.co/functions/v1/api-profiles/stats',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);

const { data } = await stats.json();
console.log(`Platform has ${data.total_profiles} members!`);
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created (for POST requests) |
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Invalid or missing API key |
| 404  | Not Found - Resource doesn't exist |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

---

## Support

For API support, questions, or to request additional endpoints, please contact the platform administrators.

## Changelog

### Version 1.0 (October 2024)
- Initial release
- Skills API with filtering
- Profiles API with location filtering
- Projects API with CRUD operations
- Platform statistics endpoint
