import p5 from 'p5';


function drawLine(v1: p5.Vector, v2: p5.Vector, p: p5) {
  p.line(v1.x, v1.y, v2.x, v2.y);
}

function makeLines(img: p5.Image, threshold: number, p: p5) {
  img.loadPixels();
  for (let i = 0; i < img.width - 1; i++) {
    for (let j = 0; j < img.height - 1; j++) {
      // console.log(img_mag.get(i, j));

      let a = img.pixels[(i + j * img.width) * 4] > threshold ? 1 : 0;
      let b = img.pixels[(i + 1 + j * img.width) * 4] > threshold ? 1 : 0;
      let c = img.pixels[(i + 1 + (j + 1) * img.width) * 4] > threshold ? 1 : 0;
      let d = img.pixels[(i + (j + 1) * img.width) * 4] > threshold ? 1 : 0;

      let code = a * 8 + b * 4 + c * 2 + d;

      let a_val = img.pixels[(i + j * img.width) * 4];
      let b_val = img.pixels[(i + 1 + j * img.width) * 4];
      let c_val = img.pixels[(i + 1 + (j + 1) * img.width) * 4];
      let d_val = img.pixels[(i + (j + 1) * img.width) * 4];
      let y = j + 0.5;
      let x = i + 0.5;

      let a_vec = p.createVector();
      let amt = (1 - a_val) / (b_val - a_val);
      amt = 0.5;
      a_vec.x = p.lerp(x - 0.5, x + 0.5, amt);
      // a_vec.x = x + 0.5;
      a_vec.y = y - 0.5;

      let b_vec = p.createVector();
      amt = (1 - b_val) / (c_val - b_val);
      amt = 0.5;
      b_vec.x = x + 0.5;
      b_vec.y = p.lerp(y - 0.5, y + 0.5, amt);
      // b_vec.y = y + 0.5;

      let c_vec = p.createVector();
      amt = (1 - d_val) / (c_val - d_val);
      amt = 0.5;
      c_vec.x = p.lerp(x - 0.5, x + 0.5, amt);
      // c_vec.x = x + 0.5;
      c_vec.y = y + 0.5;

      let d_vec = p.createVector();
      amt = (1 - a_val) / (d_val - a_val);
      amt = 0.5;
      d_vec.x = x - 0.5;

      d_vec.y = p.lerp(y - 0.5, y + 0.5, amt);


      switch (code) {
        case 1:
          drawLine(c_vec, d_vec, p);
          break;
        case 2:
          drawLine(b_vec, c_vec, p);
          break;
        case 3:
          drawLine(b_vec, d_vec, p);
          break;
        case 4:
          drawLine(a_vec, b_vec, p);
          break;
        case 5:
          drawLine(a_vec, d_vec, p);
          drawLine(b_vec, c_vec, p);
          break;
        case 6:
          drawLine(a_vec, c_vec, p);
          break;
        case 7:
          drawLine(a_vec, d_vec, p);
          break;
        case 8:
          drawLine(a_vec, d_vec, p);
          break;
        case 9:
          drawLine(a_vec, c_vec, p);
          break;
        case 10:
          drawLine(a_vec, b_vec, p);
          drawLine(c_vec, d_vec, p);
          break;
        case 11:
          drawLine(a_vec, b_vec, p);
          break;
        case 12:
          drawLine(b_vec, d_vec, p);
          break;
        case 13:
          drawLine(b_vec, c_vec, p);
          break;
        case 14:
          drawLine(c_vec, d_vec, p);
          break;
      }
    }
  }

}

export default function lineSketch(url: string) {

  let image: p5.Image;
  let imgCopy: p5.Image;

  return (p: p5) => {
    p.preload = () => {
      image = p.loadImage(url);
    };

    p.setup = () => {
      imgCopy = p.createImage(image.width, image.height);
      imgCopy.copy(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
      image.filter(p.BLUR, 2);
      image.filter(p.POSTERIZE, 8);
      image.loadPixels();
      p.createCanvas(image.width, image.height);
      p.noLoop();
    };

    p.draw = () => {
      p.background(255);
      // p.image(image, 0, 0, image.width, image.height);
      p.stroke('black');

      makeLines(image, 224, p);
      makeLines(image, 192, p);
      makeLines(image, 160, p);
      makeLines(image, 128, p);
      makeLines(image, 96, p);
      makeLines(image, 64, p);
      makeLines(image, 32, p);

      // p.strokeWeight(1);
      // imgCopy.filter(p.GRAY);
      // p.image(imgCopy, 0, 0, image.width, image.height);

      // p.stroke('green');
      // makeLines(image, 192, p);

      // p.stroke('white');
      // makeLines(image, 127, p);

      // p.stroke('red');
      // makeLines(image, 65, p);

    }

  }
}
