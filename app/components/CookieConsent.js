"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
    // Initialize GA4 after consent
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowConsent(false);
    // Disable GA4 tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Бид таны вэб хөт��ийн cookie ашиглан үйлчилгээгээ сайжруулдаг.
          <a href="/privacy" className="text-blue-600 hover:underline ml-1">
            Нууцлалын бодлого
          </a>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Татгалзах
          </Button>
          <Button onClick={handleAccept} size="sm">
            Зөвшөөрөх
          </Button>
        </div>
      </div>
    </div>
  );
};
