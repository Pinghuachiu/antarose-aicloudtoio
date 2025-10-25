import request from 'supertest'
import express, { Application } from 'express'
import versionRouter from '../routes/version'

interface VersionResponse {
  app: string
  commit: string
  commitDate: string
  buildTime: string
  node: string
  environment: string
}

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
      const body = response.body as VersionResponse
      expect(body.app).toBeDefined()
      expect(typeof body.app).toBe('string')
    })

    it('should include git commit information', async () => {
      const response = await request(app).get('/api/version')
      const body = response.body as VersionResponse
      expect(body.commit).toBeDefined()
      expect(typeof body.commit).toBe('string')
    })

    it('should include commit date', async () => {
      const response = await request(app).get('/api/version')
      const body = response.body as VersionResponse
      expect(body.commitDate).toBeDefined()
      expect(typeof body.commitDate).toBe('string')
    })

    it('should include build time', async () => {
      const response = await request(app).get('/api/version')
      const body = response.body as VersionResponse
      expect(body.buildTime).toBeDefined()
      expect(typeof body.buildTime).toBe('string')
    })

    it('should include Node.js version', async () => {
      const response = await request(app).get('/api/version')
      const body = response.body as VersionResponse
      expect(body.node).toBeDefined()
      expect(typeof body.node).toBe('string')
      expect(body.node).toMatch(/^v\d+\.\d+\.\d+/)
    })

    it('should include environment information', async () => {
      const response = await request(app).get('/api/version')
      const body = response.body as VersionResponse
      expect(body.environment).toBeDefined()
      expect(typeof body.environment).toBe('string')
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
      const body = response.body as VersionResponse

      expect(body.app).toBe('2.0.0')
      expect(body.commit).toBe('abc1234')
      expect(body.buildTime).toBe('2025-10-25T12:00:00.000Z')

      // Cleanup
      delete process.env.APP_VERSION
      delete process.env.GIT_COMMIT
      delete process.env.BUILD_TIME
    })
  })
})
