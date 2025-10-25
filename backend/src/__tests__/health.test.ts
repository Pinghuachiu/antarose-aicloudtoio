import request from 'supertest'
import express, { Application } from 'express'
import healthRouter from '../routes/health'

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
      expect(response.body.status).toBe('ok')
    })

    it('should include timestamp in ISO format', async () => {
      const response = await request(app).get('/health')
      expect(response.body.timestamp).toBeDefined()
      expect(() => new Date(response.body.timestamp)).not.toThrow()
    })

    it('should include uptime as a number', async () => {
      const response = await request(app).get('/health')
      expect(response.body.uptime).toBeDefined()
      expect(typeof response.body.uptime).toBe('number')
      expect(response.body.uptime).toBeGreaterThanOrEqual(0)
    })

    it('should include environment information', async () => {
      const response = await request(app).get('/health')
      expect(response.body.environment).toBeDefined()
      expect(typeof response.body.environment).toBe('string')
    })

    it('should include memory usage information', async () => {
      const response = await request(app).get('/health')
      expect(response.body.memory).toBeDefined()
      expect(response.body.memory.used).toBeDefined()
      expect(response.body.memory.total).toBeDefined()
      expect(response.body.memory.rss).toBeDefined()
      expect(typeof response.body.memory.used).toBe('number')
      expect(typeof response.body.memory.total).toBe('number')
      expect(typeof response.body.memory.rss).toBe('number')
    })

    it('should include process ID', async () => {
      const response = await request(app).get('/health')
      expect(response.body.pid).toBeDefined()
      expect(typeof response.body.pid).toBe('number')
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
