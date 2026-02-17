# Player Management API

## Overview
The Player Management API provides endpoints for creating, updating, and managing player profiles. This API supports the complete player lifecycle from initial registration through profile management.

## Base URL
```
/api/v1/players
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

## Endpoints

### Create Player
Creates a new player profile.

**Endpoint:** `POST /api/v1/players`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "dateOfBirth": "1990-05-15",
  "position": "midfielder",
  "skillLevel": "intermediate",
  "preferredFoot": "right",
  "height": 180,
  "weight": 75,
  "bio": "Passionate midfielder with 5 years of experience"
}
```

**Request Schema:**
- `name` (string, required): Player's full name (2-50 characters)
- `email` (string, required): Valid email address
- `username` (string, required): Unique username (3-20 characters, alphanumeric and underscores only)
- `dateOfBirth` (string, required): Date in ISO format (YYYY-MM-DD)
- `position` (string, required): One of: goalkeeper, defender, midfielder, forward
- `skillLevel` (string, required): One of: beginner, intermediate, advanced, professional
- `preferredFoot` (string, optional): One of: left, right, both
- `height` (number, optional): Height in centimeters (100-250)
- `weight` (number, optional): Weight in kilograms (30-200)
- `bio` (string, optional): Player biography (max 500 characters)

**cURL Example:**
```bash
curl -X POST \
  http://localhost:3000/api/v1/players \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-access-token' \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe123",
    "dateOfBirth": "1990-05-15",
    "position": "midfielder",
    "skillLevel": "intermediate",
    "preferredFoot": "right",
    "height": 180,
    "weight": 75
  }'
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "player_123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe123",
    "dateOfBirth": "1990-05-15",
    "position": "midfielder",
    "skillLevel": "intermediate",
    "preferredFoot": "right",
    "height": 180,
    "weight": 75,
    "bio": null,
    "profileImageUrl": null,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Player created successfully"
}
```

### Get Player
Retrieves a specific player by ID.

**Endpoint:** `GET /api/v1/players/:id`

**cURL Example:**
```bash
curl -X GET \
  http://localhost:3000/api/v1/players/player_123456789 \
  -H 'Authorization: Bearer your-access-token'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "player_123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe123",
    "dateOfBirth": "1990-05-15",
    "position": "midfielder",
    "skillLevel": "intermediate",
    "preferredFoot": "right",
    "height": 180,
    "weight": 75,
    "bio": "Passionate midfielder with 5 years of experience",
    "profileImageUrl": "https://example.com/avatars/player_123456789.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z",
    "stats": {
      "gamesPlayed": 15,
      "goalsScored": 3,
      "assists": 7,
      "yellowCards": 2,
      "redCards": 0
    }
  }
}
```

### Update Player
Updates an existing player profile.

**Endpoint:** `PUT /api/v1/players/:id`

**Request Body:** Same schema as Create Player, but all fields are optional except `id`

**cURL Example:**
```bash
curl -X PUT \
  http://localhost:3000/api/v1/players/player_123456789 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-access-token' \
  -d '{
    "bio": "Updated bio with recent achievements",
    "skillLevel": "advanced"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "player_123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe123",
    "dateOfBirth": "1990-05-15",
    "position": "midfielder",
    "skillLevel": "advanced",
    "preferredFoot": "right",
    "height": 180,
    "weight": 75,
    "bio": "Updated bio with recent achievements",
    "profileImageUrl": "https://example.com/avatars/player_123456789.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  },
  "message": "Player updated successfully"
}
```

### List Players
Retrieves a paginated list of players with optional filtering.

**Endpoint:** `GET /api/v1/players`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `position` (string, optional): Filter by position
- `skillLevel` (string, optional): Filter by skill level
- `search` (string, optional): Search in name and username
- `isActive` (boolean, optional): Filter by active status

**cURL Example:**
```bash
curl -X GET \
  'http://localhost:3000/api/v1/players?page=1&limit=10&position=midfielder&skillLevel=intermediate' \
  -H 'Authorization: Bearer your-access-token'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "players": [
      {
        "id": "player_123456789",
        "name": "John Doe",
        "username": "johndoe123",
        "position": "midfielder",
        "skillLevel": "intermediate",
        "profileImageUrl": "https://example.com/avatars/player_123456789.jpg",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Delete Player
Soft deletes a player (sets isActive to false).

**Endpoint:** `DELETE /api/v1/players/:id`

**cURL Example:**
```bash
curl -X DELETE \
  http://localhost:3000/api/v1/players/player_123456789 \
  -H 'Authorization: Bearer your-access-token'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Player deactivated successfully"
}
```

### Upload Player Avatar
Uploads a profile image for a player.

**Endpoint:** `POST /api/v1/players/:id/avatar`

**Request:** Multipart form data with file field named `avatar`

**cURL Example:**
```bash
curl -X POST \
  http://localhost:3000/api/v1/players/player_123456789/avatar \
  -H 'Authorization: Bearer your-access-token' \
  -F 'avatar=@/path/to/image.jpg'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "profileImageUrl": "https://example.com/avatars/player_123456789.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "username",
      "message": "Username already exists"
    }
  ]
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### Not Found (404 Not Found)
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Player not found"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Validation Rules

### Field Validation
- **name**: Required, 2-50 characters, letters and spaces only
- **email**: Required, valid email format, unique
- **username**: Required, 3-20 characters, alphanumeric and underscores, unique
- **dateOfBirth**: Required, valid date, must be at least 13 years old
- **position**: Required, must be one of the predefined positions
- **skillLevel**: Required, must be one of the predefined skill levels
- **height**: Optional, integer between 100-250 cm
- **weight**: Optional, integer between 30-200 kg
- **bio**: Optional, maximum 500 characters

### File Upload Validation
- **avatar**: Maximum 5MB, formats: jpg, jpeg, png, gif
- Images are automatically resized to 400x400 pixels

## Rate Limiting
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user
- Avatar uploads: 10 per hour per user

## Common Integration Patterns

### Player Registration Flow
```javascript
// 1. Create player
const playerData = {
  name: formData.name,
  email: formData.email,
  username: formData.username,
  dateOfBirth: formData.dateOfBirth,
  position: formData.position,
  skillLevel: formData.skillLevel
};

const response = await fetch('/api/v1/players', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(playerData)
});

// 2. Handle success/error
if (response.ok) {
  const { data } = await response.json();
  // Redirect to player profile or next step
} else {
  const { error, details } = await response.json();
  // Display validation errors
}
```

### Player Search and Filter
```javascript
const searchPlayers = async (filters) => {
  const queryParams = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.position && { position: filters.position }),
    ...(filters.skillLevel && { skillLevel: filters.skillLevel }),
    ...(filters.search && { search: filters.search })
  });

  const response = await fetch(`/api/v1/players?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};
```