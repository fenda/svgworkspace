import {
  isSafeStyleDeclaration,
  parseStyleDeclarations,
  type ParsedStyleDeclaration,
} from "./inline-styles";

type SafeClassRule = {
  className: string;
  declarations: ParsedStyleDeclaration[];
};

type CssRuleSegment =
  | {
      kind: "safe";
      raw: string;
      rule: SafeClassRule;
    }
  | {
      kind: "unsafe";
      raw: string;
    };

type ParsedStyleBlock = {
  element: Element;
  rules: CssRuleSegment[];
};

const SIMPLE_CLASS_SELECTOR_PATTERN = /^\.[A-Za-z_][A-Za-z0-9_-]*$/;

function getStyleElements(svg: SVGSVGElement): Element[] {
  return Array.from(svg.querySelectorAll("style")).filter((element) =>
    Boolean(element.textContent?.trim()),
  );
}

function parseRule(selector: string, body: string, raw: string): CssRuleSegment {
  const trimmedSelector = selector.trim();
  const trimmedBody = body.trim();

  if (!SIMPLE_CLASS_SELECTOR_PATTERN.test(trimmedSelector)) {
    return {
      kind: "unsafe",
      raw,
    };
  }

  if (!trimmedBody || trimmedBody.includes("{") || trimmedBody.includes("}")) {
    return {
      kind: "unsafe",
      raw,
    };
  }

  const declarations = parseStyleDeclarations(trimmedBody);

  if (
    declarations === null ||
    declarations.length === 0 ||
    !declarations.every(isSafeStyleDeclaration)
  ) {
    return {
      kind: "unsafe",
      raw,
    };
  }

  return {
    kind: "safe",
    raw,
    rule: {
      className: trimmedSelector.slice(1),
      declarations,
    },
  };
}

function parseStyleBlock(cssText: string): CssRuleSegment[] {
  const rules: CssRuleSegment[] = [];
  let cursor = 0;

  while (cursor < cssText.length) {
    while (cursor < cssText.length && /\s/.test(cssText[cursor] ?? "")) {
      cursor += 1;
    }

    if (cursor >= cssText.length) {
      break;
    }

    const selectorStart = cursor;
    const openBraceIndex = cssText.indexOf("{", cursor);

    if (openBraceIndex === -1) {
      const trailing = cssText.slice(cursor).trim();

      if (trailing) {
        rules.push({
          kind: "unsafe",
          raw: cssText.slice(cursor),
        });
      }

      break;
    }

    let depth = 1;
    let position = openBraceIndex + 1;

    while (position < cssText.length && depth > 0) {
      const character = cssText[position];

      if (character === "{") {
        depth += 1;
      } else if (character === "}") {
        depth -= 1;
      }

      position += 1;
    }

    if (depth !== 0) {
      rules.push({
        kind: "unsafe",
        raw: cssText.slice(selectorStart),
      });
      break;
    }

    const raw = cssText.slice(selectorStart, position);
    const selector = cssText.slice(selectorStart, openBraceIndex);
    const body = cssText.slice(openBraceIndex + 1, position - 1);

    rules.push(parseRule(selector, body, raw));
    cursor = position;
  }

  return rules;
}

function getParsedStyleBlocks(svg: SVGSVGElement): ParsedStyleBlock[] {
  return getStyleElements(svg).map((element) => ({
    element,
    rules: parseStyleBlock(element.textContent ?? ""),
  }));
}

function getInlineableRuleCount(blocks: ParsedStyleBlock[]): number {
  return blocks.reduce(
    (count, block) =>
      count + block.rules.filter((rule) => rule.kind === "safe").length,
    0,
  );
}

export function getInlineableCssRuleCount(svg: SVGSVGElement): number {
  return getInlineableRuleCount(getParsedStyleBlocks(svg));
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
  return getInlineableCssRuleCount(svg) > 0;
}

export function inlineCssClasses(svg: SVGSVGElement): void {
  const blocks = getParsedStyleBlocks(svg);

  if (getInlineableRuleCount(blocks) === 0) {
    return;
  }

  blocks.forEach(({ rules }) => {
    rules.forEach((rule) => {
      if (rule.kind !== "safe") {
        return;
      }

      const { className, declarations } = rule.rule;

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

  blocks.forEach(({ element, rules }) => {
    const remainingRules = rules
      .filter((rule) => rule.kind === "unsafe")
      .map((rule) => rule.raw.trim())
      .filter(Boolean);

    if (remainingRules.length === 0) {
      element.remove();
      return;
    }

    element.textContent = `\n${remainingRules.join("\n\n")}\n`;
  });
}
