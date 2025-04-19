import p5 from 'p5';

const nothingSketch = (url: string) => {

  return (p: p5) => {
    let image: p5.Image;

    p.preload = () => {
      image = p.loadImage(url);
    }

    p.setup = () => {
      p.createCanvas(image.width, image.height);
      p.noLoop();
    };

    p.draw = () => {
      p.imageMode(p.CENTER);
      p.image(image, p.width / 2, p.height / 2, image.width, image.height);
    }

  }
}

export default nothingSketch;