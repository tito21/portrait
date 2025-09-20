import './style.css'
import './header.css'
import './capture.css'

import p5 from 'p5';

import nothingSketch from './sketches/nothing/sketch.ts';
import triangleSketch from './sketches/triangle/sketch.ts';
import pointillismSketch from './sketches/pointillism/sketch.ts';
import lineSketch from './sketches/line/sketch.ts';
import stipplingSketch from './sketches/stippling/sketch.ts';
import isoluminanceSketch from './sketches/isoluminance/sketch.ts';

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const downloadButton = document.getElementById('download-button') as HTMLButtonElement;
const captureButton = document.getElementById('capture-button') as HTMLButtonElement;
const captureContainer = document.getElementById('capture-container') as HTMLDivElement;
const saveButton = document.getElementById('save-button') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const video = document.getElementById('video') as HTMLVideoElement;

let url= '';
let streaming = false;
let width = 640;
let height = 0;

downloadButton.addEventListener('click', () => {
  const sketchContainer = document.getElementById('sketch');
  if (sketchContainer) {
    const canvas = sketchContainer.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'sketch.png';
      link.click();
    }
  }
});

fileInput.addEventListener('change', (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      url = e.target?.result as string;
      const selected = document.querySelector('.selected')!;
      selected.dispatchEvent(new Event('click'));
    };
    reader.readAsDataURL(file);
  }
});

captureButton.addEventListener('click', () => {
  captureContainer.style.display = 'flex';
  navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error(`An error occurred: ${err}`);
  });

  video.addEventListener(
    "canplay",
    (_) => {
      if (!streaming) {
        height = (video.videoHeight / video.videoWidth) * width;
        video.setAttribute("width", width.toString());
        video.setAttribute("height", height.toString());
        streaming = true;
      }
    },
    false,
  );
});

saveButton.addEventListener('click', () => {
  streaming = false;
  captureContainer.style.display = 'none';

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    url = canvas.toDataURL("image/png");
    const selected = document.querySelector('.selected')!;
    selected.dispatchEvent(new Event('click'));

  }
});

const sketches = [
  {name: "Nothing", sketch: nothingSketch},
  {name: "Triangle", sketch: triangleSketch},
  {name: "Pointillism", sketch: pointillismSketch},
  {name: "Line", sketch: lineSketch},
  {name: "Stippling", sketch: stipplingSketch},
  {name: "Isoluminance", sketch: isoluminanceSketch},
];

const navList = document.getElementById('nav-list');

sketches.forEach(({name, sketch}) => {
  const li = document.createElement('li');
  li.innerText = name;
  li.addEventListener('click', () => {
    const sketchContainer = document.getElementById('sketch');
    sketchContainer?.replaceChildren();
    new p5(sketch(url), sketchContainer as HTMLElement);
    const selected = document.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }
    li.classList.add('selected');
  });
  navList?.appendChild(li);
});

const firstSketch = navList?.firstElementChild!
firstSketch.classList.add('selected');
firstSketch.dispatchEvent(new Event('click'));