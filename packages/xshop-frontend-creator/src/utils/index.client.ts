export const getChannel = () => {
  const userAgent = window.navigator.userAgent;
  if (/MicroMessenger/i.test(userAgent)) return "wechat";
  return "";
};