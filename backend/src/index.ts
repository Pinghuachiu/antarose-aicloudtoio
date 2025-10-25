import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import path from 'path'
import { logger } from './middlewares/logger'
import { errorHandler } from './middlewares/error-handler'
import healthRouter from './routes/health'
import versionRouter from './routes/version'
import helloRouter from './routes/hello'
import errorExampleRouter from './routes/error-example'

const app: Application = express()
const PORT = process.env.PORT || 4000

// Security Middlewares
app.use(helmet())

// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3004'],
    credentials: true,
  })
)

// Compression Middleware
app.use(compression())

// Body Parser Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger Middleware
app.use(logger)

// API Routes
app.use('/health', healthRouter)
app.use('/api', versionRouter)
app.use('/api', helloRouter)
app.use('/api', errorExampleRouter)

// 提供 Frontend 靜態檔案
const frontendBuildPath = path.join(__dirname, '../../frontend/.next')
const frontendPublicPath = path.join(__dirname, '../../frontend/public')

// 提供 public 目錄的靜態資源
app.use(express.static(frontendPublicPath))

// 提供 Next.js 靜態資源
app.use('/_next', express.static(path.join(frontendBuildPath, 'static')))

// Error Handler (必須在最後)
app.use(errorHandler)

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
