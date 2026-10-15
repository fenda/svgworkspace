const TEXT_SENSITIVE_ELEMENT_NAMES = new Set([
  "desc",
  "foreignobject",
  "script",
  "style",
  "text",
  "textpath",
  "title",
  "tspan",
]);

export function preservesSvgWhitespace(tagName: string): boolean {
  return TEXT_SENSITIVE_ELEMENT_NAMES.has(tagName.toLowerCase());
}

function isInWhitespacePreservingSubtree(element: Element): boolean {
  let current: Element | null = element;

  while (current) {
    if (
      preservesSvgWhitespace(current.tagName) ||
      current.getAttribute("xml:space")?.trim().toLowerCase() === "preserve"
    ) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

function collectRemovableWhitespaceNodes(
  element: Element,
  nodes: Text[],
): void {
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent?.trim() && !isInWhitespacePreservingSubtree(element)) {
        nodes.push(node as Text);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      collectRemovableWhitespaceNodes(node as Element, nodes);
    }
  });
}

function getRemovableWhitespaceNodes(svg: SVGSVGElement): Text[] {
  const nodes: Text[] = [];
  collectRemovableWhitespaceNodes(svg, nodes);
  return nodes;
}

export function getRemovableWhitespaceNodeCount(svg: SVGSVGElement): number {
  return getRemovableWhitespaceNodes(svg).length;
}

export function normalizeSvgWhitespace(svg: SVGSVGElement): number {
  const removableNodes = getRemovableWhitespaceNodes(svg);
  removableNodes.forEach((node) => node.remove());
  return removableNodes.length;
}
