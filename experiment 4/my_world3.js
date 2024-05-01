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

let mySound; // Variable to hold your sound

function p3_preload() {
    // Load the sound
    mySound = loadSound('./heaven.mp3');
}
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
  // Play the sound when a tile is clicked
  if (mySound.isPlaying()) {
      mySound.pause(); // Stop the song if it's already playing
  }else{
    mySound.play(); // Play the song
  }
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
  if (totalElevation < 370) {
      topColor = color(0, 0, 0 + (0.4 * totalElevation)); // Water
  } else {
      topColor = color(255 + random(-2, 10),255 + random(-2, 10),255 + random(-2, 10)); // Snow caps
  }

  // Light source adjustments for side colors
  let leftColor = lerpColor(topColor, color(0), 0.3); // Left side darker
  let rightColor = lerpColor(topColor, color(255), 0.1); // Right side lighter

  push();

  // make mountains more extreme
  if (totalElevation >= 450) {
    totalElevation =  totalElevation + ((totalElevation-390)*2)
  }

  if (totalElevation<370){
    translate(0, -300 * 0.5); // make water all the same height, with varying levels of depths 
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








function p3_drawSelectedTile(i, j) {
    noFill();
    stroke(0, 255, 0, 128);
    push();
    translate(0, -noise(i * 0.1, j * 0.1) * 25); // Adjust translation for selected tile
  
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
  
    noStroke();
    fill(0);
    text("tile " + [i, j], 0, 0);
    pop();
  }
  

function p3_drawAfter() {}