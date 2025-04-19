import './style.css'
import './header.css'

import p5 from 'p5';

import nothingSketch from './sketches/nothing/sketch.ts';
import triangleSketch from './sketches/triangle/sketch.ts';
import pointillismSketch from './sketches/pointillism/sketch.ts';

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const downloadButton = document.getElementById('download-button') as HTMLButtonElement;
let url= '';

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


const sketches = [
  {name: "nothing", sketch: nothingSketch},
  {name: "triangle", sketch: triangleSketch},
  {name: "pointillism", sketch: pointillismSketch},
]

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