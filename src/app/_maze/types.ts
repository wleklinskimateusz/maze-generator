export type Node = { id: number; x: number; y: number };
export type Parent = { [key: Node["id"]]: Node["id"] };
export type Rank = Record<Node["id"], number>;
export type Link = { source: number; target: number; weight: number };
