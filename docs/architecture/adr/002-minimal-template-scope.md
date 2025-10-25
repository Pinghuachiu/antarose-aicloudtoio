# ADR-002: Minimal Template Scope - Remove Database and Authentication

**Date**: 2025-10-24
**Status**: Accepted
**Author**: Leo (System Architect)
**Reviewed By**: CTO

---

## Context

The original proposal (`docs/specs/proposal.md`) included a comprehensive feature set:

**Originally Proposed Features**:
- ✅ Express backend (implemented)
- ✅ Next.js frontend (implemented)
- ❌ Prisma ORM + PostgreSQL (removed)
- ❌ NextAuth.js authentication (removed)
- ❌ Redis caching (removed)
- ❌ tRPC API (removed)
- ❌ RBAC authorization (removed)

We needed to decide: **Should we build a full-featured template or a minimal foundation?**

This decision impacts:
- Template complexity
- Learning curve for new users
- Maintenance burden
- Setup time
- Use case flexibility

---

## Decision

We decided to create a **minimal template** by removing:

1. ❌ Database layer (Prisma + PostgreSQL)
2. ❌ Authentication system (NextAuth.js)
3. ❌ Redis caching
4. ❌ tRPC
5. ❌ Role-based access control (RBAC)

**What We Kept**:
- ✅ Express backend with TypeScript
- ✅ Next.js 15 frontend with TypeScript
- ✅ Tailwind CSS + shadcn/ui
- ✅ Security middleware (Helmet, CORS)
- ✅ Compression
- ✅ Error handling
- ✅ Development tooling (ESLint, Prettier)

---

## Rationale

### Why Minimal is Better for a Template

#### 1. Easier to Understand
**Problem with Full-Featured Template**:
```
New user: "I just want to learn Next.js + Express"
Full template: "Here's 20 files for authentication, database migrations, RBAC..."
User: "I'm overwhelmed 😵"
```

**Minimal Template**:
```
New user: "I just want to learn Next.js + Express"
Minimal template: "Here's a clean frontend + backend with security basics"
User: "Perfect! I can understand everything! 🎉"
```

**Key Insight**: **Users can add complexity, but they cannot easily remove it.**

#### 2. Faster Onboarding
**Full Template Setup**:
```bash
# 30 minutes of setup
1. Clone repo
2. Install PostgreSQL
3. Create database
4. Configure Prisma
5. Run migrations
6. Setup NextAuth.js
7. Configure OAuth apps (GitHub, Google)
8. Setup Redis
9. Configure environment variables (15+ vars)
10. Finally: npm run dev
```

**Minimal Template Setup**:
```bash
# 2 minutes of setup
1. Clone repo
2. cd frontend && npm install && npm run dev
3. cd backend && npm install && npm run dev
4. Done! 🚀
```

**Time Saved**: ~28 minutes per new user

#### 3. No Infrastructure Dependencies
**Full Template Requirements**:
- PostgreSQL server
- Redis server
- OAuth app registration (GitHub, Google)
- Database hosting (production)
- Redis hosting (production)

**Minimal Template Requirements**:
- Node.js (that's it!)

**Benefit**: Works immediately after `git clone`, no external services needed.

#### 4. Flexible for Any Use Case
**Full Template**:
```
User: "I want to use MongoDB instead of PostgreSQL"
→ Must remove Prisma, rewrite all database code

User: "I want to use Clerk instead of NextAuth.js"
→ Must remove NextAuth.js, rewrite all auth logic

User: "I don't need authentication"
→ Must manually remove auth from 15+ files
```

**Minimal Template**:
```
User: "I want to use MongoDB"
→ Add Mongoose, start fresh ✅

User: "I want to use Clerk"
→ Add Clerk, no conflicts ✅

User: "I don't need authentication"
→ Template doesn't have it, perfect! ✅
```

**Key Insight**: **Minimal template is a foundation, not a restriction.**

#### 5. Easier Maintenance
**Full Template Maintenance**:
- Keep Prisma up to date
- Keep NextAuth.js up to date (frequent breaking changes)
- Maintain database migrations
- Test authentication flows
- Update OAuth configurations

**Minimal Template Maintenance**:
- Keep Express up to date
- Keep Next.js up to date
- That's mostly it!

**Maintenance Hours Saved**: ~80% reduction

#### 6. Clear Learning Path
**Full Template**: Everything at once (overwhelming)

**Minimal Template**: Progressive learning
```
Step 1: Learn frontend + backend basics (minimal template)
Step 2: Add database when needed (choose your own: Prisma, Drizzle, Mongoose)
Step 3: Add authentication when needed (choose your own: NextAuth, Clerk, Lucia)
Step 4: Add advanced features as needed
```

---

### Specific Rationale for Each Removed Feature

#### Database (Prisma + PostgreSQL)
**Why Removed**:
1. **Choice Paralysis**: Users might want:
   - PostgreSQL vs MySQL vs MongoDB vs SQLite
   - Prisma vs Drizzle vs Kysely vs Mongoose
   - Different schema designs

2. **Setup Friction**: Requires PostgreSQL installation and configuration

3. **Not Always Needed**: Many apps don't need persistence initially:
   - Static sites
   - API proxies
   - Serverless functions
   - Prototypes

**Extension Path**:
```bash
# When user needs database
npm install prisma @prisma/client
npx prisma init
# User follows their preferred database guide
```

---

#### Authentication (NextAuth.js)
**Why Removed**:
1. **Frequent Breaking Changes**: NextAuth.js v5 (Auth.js) is still evolving

2. **Configuration Complexity**: Requires OAuth app setup for each provider

3. **Many Alternatives**:
   - NextAuth.js (open source)
   - Clerk (commercial, excellent DX)
   - Auth0 (enterprise)
   - Supabase Auth (backend-as-a-service)
   - Lucia (lightweight)

4. **Not Always Needed**: Many apps don't need authentication:
   - Public blogs
   - Landing pages
   - Read-only APIs

**Extension Path**:
```bash
# When user needs authentication
npm install next-auth
# User follows their preferred auth guide
```

---

#### Redis Caching
**Why Removed**:
1. **Infrastructure Dependency**: Requires Redis server

2. **Premature Optimization**: Most apps don't need caching initially

3. **Many Alternatives**:
   - Redis (in-memory)
   - Node-cache (local memory)
   - Memcached (distributed)
   - CDN caching (Cloudflare, Vercel Edge)

**Extension Path**:
```bash
# When user needs caching
npm install redis ioredis
# User adds Redis to their stack
```

---

#### tRPC
**Why Removed**:
1. **Opinionated**: tRPC is great but requires specific patterns

2. **REST is Simpler**: For learning, REST is more universal

3. **Easy to Add Later**: Can add tRPC without conflicts

4. **Not Always Appropriate**:
   - Public APIs (REST is more standard)
   - Mobile apps (REST/GraphQL more common)

**Extension Path**:
```bash
# When user wants type-safe API
npm install @trpc/server @trpc/client
# User follows tRPC setup guide
```

---

#### RBAC (Role-Based Access Control)
**Why Removed**:
1. **Too Specific**: Different apps have different permission models:
   - RBAC (Role-Based)
   - ABAC (Attribute-Based)
   - Simple admin/user
   - Complex multi-tenant

2. **Depends on Authentication**: Can't have RBAC without auth

3. **Business Logic Dependent**: Permissions vary widely by use case

**Extension Path**:
```typescript
// User adds their own authorization logic
function requireRole(role: string) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

---

## Alternatives Considered

### Alternative 1: Full-Featured Template (As Proposed)
**Structure**:
```
antarose-template-nodejs/
├── frontend/ (Next.js + NextAuth.js + tRPC client)
├── backend/ (Express + Prisma + tRPC server)
├── packages/types/ (shared types)
├── packages/database/ (Prisma schema)
└── docker-compose.yml (PostgreSQL + Redis)
```

**Pros**:
- ✅ Batteries included
- ✅ Shows best practices
- ✅ Type sharing via monorepo
- ✅ Full auth example
- ✅ Database integration example

**Cons**:
- ❌ Complex setup (requires Docker or manual DB setup)
- ❌ Steep learning curve
- ❌ Harder to customize (must remove features)
- ❌ More maintenance burden
- ❌ Monorepo adds complexity
- ❌ Requires Prisma knowledge
- ❌ Requires tRPC knowledge
- ❌ Requires NextAuth.js knowledge

**Why Rejected**: **Too complex for a template**. This would be a "starter project" rather than a "template". Templates should be minimal foundations, not full applications.

---

### Alternative 2: Minimal + Optional Features
**Structure**:
```
antarose-template-nodejs/
├── frontend/ (minimal)
├── backend/ (minimal)
└── features/ (optional add-ons)
    ├── database/
    ├── authentication/
    ├── caching/
    └── trpc/
```

**Pros**:
- ✅ Flexible
- ✅ Users choose what they need
- ✅ Examples provided

**Cons**:
- ❌ Maintenance nightmare (must test all combinations)
- ❌ Documentation burden (how to integrate each feature)
- ❌ Still requires understanding all features

**Why Rejected**: **Too much maintenance**. We'd need to test:
- Minimal only
- Minimal + database
- Minimal + auth
- Minimal + database + auth
- ... (exponential combinations)

---

### Alternative 3: Separate Templates for Each Stack
**Example**:
- `antarose-template-nextjs-express` (minimal)
- `antarose-template-nextjs-express-prisma` (with DB)
- `antarose-template-nextjs-express-auth` (with auth)
- `antarose-template-nextjs-express-full` (everything)

**Pros**:
- ✅ Users choose exactly what they need
- ✅ Each template is focused

**Cons**:
- ❌ 4x maintenance burden
- ❌ Feature duplication across templates
- ❌ Documentation fragmentation

**Why Rejected**: **Unsustainable maintenance**. We'd need to maintain multiple templates in sync.

---

## Consequences

### Positive Consequences

1. **Instant Productivity**
   - Users can start coding immediately
   - No infrastructure setup required
   - No complex configuration

2. **Easy to Understand**
   - ~10 files in frontend
   - ~10 files in backend
   - Clear structure, no magic

3. **Flexible for Any Use Case**
   - Users add only what they need
   - No need to remove unwanted features
   - Works with any database, any auth system

4. **Low Maintenance**
   - Minimal dependencies to update
   - No complex migrations to maintain
   - No breaking changes from auth providers

5. **Great for Learning**
   - See how Next.js works
   - See how Express works
   - See how they communicate
   - No distractions from advanced features

### Negative Consequences

1. **No "Complete" Example**
   - **Impact**: Users don't see how database integration works
   - **Severity**: Medium
   - **Mitigation**: Provide extension guides in documentation

2. **Users Must Add Common Features**
   - **Impact**: Users must implement auth, database themselves
   - **Severity**: Low
   - **Mitigation**: This is actually a benefit (learn by doing)

3. **Not a "Production-Ready" Starter**
   - **Impact**: Can't use directly for production app
   - **Severity**: Low (not the goal)
   - **Mitigation**: Template is a foundation, not a complete app

---

## Extension Guide

Users can add features as needed:

### Adding Database (Prisma + PostgreSQL)
```bash
cd backend
npm install prisma @prisma/client
npx prisma init
# Follow Prisma setup guide
```

**Documentation**: `docs/guides/adding-database.md` (to be created)

---

### Adding Authentication (NextAuth.js)
```bash
cd frontend
npm install next-auth
# Follow NextAuth.js setup guide
```

**Documentation**: `docs/guides/adding-authentication.md` (to be created)

---

### Adding State Management (Zustand)
```bash
cd frontend
npm install zustand
```

**Documentation**: `docs/guides/adding-state-management.md` (to be created)

---

### Adding Redis Caching
```bash
cd backend
npm install redis ioredis
# Setup Redis connection
```

**Documentation**: `docs/guides/adding-caching.md` (to be created)

---

## Future Roadmap

### Phase 1: Minimal Foundation (Current - v3.0.0)
- ✅ Separate frontend and backend
- ✅ TypeScript everywhere
- ✅ Security basics (Helmet, CORS)
- ✅ Development tooling

### Phase 2: Extension Guides (v3.1.0)
- ⏳ Guide: Adding Prisma + PostgreSQL
- ⏳ Guide: Adding NextAuth.js
- ⏳ Guide: Adding Zustand/TanStack Query
- ⏳ Guide: Adding Redis
- ⏳ Guide: Adding tRPC

### Phase 3: Example Implementations (v3.2.0)
- ⏳ Example branch: `example/with-database`
- ⏳ Example branch: `example/with-auth`
- ⏳ Example branch: `example/full-stack`

**Approach**: Keep main branch minimal, provide examples in separate branches

---

## Review Criteria

**This decision should be reviewed if**:
1. 80%+ of users request database/auth out of the box
2. Competing templates with features gain more adoption
3. Setup complexity is reduced significantly (e.g., Prisma becomes zero-config)

**Next Review**: 6 months (2025-04-24) or after 100 GitHub stars

---

## Lessons Learned

1. **Simplicity > Features**: Users prefer simple templates they can extend
2. **Less is More**: Fewer files = easier to understand
3. **Flexibility > Convention**: Let users choose their stack
4. **Foundation > Framework**: Templates should be foundations, not frameworks

**Quote from Design Philosophy**:
> "A template should be a blank canvas, not a pre-painted picture. Give users the tools and let them create their masterpiece."

---

## References

- [Original Proposal](../specs/proposal.md)
- [Design Document](../specs/design.md)
- [Create React App Philosophy](https://create-react-app.dev/docs/getting-started) (simplicity-first)
- [Vite Philosophy](https://vitejs.dev/guide/why.html) (minimal by default)
- [T3 Stack](https://create.t3.gg/) (example of opinionated template - opposite approach)

---

**Status**: Accepted
**Last Updated**: 2025-10-24
**Author**: Leo (System Architect)
**Approved By**: CTO (Pending)
