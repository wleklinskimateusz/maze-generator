import type { Node, Link } from "./types";

export function dijkstra(
  nodes: Node[],
  links: Link[],
  start: number,
  end: number
) {
  const queue: number[] = nodes.map((node) => node.id);
  const distances = nodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: Infinity }),
    {} as Record<number, number>
  );
  const previous: Record<number, number | null> = nodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: null }),
    {}
  );

  distances[start] = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const current = queue.shift();
    if (current === end) break;
    if (current === undefined) throw new Error("Queue is empty");

    const neighbors = links.filter(
      (link) => link.source === current || link.target === current
    );
    neighbors.forEach((neighbor) => {
      const v = neighbor.source === current ? neighbor.target : neighbor.source;
      const alt = distances[current] + neighbor.weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = current;
      }
    });
  }

  const path = [];
  let u: number | null = end;
  while (u !== null && previous[u] !== null) {
    path.unshift(u);
    u = previous[u];
  }
  if (distances[end] !== Infinity) {
    path.unshift(start);
  }
  return path;
}
