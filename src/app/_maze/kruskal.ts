import { Link, Node, Parent, Rank } from "./types";

// Helper function to initialize the union-find data structure
const initializeUnionFind = (nodes: Node[]) => {
  const parent = nodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: node.id }),
    {} as Parent
  );
  const rank = nodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: 0 }),
    {} as Rank
  );
  return { parent, rank };
};

const find = (parent: Parent, node: number): Parent => {
  if (parent[node] !== node) {
    const root = find(parent, parent[node])[parent[node]];
    return { ...parent, [node]: root };
  }
  return parent;
};

// Helper function to union two sets
const union = (parent: Parent, rank: Rank, x: number, y: number) => {
  const rootX = find(parent, x)[x];
  const rootY = find(parent, y)[y];

  if (rootX === rootY) return { parent, rank };

  if (rank[rootX] > rank[rootY])
    return {
      parent: { ...parent, [rootY]: rootX },
      rank,
    };
  else if (rank[rootX] < rank[rootY])
    return {
      parent: { ...parent, [rootX]: rootY },
      rank,
    };
  else
    return {
      parent: { ...parent, [rootY]: rootX },
      rank: { ...rank, [rootX]: rank[rootX] + 1 },
    };
};

export function kruskal(nodes: Node[], edges: Link[]) {
  const { parent: initialParent, rank: initialRank } =
    initializeUnionFind(nodes);

  const sortedEdges = edges.slice().sort((a, b) => a.weight - b.weight);
  console.log(sortedEdges);
  const result = sortedEdges.reduce(
    (acc, edge) => {
      const { parent, rank, mst } = acc;
      const { source, target } = edge;

      const newParent = find(parent, source);
      const rootSource = newParent[source];
      const newParent2 = find(newParent, target);
      const rootTarget = newParent2[target];

      if (rootSource !== rootTarget) {
        const { parent: updatedParent, rank: updatedRank } = union(
          newParent2,
          rank,
          rootSource,
          rootTarget
        );
        return {
          parent: updatedParent,
          rank: updatedRank,
          mst: [...mst, edge],
        };
      }

      return acc;
    },
    { parent: initialParent, rank: initialRank, mst: [] as Link[] }
  );

  return result.mst;
}
