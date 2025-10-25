# antarose-aicloudtoio

A production-ready full-stack template featuring Express + TypeScript backend and Next.js 15 frontend.

## Overview

This template provides a solid foundation for building modern web applications with:

- **Backend**: Express 5 + TypeScript API server
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS + shadcn/ui
- **Architecture**: Separate frontend/backend (no monorepo)
- **Development**: Hot reload, TypeScript, ESLint, Prettier
- **Production**: Optimized builds, security headers, compression

## Quick Start

### Using Bootstrap Script (Recommended) 🚀

Create a new project from this template with a single command:

```bash
# Method 1: Download and run locally
curl -O https://raw.githubusercontent.com/Pinghuachiu/antarose-template-nodejs/main/anta-node.sh
chmod +x anta-node.sh
./anta-node.sh my-awesome-project

# Method 2: Direct execution (one-liner)
curl -fsSL https://raw.githubusercontent.com/Pinghuachiu/antarose-template-nodejs/main/anta-node.sh | bash -s my-awesome-project
```

**Interactive Configuration:**

The script will guide you through setup with these prompts:

| Prompt | Default Value | Required |
|--------|--------------|----------|
| Project description | "A Node.js project built with Antarose Template" | No |
| Author | jackalchiu@antarose.com | No |
| GitHub repository URL | (skip) | No |
| Install dependencies? | Yes | No |

**What the script does automatically:**

- ✅ **Validates environment** (Git, Node.js, npm installed)
- ✅ **Clones template** from this repository
- ✅ **Validates project name** (npm package naming rules)
- ✅ **Removes template Git history** (.git/ directory)
- ✅ **Cleans up files** (removes docs/specs/, keeps docs/architecture/)
- ✅ **Updates configuration**:
  - `frontend/package.json` - name, description, author, version
  - `backend/package.json` - name, description, author, version
  - `README.md` - project name
- ✅ **Installs dependencies** (frontend + backend)
- ✅ **Initializes new Git repository** with initial commit
- ✅ **Sets up Git remote** (if provided)

**Requirements:**
- ✅ Project name must be lowercase (a-z, 0-9, -, _)
- ✅ Max 214 characters
- ✅ Cannot start with `.` or `_`

### Manual Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Full Stack Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## Project Structure

```
antarose-template-nodejs/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── index.ts         # Application entry point
│   │   ├── middlewares/     # Custom middlewares
│   │   └── routes/          # API endpoints
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js application
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # Documentation
└── README.md                # This file
```

## Backend

### Technology Stack

- **Framework**: Express 5
- **Language**: TypeScript
- **Security**: Helmet
- **Cross-Origin**: CORS
- **Compression**: Response compression middleware

### Starting the Backend

```bash
cd backend
npm install
npm run dev      # Development mode (port 4000)
npm run build    # Build TypeScript
npm start        # Production mode
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/hello` | Example API |
| GET | `/api/error/*` | Error handling examples |

### Backend Project Structure

```
backend/
├── src/
│   ├── index.ts              # App entry point
│   ├── middlewares/
│   │   ├── logger.ts         # Request logging
│   │   └── error-handler.ts  # Error handling
│   └── routes/
│       ├── health.ts         # Health check
│       ├── hello.ts          # Example endpoint
│       └── error-example.ts  # Error examples
└── dist/                     # Compiled output
```

### Environment Variables (Backend)

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Adding New API Endpoints

1. Create route handler in `backend/src/routes/`
2. Import and register in `backend/src/index.ts`
3. Test with curl or frontend

Example:

```typescript
// backend/src/routes/users.ts
import { Router, Request, Response } from 'express'

const router = Router()

router.get('/users', (req: Request, res: Response) => {
  res.json({ users: [] })
})

export default router
```

For detailed backend documentation, see [backend/README.md](./backend/README.md).

## Frontend

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React

### Starting the Frontend

```bash
cd frontend
npm install
npm run dev      # Development mode (port 3000)
npm run build    # Production build
npm start        # Production mode
```

### Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript strict mode
- ✅ Tailwind CSS configured
- ✅ shadcn/ui components
- ✅ Responsive header/footer
- ✅ Error boundary and 404 page
- ✅ ESLint and Prettier

### Frontend Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── about/page.tsx       # About page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── layout/              # Layout components
└── lib/
    └── utils.ts             # Utilities
```

### Environment Variables (Frontend)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Adding New Pages

Create `frontend/app/[pagename]/page.tsx`:

```tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

For detailed frontend documentation, see [frontend/README.md](./frontend/README.md).

## Development Workflow

### 1. Start Both Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 2. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

### 3. Make Changes

- Backend changes auto-reload via `ts-node-dev`
- Frontend changes auto-reload via Next.js Fast Refresh

## Production Build

### Build Backend

```bash
cd backend
npm run build    # Compiles TypeScript to dist/
npm start        # Runs compiled code
```

### Build Frontend

```bash
cd frontend
npm run build    # Creates optimized production build
npm start        # Starts production server
```

## API Integration

### Frontend Calling Backend

```typescript
// frontend/app/example/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ExamplePage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/hello')
      .then(res => res.json())
      .then(setData)
  }, [])

  return <div>{JSON.stringify(data)}</div>
}
```

## Code Quality

### Backend

```bash
cd backend
npm run lint      # ESLint
npm run format    # Prettier
```

### Frontend

```bash
cd frontend
npm run lint      # Next.js ESLint
```

## Security Features

### Backend
- Helmet for security headers
- CORS configuration
- Request body size limits
- Error sanitization in production

### Frontend
- Next.js security defaults
- Environment variable protection
- CSP headers (configurable)

## Performance Optimizations

### Backend
- Response compression
- Efficient routing
- JSON parsing limits

### Frontend
- Next.js automatic code splitting
- Image optimization
- Static generation (SSG)
- Incremental static regeneration (ISR)

## Troubleshooting

### Port Already in Use

**Backend (port 4000):**
```bash
lsof -ti:4000 | xargs kill -9
```

**Frontend (port 3000):**
```bash
lsof -ti:3000 | xargs kill -9
```

### CORS Errors

1. Check `backend/.env` has correct `CORS_ORIGIN`
2. Verify frontend is running on allowed origin
3. Check browser console for specific error

### Build Errors

**Backend:**
```bash
cd backend
rm -rf dist
npm run build
```

**Frontend:**
```bash
cd frontend
rm -rf .next
npm run build
```

## Documentation

- [Backend Documentation](./backend/README.md) - API server details
- [Frontend Documentation](./frontend/README.md) - Next.js app details
- [Technical Docs](./docs/) - Architecture and design documents

## Technology References

### Backend
- [Express Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Helmet Documentation](https://helmetjs.github.io/)

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

MIT

## Contributing

This is a template repository. Feel free to customize for your project needs.

## Support

For issues and questions:
1. Check documentation in `docs/` directory
2. Review component-specific README files
3. Consult technology-specific documentation linked above
