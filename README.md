# Inkwell — A Production-Ready MERN Blog

Full-stack blog application: React (Vite) + Tailwind on the frontend, Node/Express (ES Modules) + MongoDB/Mongoose on the backend.

## Features

- JWT authentication (Bearer + HTTP-only cookie), bcrypt password hashing
- Role-based authorization: `admin`, `author`, `reader`
- Full CRUD for posts with Markdown content, auto-generated slugs, drafts vs published
- Cover image upload via Multer (local disk storage)
- Comments, categories, tags, full-text search, pagination
- Responsive, accessible UI with dark mode

## Structure

```
inkwell/
├── backend/     # Express API — see backend/README below via .env.example
└── frontend/    # React + Vite client
```

See the full setup and deployment guide provided alongside this project for exact terminal commands, environment variable templates, and free-tier deployment steps (Render + Vercel + MongoDB Atlas).

## Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # edit JWT_SECRET
npm run seed            # optional: demo data
npm run dev              # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

Demo accounts after seeding:
- `admin@inkwell.io` / `Admin123!`
- `author@inkwell.io` / `Author123!`
- `reader@inkwell.io` / `Reader123!`
