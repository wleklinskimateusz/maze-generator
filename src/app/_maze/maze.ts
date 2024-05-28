// maze.js
import { dijkstra } from "./dijkstra";
import { kruskal } from "./kruskal";

export function generateMaze(n: number) {
  // Function to create a grid graph
  function createGridGraph(n: number) {
    const nodes = new Array(n)
      .fill(null)
      .map((_, i) =>
        new Array(n).fill(null).map((_, j) => ({
          id: i * n + j,
          x: j,
          y: i,
        }))
      )
      .flat();

    const links = new Array(n - 1)
      .fill(null)
      .map((_, i) =>
        new Array(n - 1).fill(null).map((_, j) => ({
          source: i * n + j,
          target: i * n + j + 1,
          weight: Math.random(),
        }))
      )
      .flat();

    return { nodes, links };
  }

  // Dijkstra's algorithm to find the shortest path

  // Create the grid graph
  const { nodes, links } = createGridGraph(n);

  // Find the minimum spanning tree
  const mstLinks = kruskal(nodes, links);
  console.log("MST Links:", mstLinks);

  // Initialize a 2D array to represent the maze
  const maze = Array.from({ length: 2 * n + 1 }, () =>
    Array<number>(2 * n + 1).fill(1)
  );

  // Carve paths in the maze based on the minimum spanning tree
  mstLinks.forEach((link) => {
    const source = nodes[link.source];
    const target = nodes[link.target];
    const x1 = 2 * source.x + 1;
    const y1 = 2 * source.y + 1;
    const x2 = 2 * target.x + 1;
    const y2 = 2 * target.y + 1;
    maze[y1][x1] = 0;
    maze[y2][x2] = 0;
    maze[(y1 + y2) / 2][(x1 + x2) / 2] = 0;
  });

  // Find the shortest path
  const startNode = 0; // Top-left corner
  const endNode = n * n - 1; // Bottom-right corner
  const shortestPath = dijkstra(nodes, mstLinks, startNode, endNode);

  // Highlight the shortest path in the maze
  shortestPath.forEach((node, index) => {
    if (index < shortestPath.length - 1) {
      const source = nodes[node];
      const target = nodes[shortestPath[index + 1]];
      const x1 = 2 * source.x + 1;
      const y1 = 2 * source.y + 1;
      const x2 = 2 * target.x + 1;
      const y2 = 2 * target.y + 1;
      maze[y1][x1] = 2;
      maze[y2][x2] = 2;
      maze[(y1 + y2) / 2][(x1 + x2) / 2] = 2;
    }
  });
  return maze;
}
