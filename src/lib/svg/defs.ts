const REFERENCEABLE_DEF_TAGS = new Set([
  "clippath",
  "filter",
  "lineargradient",
  "marker",
  "mask",
  "pattern",
  "radialgradient",
  "symbol",
]);

const URL_REFERENCE_PATTERN = /url\((['"]?)#([^)'" ]+)\1\)/g;
const HASH_REFERENCE_PATTERN = /^#(.+)$/;

function getDefinitionEntries(svg: SVGSVGElement) {
  return Array.from(svg.querySelectorAll("defs"))
    .flatMap((defs) =>
      Array.from(defs.children).filter((child) => {
        const tagName = child.tagName.toLowerCase();
        return (
          REFERENCEABLE_DEF_TAGS.has(tagName) &&
          Boolean(child.getAttribute("id"))
        );
      }),
    )
    .map((element) => ({
      id: element.getAttribute("id")!,
      element,
    }));
}

function collectReferencesFromValue(
  value: string,
  knownIds: Set<string>,
): Set<string> {
  const references = new Set<string>();

  const trimmed = value.trim();

  if (!trimmed) {
    return references;
  }

  for (const match of trimmed.matchAll(URL_REFERENCE_PATTERN)) {
    const id = match[2]?.trim();

    if (id && knownIds.has(id)) {
      references.add(id);
    }
  }

  const hashReference = trimmed.match(HASH_REFERENCE_PATTERN)?.[1]?.trim();

  if (hashReference && knownIds.has(hashReference)) {
    references.add(hashReference);
  }

  return references;
}

function collectReferencesFromSubtree(
  root: Element,
  knownIds: Set<string>,
): Set<string> {
  const references = new Set<string>();
  const elements = [root, ...Array.from(root.querySelectorAll("*"))];

  elements.forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      collectReferencesFromValue(attribute.value, knownIds).forEach((id) => {
        references.add(id);
      });
    });

    if (element.tagName.toLowerCase() === "style") {
      collectReferencesFromValue(element.textContent ?? "", knownIds).forEach(
        (id) => {
          references.add(id);
        },
      );
    }
  });

  return references;
}

export function getUnusedDefinitionIds(svg: SVGSVGElement): string[] {
  const definitions = getDefinitionEntries(svg);

  if (definitions.length === 0) {
    return [];
  }

  const knownIds = new Set(definitions.map((definition) => definition.id));
  const definitionReferences = new Map<string, Set<string>>();
  const externallyReferencedIds = new Set<string>();

  definitions.forEach(({ id, element }) => {
    definitionReferences.set(id, collectReferencesFromSubtree(element, knownIds));
  });

  [svg, ...Array.from(svg.querySelectorAll("*"))].forEach((element) => {
    if (element.closest("defs")) {
      return;
    }

    collectReferencesFromSubtree(element, knownIds).forEach((id) => {
      externallyReferencedIds.add(id);
    });
  });

  const usedIds = new Set<string>();
  const queue = Array.from(externallyReferencedIds);

  while (queue.length > 0) {
    const id = queue.shift();

    if (!id || usedIds.has(id)) {
      continue;
    }

    usedIds.add(id);

    definitionReferences.get(id)?.forEach((referenceId) => {
      if (!usedIds.has(referenceId)) {
        queue.push(referenceId);
      }
    });
  }

  return definitions
    .map(({ id }) => id)
    .filter((id) => !usedIds.has(id));
}

export function removeUnusedDefinitions(svg: SVGSVGElement): number {
  const unusedIds = new Set(getUnusedDefinitionIds(svg));

  if (unusedIds.size === 0) {
    return 0;
  }

  let removedCount = 0;

  Array.from(svg.querySelectorAll("defs")).forEach((defs) => {
    Array.from(defs.children).forEach((child) => {
      const id = child.getAttribute("id");

      if (id && unusedIds.has(id)) {
        child.remove();
        removedCount += 1;
      }
    });
  });

  return removedCount;
}
