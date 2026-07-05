import type { AnalysisRule, Finding, RuleFixType } from "@/analysis/models";

type FindingOverrides = {
  recommendation: string;
  title?: string;
  description?: string;
  severity?: Finding["severity"];
  fixType?: RuleFixType;
  scoreImpact?: number;
};

const REQUIRED_RULE_FIELDS = [
  "title",
  "description",
  "severity",
  "scoreImpact",
  "fixType",
  "status",
  "introducedIn",
] as const;

function isMissingMetadataValue(
  value: AnalysisRule[(typeof REQUIRED_RULE_FIELDS)[number]],
): boolean {
  if (typeof value === "number") {
    return !Number.isFinite(value);
  }

  return typeof value !== "string" || value.trim().length === 0;
}

export function createRuleFinding(
  rule: AnalysisRule,
  overrides: FindingOverrides,
): Finding {
  return {
    id: rule.id,
    category: rule.category,
    title: overrides.title ?? rule.title,
    description: overrides.description ?? rule.description,
    severity: overrides.severity ?? rule.severity,
    fixType: overrides.fixType ?? rule.fixType,
    recommendation: overrides.recommendation,
    scoreImpact: overrides.scoreImpact ?? rule.scoreImpact,
  };
}

export function validateRuleMetadata(
  rules: AnalysisRule[],
  groupName: string,
): AnalysisRule[] {
  if (process.env.NODE_ENV === "production") {
    return rules;
  }

  const seenRuleIds = new Set<string>();
  const warnings: string[] = [];

  for (const rule of rules) {
    const missingFields = REQUIRED_RULE_FIELDS.filter((field) =>
      isMissingMetadataValue(rule[field]),
    );

    if (missingFields.length > 0) {
      warnings.push(
        `${rule.id} is missing metadata: ${missingFields.join(", ")}`,
      );
    }

    if (seenRuleIds.has(rule.id)) {
      warnings.push(`${rule.id} is registered more than once in ${groupName}`);
    }

    seenRuleIds.add(rule.id);
  }

  if (warnings.length > 0) {
    console.warn(
      `[analysis] Rule metadata warnings for ${groupName}:\n- ${warnings.join("\n- ")}`,
    );
  }

  return rules;
}
