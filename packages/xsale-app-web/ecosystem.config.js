const nextPortIndex = process.argv.indexOf("-p");
const port = nextPortIndex !== -1 ? process.argv[nextPortIndex + 1] : 3000;
module.exports = {
  apps: [
    {
      name: "xsale-app-web",
      script: "node_modules/next/dist/bin/next",
      max_memory_restart: "800M",
      args: `start -p ${port}`,
      out_file: "./logs/access.log", // 日志输出路径
      error_file: "./logs/error.log" // 报错日志输出路径
    }
  ]
};
