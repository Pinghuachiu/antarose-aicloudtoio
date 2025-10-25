import { Router, Request, Response } from 'express'

const router = Router()

router.get('/hello', (_req: Request, res: Response) => {
  res.json({
    message: 'Hello from Express!',
    version: '1.0.0',
  })
})

export default router
