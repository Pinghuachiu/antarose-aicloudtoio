import request from 'supertest'
import express, { Application } from 'express'
import versionRouter from '../routes/version'

describe('Version Endpoint', () => {
  let app: Application

  beforeEach(() => {
    app = express()
    app.use('/api', versionRouter)
  })

  describe('GET /api/version', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/version')
      expect(response.status).toBe(200)
    })

    it('should return JSON with app version', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body.app).toBeDefined()
      expect(typeof response.body.app).toBe('string')
    })

    it('should include git commit information', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body.commit).toBeDefined()
      expect(typeof response.body.commit).toBe('string')
    })

    it('should include commit date', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body.commitDate).toBeDefined()
      expect(typeof response.body.commitDate).toBe('string')
    })

    it('should include build time', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body.buildTime).toBeDefined()
      expect(typeof response.body.buildTime).toBe('string')
    })

    it('should include Node.js version', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body.node).toBeDefined()
      expect(typeof response.body.node).toBe('string')
      expect(response.body.node).toMatch(/^v\d+\.\d+\.\d+/)
    })

    it('should include environment information', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body.environment).toBeDefined()
      expect(typeof response.body.environment).toBe('string')
    })

    it('should have all required fields', async () => {
      const response = await request(app).get('/api/version')
      expect(response.body).toHaveProperty('app')
      expect(response.body).toHaveProperty('commit')
      expect(response.body).toHaveProperty('commitDate')
      expect(response.body).toHaveProperty('buildTime')
      expect(response.body).toHaveProperty('node')
      expect(response.body).toHaveProperty('environment')
    })

    it('should use environment variables when available', async () => {
      process.env.APP_VERSION = '2.0.0'
      process.env.GIT_COMMIT = 'abc1234'
      process.env.BUILD_TIME = '2025-10-25T12:00:00.000Z'

      const response = await request(app).get('/api/version')

      expect(response.body.app).toBe('2.0.0')
      expect(response.body.commit).toBe('abc1234')
      expect(response.body.buildTime).toBe('2025-10-25T12:00:00.000Z')

      // Cleanup
      delete process.env.APP_VERSION
      delete process.env.GIT_COMMIT
      delete process.env.BUILD_TIME
    })
  })
})
