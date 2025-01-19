# Chat API

A modern, secure REST API for chat applications built with Fastify, TypeScript, and Prisma.

## Prerequisites

### Local Development
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Docker Deployment
- Docker
- Docker Compose v2

## Docker Deployment

1. Run command in root file
```bash
cat .env.example > .env
```

2. Start the application using Docker Compose:

```bash
cd .deploy
docker compose --env-file ../.env up -d
```

This will:
- Start a PostgreSQL database
- Run database migrations
- Launch the API server

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/documentation
```

## API Endpoints

### Authentication
- `POST /account/register` - Register a new user
  - Required fields: login, password

### Messages
- `POST /messages/text` - Send a text message
- `POST /messages/file` - Upload a file message
- `GET /messages` - Get message list
- `GET /messages/:id` - Get specific message row content

## File Upload Specifications

- Maximum file size: 5MB
- Supported file types:
  - Images (jpeg, png, gif)
  - PDF documents
  - Plain text files

## Docker Architecture

The application consists of three services:

1. `api`: Main application service
   - Runs the Fastify server
   - Handles API requests
   - Manages file uploads

2. `db`: PostgreSQL database
   - Stores all application data
   - Persists data using a named volume
   - Includes health checks

3. `migration`: Database migration service
   - Runs Prisma migrations
   - Ensures database schema is up to date
   - Runs before API service starts
