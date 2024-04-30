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

// function p3_worldKeyChanged(key) {
//   worldSeed = XXH.h32(key, 0);
//   noiseSeed(worldSeed);
//   randomSeed(worldSeed);
// }

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

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

// function p3_drawTile(i, j) {
//   noStroke();

//   if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
//     fill(240, 200);
//   } else {
//     fill(255, 200);
//   }

//   push();

//   beginShape();
//   vertex(-tw, 0);
//   vertex(0, th);
//   vertex(tw, 0);
//   vertex(0, -th);
//   endShape(CLOSE);

//   let n = clicks[[i, j]] | 0;
//   if (n % 2 == 1) {
//     fill(0, 0, 0, 32);
//     ellipse(0, 0, 10, 5);
//     translate(0, -10);
//     fill(255, 255, 100, 128);
//     ellipse(0, 0, 10, 10);
//   }

//   pop();
// }

// function p3_drawTile(i, j) {
//     noStroke();
//     let elevation = noise(i * 0.1, j * 0.1) * 255; // Scale noise result to get elevation
    
//     // Elevation-based color gradient
//     fill(elevation, 200 - elevation * 0.5, 100 + elevation * 0.5);
    
//     push();
//     translate(0, -elevation * 0.25); // Simulate elevation by shifting the tile upwards
  
//     beginShape();
//     vertex(-tw, 0);
//     vertex(0, th);
//     vertex(tw, 0);
//     vertex(0, -th);
//     endShape(CLOSE);
  
//     let n = clicks[[i, j]] | 0;
//     if (n % 2 == 1) {
//       fill(0, 0, 0, 32);
//       ellipse(0, 0, 10, 5);
//       translate(0, -10);
//       fill(255, 255, 100, 128);
//       ellipse(0, 0, 10, 10);
//     }
  
//     pop();
//   }

// function p3_drawSelectedTile(i, j) {
//   noFill();
//   stroke(0, 255, 0, 128);

//   beginShape();
//   vertex(-tw, 0);
//   vertex(0, th);
//   vertex(tw, 0);
//   vertex(0, -th);
//   endShape(CLOSE);

//   noStroke();
//   fill(0);
//   text("tile " + [i, j], 0, 0);
// }


//best one so far
// function p3_drawTile(i, j) {
//     noStroke();
//     // Combine two layers of noise with increased elevation impact
//     let baseElevation = noise(i * 0.05, j * 0.05) * 0.75; // Larger scale variations
//     let detailElevation = noise(i * 0.2, j * 0.2) * 0.25; // Smaller scale, more detail
//     let totalElevation = (baseElevation + detailElevation) * 500; // Scale up the maximum elevation
  
//     // Elevation-based color gradient, more dynamic
//     fill(totalElevation, 200 - totalElevation * 0.5, 100 + totalElevation * 0.5);
  
//     push();
//     translate(0, -totalElevation * 0.5); // Increase vertical shift to exaggerate the elevation
  
//     beginShape();
//     vertex(-tw, 0);
//     vertex(0, th);
//     vertex(tw, 0);
//     vertex(0, -th);
//     endShape(CLOSE);
  
//     let n = clicks[[i, j]] | 0;
//     if (n % 2 == 1) {
//       fill(0, 0, 0, 32);
//       ellipse(0, 0, 10, 5);
//       translate(0, -10);
//       fill(255, 255, 100, 128);
//       ellipse(0, 0, 10, 10);
//     }
  
//     pop();
//   }

function p3_drawTile(i, j) {
  noStroke();
  // Combine two layers of noise with increased elevation impact
  let baseElevation = noise(i * 0.05, j * 0.05) * 0.75; // Larger scale variations
  let detailElevation = noise(i * 0.2, j * 0.2) * 0.25; // Smaller scale, more detail
  let totalElevation = (baseElevation + detailElevation) * 500; // Scale up the maximum elevation

  // Set colors based on elevation
  if (totalElevation < 100) {
      // Water
      fill(0, 0, 255 - totalElevation); // Darker blue at deeper water
  } else if (totalElevation < 200) {
      // Beach
      fill(210, 180, 140); // Sandy tan
  } else if (totalElevation < 400) {
      // Vegetation
      fill(34, 139, 34); // Forest green
  } else if (totalElevation < 450) {
      // Mountain
      fill(169, 169, 169); // Dark grey
  } else {
      // Snow caps
      fill(255); // White
  }

  push();
  translate(0, -totalElevation * 0.5); // Increase vertical shift to exaggerate the elevation

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }

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
