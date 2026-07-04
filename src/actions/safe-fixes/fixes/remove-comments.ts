export function removeComments(svg: SVGSVGElement): void {
  const walker = svg.ownerDocument.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];

  while (walker.nextNode()) {
    comments.push(walker.currentNode as Comment);
  }

  comments.forEach((comment) => comment.remove());
}
