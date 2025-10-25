import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import { logger } from './middlewares/logger'
import { errorHandler } from './middlewares/error-handler'
import healthRouter from './routes/health'
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

// Routes
app.use('/health', healthRouter)
app.use('/api', helloRouter)
app.use('/api', errorExampleRouter)

// Error Handler (必須在最後)
app.use(errorHandler)

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
