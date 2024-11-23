export const initGA = () => {
  if (typeof window === "undefined") return;

  const consent = localStorage.getItem("cookie-consent");

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    cookie_flags: "SameSite=None;Secure",
    consent_mode: "advanced",
    analytics_storage: consent === "accepted" ? "granted" : "denied",
  });
};
