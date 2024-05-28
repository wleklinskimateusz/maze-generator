import { Maze } from "./_maze/Maze";

type MazeProps = {
  n: number;
  width: number;
  height: number;
};

export const MazeGrid = () => {
  const n = 20;
  const gridSize = 600;

  const maze = new Maze(n, gridSize);
  function getColor(value: Maze["maze"][0][0]) {
    switch (value) {
      case "wall":
        return "black";
      case "empty":
        return "white";
      case "path":
        return "blue";
      default:
        value satisfies never;
    }
  }

  return (
    <svg width={gridSize} height={gridSize}>
      {maze.mapCells((cell, i) => (
        <rect
          key={i}
          x={cell.col}
          y={cell.row}
          width={maze.cellSize}
          height={maze.cellSize}
          fill={getColor(cell.value)}
        />
      ))}
    </svg>
  );
};
