# Backend API

Express + TypeScript API template for production-ready backend services.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Language**: TypeScript
- **Security**: Helmet
- **Cross-Origin**: CORS
- **Compression**: Compression middleware
- **Development**: ts-node-dev (hot reload)

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Application entry point
│   ├── middlewares/          # Custom middlewares
│   │   ├── logger.ts         # Request logging middleware
│   │   └── error-handler.ts  # Global error handler
│   └── routes/               # API route handlers
│       ├── health.ts         # Health check endpoint
│       ├── hello.ts          # Example API endpoint
│       └── error-example.ts  # Error handling examples
├── dist/                     # Compiled JavaScript (generated)
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

Server will run on `http://localhost:4000`

### Production Build

Build TypeScript to JavaScript:

```bash
npm run build
```

### Production Mode

Run the compiled application:

```bash
npm start
```

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-24T12:00:00.000Z"
}
```

### Hello World

```http
GET /api/hello
```

**Response:**
```json
{
  "message": "Hello from Express + TypeScript!",
  "timestamp": "2025-10-24T12:00:00.000Z"
}
```

### Error Handling Examples

```http
GET /api/error/sync      # Synchronous error example
GET /api/error/async     # Asynchronous error example
GET /api/error/custom    # Custom error with status code
```

**Error Response Format:**
```json
{
  "message": "Error description",
  "path": "/api/error/sync",
  "timestamp": "2025-10-24T12:00:00.000Z"
}
```

## Adding New API Endpoints

### Step 1: Create Route Handler

Create a new file in `src/routes/`:

```typescript
// src/routes/users.ts
import { Router, Request, Response } from 'express'

const router = Router()

router.get('/users', (req: Request, res: Response) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]
  })
})

export default router
```

### Step 2: Register Route in Main App

Add to `src/index.ts`:

```typescript
import usersRouter from './routes/users'

// ... existing code ...

app.use('/api', usersRouter)
```

### Step 3: Test Endpoint

```bash
curl http://localhost:4000/api/users
```

## Middleware System

### Built-in Middlewares

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Compression**: Response compression
- **Body Parser**: JSON and URL-encoded parsing

### Custom Middlewares

- **Logger**: Request/response logging
- **Error Handler**: Centralized error handling

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Security Features

- Helmet for HTTP security headers
- CORS configured for specific origins
- Request body size limits
- Error details sanitized in production

## Performance Optimizations

- Response compression enabled
- JSON parsing with size limits
- Efficient routing with Express 5

## Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Type Safety**: TypeScript catches errors at compile time
3. **Middleware Order**: Keep error handler last
4. **CORS Origins**: Update allowed origins in production
5. **Environment Variables**: Never commit `.env` file

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 4000
lsof -ti:4000

# Kill the process
kill -9 $(lsof -ti:4000)
```

### TypeScript Errors

```bash
# Clean build directory
rm -rf dist

# Rebuild
npm run build
```

### CORS Issues

- Ensure frontend origin is in CORS whitelist
- Check credentials setting matches frontend
- Verify preflight OPTIONS requests succeed

## Related Documentation

- [Express 5 Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Helmet Documentation](https://helmetjs.github.io/)
