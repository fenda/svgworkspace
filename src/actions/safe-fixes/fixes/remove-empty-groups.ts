function isMeaningfulGroup(group: SVGGElement): boolean {
  return group.children.length > 0 || Boolean(group.textContent?.trim());
}

export function removeEmptyGroups(svg: SVGSVGElement): void {
  let changed = true;

  while (changed) {
    changed = false;

    Array.from(svg.querySelectorAll("g")).forEach((group) => {
      if (!isMeaningfulGroup(group)) {
        group.remove();
        changed = true;
      }
    });
  }
}
