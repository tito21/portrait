declare module 'c2.js'

{
  export class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  export class Triangle {
    constructor(p1: Point, p2: Point, p3: Point);
    p1: Point;
    p2: Point;
    p3: Point;
    centroid(): Point;
  }

  export class Delaunay {
    constructor();
    compute(points: Array<Point>): void;
    triangles: Array<Triangle>;
  }
}