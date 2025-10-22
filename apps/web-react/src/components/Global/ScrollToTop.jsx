import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls window to top on every pathname change
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use 'auto' for an immediate jump; change to 'smooth' if you prefer
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
