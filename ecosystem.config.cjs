module.exports = {
  apps: [
    {
      name: 'jiankangpinzhiyanhuo',
      script: 'server/app.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: Number(process.env.PORT || 4007),
        DATA_DIR: './data',
        BACKUP_DIR: './backups',
        DINGTALK_WEBHOOK: process.env.DINGTALK_WEBHOOK || '',
        DINGTALK_SECRET: process.env.DINGTALK_SECRET || '',
        ADMIN_NAME: process.env.ADMIN_NAME || '孙立柱',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
        SECOND_ADMIN_NAME: process.env.SECOND_ADMIN_NAME || '胡远刚',
        SECOND_ADMIN_PASSWORD: process.env.SECOND_ADMIN_PASSWORD || ''
      },
      max_memory_restart: '512M'
    }
  ]
};
