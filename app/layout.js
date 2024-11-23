import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./components/Providers";
import { AuthProvider } from "./components/auth/AuthProvider";
import Header from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsent } from "./components/CookieConsent";
import { GoogleAnalytics } from "./components/GoogleAnalytics";

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
  title: "Монгол яриаг текст болгогч | Speech to Text",
  description:
    "Монгол хэл дээрх яриаг текст болгох үнэгүй онлайн програм. Дуу хураагуураар ярихад таны яриаг шууд текст болгоно.",
  keywords: [
    "speech to text монгол",
    "яриа текст болгох",
    "монгол хэл текст",
    "дуу бичлэг текст болгох",
    "үнэгүй орчуулга",
    "монгол яриа бичих",
    "speech recognition mongolia",
    "voice to text mongolian",
  ].join(", "),
  alternates: {
    canonical: "https://speeech.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              debug_mode: true,
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <link rel="icon" href="/cloud-favicon.ico" sizes="any" />
        <link rel="icon" href="../public/cloud-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/cloud-icon-180.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster />
            <SpeedInsights />
            <CookieConsent />
            <GoogleAnalytics />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
