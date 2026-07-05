"use client";

import { useEffect } from "react";
import {
  disableAnalytics,
  enableAnalytics,
} from "@/lib/analytics";

export function AnalyticsConsent() {
  useEffect(() => {
    let isCancelled = false;

    async function setupConsent() {
      const CookieConsent = await import("vanilla-cookieconsent");

      if (isCancelled) {
        return;
      }

      await CookieConsent.run({
        mode: "opt-in",
        autoClearCookies: false,
        disablePageInteraction: false,
        cookie: {
          name: "svg_workspace_consent",
          expiresAfterDays: 182,
          sameSite: "Lax",
          useLocalStorage: true,
        },
        guiOptions: {
          consentModal: {
            layout: "box",
            position: "bottom right",
            equalWeightButtons: true,
          },
          preferencesModal: {
            layout: "box",
            equalWeightButtons: true,
          },
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {
            enabled: false,
            readOnly: false,
          },
        },
        onConsent: async () => {
          if (CookieConsent.acceptedCategory("analytics")) {
            await enableAnalytics();
          } else {
            disableAnalytics();
          }
        },
        onChange: async ({ changedCategories }) => {
          if (!changedCategories.includes("analytics")) {
            return;
          }

          if (CookieConsent.acceptedCategory("analytics")) {
            await enableAnalytics();
          } else {
            disableAnalytics();
          }
        },
        language: {
          default: "en",
          translations: {
            en: {
              consentModal: {
                title: "Cookie settings",
                description:
                  "SVG Workspace uses optional analytics to understand which features are used. No SVG content or filenames are collected.",
                acceptAllBtn: "Accept analytics",
                acceptNecessaryBtn: "Decline",
                showPreferencesBtn: "Cookie settings",
              },
              preferencesModal: {
                title: "Cookie settings",
                acceptAllBtn: "Accept analytics",
                acceptNecessaryBtn: "Decline",
                savePreferencesBtn: "Save settings",
                sections: [
                  {
                    title: "Analytics",
                    description:
                      "Helps understand feature usage so SVG Workspace can improve. No SVG content, filenames, or personal data are collected.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
          },
        },
      });
    }

    void setupConsent();

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
