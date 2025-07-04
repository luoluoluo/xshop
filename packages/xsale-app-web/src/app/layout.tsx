import { ConfirmProvider } from "@/components/confirm";
import { Toaster } from "@/components/ui/toaster";
import { setting } from "@/config/config";
import { cn } from "@/utils";
import { Inter } from "next/font/google";
import { Analytics } from "./analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateMetadata() {
  return {
    title: setting.title,
    keywords: setting.keywords,
    description: setting.description,
    openGraph: {
      title: setting.title,
      description: setting.description,
      images: [{ url: "/images/logo.png", width: 960, height: 960 }],
    },
  };
}

export function generateViewport() {
  return {
    maximumScale: 1.0,
    userScalable: "no",
  };
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          sizes="32x32"
          rel="icon"
          type="image/x-icon"
          href="/images/logo.png"
        />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta> */}
        {/* <script src="/scripts/baidu.js" /> */}
        <Analytics />
      </head>
      <body className={cn(inter.className)}>
        <ConfirmProvider>{children}</ConfirmProvider>
        <Toaster />
      </body>
    </html>
  );
}
