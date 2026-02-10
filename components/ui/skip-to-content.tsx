"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

/**
 * Scroll to top button
 * Only visible when user scrolls down past 300px
 * Smooth scroll to top on click
 */
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`border-accent-blue bg-bg-primary text-accent-blue shadow-hard hover:bg-accent-blue fixed right-4 bottom-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 hover:text-white focus:ring-0 focus:outline-none active:translate-y-0.5 active:shadow-none sm:right-6 sm:bottom-6 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}

export { ScrollToTop };
