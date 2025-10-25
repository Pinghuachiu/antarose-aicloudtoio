import request from 'supertest'
import express, { Application, Request, Response } from 'express'
import { logger } from '../middlewares/logger'

describe('Logger Middleware', () => {
  let app: Application
  let consoleLogSpy: jest.SpyInstance

  beforeEach(() => {
    app = express()
    app.use(logger)
    app.get('/test', (_req: Request, res: Response) => {
      res.status(200).json({ message: 'test' })
    })

    // Spy on console.log to capture log output
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('should log request details', async () => {
    await request(app).get('/test')

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    const logMessage = consoleLogSpy.mock.calls[0][0]

    // Check that log message contains expected components
    expect(logMessage).toContain('GET /test')
    expect(logMessage).toContain('200')
    expect(logMessage).toContain('ms')
  })

  it('should include timestamp in ISO format', async () => {
    await request(app).get('/test')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    // Check for ISO timestamp format [YYYY-MM-DDTHH:mm:ss.sssZ]
    expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
  })

  it('should include client IP address', async () => {
    await request(app).get('/test')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('IP:')
  })

  it('should include User-Agent', async () => {
    await request(app).get('/test').set('User-Agent', 'TestAgent/1.0')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('UA: TestAgent/1.0')
  })

  it('should include Referrer', async () => {
    await request(app).get('/test').set('Referer', 'https://example.com')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('Ref: https://example.com')
  })

  it('should handle missing User-Agent', async () => {
    await request(app).get('/test')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('UA: unknown')
  })

  it('should handle missing Referrer', async () => {
    await request(app).get('/test')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('Ref: Direct')
  })

  it('should prefer Cloudflare IP header', async () => {
    await request(app).get('/test').set('cf-connecting-ip', '1.2.3.4')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('IP: 1.2.3.4')
  })

  it('should fallback to X-Forwarded-For when Cloudflare IP is missing', async () => {
    await request(app).get('/test').set('x-forwarded-for', '5.6.7.8, 9.10.11.12')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('IP: 5.6.7.8')
  })

  it('should include response time', async () => {
    await request(app).get('/test')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toMatch(/\d+ms/)
  })

  it('should log different status codes correctly', async () => {
    app.get('/error', (_req: Request, res: Response) => {
      res.status(500).json({ error: 'test error' })
    })

    await request(app).get('/error')

    const logMessage = consoleLogSpy.mock.calls[0][0]
    expect(logMessage).toContain('500')
  })
})
