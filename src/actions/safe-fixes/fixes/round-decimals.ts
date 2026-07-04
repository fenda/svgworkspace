import { MAX_DECIMAL_PLACES } from "@/analysis/rules/performance/performance-003-high-decimal-precision";

const HIGH_PRECISION_NUMBER = /-?\d*\.\d{5,}/g;

function trimTrailingZeros(value: string): string {
  return value.replace(/\.?0+$/, "");
}

function roundHighPrecisionNumbers(input: string): string {
  return input.replace(HIGH_PRECISION_NUMBER, (match) => {
    const rounded = Number(match).toFixed(MAX_DECIMAL_PLACES);
    return trimTrailingZeros(rounded);
  });
}

export function roundDecimals(svg: SVGSVGElement): void {
  Array.from(svg.querySelectorAll("*")).forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const roundedValue = roundHighPrecisionNumbers(attribute.value);

      if (roundedValue !== attribute.value) {
        element.setAttribute(attribute.name, roundedValue);
      }
    });
  });
}
