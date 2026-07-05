import {
  isSafeStyleDeclaration,
  parseStyleDeclarations,
  type ParsedStyleDeclaration,
} from "./inline-styles";

type SafeClassRule = {
  className: string;
  declarations: ParsedStyleDeclaration[];
};

type SafeStyleBlock = {
  element: Element;
  rules: SafeClassRule[];
};

const SIMPLE_CLASS_SELECTOR_PATTERN = /^\.[A-Za-z_][A-Za-z0-9_-]*$/;

function getStyleElements(svg: SVGSVGElement): Element[] {
  return Array.from(svg.querySelectorAll("style")).filter((element) =>
    Boolean(element.textContent?.trim()),
  );
}

function parseSafeClassRules(cssText: string): SafeClassRule[] | null {
  const trimmedCss = cssText.trim();

  if (!trimmedCss) {
    return [];
  }

  if (trimmedCss.includes("@")) {
    return null;
  }

  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  const rules: SafeClassRule[] = [];
  let lastIndex = 0;

  for (const match of trimmedCss.matchAll(rulePattern)) {
    const matchIndex = match.index ?? 0;
    const skippedContent = trimmedCss.slice(lastIndex, matchIndex).trim();

    if (skippedContent) {
      return null;
    }

    const selector = match[1]?.trim() ?? "";
    const declarations = parseStyleDeclarations(match[2]?.trim() ?? "");

    if (!SIMPLE_CLASS_SELECTOR_PATTERN.test(selector) || declarations === null) {
      return null;
    }

    if (
      declarations.length === 0 ||
      !declarations.every(isSafeStyleDeclaration)
    ) {
      return null;
    }

    rules.push({
      className: selector.slice(1),
      declarations,
    });

    lastIndex = matchIndex + match[0].length;
  }

  if (trimmedCss.slice(lastIndex).trim()) {
    return null;
  }

  return rules.length > 0 ? rules : null;
}

function getSafeStyleBlocks(svg: SVGSVGElement): SafeStyleBlock[] | null {
  const styleElements = getStyleElements(svg);

  if (styleElements.length === 0) {
    return [];
  }

  const blocks = styleElements.map((element) => {
    const rules = parseSafeClassRules(element.textContent?.trim() ?? "");

    if (rules === null) {
      return null;
    }

    return {
      element,
      rules,
    };
  });

  if (blocks.some((block) => block === null)) {
    return null;
  }

  return blocks as SafeStyleBlock[];
}

function getElementsWithClass(svg: SVGSVGElement, className: string): Element[] {
  return Array.from(svg.querySelectorAll("[class]")).filter((element) => {
    const classValue = element.getAttribute("class")?.trim();

    if (!classValue) {
      return false;
    }

    return classValue.split(/\s+/).includes(className);
  });
}

export function hasEmbeddedCssClasses(svg: SVGSVGElement): boolean {
  return getStyleElements(svg).length > 0;
}

export function canInlineCssClasses(svg: SVGSVGElement): boolean {
  const blocks = getSafeStyleBlocks(svg);

  return blocks !== null && blocks.length > 0;
}

export function inlineCssClasses(svg: SVGSVGElement): void {
  const blocks = getSafeStyleBlocks(svg);

  if (blocks === null || blocks.length === 0) {
    return;
  }

  blocks.forEach(({ rules }) => {
    rules.forEach(({ className, declarations }) => {
      getElementsWithClass(svg, className).forEach((element) => {
        declarations.forEach(({ property, value }) => {
          element.setAttribute(property, value);
        });

        const remainingClasses = (element.getAttribute("class") ?? "")
          .split(/\s+/)
          .map((token) => token.trim())
          .filter((token) => token && token !== className);

        if (remainingClasses.length === 0) {
          element.removeAttribute("class");
          return;
        }

        element.setAttribute("class", remainingClasses.join(" "));
      });
    });
  });

  blocks.forEach(({ element }) => {
    element.remove();
  });
}
