import { removeUnusedNamespacesFromSvg } from "@/lib/svg/namespaces";

export function removeUnusedNamespaces(svg: SVGSVGElement): void {
  removeUnusedNamespacesFromSvg(svg);
}
