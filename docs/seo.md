# SEO And Indexing

## Production Origin

SVG Workspace is published from `https://svgworkspace.com`.

All public metadata, canonical URLs, `robots.txt`, and the sitemap use this origin. Do not use localhost, preview hosts, or alternate domains in SEO-facing configuration.

## Current Indexable Surface

The homepage (`https://svgworkspace.com/`) is the only indexable product page today. It contains server-rendered product information alongside the application experience.

Future or placeholder routes are intentionally marked `noindex` and are excluded from the sitemap until they provide a complete public workflow.

## Crawl Directives

- `/robots.txt` allows crawling of public application assets and pages.
- `/robots.txt` excludes `/test-svgs/`, which contains development fixtures rather than public product content.
- `/sitemap.xml` contains the canonical homepage only.
- The static-host fallback returns the exported 404 page with HTTP status `404` for unknown routes.

When adding a public route, decide explicitly whether it is indexable. An indexable route needs its own canonical URL, meaningful metadata, server-rendered explanatory content, and an entry in `src/app/sitemap.ts`.

## Metadata Strategy

The root layout owns the shared title, description, canonical origin, Open Graph, Twitter, and indexing metadata. The homepage also includes truthful `WebSite` and `SoftwareApplication` JSON-LD.

There is currently no dedicated social preview image. Social shares use the title and description until a real product asset is available.

## Google Search Console

After the next production deployment:

1. Create a **Domain property** for `svgworkspace.com` in Google Search Console. This covers both protocol and subdomain variants.
2. Verify ownership through the DNS method supplied by Search Console.
3. Submit `https://svgworkspace.com/sitemap.xml`.
4. Use URL Inspection on `https://svgworkspace.com/` and choose **Request indexing**.
5. Confirm the inspection result shows the canonical `https://svgworkspace.com/`, allows indexing, and can fetch the rendered page.

Indexing is asynchronous. A successful inspection and accepted sitemap confirm readiness, not an immediate search result.

## Known Limitations

SVG Workspace is a static Next.js export. The homepage renders meaningful HTML at build time, but uploaded SVG-specific workspace results are intentionally browser-local and are not crawlable content. No content pages or programmatic SEO routes are planned until they represent a complete, useful product workflow.
