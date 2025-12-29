# Mini User Management System Backend

## Tech Stack
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT (access tokens)
- bcrypt

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values.
3. Run the development server:
   ```bash
   npm run dev
   ```

## Prisma
Generate the client and apply migrations once your database is configured:
```bash
npx prisma migrate dev
```

Frontend already exists and will be connected next.
