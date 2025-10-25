import { Request, Response, NextFunction } from 'express'

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  // Log response after request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const logMessage = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`

    console.log(logMessage)
  })

  next()
}
