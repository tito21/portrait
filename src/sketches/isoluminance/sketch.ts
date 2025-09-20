import p5 from 'p5';



const isoluminaceSketch = (url: string) => {

    const blockSize = 4; // Size of each block
    // const numberPoints = 4;


    return (p: p5) => {
        let img: p5.Image;

        p.preload = () => {
            img = p.loadImage(url);
        }

        p.setup = () => {
            // Create a canvas and attach it to the sketch-container div
            p.createCanvas(img.width, img.height);
            // Set background color
            p.background(240);

            // Resize the image
            img.resize(p.width, p.height);

        }

        function getBlockColors(img: p5.Image, blockSize: number): p5.Color[] {
            let colors: p5.Color[] = [];
            img.loadPixels();
            // colorMode(RGB, 255);
            for (let y = 0; y < p.height; y += blockSize) {
                for (let x = 0; x < p.width; x += blockSize) {
                    let index = (x + y * (p.width)) * 4;
                    let r = img.pixels[index];
                    let g = img.pixels[index + 1];
                    let b = img.pixels[index + 2];
                    let c = p.color(r, g, b);
                    colors.push(c);
                }
            }
            // colorMode(HSL);
            return colors;
        }

        function uvToRgb(u: number, v: number, l: number): [number, number, number] {
            let r = u;
            let g = v;
            let b = (l - 0.2126 * r - 0.7152 * g) / 0.0722;
            return [r, g, b];
        }

        function isoluminance_square(target_color: p5.Color, angle = 0, distance = Math.SQRT1_2) {


            let r = p.red(target_color);
            let g = p.green(target_color);
            let b = p.blue(target_color);
            let l = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            let u0 = r;
            let v0 = g;

            let u1 = u0 + distance * Math.cos(angle);
            let v1 = v0 + distance * Math.sin(angle);

            let u2 = u0 + distance * Math.cos(angle + Math.PI / 2);
            let v2 = v0 + distance * Math.sin(angle + Math.PI / 2);

            let u3 = u0 + distance * Math.cos(angle + Math.PI);
            let v3 = v0 + distance * Math.sin(angle + Math.PI);

            let u4 = u0 + distance * Math.cos(angle + 3 * Math.PI / 2);
            let v4 = v0 + distance * Math.sin(angle + 3 * Math.PI / 2);

            let colors = [p.color(...uvToRgb(u1, v1, l)), p.color(...uvToRgb(u2, v2, l)), p.color(...uvToRgb(u3, v3, l)), p.color(...uvToRgb(u4, v4, l))];

            return colors

        }

        function placePbrush(x: number, y: number, color: p5.Color, size: number) {

            let colors = isoluminance_square(color, 1, 10);
            p.noStroke();

            for (let c of colors) {
                p.fill(c);
                // console.log(c);
                let offsetX = p.random(-size / 2, size / 2);
                let offsetY = p.random(-size / 2, size / 2);
                p.ellipse(x + offsetX, y + offsetY, size * 0.3, size * 0.3);
            }
        }

        p.draw = () => {

            // image(img, 0, 0, width, height);

            let colors = getBlockColors(img, blockSize);
            p.noStroke();

            let i = 0;
            for (let y = 0; y < p.height; y += blockSize) {
                for (let x = 0; x < p.width; x += blockSize) {
                    placePbrush(x, y, colors[i], 3 * blockSize);
                    i++;
                }
            }

            // console.log(colors[0`]);
            // console.log(isolumin`ance_square(colors[0], 1, 10));

            p.noLoop(); // Stop draw loop after first execution

        }
    }
};

export default isoluminaceSketch;