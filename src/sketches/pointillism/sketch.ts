import p5 from 'p5';

import { poissonDiskSampling } from './poissonDisk';
import type { Point } from './poissonDisk';

const pointillismSketch = (url: string) => {


  let radiusArray = [200, 50, 30, 10];
  const k = 30;

  let pointsArrays: Array<Array<Point>> = [];
  let indices = [];

  return (p: p5) => {
    let image: p5.Image;

    p.preload = () => {
      image = p.loadImage(url);
    }

    p.setup = () => {
      p.createCanvas(image.width, image.height);
      p.noLoop();
      p.noStroke();
      p.background(255);

      indices = [];
      for (let i = 0; i < radiusArray.length; i++) {
        // console.log(radius[i]);
        pointsArrays.push(poissonDiskSampling(radiusArray[i], k, p.width, p.height));
        indices.push(0);
      }
    };

    p.draw = () => {

      p.background(255);
      for (let i = 0; i < pointsArrays.length; i++) {
        for (let j = 0; j < pointsArrays[i].length; j++) {
          p.fill(p.color(image.get(pointsArrays[i][j].x, pointsArrays[i][j].y)));
          p.ellipse(pointsArrays[i][j].x, pointsArrays[i][j].y, radiusArray[i], radiusArray[i]);
        }
      }
      console.log('done');
    }

  }
}

export default pointillismSketch;
