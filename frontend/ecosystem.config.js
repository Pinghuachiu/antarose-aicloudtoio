module.exports = {
  apps: [
    {
      name: 'backend-dev',
      script: 'dist/index.js',
      cwd: '/var/www/ai-cloudto-io-dev/backend',
      env: { NODE_ENV: 'development', PORT: 3001 },
      instances: 1,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
    },
    {
      name: 'frontend-dev',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      cwd: '/var/www/ai-cloudto-io-dev/frontend',
      env: { NODE_ENV: 'production', PORT: 3002 },
      instances: 1,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
    },
  ],
};
