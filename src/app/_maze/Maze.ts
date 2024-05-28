import { dijkstra } from "./dijkstra";
import { kruskal } from "./kruskal";
import type { Link, Node } from "./types";

export class Maze {
  public cellSize: number;
  private maze: ("wall" | "empty" | "path")[][];
  private nodes: Node[];
  private mstLinks: Link[];

  constructor(private n: number, private width: number) {
    this.cellSize = this.width / (2 * n + 1);
    // Function to create a grid graph

    // Create the grid graph
    const { nodes, links } = createGridGraph(n);
    this.nodes = nodes;

    // Find the minimum spanning tree
    this.mstLinks = kruskal(nodes, links);

    // Initialize a 2D array to represent the maze
    this.maze = Array.from({ length: 2 * n + 1 }, () =>
      Array<"wall" | "empty" | "path">(2 * n + 1).fill("wall")
    );

    // Carve paths in the maze based on the minimum spanning tree
    this.mstLinks.forEach((link) => {
      const source = nodes[link.source];
      const target = nodes[link.target];
      const x1 = 2 * source.x + 1;
      const y1 = 2 * source.y + 1;
      const x2 = 2 * target.x + 1;
      const y2 = 2 * target.y + 1;
      this.maze[y1][x1] = "empty";
      this.maze[y2][x2] = "empty";
      this.maze[(y1 + y2) / 2][(x1 + x2) / 2] = "empty";
    });
  }
  mapCells<T>(
    callback: (
      cell: { value: "wall" | "empty" | "path"; row: number; col: number },
      index: number
    ) => T
  ) {
    return this.maze.flat().map((cell, index) => {
      const row = Math.floor(index / (2 * this.n + 1)) * this.cellSize;
      const col = (index % (2 * this.n + 1)) * this.cellSize;
      return callback({ value: cell, row, col }, index);
    });
  }
  solve() {
    // Find the shortest path
    const startNode = 0; // Top-left corner
    const endNode = this.n * this.n - 1; // Bottom-right corner
    const shortestPath = dijkstra(
      this.nodes,
      this.mstLinks,
      startNode,
      endNode
    );

    // Highlight the shortest path in the maze
    shortestPath.forEach((node, index) => {
      if (index < shortestPath.length - 1) {
        const source = this.nodes[node];
        const target = this.nodes[shortestPath[index + 1]];
        const x1 = 2 * source.x + 1;
        const y1 = 2 * source.y + 1;
        const x2 = 2 * target.x + 1;
        const y2 = 2 * target.y + 1;
        this.maze[y1][x1] = "path";
        this.maze[y2][x2] = "path";
        this.maze[(y1 + y2) / 2][(x1 + x2) / 2] = "path";
      }
    });
  }
}

function createGridGraph(n: number) {
  const nodes = new Array(n).fill(null).flatMap((_, i) =>
    new Array(n).fill(null).map((_, j) => ({
      id: i * n + j,
      x: j,
      y: i,
    }))
  );

  const links = nodes.flatMap((node) => {
    const { id, x, y } = node;
    if (x === n - 1 && y === n - 1) return [];
    if (x === n - 1)
      return [{ source: id, target: id + n, weight: Math.random() }];
    if (y === n - 1)
      return [{ source: id, target: id + 1, weight: Math.random() }];
    return [
      { source: id, target: id + 1, weight: Math.random() },
      { source: id, target: id + n, weight: Math.random() },
    ];
  });

  return { nodes, links };
}
