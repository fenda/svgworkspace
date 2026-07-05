"use client";

export async function openCookieSettings() {
  const CookieConsent = await import("vanilla-cookieconsent");
  CookieConsent.showPreferences();
}
