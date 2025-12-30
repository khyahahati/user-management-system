# Project Overview

Mini User Management System is a full-stack web application that lets organizations onboard users, authenticate them securely, and administer access. It exists to demonstrate a production-style assessment solution for managing user accounts where both standard users and administrators interact. The application solves the common problem of safely granting and restricting access by combining user authentication, role-based access control (RBAC), and distinct admin versus user capabilities.

# Tech Stack Used

## Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

## Frontend
- React (Hooks)
- Vite

## Database
- PostgreSQL (Docker)

# Features Implemented

## Authentication
- User signup flow
- Credential-based login
- JWT-based authentication
- Password hashing and verification

## User Features
- View profile details
- Update name and email
- Change password with validation

## Admin Features
- View paginated user list
- Activate or deactivate users
- Enforce RBAC for admin-only actions

## Security
- Protected API routes
- Role-based authorization checks
- Request payload validation
- Secure password storage with bcrypt

# Project Structure

```
user-management-system/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

# Deployment

- Backend: Railway (Backend URL: <to be added>)
- Frontend: Railway (Frontend URL: <to be added>)
- Database: PostgreSQL (Docker locally, Railway-hosted in production)

# Setup Instructions (Local Development)

## Prerequisites
- Node.js (LTS)
- Docker (for PostgreSQL instance)
- npm

## Backend Setup
1. cd backend
2. npm install
3. Copy .env.example to .env and fill required values
4. Run docker compose up -d (or start PostgreSQL manually)
5. npx prisma migrate dev
6. npm run dev

## Frontend Setup
1. cd frontend
2. npm install
3. Copy .env.example to .env and set VITE_API_URL
4. npm run dev

# Environment Variables

## Backend
- PORT
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN

## Frontend
- VITE_API_URL

# API Documentation

## Auth
- POST /auth/signup
- POST /auth/login
- GET /auth/me

## User
- GET /users/me
- PATCH /users/me
- PATCH /users/me/password

## Admin
- GET /admin/users
- PATCH /admin/users/:userId/activate
- PATCH /admin/users/:userId/deactivate

All endpoints require a valid JWT in the Authorization header. Admin routes are restricted to users with the admin role.

# Testing
- Backend unit tests cover authentication flows, profile management, and RBAC rules.
- To run tests:
  1. cd backend
  2. npm test


