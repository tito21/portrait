import p5 from 'p5';
import * as c2 from 'c2.js';

const triangleSketch = (url: string) => {
  let numPoints = 5000;

  return (p: p5) => {
    let image: p5.Image;

    p.preload = () => {
      image = p.loadImage(url);
    }

    p.setup = () => {

      p.createCanvas(image.width, image.height);
      p.background(255);
      p.noStroke();

      p.ellipseMode(p.CENTER);

      p.noLoop();
      console.log(image.width, image.height);
    }

    p.draw = () => {

      let points: Array<c2.Point> = [];
      for (let i = 0; i < numPoints; i++) {
        points.push(new c2.Point(p.random(p.width), p.random(p.height)));
      }

      let delaunay = new c2.Delaunay();
      delaunay.compute(points);
      let triangles = delaunay.triangles;

      for (let i = 0; i < triangles.length; i++) {
        let centroid = triangles[i].centroid();
        let c = image.get(centroid.x, centroid.y);

        p.fill(c);
        p.stroke(1, 0.5);
        p.triangle(triangles[i].p1.x, triangles[i].p1.y,
          triangles[i].p2.x, triangles[i].p2.y,
          triangles[i].p3.x, triangles[i].p3.y);
      }
    }

  }
}

export default triangleSketch;