import type { Node, Link } from "./types";

export function dijkstra(
  nodes: Node[],
  links: Link[],
  start: number,
  end: number
) {
  const distances = {};
  const previous = {};
  const queue = [];

  nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  });
  distances[start] = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift();
    if (u === end) break;

    const neighbors = links.filter(
      (link) => link.source === u || link.target === u
    );
    neighbors.forEach((neighbor) => {
      const v = neighbor.source === u ? neighbor.target : neighbor.source;
      const alt = distances[u] + neighbor.weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = u;
      }
    });
  }

  const path = [];
  let u = end;
  while (previous[u] !== null) {
    path.unshift(u);
    u = previous[u];
  }
  if (distances[end] !== Infinity) {
    path.unshift(start);
  }
  return path;
}
