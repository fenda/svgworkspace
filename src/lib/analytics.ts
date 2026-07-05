"use client";

import type { AnalysisResult, Severity } from "@/analysis";

const GA_MEASUREMENT_ID = "G-XDK5R1FYNK";
const GA_SCRIPT_ID = "svg-workspace-ga4";

type AnalyticsEventName =
  | "svg_uploaded"
  | "analysis_completed"
  | "optimize_clicked"
  | "transform_applied"
  | "reset_to_original"
  | "copy_clicked"
  | "download_clicked"
  | "diff_viewed";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let analyticsEnabled = false;
let analyticsInitialized = false;
let scriptLoadPromise: Promise<void> | null = null;

function ensureGtag() {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

function loadGaScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      GA_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Analytics")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load Google Analytics")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function sendPageView() {
  if (!analyticsEnabled || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}

export async function enableAnalytics() {
  if (typeof window === "undefined") {
    return;
  }

  ensureGtag();
  await loadGaScript();

  if (!window.gtag) {
    return;
  }

  analyticsEnabled = true;
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });

  if (!analyticsInitialized) {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: false,
    });
    analyticsInitialized = true;
  }

  sendPageView();
}

export function disableAnalytics() {
  analyticsEnabled = false;

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  params?: AnalyticsParams,
) {
  if (!analyticsEnabled || typeof window === "undefined" || !window.gtag) {
    return;
  }

  const filteredParams = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined),
  );

  window.gtag("event", eventName, filteredParams);
}

export function trackAnalysisCompleted(result: AnalysisResult) {
  const severityCounts: Record<Severity, number> = {
    error: 0,
    warning: 0,
    info: 0,
    success: 0,
  };

  for (const finding of result.findings) {
    severityCounts[finding.severity] += 1;
  }

  trackAnalyticsEvent("analysis_completed", {
    total_findings: result.health.findingCount,
    error_count: severityCounts.error,
    warning_count: severityCounts.warning,
    info_count: severityCounts.info,
  });
}
