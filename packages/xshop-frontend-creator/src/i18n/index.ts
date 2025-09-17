import i18n from "i18next";
import { initReactI18next } from "react-i18next"; // https://react.i18next.com/latest/using-with-hooks
import Backend from "i18next-http-backend"; // For lazy loading for translations: https://github.com/i18next/i18next-http-backend
import detector from "i18next-browser-languagedetector"; // For auto detecting the user language: https://github.com/i18next/i18next-browser-languageDetector
import { BASE_PATH } from "../config/constant";

// 全局类型声明
declare const BUILD_TIME: string;

export const languages = [
  { value: "zh-CN", label: "简体中文" },
  // { key: "zh", label: "简体中文" },
];

// 添加构建时间戳，防止CDN缓存
const buildTime = BUILD_TIME || Date.now();

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    // debug: true,
    lng: "zh-CN",
    supportedLngs: languages.map((lng) => lng.value),
    backend: {
      loadPath: `${BASE_PATH}/locales/{{lng}}.json?t=${buildTime}`, // locale files path with buildtime
    },
    // ns: ["common"],
    // defaultNS: "common",
    fallbackLng: "zh-CN",
    // 检测插件配置
    detection: {
      order: ["queryString", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["cookie"],
    },
  })
  .catch((e) => {
    console.log(e, "i18n init");
  });

export default i18n;
