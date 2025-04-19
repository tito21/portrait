
export interface Point {
  x: number;
  y: number;
};


function distance(p1: Point | undefined, p2: Point | undefined): number {
  if (p1 === undefined || p2 === undefined) {
    return 0;
  }
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function poissonDiskSampling(radius: number, k: number, width: number, height: number): Array<Point> {
  const points: Array<Point> = [];
  const active: Array<Point> = [];


  const cellsize = radius / Math.sqrt(2);
  console.log(width, height);
  const ncols = Math.ceil(width / cellsize) + 1;
  const nrows = Math.ceil(height / cellsize) + 1;
  console.log(ncols, nrows);
  const grid = Array(ncols * nrows).fill(undefined);
  let p0: Point = { x: Math.random() * width, y: Math.random() * height };

  insertPoint(grid, p0, cellsize, ncols);
  points.push(p0);
  active.push(p0);

  while (active.length > 0) {
    const randomIndex = Math.floor(Math.random() * active.length);
    const p: Point = active[randomIndex];
    let found = false;
    for (let tries = 0; tries < k; tries++) {
      const theta: number = Math.random() * 2 * Math.PI;
      const newRadius: number = Math.random() * radius + radius;
      const newPoint: Point = { x: p.x + newRadius * Math.cos(theta), y: p.y + newRadius * Math.sin(theta) };

      if (!isValidPoint(grid, newPoint, radius, cellsize, ncols, nrows, width, height)) {
        continue;
      }

      points.push(newPoint);
      insertPoint(grid, newPoint, cellsize, ncols);
      active.push(newPoint);
      found = true;
      break;
    }
    if (!found) {
      active.splice(randomIndex, 1);
    }
  }
  return points;
}

function insertPoint(grid: Array<Point | undefined>, point: Point, cellsize: number, ncols: number) {
  grid[Math.floor(point.x / cellsize) + Math.floor(point.y / cellsize) * ncols] = point;
}

function isValidPoint(grid: Array<Point | undefined>, point: Point, radius: number, cellsize: number, ncols: number, nrows: number, width: number, height: number): boolean {
  if (point.x < 0 || point.x >= width || point.y < 0 || point.y >= height) {
    return false;
  }
  const x = Math.floor(point.x / cellsize);
  const y = Math.floor(point.y / cellsize);

  for (let i = Math.max(0, x - 1); i <= Math.min(ncols - 1, x + 1); i++) {
    for (let j = Math.max(0, y - 1); j <= Math.min(nrows - 1, y + 1); j++) {
      if (grid[i + j * ncols] != undefined) {
        if (distance(grid[i + j * ncols], point) < radius) {
          return false;
        }
      }
    }
  }
  return true;
}
