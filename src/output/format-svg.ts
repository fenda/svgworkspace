import { assertBrowser } from "@/lib/browser/assert-browser";
import { parseSvgMarkup } from "@/lib/svg/parse";

function escapeText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value: string): string {
  return escapeText(value).replaceAll('"', "&quot;");
}

// Whitespace and child markup can affect text, CSS, scripts, or embedded content.
// Keep these elements intact instead of treating their children as structural noise.
const TEXT_SENSITIVE_ELEMENTS = new Set([
  "desc",
  "foreignobject",
  "script",
  "style",
  "text",
  "textpath",
  "title",
  "tspan",
]);

function formatAttributes(element: Element): string {
  return element
    .getAttributeNames()
    .map((name) => `${name}="${escapeAttribute(element.getAttribute(name) ?? "")}"`)
    .join(" ");
}

function formatNode(node: Node, depth: number): string {
  const indent = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    return `${indent}${escapeText(node.textContent ?? "")}`;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${indent}<!--${node.textContent ?? ""}-->`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const tagName = element.tagName;

  if (TEXT_SENSITIVE_ELEMENTS.has(tagName.toLowerCase())) {
    return `${indent}${new XMLSerializer().serializeToString(element)}`;
  }

  const attributes = formatAttributes(element);
  const openingTag = attributes ? `<${tagName} ${attributes}` : `<${tagName}`;
  const children = Array.from(element.childNodes).filter((child) => {
    return !(child.nodeType === Node.TEXT_NODE && !child.textContent?.trim());
  });

  if (children.length === 0) {
    return `${indent}${openingTag}/>`;
  }

  if (
    children.length === 1 &&
    children[0]?.nodeType === Node.TEXT_NODE
  ) {
    return `${indent}${openingTag}>${escapeText(children[0].textContent ?? "")}</${tagName}>`;
  }

  const formattedChildren = children
    .map((child) => formatNode(child, depth + 1))
    .filter(Boolean)
    .join("\n");

  return `${indent}${openingTag}>\n${formattedChildren}\n${indent}</${tagName}>`;
}

export function formatSvg(content: string): string {
  assertBrowser();

  const svg = parseSvgMarkup(content.trim()).cloneNode(true) as SVGSVGElement;

  return `${formatNode(svg, 0)}\n`;
}
