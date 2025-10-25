# Technology Stack Document

**Project**: antarose-template-nodejs (Minimal v3.0.0)
**Version**: 3.0.0
**Date**: 2025-10-24
**Author**: Leo (System Architect)
**Status**: Production Ready

---

## 1. Overview

This document provides a comprehensive overview of the technology stack used in `antarose-template-nodejs`. Each technology choice is documented with version, rationale, and usage guidelines.

---

## 2. Frontend Technology Stack

### 2.1 Core Framework

#### Next.js 15.1.6
**Category**: React Framework
**License**: MIT
**Website**: https://nextjs.org

**Why Next.js 15?**
- Latest stable release with App Router architecture
- Built-in TypeScript support
- Multiple rendering strategies (SSG, SSR, ISR, CSR)
- Zero-config setup
- Excellent developer experience
- Production-ready optimizations

**Key Features Used**:
- App Router (file-based routing)
- Server Components (default)
- Client Components (`'use client'`)
- Static Site Generation (default behavior)
- Automatic code splitting
- Built-in image optimization (Image component available but not yet used)

**Configuration**:
```javascript
// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Default configuration - minimal customization
}
export default nextConfig
```

**Alternatives Considered**:
- Remix: Excellent but younger ecosystem
- SvelteKit: Great performance but smaller community
- Nuxt.js: Vue-based (we chose React ecosystem)

---

#### React 19.0.0
**Category**: UI Library
**License**: MIT
**Website**: https://react.dev

**Why React 19?**
- Latest stable release
- Server Components support
- Improved performance
- Industry standard with largest ecosystem
- Excellent TypeScript support
- Massive community and resources

**Key Features Used**:
- Function Components
- Hooks (useState, useEffect, etc.)
- Server Components (default in Next.js 15)
- Error Boundaries (app/error.tsx)

**Usage Patterns**:
```typescript
// Server Component (default)
export default function HomePage() {
  return <div>Server Component</div>
}

// Client Component (interactive)
'use client'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Alternatives Considered**:
- Vue 3: Great but different paradigm
- Svelte: Excellent performance but smaller ecosystem
- Angular: Too heavy for this template

---

### 2.2 Styling & UI

#### Tailwind CSS 3.4.1
**Category**: CSS Framework
**License**: MIT
**Website**: https://tailwindcss.com

**Why Tailwind CSS?**
- Utility-first approach enables rapid development
- Minimal bundle size (only used classes are included)
- Excellent design consistency
- No CSS naming conflicts
- Built-in responsive design utilities
- Dark mode support (configurable)
- Perfect integration with shadcn/ui

**Configuration**:
```typescript
// frontend/tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // shadcn/ui color system
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... (full shadcn/ui color palette)
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

**Plugins Used**:
- `tailwindcss-animate`: Provides animation utilities for shadcn/ui

**Alternatives Considered**:
- CSS Modules: Good but requires more boilerplate
- Styled Components: Runtime overhead
- Vanilla CSS: Too manual and error-prone

---

#### shadcn/ui (Latest)
**Category**: Component Library
**License**: MIT
**Website**: https://ui.shadcn.com

**Why shadcn/ui?**
- **Not a dependency**: Components are copied to your codebase
- Full control over component code
- Built on Radix UI (accessibility primitives)
- Styled with Tailwind CSS
- TypeScript-first
- Highly customizable
- No runtime cost

**Components Installed**:
- Button (`components/ui/button.tsx`)
- Card (`components/ui/card.tsx`)

**Installation Process**:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

**Usage Example**:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

**Alternatives Considered**:
- Material UI: Too heavy and opinionated
- Chakra UI: Good but adds runtime dependency
- Ant Design: Not Tailwind-based
- Radix UI alone: Too low-level, shadcn/ui provides styled components

---

#### Lucide React 0.546.0
**Category**: Icon Library
**License**: ISC
**Website**: https://lucide.dev

**Why Lucide React?**
- **Default for shadcn/ui**: Seamless integration
- Modern, consistent design
- Tree-shakable (only imported icons are bundled)
- Actively maintained
- 1000+ icons
- Excellent TypeScript support

**Usage Example**:
```typescript
import { Home, User, Settings, ChevronRight } from 'lucide-react'

export default function Icons() {
  return (
    <>
      <Home className="h-5 w-5" />
      <User className="h-5 w-5 text-blue-500" />
      <Settings className="h-6 w-6" />
      <ChevronRight className="h-4 w-4" />
    </>
  )
}
```

**Size Guidelines**:
- Small: `h-4 w-4` (16px)
- Medium: `h-5 w-5` (20px)
- Large: `h-6 w-6` (24px)

**Alternatives Considered**:
- Heroicons: Good but more limited selection
- React Icons: Too many styles, larger bundle
- Font Awesome: Not tree-shakable, heavier

---

### 2.3 Type Safety

#### TypeScript 5.x
**Category**: Programming Language
**License**: Apache 2.0
**Website**: https://www.typescriptlang.org

**Why TypeScript?**
- Compile-time type checking
- Better IDE support (autocomplete, refactoring)
- Reduces runtime errors
- Excellent Next.js integration
- Industry standard for modern React development

**Configuration**:
```json
// frontend/tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Key Settings**:
- `strict: true`: Enable all strict type checking
- `paths: {"@/*": ["./*"]}`: Absolute imports
- `jsx: preserve`: Let Next.js handle JSX transformation

---

### 2.4 Developer Tools

#### ESLint (Next.js Config)
**Category**: Linter
**License**: MIT
**Website**: https://eslint.org

**Configuration**:
```javascript
// frontend/eslint.config.mjs
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
]

export default eslintConfig
```

**Usage**:
```bash
npm run lint
```

---

#### Prettier 3.6.2
**Category**: Code Formatter
**License**: MIT
**Website**: https://prettier.io

**Why Prettier?**
- Automatic code formatting
- Consistent code style across team
- No more style debates
- Excellent editor integration

**Configuration**:
```json
// frontend/.prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80
}
```

**Usage**:
```bash
npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"
```

---

## 3. Backend Technology Stack

### 3.1 Core Framework

#### Node.js 20 LTS
**Category**: JavaScript Runtime
**License**: MIT
**Website**: https://nodejs.org

**Why Node.js 20 LTS?**
- Long-term support (until 2026-04-30)
- Stable and production-ready
- Excellent performance
- Native ESM support
- Large ecosystem (npm)
- Industry standard for JavaScript backends

**Features Used**:
- Native ES modules (when using `"type": "module"`)
- Built-in fetch API
- Async/await
- Modern JavaScript (ES2023)

**Minimum Version**: 18.x (recommended: 20.x LTS)

---

#### Express 5.1.0
**Category**: Web Framework
**License**: MIT
**Website**: https://expressjs.com

**Why Express 5?**
- Most popular Node.js web framework
- Simple and flexible
- Extensive middleware ecosystem
- Great documentation
- Production-proven
- Express 5 has better async error handling

**Key Features Used**:
- Routing (`app.get`, `app.post`, etc.)
- Middleware chain
- Error handling
- Request/Response objects
- Static file serving (if needed)

**Middleware Stack**:
```typescript
app.use(helmet())           // Security headers
app.use(cors())             // CORS
app.use(compression())      // Response compression
app.use(express.json())     // JSON body parser
app.use(loggerMiddleware)   // Request logging
app.use('/health', healthRouter)
app.use('/api/hello', helloRouter)
app.use(errorHandler)       // Error handler (last)
```

**Alternatives Considered**:
- Fastify: Faster but smaller ecosystem
- Hapi: More opinionated, less flexible
- Koa: Requires more setup for common tasks
- NestJS: Too heavy for minimal template

---

### 3.2 Security & Middleware

#### Helmet 8.1.0
**Category**: Security Middleware
**License**: MIT
**Website**: https://helmetjs.github.io

**Why Helmet?**
- Sets secure HTTP headers
- Protects against common vulnerabilities
- Easy to configure
- Industry standard for Express security

**Headers Set by Helmet**:
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)

**Usage**:
```typescript
import helmet from 'helmet'
app.use(helmet())
```

---

#### CORS 2.8.5
**Category**: Cross-Origin Resource Sharing Middleware
**License**: MIT
**Website**: https://github.com/expressjs/cors

**Why CORS?**
- Required for frontend-backend communication
- Configurable origin whitelist
- Supports credentials (cookies)
- Simple API

**Configuration**:
```typescript
import cors from 'cors'

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
app.use(cors({
  origin: corsOrigin,
  credentials: true
}))
```

**Production Setup**:
```bash
CORS_ORIGIN=https://yourdomain.com
```

---

#### Compression 1.8.1
**Category**: Response Compression Middleware
**License**: MIT
**Website**: https://github.com/expressjs/compression

**Why Compression?**
- Reduces response size (typically 70-90% reduction)
- Faster response times
- Lower bandwidth costs
- Zero-config (works out of the box)

**Usage**:
```typescript
import compression from 'compression'
app.use(compression())
```

**Compression Algorithm**: gzip (brotli on Node.js 11.7.0+)

---

### 3.3 Type Safety

#### TypeScript 5.9.3
**Category**: Programming Language
**License**: Apache 2.0
**Website**: https://www.typescriptlang.org

**Configuration**:
```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Settings**:
- `strict: true`: Enable all strict type checking
- `module: commonjs`: CommonJS output for Node.js
- `target: ES2022`: Modern JavaScript features

**Type Definitions Used**:
- `@types/node`: Node.js types
- `@types/express`: Express types
- `@types/cors`: CORS types
- `@types/compression`: Compression types

---

### 3.4 Developer Tools

#### ts-node-dev 2.0.0
**Category**: Development Server
**License**: MIT
**Website**: https://github.com/wclr/ts-node-dev

**Why ts-node-dev?**
- Hot reload on file changes
- Faster than nodemon + ts-node
- No need to compile TypeScript manually in development
- Excellent for rapid development

**Usage**:
```bash
npm run dev
# Runs: ts-node-dev --respawn src/index.ts
```

**Alternatives Considered**:
- nodemon + ts-node: Slower restart
- tsx: Newer but less mature
- swc-node: Very fast but experimental

---

#### ESLint 9.38.0
**Category**: Linter
**License**: MIT
**Website**: https://eslint.org

**Configuration**:
```javascript
// backend/eslint.config.mjs
import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
```

**Rules Enabled**:
- JavaScript recommended rules
- TypeScript recommended rules
- Node.js globals

**Usage**:
```bash
npm run lint
```

---

#### Prettier 3.6.2
**Category**: Code Formatter
**License**: MIT
**Website**: https://prettier.io

**Configuration**:
```json
// backend/.prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80
}
```

**Usage**:
```bash
npm run format
# Runs: prettier --write "src/**/*.ts"
```

---

## 4. Development Tools

### 4.1 Package Manager

**npm** (default with Node.js)
- Version: 10.x (comes with Node.js 20)
- No additional installation required
- Standard choice for simplicity

**Alternatives Considered**:
- pnpm: Faster and more efficient but requires installation
- yarn: Good but adds complexity for minimal template

---

## 5. Technology Versioning Strategy

### 5.1 Version Pinning

**Frontend Dependencies**:
```json
{
  "dependencies": {
    "next": "^15.1.6",          // Allow minor updates
    "react": "^19.0.0",          // Allow minor updates
    "tailwindcss": "^3.4.1"      // Allow minor updates
  }
}
```

**Backend Dependencies**:
```json
{
  "dependencies": {
    "express": "^5.1.0",         // Allow minor updates
    "helmet": "^8.1.0",          // Allow minor updates
    "cors": "^2.8.5"             // Allow patch updates
  }
}
```

**Version Range Strategy**:
- `^`: Allow minor and patch updates (e.g., `^1.2.3` → `1.x.x`)
- Rationale: Balance between stability and security updates

### 5.2 Update Schedule

**Recommended Update Frequency**:
- **Security patches**: Immediately
- **Minor versions**: Monthly review
- **Major versions**: Quarterly review (with testing)

**Update Process**:
```bash
# Check for outdated packages
npm outdated

# Update patch and minor versions
npm update

# Update major versions (manually review breaking changes)
npm install package@latest
```

---

## 6. Future Technology Considerations

### 6.1 Planned Additions

**Database Layer**:
- Prisma ORM (recommended): Type-safe database access
- PostgreSQL 16: Relational database
- Redis 7: Caching and sessions

**Authentication**:
- NextAuth.js v5 (Auth.js): Authentication for Next.js
- bcryptjs: Password hashing
- jsonwebtoken: JWT tokens

**State Management**:
- Zustand: Lightweight client state
- TanStack Query v5: Server state management

**Testing**:
- Vitest: Unit testing
- Playwright: E2E testing
- React Testing Library: Component testing

**Monitoring**:
- Sentry: Error tracking
- Pino: Structured logging
- Prometheus: Metrics

---

## 7. Deprecated Technologies

**None** - This is a new template

**Technologies Explicitly Avoided**:
- jQuery: Outdated, React replaces its use case
- Bootstrap: Tailwind CSS is more flexible
- Monorepo tools (Turborepo, Nx): Adds complexity for minimal template
- Class-based React components: Function components are modern standard
- JavaScript (without TypeScript): TypeScript provides better DX

---

## 8. Technology Decision Matrix

| Category | Choice | Alternatives Considered | Decision Rationale |
|----------|--------|-------------------------|-------------------|
| Frontend Framework | Next.js 15 | Remix, SvelteKit, Nuxt | Industry standard, best DX, App Router |
| UI Library | React 19 | Vue, Svelte, Angular | Largest ecosystem, Server Components |
| Styling | Tailwind CSS | CSS Modules, Styled Components | Rapid development, minimal bundle size |
| Component Library | shadcn/ui | Material UI, Chakra UI | Copy-paste components, full control |
| Icons | Lucide React | Heroicons, React Icons | shadcn/ui default, tree-shakable |
| Backend Framework | Express 5 | Fastify, Hapi, NestJS | Simple, flexible, proven |
| Security | Helmet | Manual headers | Industry standard, comprehensive |
| CORS | cors package | Manual CORS | Simple API, battle-tested |
| Compression | compression | Manual gzip | Zero-config, automatic |
| Dev Server | ts-node-dev | nodemon+ts-node, tsx | Fast restarts, good DX |
| Linting | ESLint | TSLint (deprecated) | Industry standard |
| Formatting | Prettier | Manual | Consistent style, zero config |

---

## 9. License Summary

All technologies used are **MIT or compatible open-source licenses**:

- Next.js: MIT
- React: MIT
- Tailwind CSS: MIT
- shadcn/ui: MIT
- Lucide React: ISC
- Express: MIT
- Helmet: MIT
- CORS: MIT
- Compression: MIT
- TypeScript: Apache 2.0
- Node.js: MIT

**No proprietary or restrictive licenses used.**

---

## 10. Conclusion

The technology stack is carefully chosen to provide:

1. **Modern**: Latest stable versions of all technologies
2. **Minimal**: Only essential dependencies
3. **Type-Safe**: TypeScript everywhere
4. **Production-Ready**: Security, compression, error handling built-in
5. **Extensible**: Easy to add more features when needed
6. **Well-Documented**: All major technologies have excellent documentation

This stack balances **simplicity** with **production readiness**, making it ideal for rapid development without sacrificing quality.

---

**Document Version**: 3.0.0
**Last Updated**: 2025-10-24
**Author**: Leo (System Architect)
**Reviewed By**: CTO (Pending)
