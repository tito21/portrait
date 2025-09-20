import p5 from 'p5';
import * as d3 from 'd3';


function getPoints(p: p5, image: p5.Image, numPoints: number): p5.Vector[] {
  const points: p5.Vector[] = [];
  for (let i = 0; i < numPoints; i++) {
    let x = Math.random() * image.width;
    let y = Math.random() * image.height;
    const pixelColor = image.get(Math.floor(x), Math.floor(y));
    const brightness = p.brightness(pixelColor);
    if (brightness < Math.random() * 100) {
      points.push(p.createVector(x, y));
    } else {
      i--; // If the point is too bright, try again
    }
  }
  return points;
}

function getDelaunay(points: p5.Vector[]): d3.Delaunay<number> {

  const pointsArray: number[] = [];
  for (const point of points) {
    pointsArray.push(point.x, point.y);
  }
  const delaunay = new d3.Delaunay(pointsArray);
  return delaunay;
}

function displayPoints(p: p5, points: p5.Vector[], image: p5.Image, avgWeights: number[], maxWeight: number) {
  p.background(255);
  for (const point of points) {
    p.stroke(image.get(Math.floor(point.x), Math.floor(point.y)));
    p.strokeWeight(p.map(avgWeights[points.indexOf(point)], 0, maxWeight, 1, 10));
    p.point(point.x, point.y);
  }
}

function updatePoints(p: p5, image: p5.Image, points: p5.Vector[], delaunay: d3.Delaunay<number>, voronoi: d3.Voronoi<number>): { delaunay: d3.Delaunay<number>, voronoi: d3.Voronoi<number>, avgWeights: number[], maxWeight: number } {
  // Move points towards the centroid of their Voronoi cell

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  let centroids = new Array(cells.length).fill(0).map(() => p.createVector(0, 0));
  let weights = new Array(cells.length).fill(0);
  let counts = new Array(cells.length).fill(0);
  let avgWeights = new Array(cells.length).fill(0);

  let delaunayIndex = 0;
  image.loadPixels();
  for (let i = 0; i < image.width; i++) {
    for (let j = 0; j < image.height; j++) {
      const index = (i + j * image.width) * 4;
      const pixelColor = [image.pixels[index], image.pixels[index + 1], image.pixels[index + 2]];
      // 0.2126 R + 0.7152 G + 0.0722 B
      const brightness = pixelColor[0] * 0.2126 + pixelColor[1] * 0.7152 + pixelColor[2] * 0.0722; // Using luminance formula
      const weight = 1 - brightness / 255; // Normalize brightness to [0, 1]
      // console.log(brightness, weight);
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      // console.log(delaunayIndex, i, j, weight);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
      counts[delaunayIndex] += 1;
    }
  }

  let maxWeight = 0;
  centroids = centroids.map((centroid, index) => {
    if (weights[index] > 0) {
      avgWeights[index] = weights[index] / (counts[index] || 1);
      if (avgWeights[index] > maxWeight) {
        maxWeight = avgWeights[index];
      }
      return centroid.div(weights[index]);
    } else {
      return points[index].copy();
    }
  }
  );

  points.forEach((point, index) => {
    point.lerp(centroids[index], 0.1);
  });

  delaunay = getDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, image.width, image.height]);
  return { delaunay: delaunay, voronoi: voronoi, avgWeights: avgWeights, maxWeight: maxWeight };
}

const stipplingSketch = (url: string) => {
  let numPoints = 5000;

  return (p: p5) => {
    let image: p5.Image;
    let points: p5.Vector[] = [];
    let voronoi: d3.Voronoi<number>;
    let delaunay: d3.Delaunay<number>;


    p.preload = () => {
      image = p.loadImage(url);
    }

    p.setup = () => {

      p.createCanvas(image.width, image.height);
      p.background(255);

      // p.noLoop();
      console.log(image.width, image.height);
      points = getPoints(p, image, numPoints);
      delaunay = getDelaunay(points);
      voronoi = delaunay.voronoi([0, 0, image.width, image.height]);

    }

    p.draw = () => {
      const { delaunay: newDelaunay, voronoi: newVoronoi, avgWeights, maxWeight } = updatePoints(p, image, points, delaunay, voronoi);
      delaunay = newDelaunay;
      voronoi = newVoronoi;
      displayPoints(p, points, image, avgWeights, maxWeight);
    }

  }
}

export default stipplingSketch;