import {
  Code2,
  Eye,
  Globe,
  Layers,
  Maximize2,
  Palette,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const navItems: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { label: "Workspace", href: "/playground", icon: Code2 },
  { label: "Optimize", href: "/optimize", icon: Sparkles },
  { label: "Convert", href: "/convert", icon: Code2 },
  { label: "Colors", href: "/colors", icon: Palette },
  { label: "Sprite", href: "/sprite", icon: Layers },
  { label: "Inspect", href: "/inspect", icon: Eye },
];

export const heroBadges = [
  "🔒 Browser only",
  "⚡ Instant",
  "❤️ Private",
] as const;

export const quickActions: {
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { label: "Convert to React", icon: Code2, color: "text-sky-400" },
  { label: "Optimize SVG", icon: Sparkles, color: "text-emerald-400" },
  { label: "Preview SVG", icon: Eye, color: "text-violet-400" },
  { label: "Replace Colors", icon: Palette, color: "text-fuchsia-400" },
  { label: "Build succeeded", icon: Layers, color: "text-amber-400" },
  { label: "Inspect SVG", icon: Wrench, color: "text-orange-400" },
];

export const svgMetadata = {
  filename: "logo-example.svg",
  viewBox: "24 × 24",
  size: "2.4 KB",
  paths: 3,
  colors: 2,
  responsive: "Yes",
};

export const analysisData = {
  grade: "A",
  score: 92,
  maxScore: 100,
  label: "Production Ready",
  potentialGains: ["+5 Score", "−18% File Size", "3 Improvements"],
  improvementsFound: 3,
  estimatedReduction: "18%",
  estimatedSavings: "~450 B smaller",
  checks: [
    { label: "Well structured", status: "good" as const },
    { label: "Accessible", status: "good" as const },
    { label: "Responsive", status: "good" as const },
    { label: "Can be optimized", status: "warning" as const },
  ],
  summary: [
    { label: "ViewBox", value: "Good", status: "good" as const },
    { label: "Responsive", value: "Yes", status: "good" as const },
    { label: "Accessible", value: "Yes", status: "good" as const },
    { label: "Hardcoded colors", value: "2 found", status: "warning" as const },
    {
      label: "Illustrator metadata",
      value: "Detected",
      status: "warning" as const,
    },
  ],
};

export const improvements = [
  {
    id: "optimize",
    title: "Optimize SVG",
    description: "Remove unnecessary data and reduce file size.",
    badge: "Best impact",
    badgeVariant: "success" as const,
    icon: Sparkles,
    iconColor: "text-emerald-400 bg-emerald-400/10",
    metric: "18% smaller",
  },
  {
    id: "colors",
    title: "Replace Colors",
    description:
      "Convert hardcoded fills to currentColor to make your SVG flexible.",
    icon: Palette,
    iconColor: "text-violet-400 bg-violet-400/10",
    metric: "2 colors",
  },
  {
    id: "clean",
    title: "Clean SVG",
    description: "Remove metadata and editor-specific information.",
    icon: Wrench,
    iconColor: "text-amber-400 bg-amber-400/10",
    metric: "~450 B smaller",
  },
];

export const continueActions = [
  {
    label: "React",
    description: "React component",
    icon: Code2,
    color: "text-sky-400",
  },
  {
    label: "Vue",
    description: "Vue component",
    icon: Code2,
    color: "text-emerald-400",
  },
  {
    label: "HTML",
    description: "Inline SVG",
    icon: Globe,
    color: "text-orange-400",
  },
  {
    label: "Preview",
    description: "Live preview",
    icon: Eye,
    color: "text-violet-400",
  },
  {
    label: "Sprite",
    description: "SVG sprite",
    icon: Layers,
    color: "text-fuchsia-400",
  },
  {
    label: "Dimensions",
    description: "Resize & scale",
    icon: Maximize2,
    color: "text-amber-400",
  },
];

export const footerLinks = {
  product: [
    { label: "Features", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  resources: [
    { label: "Docs", href: "#" },
    { label: "Learn", href: "#" },
    { label: "Examples", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "License", href: "#" },
  ],
};

export const EXAMPLE_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="6" fill="#8B5CF6"/>
  <ellipse cx="12" cy="12" rx="10" ry="3" stroke="#A78BFA" stroke-width="1.5" fill="none" transform="rotate(-20 12 12)"/>
  <circle cx="10" cy="10" r="1.5" fill="#C4B5FD" opacity="0.8"/>
</svg>`;
