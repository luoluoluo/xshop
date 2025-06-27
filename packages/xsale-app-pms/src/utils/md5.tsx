// npm install --save-dev @types/crypto-js
import * as CryptoJS from "crypto-js";

export function calculateFileMD5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      if (content instanceof ArrayBuffer) {
        const wordArray = CryptoJS.lib.WordArray.create(content);
        const hash = CryptoJS.MD5(wordArray);
        resolve(hash.toString(CryptoJS.enc.Hex));
      } else {
        reject(new Error("Failed to read file content"));
      }
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => reject(error);

    reader.readAsArrayBuffer(file);
  });
}
