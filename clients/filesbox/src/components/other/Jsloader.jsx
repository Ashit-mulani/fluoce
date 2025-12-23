"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  speed: 400,
});

export const Jsloader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigationStart = useRef(null);
  const progressStarted = useRef(false);
  const slowNavTimer = useRef(null);

  useEffect(() => {
    if (progressStarted.current) {
      NProgress.done();
      progressStarted.current = false;
    }

    navigationStart.current = null;

    if (slowNavTimer.current) {
      clearTimeout(slowNavTimer.current);
      slowNavTimer.current = null;
    }
  }, [pathname, searchParams]);

  const startProgress = () => {
    if (!progressStarted.current) {
      progressStarted.current = true;
      NProgress.start();
    }
  };

  const isNextJsResource = (entry) => {
    return (
      entry.initiatorType === "script" ||
      entry.name.includes("/_next/static/chunks/") ||
      entry.name.includes("/_next/static/")
    );
  };

  const isNetworkLoad = (entry) => entry.transferSize > 0;

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      if (!navigationStart.current) return;

      for (const entry of list.getEntries()) {
        if (entry.startTime < navigationStart.current) continue;
        if (!isNextJsResource(entry)) continue;

        if (isNetworkLoad(entry)) {
          startProgress();
        }
      }
    });

    try {
      observer.observe({ type: "resource", buffered: true });
    } catch {}

    const beginNavigation = () => {
      navigationStart.current = performance.now();
      progressStarted.current = false;

      slowNavTimer.current = setTimeout(() => {
        if (!progressStarted.current) startProgress();
      }, 500);
    };

    const handleClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");

      if (link.hasAttribute("download")) return;

      if (link.target === "_blank") return;

      if (
        href?.startsWith("mailto:") ||
        href?.startsWith("tel:") ||
        href?.startsWith("blob:") ||
        href?.startsWith("data:")
      ) {
        return;
      }

      if (
        href &&
        !href.startsWith("/") &&
        !href.startsWith(window.location.origin)
      ) {
        return;
      }

      const binaryExt = [
        "pdf",
        "zip",
        "rar",
        "7z",
        "mp3",
        "wav",
        "ttf",
        "otf",
        "woff",
        "woff2",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
      ];
      const ext = href?.split(".").pop().toLowerCase();

      if (binaryExt.includes(ext)) return;

      const next = new URL(link.href, location.href);
      const current = new URL(location.href);

      if (
        next.pathname !== current.pathname ||
        next.search !== current.search
      ) {
        beginNavigation();
      }
    };

    const handlePopState = () => beginNavigation();

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);

      if (slowNavTimer.current) clearTimeout(slowNavTimer.current);
    };
  }, []);

  return null;
};
