import packageJson from "../../package.json";

function normalizeVersion(version: string): string {
  if (version.startsWith("v")) {
    return version;
  }

  return `v${version}`;
}

export const APP_VERSION = normalizeVersion(
  process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version,
);

export const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA || null;

export const SHORT_COMMIT_SHA = COMMIT_SHA ? COMMIT_SHA.slice(0, 7) : null;
