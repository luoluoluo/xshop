import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const URL_KEY = "x-url";

export const AFFILIATE_ID_KEY = "affid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const runtime = typeof window === "undefined" ? "server" : "client";

// export const getChannel = (userAgent: string) => {
//   // const userAgent = window.navigator.userAgent;
//   if (/MicroMessenger/i.test(userAgent)) return "wechat";
//   return "";
// };

// export function debounce<T extends Function>(cb: T, wait = 200) {
//   let h: any = 0;
//   let callable = (...args: any) => {
//     clearTimeout(h);
//     h = setTimeout(() => cb(...args), wait);
//   };
//   return <T>(<any>callable);
// }
