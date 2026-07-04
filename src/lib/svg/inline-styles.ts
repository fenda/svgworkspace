const SAFE_STYLE_PROPERTIES = new Set([
  "clip-rule",
  "fill",
  "fill-opacity",
  "fill-rule",
  "opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
]);

type ParsedStyleDeclaration = {
  property: string;
  value: string;
};

function parseStyleDeclarations(style: string): ParsedStyleDeclaration[] | null {
  const declarations = style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean);

  if (declarations.length === 0) {
    return [];
  }

  const parsed = declarations.map((declaration) => {
    const separatorIndex = declaration.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
    const value = declaration.slice(separatorIndex + 1).trim();

    if (!property || !value) {
      return null;
    }

    return { property, value };
  });

  if (parsed.some((declaration) => declaration === null)) {
    return null;
  }

  return parsed as ParsedStyleDeclaration[];
}

function isSafeStyleDeclaration({ property, value }: ParsedStyleDeclaration): boolean {
  if (!SAFE_STYLE_PROPERTIES.has(property)) {
    return false;
  }

  if (property.startsWith("--")) {
    return false;
  }

  if (value.includes("!important")) {
    return false;
  }

  return true;
}

function getStyledElements(svg: SVGSVGElement): Element[] {
  return Array.from(svg.querySelectorAll("[style]")).filter((element) =>
    Boolean(element.getAttribute("style")?.trim()),
  );
}

export function canConvertInlineStylesToAttributes(svg: SVGSVGElement): boolean {
  return getStyledElements(svg).every((element) => {
    const style = element.getAttribute("style")?.trim() ?? "";
    const declarations = parseStyleDeclarations(style);

    if (declarations === null) {
      return false;
    }

    return declarations.every(isSafeStyleDeclaration);
  });
}

export function convertInlineStylesToAttributes(svg: SVGSVGElement): void {
  if (!canConvertInlineStylesToAttributes(svg)) {
    return;
  }

  getStyledElements(svg).forEach((element) => {
    const style = element.getAttribute("style")?.trim() ?? "";
    const declarations = parseStyleDeclarations(style);

    if (!declarations) {
      return;
    }

    declarations.forEach(({ property, value }) => {
      element.setAttribute(property, value);
    });

    element.removeAttribute("style");
  });
}
