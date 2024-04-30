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


// color v2
// function p3_drawTile(i, j) {
//   noStroke();

//   // Use hash to generate a consistent seed for randomness in colors based on position
//   let seed = XXH.h32(`${i}_${j}`, worldSeed).toNumber();
//   randomSeed(seed);

//   // Combine two layers of noise with increased elevation impact
//   let baseElevation = noise(i * 0.05, j * 0.05) * 0.75; // Larger scale variations
//   let detailElevation = noise(i * 0.2, j * 0.2) * 0.25; // Smaller scale, more detail
//   let totalElevation = (baseElevation + detailElevation) * 700; // Scale up the maximum elevation
//   if (totalElevation >600){
//     totalElevation = totalElevation *1.2
//   }
//   // Set colors based on elevation
//   if (totalElevation < 300) {
//       // Water
//       fill(0, 0, 0 + (0.4*totalElevation)); // Darker blue at deeper water
//   } else if (totalElevation < 320) {
//       // Beach
//       fill(210+ random(-20, 20), 180+ random(-10, 10), 140+ random(-10, 10)); // Sandy tan
//   } else if (totalElevation < 430) {
//       // Vegetation
//       fill(34+ random(-20, 20), 139+ random(-20, 20), 34+ random(-20, 20)); // Forest green
//   } else if (totalElevation < 600) {
//       // Mountain
//       fill(169+ random(-2, 10), 169+ random(-2, 10), 169+ random(-2, 10)); // Dark grey
//   } else {
//       // Snow caps
//       fill(255); // White
//   }

//   push();
//   translate(0, -totalElevation * 0.5); // Increase vertical shift to exaggerate the elevation

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

function p3_drawTile(i, j) {
  noStroke();

  // Generate consistent color seed based on tile position
  let seed = XXH.h32(`${i}_${j}`, worldSeed).toNumber();
  randomSeed(seed);

  // Elevation calculation
  let baseElevation = noise(i * 0.05, j * 0.05) * 0.75; // Base layer of noise for elevation
  let detailElevation = noise(i * 0.2, j * 0.2) * 0.25; // Detail layer for elevation
  let totalElevation = (baseElevation + detailElevation) * 700; // Scale the elevation

  // Determine the top color based on elevation
  let topColor;
  if (totalElevation < 300) {
      topColor = color(0, 0, 0 + (0.4 * totalElevation)); // Water
  } else if (totalElevation < 320) {
      topColor = color(210 + random(-20, 20), 180 + random(-10, 10), 140 + random(-10, 10)); // Beach
  } else if (totalElevation < 390) {
      topColor = color(34 + random(-20, 20), 139 + random(-20, 20), 34 + random(-20, 20)); // Vegetation
  } else if (totalElevation < 460) {
      topColor = color(169 + random(-2, 10), 169 + random(-2, 10), 169 + random(-2, 10)); // Mountain
  } else {
      topColor = color(255); // Snow caps
  }

  // Light source adjustments for side colors
  let leftColor = lerpColor(topColor, color(0), 0.3); // Left side darker
  let rightColor = lerpColor(topColor, color(255), 0.1); // Right side lighter

  push();

  // make mountains more extreme
  if (totalElevation >= 390) {
    totalElevation =  totalElevation + ((totalElevation-390)*2)
  }

  if (totalElevation<300){
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


// function p3_drawTile(i, j) {
//   noStroke();
//   // Use hash to generate a consistent seed for randomness in colors based on position
//   let seed = XXH.h32(`${i}_${j}`, worldSeed).toNumber();
//   randomSeed(seed);
  
//   // Combine two layers of noise for elevation
//   let baseElevation = noise(i * 0.1, j * 0.1) * 0.6; // Larger areas, less elevation impact
//   let detailElevation = noise(i * 0.5, j * 0.5) * 0.4; // Smaller, more frequent changes
//   let totalElevation = (baseElevation + detailElevation) * 800; // Scale up the maximum elevation for more extremes

//   // Color settings based on elevation
//   if (totalElevation < 150) {
//       // Water: varying shades of blue
//       fill(0, 0, 200 + random(-20, 55));
//   } else if (totalElevation < 250) {
//       // Beach: sandy colors with variation
//       fill(210 + random(-20, 20), 180 + random(-10, 10), 140 + random(-10, 10));
//   } else if (totalElevation < 500) {
//       // Vegetation: varying shades of green
//       fill(34 + random(-10, 10), 139 + random(-20, 20), 34 + random(-10, 10));
//   } else if (totalElevation < 650) {
//       // Mountain: darker grey
//       fill(100 + random(-20, 60), 100 + random(-20, 60), 100 + random(-20, 60));
//   } else {
//       // Snow caps: pure white with slight grey shading
//       fill(255, 255, 255 - random(0, 10));
//   }

//   push();
//   translate(0, -totalElevation * 0.5); // Exaggerate the elevation by shifting tiles up based on their elevation

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
