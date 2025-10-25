import request from 'supertest'
import express, { Application } from 'express'
import healthRouter from '../routes/health'

interface HealthResponse {
  status: string
  timestamp: string
  uptime: number
  environment: string
  memory: {
    used: number
    total: number
    rss: number
  }
  pid: number
}

describe('Health Endpoint', () => {
  let app: Application

  beforeEach(() => {
    app = express()
    app.use('/health', healthRouter)
  })

  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health')
      expect(response.status).toBe(200)
    })

    it('should return JSON with status "ok"', async () => {
      const response = await request(app).get('/health')
      const body = response.body as HealthResponse
      expect(body.status).toBe('ok')
    })

    it('should include timestamp in ISO format', async () => {
      const response = await request(app).get('/health')
      const body = response.body as HealthResponse
      expect(body.timestamp).toBeDefined()
      expect(() => new Date(body.timestamp)).not.toThrow()
    })

    it('should include uptime as a number', async () => {
      const response = await request(app).get('/health')
      const body = response.body as HealthResponse
      expect(body.uptime).toBeDefined()
      expect(typeof body.uptime).toBe('number')
      expect(body.uptime).toBeGreaterThanOrEqual(0)
    })

    it('should include environment information', async () => {
      const response = await request(app).get('/health')
      const body = response.body as HealthResponse
      expect(body.environment).toBeDefined()
      expect(typeof body.environment).toBe('string')
    })

    it('should include memory usage information', async () => {
      const response = await request(app).get('/health')
      const body = response.body as HealthResponse
      expect(body.memory).toBeDefined()
      expect(body.memory.used).toBeDefined()
      expect(body.memory.total).toBeDefined()
      expect(body.memory.rss).toBeDefined()
      expect(typeof body.memory.used).toBe('number')
      expect(typeof body.memory.total).toBe('number')
      expect(typeof body.memory.rss).toBe('number')
    })

    it('should include process ID', async () => {
      const response = await request(app).get('/health')
      const body = response.body as HealthResponse
      expect(body.pid).toBeDefined()
      expect(typeof body.pid).toBe('number')
    })

    it('should have all required fields', async () => {
      const response = await request(app).get('/health')
      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('environment')
      expect(response.body).toHaveProperty('memory')
      expect(response.body).toHaveProperty('pid')
    })
  })
})
