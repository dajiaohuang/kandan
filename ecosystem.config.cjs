module.exports = {
  apps: [
    {
      name: 'kandan-backend',
      script: 'npx',
      args: 'tsx src/index.ts',
      cwd: __dirname + '/server',
      env: {
        NODE_ENV: 'development',
        PORT: 3200,
      },
      watch: ['src'],
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'data'],
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
