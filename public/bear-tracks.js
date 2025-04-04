(function () {
  // Don't track if Do Not Track is enabled
  if (navigator.doNotTrack === "1") return;

  // Get the script URL to determine tracking endpoint
  const scriptSrc = document.currentScript.src;
  const origin = new URL(scriptSrc).origin;
  const ENDPOINT = `${origin}/api/track`;

  let sessionId = localStorage.getItem("bear_tracks_sid");

  async function track() {
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          pageUrl: window.location.pathname,
          referrer: document.referrer,
        }),
        mode: "cors",
      });

      const data = await response.json();

      if (data.sessionId && !sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem("bear_tracks_sid", sessionId);
      }
    } catch (error) {
      console.error("Bear Tracks error:", error);
    }
  }

  // Track initial page load
  track();

  // Track page navigations in SPAs
  let lastUrl = window.location.pathname;
  new MutationObserver(() => {
    const currentUrl = window.location.pathname;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      track();
    }
  }).observe(document.documentElement, { subtree: true, childList: true });
})();
