export function getCommentCount(svg: SVGSVGElement): number {
  const walker = svg.ownerDocument.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
  let count = 0;

  while (walker.nextNode()) {
    count += 1;
  }

  return count;
}

export function removeComments(svg: SVGSVGElement): void {
  const walker = svg.ownerDocument.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];

  while (walker.nextNode()) {
    comments.push(walker.currentNode as Comment);
  }

  comments.forEach((comment) => comment.remove());
}
