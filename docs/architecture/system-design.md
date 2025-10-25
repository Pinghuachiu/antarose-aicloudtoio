# System Design Document

**Project**: antarose-template-nodejs (Minimal v3.0.0)
**Version**: 3.0.0
**Date**: 2025-10-24
**Author**: Leo (System Architect)
**Status**: Production Ready

---

## 1. System Overview

### 1.1 Project Purpose

`antarose-template-nodejs` is a **minimal, production-ready full-stack template** designed for rapid development of modern web applications. It provides a solid foundation with clean separation between frontend and backend, enabling developers to quickly bootstrap new projects without unnecessary complexity.

### 1.2 Core Design Principles

1. **Simplicity First**: Minimal dependencies, clear structure, easy to understand
2. **Production Ready**: Security headers, error handling, compression built-in
3. **Independent Architecture**: Frontend and backend are separate, deployable independently
4. **Type Safety**: Full TypeScript coverage across the stack
5. **Developer Experience**: Hot reload, ESLint, Prettier, clear conventions

### 1.3 Target Use Cases

- Web applications requiring frontend + API backend
- Projects that need independent frontend/backend scaling
- Teams working separately on frontend and backend
- Microservices-ready architecture
- Projects requiring flexible deployment options

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client Layer                     │
│                  (Web Browser)                       │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTPS (Port 3000)
                     ▼
┌─────────────────────────────────────────────────────┐
│                  Frontend Server                     │
│              Next.js 15 (App Router)                 │
│          React 19 + Tailwind CSS + shadcn/ui         │
│                                                       │
│  Features:                                            │
│  - Server-Side Rendering (SSR)                        │
│  - Static Site Generation (SSG)                       │
│  - Client-Side Rendering (CSR)                        │
│  - Incremental Static Regeneration (ISR)              │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/REST (Port 4000)
                     ▼
┌─────────────────────────────────────────────────────┐
│                   Backend Server                     │
│               Express 5 + TypeScript                 │
│                                                       │
│  Middleware Stack:                                    │
│  1. Helmet (Security Headers)                         │
│  2. CORS (Cross-Origin Control)                       │
│  3. Compression (Response Compression)                │
│  4. Body Parser (JSON/URL-encoded)                    │
│  5. Logger (Request Logging)                          │
│  6. Routes (API Endpoints)                            │
│  7. Error Handler (Centralized Error Handling)        │
│                                                       │
│  API Endpoints:                                       │
│  - GET /health (Health check)                         │
│  - GET /api/hello (Example API)                       │
│  - GET /api/error/* (Error handling demos)            │
└─────────────────────────────────────────────────────┘
```

### 2.2 Architecture Decision: Separate Frontend & Backend

**Why Separate Instead of Monorepo?**

We chose **independent frontend and backend** architecture over a Monorepo setup for the following reasons:

#### Advantages
1. **Dependency Isolation**: Frontend and backend dependencies are completely isolated
   - No risk of version conflicts between frontend and backend packages
   - Smaller node_modules per project
   - Easier to upgrade packages independently

2. **Independent Deployment**:
   - Deploy frontend and backend to different platforms
   - Scale frontend and backend independently based on load
   - Update one without affecting the other

3. **Team Autonomy**:
   - Frontend and backend teams can work independently
   - Different CI/CD pipelines
   - Separate testing strategies

4. **Simplified Onboarding**:
   - New developers only need to understand one side initially
   - Clearer mental model of system boundaries
   - Easier to maintain and debug

#### Trade-offs
1. **No Shared TypeScript Types**: Cannot share type definitions across frontend and backend
   - **Mitigation**: Use OpenAPI/Swagger to generate types from API schema
   - **Mitigation**: Establish clear API contracts with documentation

2. **Duplicate Configuration**: Some config files (ESLint, Prettier, tsconfig) are duplicated
   - **Mitigation**: Keep configurations simple and synchronized manually
   - **Mitigation**: Use configuration templates for consistency

3. **Separate Dependency Updates**: Need to update packages separately
   - **Mitigation**: Use automated dependency update tools (Renovate, Dependabot)

---

## 3. Frontend Architecture

### 3.1 Technology Stack

- **Framework**: Next.js 15.1.6 (App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.1
- **Components**: shadcn/ui (Latest)
- **Icons**: Lucide React 0.546.0

### 3.2 Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── about/
│   │   └── page.tsx             # Static About page (SSG)
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page (SSG)
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # 404 page
│   └── globals.css              # Global styles + Tailwind
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── layout/                  # Layout components
│       ├── header.tsx           # Main header
│       └── footer.tsx           # Main footer
│
├── lib/
│   └── utils.ts                 # Utility functions (cn helper)
│
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

### 3.3 Rendering Strategies

This template demonstrates all Next.js rendering strategies:

1. **Static Site Generation (SSG)**: Default for all pages
   - Home page (`app/page.tsx`)
   - About page (`app/about/page.tsx`)
   - Built at build time, served as static HTML

2. **Server-Side Rendering (SSR)**: Available when needed
   ```typescript
   export const dynamic = 'force-dynamic'
   ```

3. **Client-Side Rendering (CSR)**: For interactive components
   ```typescript
   'use client'
   ```

4. **Incremental Static Regeneration (ISR)**: Available when needed
   ```typescript
   export const revalidate = 3600 // Revalidate every hour
   ```

### 3.4 Data Flow

```
User Browser
    ↓
Next.js Page Component
    ↓
Fetch API Call (Client-side)
    ↓
Backend API (http://localhost:4000/api/*)
    ↓
Response JSON
    ↓
Component State Update
    ↓
UI Re-render
```

### 3.5 State Management

Currently using **React built-in state** (useState, useContext):
- Simple and minimal
- No external state management library
- Suitable for most small to medium applications

**Future Extensions**:
- Add Zustand for complex client state
- Add TanStack Query for server state management

---

## 4. Backend Architecture

### 4.1 Technology Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.9.3
- **Security**: Helmet 8.1.0
- **Cross-Origin**: CORS 2.8.5
- **Compression**: Compression 1.8.1

### 4.2 Directory Structure

```
backend/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── middlewares/
│   │   ├── logger.ts           # Request logging middleware
│   │   └── error-handler.ts    # Centralized error handling
│   └── routes/
│       ├── health.ts           # Health check endpoint
│       ├── hello.ts            # Example API endpoint
│       └── error-example.ts    # Error handling examples
│
├── dist/                        # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

### 4.3 Middleware Stack Order

```typescript
// apps/backend/src/index.ts

// 1. Security Headers (Helmet)
app.use(helmet())

// 2. CORS (Cross-Origin Resource Sharing)
app.use(cors({ origin: corsOrigin, credentials: true }))

// 3. Compression (Response Compression)
app.use(compression())

// 4. Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 5. Request Logger
app.use(loggerMiddleware)

// 6. Routes
app.use('/health', healthRouter)
app.use('/api/hello', helloRouter)
app.use('/api/error', errorExampleRouter)

// 7. Error Handler (Must be last)
app.use(errorHandler)
```

**Why This Order?**

1. **Helmet First**: Security headers must be applied before any response
2. **CORS Early**: Check origin before processing request
3. **Compression After CORS**: No need to compress rejected requests
4. **Body Parsers**: Required before route handlers access req.body
5. **Logger**: Log after basic middleware setup
6. **Routes**: Business logic
7. **Error Handler Last**: Catch all errors from previous middleware

### 4.4 API Design

#### RESTful Conventions

```
GET    /health              → Health check
GET    /api/hello           → Example API
GET    /api/error/sync      → Synchronous error example
GET    /api/error/async     → Asynchronous error example
GET    /api/error/custom    → Custom error example
```

#### Response Format

**Success Response**:
```json
{
  "message": "Hello from backend!",
  "timestamp": "2025-10-24T10:00:00.000Z"
}
```

**Error Response**:
```json
{
  "error": "Error message",
  "path": "/api/error/sync"
}
```

#### Status Codes

- `200 OK`: Successful GET/PUT/PATCH
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 5. Data Flow

### 5.1 Complete Request Flow

```
1. User clicks button on frontend
   ↓
2. Frontend sends HTTP request
   fetch('http://localhost:4000/api/hello')
   ↓
3. Request hits backend Express server
   ↓
4. Passes through middleware stack:
   - Helmet (adds security headers)
   - CORS (checks origin)
   - Compression (prepares for compression)
   - Body Parser (parses JSON)
   - Logger (logs request)
   ↓
5. Routes to appropriate handler
   GET /api/hello → helloRouter
   ↓
6. Handler executes business logic
   res.json({ message: 'Hello from backend!' })
   ↓
7. Response flows back through middleware
   - Compression (compresses response)
   - Logger (logs response)
   ↓
8. Response sent to frontend
   ↓
9. Frontend receives JSON
   ↓
10. Component updates state and re-renders UI
```

### 5.2 Error Flow

```
1. Error occurs in route handler
   throw new Error('Something went wrong')
   ↓
2. Express calls next(error)
   ↓
3. Error propagates through middleware stack
   ↓
4. Caught by centralized error handler
   app.use(errorHandler)
   ↓
5. Error handler formats error response
   { error: 'Error message', path: '/api/...' }
   ↓
6. Response sent to frontend with appropriate status code
   ↓
7. Frontend error boundary catches error
   app/error.tsx displays error UI
```

---

## 6. Deployment Architecture

### 6.1 Development Environment

```
Developer Machine
├── Frontend Server (localhost:3000)
│   └── Next.js Dev Server
│       - Hot Module Replacement
│       - Fast Refresh
│       - TypeScript compilation on-the-fly
│
└── Backend Server (localhost:4000)
    └── Express + ts-node-dev
        - Auto-restart on file change
        - TypeScript compilation on-the-fly
```

### 6.2 Production Environment

```
Production Deployment
├── Frontend (Vercel / Netlify)
│   └── Next.js Static Site
│       - Pre-rendered HTML pages
│       - Optimized JavaScript bundles
│       - CDN-served assets
│
└── Backend (Railway / Render / AWS)
    └── Express Server (Docker)
        - Compiled JavaScript (dist/)
        - PM2 or Node Cluster
        - Health checks enabled
```

### 6.3 Recommended Deployment Platforms

**Frontend**:
- **Vercel** (Recommended): Zero-config Next.js deployment
- **Netlify**: Easy static site deployment
- **Cloudflare Pages**: Fast global CDN

**Backend**:
- **Railway** (Recommended): Easy Node.js deployment with health checks
- **Render**: Simple container deployment
- **AWS Elastic Beanstalk**: Enterprise-grade hosting
- **Docker + any cloud**: Maximum flexibility

### 6.4 Environment Variables

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Backend** (`.env`):
```bash
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

---

## 7. Security Architecture

### 7.1 Security Layers

```
┌─────────────────────────────────────────┐
│         Browser Security Layer          │
│  - HTTPS enforcement                    │
│  - Content Security Policy (CSP)        │
│  - Secure cookies                       │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Frontend Security Layer          │
│  - Next.js security defaults            │
│  - Environment variable protection      │
│  - XSS protection via React             │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Backend Security Layer           │
│  - Helmet (Security headers)            │
│  - CORS (Origin control)                │
│  - Request size limits                  │
│  - Error sanitization                   │
└─────────────────────────────────────────┘
```

### 7.2 Security Features

**Backend Security (Helmet)**:
- Content Security Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)

**CORS Configuration**:
```typescript
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
app.use(cors({
  origin: corsOrigin,
  credentials: true
}))
```

**Request Limits**:
```typescript
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
```

---

## 8. Performance Considerations

### 8.1 Frontend Performance

- **Static Site Generation**: Pre-rendered HTML for instant page loads
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component (not yet implemented)
- **Tailwind CSS**: Minimal CSS bundle size
- **Tree Shaking**: Automatic unused code removal

### 8.2 Backend Performance

- **Compression**: Response compression reduces bandwidth
- **Efficient Routing**: Express's fast routing engine
- **Minimal Middleware**: Only essential middleware enabled
- **TypeScript Compilation**: Pre-compiled for production (dist/)

### 8.3 Future Optimizations

- Add Redis caching for API responses
- Implement database connection pooling (when database is added)
- Add CDN for static assets
- Implement rate limiting for API endpoints

---

## 9. Monitoring & Observability

### 9.1 Current Implementation

**Health Check Endpoint**:
```
GET /health
Response: 200 OK with { status: 'healthy' }
```

**Request Logging**:
```typescript
// Logs each request with method, URL, status, response time
[LOG] GET /api/hello 200 - 5ms
```

### 9.2 Future Monitoring

**Recommended Tools**:
- **Sentry**: Error tracking and performance monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Winston/Pino**: Structured logging
- **Vercel Analytics**: Frontend performance monitoring

---

## 10. Testing Strategy

### 10.1 Current State

- **No tests implemented yet** (minimal template)
- ESLint and TypeScript provide compile-time checks

### 10.2 Recommended Testing Strategy

**Backend Testing**:
```typescript
// Unit tests (Vitest)
describe('GET /api/hello', () => {
  it('should return hello message', async () => {
    const response = await request(app).get('/api/hello')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Hello from backend!')
  })
})
```

**Frontend Testing**:
```typescript
// Component tests (React Testing Library)
describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})

// E2E tests (Playwright)
test('user can navigate to about page', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('text=About')
  await expect(page).toHaveURL('http://localhost:3000/about')
})
```

**Coverage Goals**:
- Unit tests: ≥80%
- Integration tests: ≥60%
- E2E tests: Critical user flows

---

## 11. Scalability Considerations

### 11.1 Horizontal Scaling

**Frontend**:
- Static files served via CDN (infinite scalability)
- Multiple Next.js server instances behind load balancer

**Backend**:
- Stateless API design (no sessions stored in memory)
- Multiple Express instances behind load balancer
- Database connection pooling (when database is added)

### 11.2 Vertical Scaling

**Current Resource Usage**:
- Frontend: ~100MB RAM (dev mode)
- Backend: ~50MB RAM (idle)

**Production Recommendations**:
- Frontend: 256MB-512MB RAM per instance
- Backend: 256MB-1GB RAM per instance

### 11.3 Future Scalability Features

- Add Redis for session storage and caching
- Implement microservices for specific features
- Add message queue (RabbitMQ, Redis Pub/Sub) for async tasks
- Database read replicas for read-heavy workloads

---

## 12. Migration & Extension Guide

### 12.1 Adding Database

**Step 1**: Choose ORM (Prisma recommended)
```bash
cd backend
npm install prisma @prisma/client
npx prisma init
```

**Step 2**: Define schema
```prisma
// prisma/schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

**Step 3**: Integrate with Express
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### 12.2 Adding Authentication

**Recommended**: NextAuth.js (Auth.js v5)

**Step 1**: Install
```bash
cd frontend
npm install next-auth
```

**Step 2**: Configure
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [GithubProvider({ ... })],
}
```

### 12.3 Adding State Management

**Recommended**: Zustand (lightweight) or TanStack Query (server state)

```bash
cd frontend
npm install zustand
# or
npm install @tanstack/react-query
```

---

## 13. Known Limitations

### 13.1 Current Limitations

1. **No Database**: Template is database-agnostic
   - **Impact**: Cannot persist data
   - **Mitigation**: Add Prisma + PostgreSQL when needed

2. **No Authentication**: No user management system
   - **Impact**: No login/signup functionality
   - **Mitigation**: Add NextAuth.js when needed

3. **No Type Sharing**: Frontend and backend cannot share TypeScript types
   - **Impact**: Manual type synchronization required
   - **Mitigation**: Use OpenAPI/Swagger to generate types

4. **No Testing**: No test suites included
   - **Impact**: No automated quality checks
   - **Mitigation**: Add Vitest (backend) + Playwright (frontend)

5. **Basic Error Handling**: Error handling is minimal
   - **Impact**: Limited error information in production
   - **Mitigation**: Add Sentry for error tracking

### 13.2 Intentional Design Choices

These are **not bugs**, but deliberate design decisions:

1. **No Monorepo**: Separate projects for frontend and backend
2. **No Shared Code**: No shared packages between frontend and backend
3. **Minimal Dependencies**: Only essential packages installed
4. **No Pre-configured CI/CD**: Platform-agnostic deployment

---

## 14. Architecture Evolution Roadmap

### Phase 1: Foundation (Current)
- ✅ Separate frontend and backend
- ✅ TypeScript everywhere
- ✅ Basic security (Helmet, CORS)
- ✅ Production-ready build process

### Phase 2: Data Layer (Future)
- ⏳ Add Prisma ORM
- ⏳ PostgreSQL integration
- ⏳ Database migrations
- ⏳ Connection pooling

### Phase 3: Authentication (Future)
- ⏳ NextAuth.js integration
- ⏳ OAuth providers (GitHub, Google)
- ⏳ Role-based access control (RBAC)
- ⏳ Session management

### Phase 4: Enhanced Features (Future)
- ⏳ State management (Zustand/TanStack Query)
- ⏳ Redis caching
- ⏳ File upload (S3/MinIO)
- ⏳ Background jobs (BullMQ)

### Phase 5: Production Enhancements (Future)
- ⏳ Comprehensive testing (Vitest + Playwright)
- ⏳ Error tracking (Sentry)
- ⏳ Performance monitoring
- ⏳ CI/CD pipelines
- ⏳ Docker Compose for local development

---

## 15. Conclusion

This architecture provides a **solid, minimal foundation** for full-stack web applications. It balances simplicity with production readiness, making it ideal for:

- Rapid prototyping
- Learning full-stack development
- Small to medium-sized projects
- Microservices architecture
- Teams requiring independent frontend/backend development

The separate frontend/backend architecture ensures **maximum flexibility** for deployment, scaling, and team collaboration while maintaining clear boundaries between concerns.

**Next Steps**:
1. Review `tech-stack.md` for detailed technology choices
2. Check `adr/` for architecture decision records
3. Read `implementation-notes.md` for implementation details

---

**Document Version**: 3.0.0
**Last Updated**: 2025-10-24
**Author**: Leo (System Architect)
**Reviewed By**: CTO (Pending)
