import { Router, Request, Response, NextFunction } from 'express'

const router = Router()

router.get('/error', (req: Request, res: Response, next: NextFunction) => {
  // 故意拋出錯誤，測試 error handler
  next(new Error('This is a test error'))
})

export default router
