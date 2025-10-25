import { Request, Response, NextFunction } from 'express'

/**
 * Enhanced logging middleware
 * Logs request details including method, URL, status code, response time,
 * User-Agent, Referrer, and client IP (Cloudflare-aware)
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  // Log response after request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const timestamp = new Date().toISOString()

    // Extract client IP (Cloudflare-aware)
    const xForwardedFor = req.headers['x-forwarded-for']
    const cloudflareIP = req.headers['cf-connecting-ip']

    let clientIP = 'unknown'
    if (typeof cloudflareIP === 'string') {
      clientIP = cloudflareIP
    } else if (typeof xForwardedFor === 'string') {
      const firstIP = xForwardedFor.split(',')[0]
      clientIP = firstIP?.trim() || 'unknown'
    } else if (req.socket.remoteAddress) {
      clientIP = req.socket.remoteAddress
    }

    // Extract User-Agent and Referrer
    const userAgent = (req.headers['user-agent'] as string) || 'unknown'
    const refererHeader = req.headers['referer'] || req.headers['referrer']
    const referrer = typeof refererHeader === 'string' ? refererHeader : (Array.isArray(refererHeader) && refererHeader[0] ? refererHeader[0] : 'Direct')

    // Construct log message with all details
    const logMessage = [
      `[${timestamp}]`,
      `${req.method} ${req.url}`,
      `${res.statusCode}`,
      `${duration}ms`,
      `IP: ${clientIP}`,
      `UA: ${userAgent}`,
      `Ref: ${referrer}`,
    ].join(' | ')

    console.log(logMessage)
  })

  next()
}
