module.exports = {
  apps: [
    {
      name: 'xshop-backend',
      script: 'dist/main.js',
      out_file: './logs/access.log', // 日志输出路径
      error_file: './logs/error.log', // 报错日志输出路径
    },
  ],
};
