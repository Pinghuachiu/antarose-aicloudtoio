/**
 * PM2 配置檔案 - ai.cloudto.io
 *
 * 用途：管理開發和生產環境的 Node.js 應用程式
 *
 * 環境配置：
 * - Development: dev-ai.cloudto.io (port 3001)
 * - Production: ai.cloudto.io (port 3000)
 *
 * 使用方式：
 * - 啟動開發環境: pm2 start ecosystem.config.js --only ai-cloudto-io-dev
 * - 啟動生產環境: pm2 start ecosystem.config.js --only ai-cloudto-io-prd
 * - 啟動所有環境: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    // ========================================
    // Development Environment
    // ========================================
    {
      name: 'ai-cloudto-io-dev',
      script: 'backend/server.js',
      cwd: '/var/www/ai-cloudto-io-dev',

      // Environment Variables
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },

      // Instance Configuration
      instances: 1,
      exec_mode: 'fork',

      // Auto Restart
      autorestart: true,
      watch: false, // 不使用 watch 以避免不必要的重啟

      // Memory Limit
      max_memory_restart: '500M',

      // Logging
      error_file: 'logs/dev-error.log',
      out_file: 'logs/dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Graceful Shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Restart Delay
      restart_delay: 4000,
    },

    // ========================================
    // Production Environment
    // ========================================
    {
      name: 'ai-cloudto-io-prd',
      script: 'backend/server.js',
      cwd: '/var/www/ai-cloudto-io-prd',

      // Environment Variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Cluster Mode - 充分利用 2 核心 VPS
      instances: 2,
      exec_mode: 'cluster',

      // Auto Restart
      autorestart: true,
      watch: false,

      // Memory Limit
      max_memory_restart: '1G',

      // Logging
      error_file: 'logs/prd-error.log',
      out_file: 'logs/prd-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Graceful Shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Restart Delay
      restart_delay: 4000,

      // Production-specific settings
      merge_logs: true, // 合併多個 instance 的日誌

      // Exponential Backoff Restart Delay
      exp_backoff_restart_delay: 100, // 啟用指數退避重啟
    },
  ],
};
