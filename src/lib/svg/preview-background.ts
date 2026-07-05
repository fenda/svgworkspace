export type PreviewBackground = "checkerboard" | "white" | "dark";

const HEX_SHORT_PATTERN = /^#([\da-f]{3,4})$/i;
const HEX_LONG_PATTERN = /^#([\da-f]{6}|[\da-f]{8})$/i;
const RGB_PATTERN =
  /^rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*,\s*[\d.]+%?\s*)?\)$/i;
const HSL_PATTERN =
  /^hsla?\(\s*([-\d.]+)(?:deg)?\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*[\d.]+%?\s*)?\)$/i;

const COLOR_ATTR_PATTERN = /\s(?:fill|stroke)\s*=\s*["']([^"']+)["']/gi;
const STYLE_ATTR_PATTERN = /\sstyle\s*=\s*["']([^"']+)["']/gi;
const STYLE_BLOCK_PATTERN = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const STYLE_DECLARATION_PATTERN =
  /(?:^|[;{\s])(fill|stroke)\s*:\s*([^;}{]+)(?=[;}])/gi;

const NAMED_COLORS: Record<string, [number, number, number]> = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  purple: [128, 0, 128],
  teal: [0, 128, 128],
  navy: [0, 0, 128],
};

function normalizeRgbComponent(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed.endsWith("%")) {
    const percentage = Number.parseFloat(trimmed.slice(0, -1));

    if (!Number.isFinite(percentage)) {
      return null;
    }

    return Math.max(0, Math.min(255, Math.round((percentage / 100) * 255)));
  }

  const numericValue = Number.parseFloat(trimmed);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(255, Math.round(numericValue)));
}

function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number,
): [number, number, number] {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const normalizedSaturation = Math.max(0, Math.min(1, saturation));
  const normalizedLightness = Math.max(0, Math.min(1, lightness));

  const chroma =
    (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
  const huePrime = normalizedHue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const matchLightness = normalizedLightness - chroma / 2;

  return [red, green, blue].map((channel) =>
    Math.round((channel + matchLightness) * 255),
  ) as [number, number, number];
}

function parseColorValue(value: string): [number, number, number] | null {
  const normalizedValue = value.trim().toLowerCase();

  if (
    !normalizedValue ||
    normalizedValue === "none" ||
    normalizedValue === "transparent" ||
    normalizedValue === "currentcolor" ||
    normalizedValue === "inherit" ||
    normalizedValue === "initial" ||
    normalizedValue === "unset" ||
    normalizedValue.startsWith("url(") ||
    normalizedValue.startsWith("var(")
  ) {
    return null;
  }

  const shortHexMatch = normalizedValue.match(HEX_SHORT_PATTERN);

  if (shortHexMatch) {
    const digits = shortHexMatch[1];
    return [
      Number.parseInt(`${digits[0]}${digits[0]}`, 16),
      Number.parseInt(`${digits[1]}${digits[1]}`, 16),
      Number.parseInt(`${digits[2]}${digits[2]}`, 16),
    ];
  }

  const longHexMatch = normalizedValue.match(HEX_LONG_PATTERN);

  if (longHexMatch) {
    const digits = longHexMatch[1];
    return [
      Number.parseInt(digits.slice(0, 2), 16),
      Number.parseInt(digits.slice(2, 4), 16),
      Number.parseInt(digits.slice(4, 6), 16),
    ];
  }

  const rgbMatch = normalizedValue.match(RGB_PATTERN);

  if (rgbMatch) {
    const red = normalizeRgbComponent(rgbMatch[1]);
    const green = normalizeRgbComponent(rgbMatch[2]);
    const blue = normalizeRgbComponent(rgbMatch[3]);

    if (red === null || green === null || blue === null) {
      return null;
    }

    return [red, green, blue];
  }

  const hslMatch = normalizedValue.match(HSL_PATTERN);

  if (hslMatch) {
    return hslToRgb(
      Number.parseFloat(hslMatch[1]),
      Number.parseFloat(hslMatch[2]) / 100,
      Number.parseFloat(hslMatch[3]) / 100,
    );
  }

  return NAMED_COLORS[normalizedValue] ?? null;
}

function parseStyleAttribute(style: string): string[] {
  return style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .flatMap((declaration) => {
      const separatorIndex = declaration.indexOf(":");

      if (separatorIndex === -1) {
        return [];
      }

      const property = declaration
        .slice(0, separatorIndex)
        .trim()
        .toLowerCase();
      const value = declaration.slice(separatorIndex + 1).trim();

      if ((property === "fill" || property === "stroke") && value) {
        return [value];
      }

      return [];
    });
}

function collectColorValues(markup: string): string[] {
  const colors: string[] = [];

  for (const match of markup.matchAll(COLOR_ATTR_PATTERN)) {
    const value = match[1]?.trim();

    if (value) {
      colors.push(value);
    }
  }

  for (const match of markup.matchAll(STYLE_ATTR_PATTERN)) {
    const style = match[1]?.trim();

    if (style) {
      colors.push(...parseStyleAttribute(style));
    }
  }

  for (const match of markup.matchAll(STYLE_BLOCK_PATTERN)) {
    const css = match[1]?.trim();

    if (!css) {
      continue;
    }

    for (const declarationMatch of css.matchAll(STYLE_DECLARATION_PATTERN)) {
      const value = declarationMatch[2]?.trim();

      if (value) {
        colors.push(value);
      }
    }
  }

  return colors;
}

function getRelativeLuminance([red, green, blue]: [number, number, number]): number {
  const normalizeChannel = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * normalizeChannel(red) +
    0.7152 * normalizeChannel(green) +
    0.0722 * normalizeChannel(blue)
  );
}

export function getAutomaticPreviewBackground(
  markup: string,
): PreviewBackground {
  const parsedColors = collectColorValues(markup)
    .map(parseColorValue)
    .filter((color): color is [number, number, number] => color !== null);

  if (parsedColors.length === 0) {
    return "checkerboard";
  }

  let darkCount = 0;
  let lightCount = 0;

  parsedColors.forEach((color) => {
    const luminance = getRelativeLuminance(color);

    if (luminance <= 0.25) {
      darkCount += 1;
    } else if (luminance >= 0.75) {
      lightCount += 1;
    }
  });

  const totalCount = parsedColors.length;

  if (darkCount / totalCount >= 0.7) {
    return "white";
  }

  if (lightCount / totalCount >= 0.7) {
    return "dark";
  }

  return "checkerboard";
}
