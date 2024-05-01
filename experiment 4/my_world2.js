"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
    worldSeed = XXH.h32(key, 0).toString(16);
    noiseSeed(parseInt(worldSeed, 16));
    randomSeed(parseInt(worldSeed, 16));
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

// function p3_tileClicked(i, j) {
//   let key = `${i}_${j}`; ;
//   clicks[key] = 1 + (clicks[key] | 0)+30;
//   redraw()
// }

function p3_tileClicked(i, j) {
  let primaryIncrease = 10;
  let secondaryIncrease = 5;
  let tertiaryIncrease = 2;

  // Function to safely add elevation to a tile, ensuring keys are correctly formatted and initialized
  function addElevation(x, y, increase) {
    let key = `${x}_${y}`;
    clicks[key] = (clicks[key] || 0) + increase;
  }

  // Update the clicked tile
  addElevation(i, j, primaryIncrease);

  // Coordinates of directly adjacent tiles
  let neighbors = [
    [i + 1, j], [i - 1, j], // horizontal neighbors
    [i, j + 1], [i, j - 1], // vertical neighbors
    [i + 1, j + 1], [i - 1, j - 1], // diagonal neighbors
    [i + 1, j - 1], [i - 1, j + 1]
  ];

  // Update directly adjacent tiles
  neighbors.forEach(([ni, nj]) => {
    addElevation(ni, nj, secondaryIncrease);

    // Coordinates of secondary neighbors around each directly adjacent tile
    let secondaryNeighbors = [
      [ni + 1, nj], [ni - 1, nj],
      [ni, nj + 1], [ni, nj - 1],
      [ni + 1, nj + 1], [ni - 1, nj - 1],
      [ni + 1, nj - 1], [ni - 1, nj + 1]
    ];

    // Update secondary neighbors
    secondaryNeighbors.forEach(([nni, nnj]) => {
      if (nni === i && nnj === j) return; // Exclude the center tile
      addElevation(nni, nnj, tertiaryIncrease);
    });
  });

  redraw(); // Request a redraw of the sketch to reflect elevation changes
}


function p3_drawBefore() {}





function p3_drawTile(i, j) {
  noStroke();

  // Generate consistent color seed based on tile position
  let seed = XXH.h32(`${i}_${j}`, worldSeed).toNumber();
  randomSeed(seed);

  // Elevation calculation
  let baseElevation = noise(i * 0.05, j * 0.05) * 0.75; // Base layer of noise for elevation
  let detailElevation = noise(i * 0.2, j * 0.2) * 0.25; // Detail layer for elevation
  let totalElevation = (baseElevation + detailElevation) * 700; // Scale the elevation
  let clickElevation = clicks[`${i}_${j}`] || 0;
  
  totalElevation = totalElevation+clickElevation;

  // Determine the top color based on elevation
  let topColor;
  if (totalElevation < 300) {
      topColor = color(255 + random(-20, 20), 69 + random(-10, 10), 0 + random(-10, 10)); // Water
  } else if (totalElevation < 320) {
      topColor = color(71 + random(-20, 20), 51 + random(-10, 10), 40 + random(-10, 10)); // Beach
  } else if (totalElevation < 390) {
      topColor = color(65 + random(-5, 5), 45 + random(-5, 5), 28 + random(-5, 5)); // Vegetation
  } else if (totalElevation < 480) {
      topColor = color(20 + random(-2, 10), 20 + random(-2, 10), 30+ random(-2, 10)); // Mountain
  } else {
      topColor = topColor = color(255 + random(-20, 20), 69 + random(-10, 10), 0 + random(-10, 10)); // Snow caps
  }

  // Light source adjustments for side colors
  let leftColor = lerpColor(topColor, color(0), 0.3); // Left side darker
  let rightColor = lerpColor(topColor, color(255), 0.1); // Right side lighter

  push();

  // make mountains more extreme
  if (totalElevation >= 390) {
    totalElevation =  totalElevation + ((totalElevation-350)*2)
  }

  if (totalElevation<300){
    translate(0, -300 * 0.5); // make water all the same height, with varying levels of depths 
  }else if(totalElevation >=480){
    translate(0, -600 * 0.5);
  }else{
    translate(0, -totalElevation * 0.5); // Vertical shift based on elevation
  }
  // Draw top face
  fill(topColor);
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Draw left face
  fill(leftColor);
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(0, th + totalElevation * 0.5);
  vertex(-tw, totalElevation * 0.5);
  endShape(CLOSE);

  // Draw right face
  fill(rightColor);
  beginShape();
  vertex(tw, 0);
  vertex(0, th);
  vertex(0, th + totalElevation * 0.5);
  vertex(tw, totalElevation * 0.5);
  endShape(CLOSE);

  pop();
}
