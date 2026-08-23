import type { AnalysisRule } from "@/analysis/models";
import { getBrokenLocalReferenceIds } from "@/lib/svg/references";
import { createRuleFinding } from "../utils";

export const structure009BrokenInternalReferences: AnalysisRule = {
  id: "STRUCTURE_009",
  category: "structure",
  title: "Broken Internal References",
  description:
    "One or more local SVG references point to IDs that are not present in this document.",
  severity: "warning",
  scoreImpact: 5,
  fixType: "manual",
  introducedIn: "0.5.0",
  status: "implemented",
  analyze(svg) {
    const brokenReferences = getBrokenLocalReferenceIds(svg);

    if (brokenReferences.length === 0) {
      return null;
    }

    const count = brokenReferences.length;

    return createRuleFinding(structure009BrokenInternalReferences, {
      description:
        count === 1
          ? "1 local SVG reference points to an ID that is not present in this document. The referenced paint, clipping, masking, filter, marker, or <use> content may not render as intended."
          : `${count} local SVG references point to IDs that are not present in this document. The referenced paint, clipping, masking, filter, marker, or <use> content may not render as intended.`,
      recommendation:
        "Define the missing IDs or update the references to valid elements in this SVG.",
    });
  },
};
