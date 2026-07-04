export type DiffLine = {
  kind: "context" | "added" | "removed";
  text: string;
};

function buildLcsMatrix(left: string[], right: string[]): number[][] {
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array.from({ length: right.length + 1 }, () => 0),
  );

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      matrix[i][j] = left[i] === right[j]
        ? matrix[i + 1][j + 1] + 1
        : Math.max(matrix[i + 1][j], matrix[i][j + 1]);
    }
  }

  return matrix;
}

export function createSvgDiff(original: string, current: string): DiffLine[] {
  const left = original.split("\n");
  const right = current.split("\n");
  const matrix = buildLcsMatrix(left, right);
  const diff: DiffLine[] = [];

  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      diff.push({ kind: "context", text: left[i] ?? "" });
      i += 1;
      j += 1;
      continue;
    }

    if (matrix[i + 1][j] >= matrix[i][j + 1]) {
      diff.push({ kind: "removed", text: left[i] ?? "" });
      i += 1;
      continue;
    }

    diff.push({ kind: "added", text: right[j] ?? "" });
    j += 1;
  }

  while (i < left.length) {
    diff.push({ kind: "removed", text: left[i] ?? "" });
    i += 1;
  }

  while (j < right.length) {
    diff.push({ kind: "added", text: right[j] ?? "" });
    j += 1;
  }

  return diff;
}
