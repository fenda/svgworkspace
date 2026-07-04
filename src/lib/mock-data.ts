import {
  Code2,
  Eye,
  Globe,
  Layers,
  Maximize2,
  Monitor,
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

export const sidebarSections: {
  label: string;
  items: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[];
}[] = [
  {
    label: "Improve",
    items: [
      { label: "Optimize", href: "/optimize", icon: Sparkles },
      { label: "Replace Colors", href: "/colors", icon: Palette },
    ],
  },
  {
    label: "Convert",
    items: [
      { label: "React", href: "/convert", icon: Code2 },
      { label: "Vue", href: "/convert", icon: Code2 },
      { label: "HTML", href: "/convert", icon: Globe },
    ],
  },
  {
    label: "Inspect",
    items: [
      { label: "Preview", href: "/inspect", icon: Monitor },
      { label: "Dimensions", href: "/inspect", icon: Maximize2 },
      { label: "Inspect SVG", href: "/inspect", icon: Eye },
    ],
  },
  {
    label: "Build",
    items: [{ label: "Sprite", href: "/sprite", icon: Layers }],
  },
];

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

export const EXAMPLE_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="6" fill="#8B5CF6"/>
  <ellipse cx="12" cy="12" rx="10" ry="3" stroke="#A78BFA" stroke-width="1.5" fill="none" transform="rotate(-20 12 12)"/>
  <circle cx="10" cy="10" r="1.5" fill="#C4B5FD" opacity="0.8"/>
</svg>`;
