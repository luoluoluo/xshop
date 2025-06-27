import i18n from "i18next";
import { initReactI18next } from "react-i18next"; // https://react.i18next.com/latest/using-with-hooks
import Backend from "i18next-http-backend"; // For lazy loading for translations: https://github.com/i18next/i18next-http-backend
import detector from "i18next-browser-languagedetector"; // For auto detecting the user language: https://github.com/i18next/i18next-browser-languageDetector

export const languages = [
  { value: "zh-CN", label: "简体中文" },
  // { key: "zh", label: "简体中文" },
];

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    // debug: true,
    lng: "zh-CN",
    supportedLngs: languages.map((lng) => lng.value),
    backend: {
      loadPath: "/app-cms/locales/{{lng}}.json", // locale files path
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
