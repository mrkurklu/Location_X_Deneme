# Location X Management System

This app uses Next.js, TailwindCSS, MongoDB/Mongoose, and NextAuth with JWT sessions and role-based access control.

## Getting Started

1. Create a `.env.local` file in the project root with:

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

2. Install dependencies and run the dev server:

```
npm i
npm run dev
```

3. Open `/auth/signin` and sign in with the admin credentials. On first login, the admin user will be created automatically if missing.

## Features

- Authentication with credentials provider and JWT sessions
- Role-based access control: Admin, Sales Manager, Stock Manager
- Manage Users (CRUD) with Admin-only access (API + UI working)
- Placeholder pages for Stock, Sales, and Sales Management
- Protected API routes with role checks and location scoping
- TailwindCSS with dark mode and basic UI components

## Deploy

- Vercel-compatible. Set env vars on Vercel: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- Deploy via Git push to Vercel
