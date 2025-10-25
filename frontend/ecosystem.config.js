module.exports = {
  apps: [{
    name: 'ai-cloudto-io-dev',
    script: 'node_modules/.bin/next',
    args: 'start -p 3001',
    cwd: '/var/www/ai-cloudto-io-dev/frontend',
    env: { PORT: 3001 },
    instances: 1,
    autorestart: true,
    max_restarts: 5,
    min_uptime: '10s',
  }],
};
