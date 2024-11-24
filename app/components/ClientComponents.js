"use client";

import { Suspense, lazy } from "react";

// Lazy load components
const CookieConsent = lazy(() =>
  import("./CookieConsent").then((mod) => ({ default: mod.default }))
);

const GoogleAnalytics = lazy(() =>
  import("./GoogleAnalytics").then((mod) => ({ default: mod.default }))
);

export default function ClientComponents() {
  return (
    <Suspense fallback={null}>
      <CookieConsent />
      <GoogleAnalytics />
    </Suspense>
  );
}
