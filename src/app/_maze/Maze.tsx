"use client";
import { select } from "d3";
import { useEffect, useLayoutEffect, useRef } from "react";
import { generateMaze } from "./maze";

type MazeProps = {
  n: number;
  width: number;
  height: number;
};

export const Maze = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgElement = select(svgRef.current);
  const n = 20;
  const width = 600;
  const height = 600;
  const cellSize = width / (2 * n + 1);
  const maze = generateMaze(n);

  return (
    <svg ref={svgRef} width={width} height={height}>
      {maze.flat().map((cell, i) => (
        <rect
          key={i}
          x={(i % (2 * n + 1)) * cellSize}
          y={Math.floor(i / (2 * n + 1)) * cellSize}
          width={cellSize}
          height={cellSize}
          fill={cell === 1 ? "black" : cell === 2 ? "blue" : "white"}
        />
      ))}
    </svg>
  );
};
