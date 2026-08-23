const LOCAL_URL_REFERENCE_PATTERN = /url\(\s*(['"]?)\s*#([A-Za-z_][\w:.-]*)\s*\1\s*\)/gi;
const LOCAL_HREF_REFERENCE_PATTERN = /^#([A-Za-z_][\w:.-]*)$/;

function stripCssComments(value: string): string {
  return value.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Returns only explicit local fragment references. External URLs and arbitrary
 * attribute text are intentionally ignored to keep this check conservative.
 */
export function getLocalReferenceIdsFromValue(value: string): string[] {
  const references = new Set<string>();

  for (const match of value.matchAll(LOCAL_URL_REFERENCE_PATTERN)) {
    const id = match[2]?.trim();

    if (id) {
      references.add(id);
    }
  }

  return Array.from(references);
}

function getHrefReferenceId(attribute: Attr): string | null {
  const name = attribute.name.toLowerCase();

  if (name !== "href" && name !== "xlink:href") {
    return null;
  }

  return attribute.value.trim().match(LOCAL_HREF_REFERENCE_PATTERN)?.[1] ?? null;
}

function collectElementReferenceIds(element: Element): Set<string> {
  const references = new Set<string>();

  Array.from(element.attributes).forEach((attribute) => {
    getLocalReferenceIdsFromValue(attribute.value).forEach((id) => references.add(id));

    const hrefId = getHrefReferenceId(attribute);

    if (hrefId) {
      references.add(hrefId);
    }
  });

  if (element.tagName.toLowerCase() === "style") {
    getLocalReferenceIdsFromValue(stripCssComments(element.textContent ?? "")).forEach(
      (id) => references.add(id),
    );
  }

  return references;
}

export function getBrokenLocalReferenceIds(svg: SVGSVGElement): string[] {
  const knownIds = new Set(
    [svg, ...Array.from(svg.querySelectorAll("[id]"))]
      .map((element) => element.getAttribute("id")?.trim())
      .filter((id): id is string => Boolean(id)),
  );
  const referencedIds = new Set<string>();

  [svg, ...Array.from(svg.querySelectorAll("*"))].forEach((element) => {
    collectElementReferenceIds(element).forEach((id) => referencedIds.add(id));
  });

  return Array.from(referencedIds).filter((id) => !knownIds.has(id));
}
