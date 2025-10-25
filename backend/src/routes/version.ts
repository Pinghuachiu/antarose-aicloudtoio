import { Router, Response } from 'express'
import { execSync } from 'child_process'

const router = Router()

/**
 * Get Git commit hash
 * @returns Git commit short hash or 'unknown'
 */
function getGitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

/**
 * Get Git commit date
 * @returns Git commit date in ISO format or current date
 */
function getGitCommitDate(): string {
  try {
    return execSync('git log -1 --format=%cI').toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

/**
 * GET /api/version
 * Returns version information including app version, git commit, build time, and environment
 */
router.get('/version', (_req, res: Response) => {
  const version = {
    app: process.env.APP_VERSION || '1.0.0',
    commit: process.env.GIT_COMMIT || getGitCommit(),
    commitDate: process.env.GIT_COMMIT_DATE || getGitCommitDate(),
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
  }

  res.status(200).json(version)
})

export default router
