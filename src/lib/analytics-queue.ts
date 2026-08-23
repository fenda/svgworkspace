export type AnalyticsQueueTarget = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * gtag.js consumes queued `Arguments` objects. Keep this equivalent to the
 * official snippet rather than queuing rest-parameter arrays.
 */
export function ensureAnalyticsQueue(target: AnalyticsQueueTarget) {
  target.dataLayer = target.dataLayer || [];

  if (!target.gtag) {
    target.gtag = function gtag() {
      // gtag.js expects the native Arguments object from its canonical snippet.
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer?.push(arguments);
    };
  }
}
