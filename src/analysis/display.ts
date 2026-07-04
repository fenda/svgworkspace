import type { Severity } from "@/analysis";

export function getSeverityTextClass(severity: Severity): string {
  switch (severity) {
    case "success":
      return "text-emerald-400";
    case "info":
      return "text-zinc-300";
    case "warning":
      return "text-amber-400/90";
    case "error":
      return "text-red-400";
  }
}

export function getSeverityIconClass(severity: Severity): string {
  switch (severity) {
    case "success":
      return "text-emerald-500";
    case "info":
      return "text-zinc-400";
    case "warning":
      return "text-amber-500";
    case "error":
      return "text-red-500";
  }
}
