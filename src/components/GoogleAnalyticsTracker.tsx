import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GoogleAnalyticsTracker() {
  const location = useLocation();

  // Track page views & engagement time
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: "page_view",
        page: location.pathname + location.search,
      });

      const sendEngagedEvent = (seconds: number) => {
        dataLayer.push({
          event: `engaged_${seconds}s`,
          page_path: window.location.pathname,
          page_title: document.title
        });
      };

      // Set engagement timers
      const t30 = setTimeout(() => sendEngagedEvent(30), 30000);
      const t60 = setTimeout(() => sendEngagedEvent(60), 60000);
      const t120 = setTimeout(() => sendEngagedEvent(120), 120000);

      // Clear timers when navigating to another page
      return () => {
        clearTimeout(t30);
        clearTimeout(t60);
        clearTimeout(t120);
      };
    }
  }, [location]);

  // Track clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Try to find the nearest interactive element for a more meaningful label
      const interactiveEl = target.closest('button, a, [role="button"], input[type="submit"]');
      const elToUse = interactiveEl || target;
      
      let label = 
        elToUse.getAttribute("aria-label") || 
        elToUse.getAttribute("title") || 
        (elToUse as HTMLElement).innerText || 
        (elToUse as HTMLAnchorElement).href;

      // Fallback for images
      if ((!label || label.trim() === '') && elToUse.tagName.toLowerCase() === 'img') {
        label = elToUse.getAttribute("alt");
      }

      // Default fallback
      if (!label || typeof label !== 'string' || label.trim() === '') {
        label = elToUse.tagName.toLowerCase();
      }

      // Clean up string (remove excessive whitespace, limit to 100 chars)
      const cleanLabel = label.replace(/\s+/g, ' ').trim().substring(0, 100);

      if (typeof window !== "undefined") {
        const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
        dataLayer.push({
          event: "click",
          clicked_label: cleanLabel || "unknown_click",
        });
      }
    };

    // Use capture phase to ensure we catch the click before any stopPropagation
    document.addEventListener("click", handleClick, true);
    
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
