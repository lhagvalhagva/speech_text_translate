import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Speech to Text - Монгол яриаг текст болгогч",
  description:
    "Монгол хэл дээрх яриаг текст болгох үнэгүй онлайн програм. Дуу хураагуураар ярихад таны яриаг шууд текст болгоно.",
  keywords:
    "speech to text, монгол хэл, яриа текст болгох, дуу бичлэг, орчуулга, үнэгүй",
  openGraph: {
    title: "Speech to Text - Монгол яриаг текст болгогч",
    description: "Монгол хэл дээрх яриаг текст болгох үнэгүй онлайн програм",
    url: "https://speeech.vercel.app",
    siteName: "Speech to Text Монгол",
    images: [
      {
        url: "https://speeech.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "mn_MN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <meta
          name="google-site-verification"
          content="fSKVrmBMbTiPij6f5LbiW3GTaXVfT7Dz4vnfRzeQw8g"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        <link rel="icon" href="/cloud-favicon.ico" sizes="any" />
        <link rel="icon" href="../public/cloud-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/cloud-icon-180.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
