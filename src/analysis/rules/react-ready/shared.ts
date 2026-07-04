const KEBAB_CASE_ATTRIBUTES = new Set([
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "fill-rule",
  "clip-rule",
  "clip-path",
  "stop-color",
  "stop-opacity",
  "flood-color",
  "flood-opacity",
  "color-interpolation-filters",
]);

const INLINE_EVENT_ATTRIBUTES = new Set([
  "onclick",
  "onmouseover",
  "onmouseout",
  "onload",
  "onfocus",
  "onblur",
]);

export function hasClassAttribute(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) =>
    element.hasAttribute("class"),
  );
}

export function hasReactKebabCaseAttributes(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) =>
    element.getAttributeNames().some((name) => KEBAB_CASE_ATTRIBUTES.has(name)),
  );
}

export function hasInlineStyleString(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("[style]")).some((element) =>
    Boolean(element.getAttribute("style")?.trim()),
  );
}

export function hasXlinkAttributes(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) =>
    element.getAttributeNames().some((name) => name.startsWith("xlink:")),
  );
}

export function hasInlineEventAttributes(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) =>
    element.getAttributeNames().some((name) =>
      INLINE_EVENT_ATTRIBUTES.has(name.toLowerCase()),
    ),
  );
}
