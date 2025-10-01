# Multi-Role Job Portal API

Simple Node.js/Express API with JWT auth and role-based access (admin, recruiter, seeker). Uses MongoDB via Mongoose, file uploads to Cloudinary, and JOI validation.

## Quick start
1. Install dependencies
```bash
npm install
```
2. Create `.env` (see `.env.example`)
3. Run dev server
```bash
npm run dev
```

## Environment variables
See `.env.example` for all variables.
- PORT (optional, default 3000)
- MONGODB_URI
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- CORS_ORIGIN (optional)

## Auth flow
- POST /api/auth/register
- POST /api/auth/login ⇒ returns accessToken
- Use header: Authorization: Bearer <accessToken>

## Jobs
- POST /api/jobs/post (recruiter/admin)
- POST /api/jobs/allJobs (recruiter)
- GET /api/jobs/filter (recruiter)
- GET /api/jobs/:id (recruiter)
- DELETE /api/jobs/:id (recruiter/admin)

## Security
Helmet, CORS, rate-limiter on auth, JSON size limits, request logging.

## Development
Run with nodemon: npm run dev
Linting/tests not included. Suggested: Jest + Supertest.