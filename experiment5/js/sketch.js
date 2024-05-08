// sketch.js - purpose and description here
// Author: Your Name
// Date:

/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

function preload() {
  
  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}

// function getColorPalette(image, numColors) {
//   let colorCounts = {};
//   let sortedColors;
//   image.loadPixels();
//   for (let i = 0; i < image.pixels.length; i += 4) {
//     let r = image.pixels[i];
//     let g = image.pixels[i+1];
//     let b = image.pixels[i+2];
//     let alpha = image.pixels[i+3];
//     if (alpha > 128) { // consider only opaque pixels
//       let color = `${r},${g},${b}`;
//       colorCounts[color] = (colorCounts[color] || 0) + 1;
//     }
//   }
//   sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
//   return sortedColors.slice(0, numColors).map(col => {
//     let [r, g, b] = col.split(',');
//     return {color: [r, g, b], count: colorCounts[col]};
//   });
// }

function colorDistance(color1, color2) {
  // Parse RGB values
  let r1 = parseInt(color1[0]), g1 = parseInt(color1[1]), b1 = parseInt(color1[2]);
  let r2 = parseInt(color2[0]), g2 = parseInt(color2[1]), b2 = parseInt(color2[2]);

  // Euclidean distance between two colors
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
}

function getColorPalette(image, numColors) {
  let colorCounts = {};
  let distinctColors = [];
  const similarityThreshold = 60; // Adjust this threshold based on your needs

  image.loadPixels();
  for (let i = 0; i < image.pixels.length; i += 4) {
      let r = image.pixels[i];
      let g = image.pixels[i + 1];
      let b = image.pixels[i + 2];
      let alpha = image.pixels[i + 3];
      if (alpha > 128) { // consider only opaque pixels
          let color = `${r},${g},${b}`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
  }

  let sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);

  for (let color of sortedColors) {
      let [r, g, b] = color.split(',');
      let isNewColor = true;
      for (let existingColor of distinctColors) {
          if (colorDistance([r, g, b], existingColor.color) < similarityThreshold) {
              isNewColor = false;
              break;
          }
      }
      if (isNewColor && distinctColors.length < numColors) {
          distinctColors.push({color: [parseInt(r), parseInt(g), parseInt(b)], count: colorCounts[color]});
      }
  }
  
  return distinctColors;
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspiration.palette = getColorPalette(currentInspiration.image, 15);
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}

function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());
}
