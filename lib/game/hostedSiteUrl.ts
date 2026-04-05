/**
 * Base origin for player sites (no trailing slash required).
 * When set, relative paths from Convex are resolved against this URL for the game iframe.
 */
const HOSTED_SITES_URL = process.env.NEXT_PUBLIC_HOSTED_SITES_URL?.trim();

function isAbsoluteOrSpecialUrl(value: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
}

/** Resolves a stored website path or full URL for use as an iframe `src`. */
export function resolveHostedSiteIframeSrc(websiteUrl: string): string {
  const trimmed = websiteUrl.trim();
  if (!trimmed || trimmed === "about:blank") {
    return trimmed || "about:blank";
  }
  if (isAbsoluteOrSpecialUrl(trimmed)) {
    return trimmed;
  }
  if (!HOSTED_SITES_URL) {
    return trimmed;
  }
  try {
    return new URL(trimmed, HOSTED_SITES_URL).href;
  } catch {
    return trimmed;
  }
}
