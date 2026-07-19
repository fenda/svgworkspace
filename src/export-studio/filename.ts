function sanitizeFilenameBaseSegment(value: string): string {
  return value
    .trim()
    .replace(/\.svg$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildExportFilename(
  inputFilename: string,
  suffix?: string,
): string {
  const baseName = sanitizeFilenameBaseSegment(inputFilename) || "svg";
  const normalizedSuffix = suffix
    ? sanitizeFilenameBaseSegment(suffix)
    : "";

  if (!normalizedSuffix) {
    return `${baseName}.svg`;
  }

  const lowerBaseName = baseName.toLowerCase();
  const lowerSuffix = normalizedSuffix.toLowerCase();
  const nextBaseName =
    lowerBaseName === lowerSuffix || lowerBaseName.endsWith(`-${lowerSuffix}`)
      ? baseName
      : `${baseName}-${normalizedSuffix}`;

  return `${nextBaseName}.svg`;
}
