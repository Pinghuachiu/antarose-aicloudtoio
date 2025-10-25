import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', error)

  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? error.message : 'An unexpected error occurred',
    },
  })
}
