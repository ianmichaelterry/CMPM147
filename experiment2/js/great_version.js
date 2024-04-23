let grassBlades = []; // Array to hold data for each grass blade
let backGrassBlades = []; // Array to hold data for each grass blade
let middleFrontGrassBlades = []; // Array to hold data for each grass blade
let middleBackGrassBlades = []; // Array to hold data for each grass blade

function setup() {
  let canvasContainer = select('#canvas-container'); // Use select to find the container
  let cvs = createCanvas(canvasContainer.width, canvasContainer.height);
  cvs.parent('canvas-container'); // Attach the canvas to the container
  initializeGrass(); // Initialize the grass once in setup

  // Resize event to adjust the canvas when window size changes or goes fullscreen
  window.addEventListener('resize', function() {
    resizeCanvas(windowWidth, windowHeight);
  });
}


function setGradient(x, y, w, h, topColor, bottomColor) {
  noFill();

  // Top color to bottom color
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

let wind = 1; 


let cloudNoiseOffset = 0; // Offset for cloud noise

function drawPuffyClouds() {
  let cloudColor = lerpColor(color(255), color(135, 206, 250), 0.3); // Bluish white
  noStroke();
  for (let y = height / 4; y < height / 2; y += 20) { // Change 50 to adjust cloud layers
    for (let x = 0; x < width; x += 5) { // Change 10 to adjust cloud detail
      let cloudDensity = noise(x * 0.01, y * 0.01 + cloudNoiseOffset);
      if (cloudDensity > 0.2) { // Change 0.75 to adjust cloud density
        fill(red(cloudColor), green(cloudColor), blue(cloudColor), map(cloudDensity, 0.75, 1, 0, 255));
        ellipse(x, y, cloudDensity * 70, cloudDensity * 20); // Change numbers to adjust cloud size
      }
    }
  }
}

function drawClouds() {
  let cloudColor = lerpColor(color(255), color(135, 206, 250), 0.3); // Bluish white
  noStroke();
  // Ensure clouds only form above the horizon
  for (let y = (height/2) - 20 ; y < height / 2; y += 30) { // Start from the top and stop at the horizon
    for (let x = 0; x < width; x += 5) { // Check more frequently for detail
      let cloudDensity = noise(x * 0.01, y * 0.01 + cloudNoiseOffset); // Adjusted scale for noise
      if (cloudDensity > 0.2) { // Lower threshold for cloud density
        let opacity = map(cloudDensity, 0.2, 1, 0, 255); // Allows fuller range of cloud density
        fill(red(cloudColor), green(cloudColor), blue(cloudColor), opacity);
        ellipse(x, y, cloudDensity * 60, cloudDensity * 30); // Adjusted cloud size for appearance
      }
    }
  }
}


// function drawClouds() {
//   let cloudColor = lerpColor(color(255), color(135, 206, 250), 0.3); // Bluish white
//   noStroke();

//   // Ensure clouds only form above the horizon and become puffier as they go higher
//   for (let y = (height / 2)-80; y < (height / 2); y += 30 - (height / 2 - y) / 30) { // Adjust vertical spacing dynamically
//     for (let x = 0; x < width; x += 10 + (height / 2 - y) / 20) { // Widen horizontal gaps as we move up
//       // We use a modified form of noise that doesn't rely on frameCount or other changing variables
//       let cloudDensity = noise((x + 1000) * 0.02, (y + 1000) * 0.02); // Offset by 1000 to use a 'different' part of the noise space
//       if (cloudDensity > 0.25) { // Slightly higher threshold for better-formed clouds
//         let opacity = map(cloudDensity, 0.25, 1, 0, 255);
//         fill(red(cloudColor), green(cloudColor), blue(cloudColor), opacity);
//         let cloudSize = cloudDensity * 60; // Uniform size adjustment for simpler control
//         ellipse(x, y, cloudSize, cloudSize / 2); // Keep clouds elliptical but flatter
//       }
//     }
//   }
// }



function draw() {
  background(0, 50, 100);

  // Define the colors as the picked colors from the image
  let topColor = color(0, 76, 153); // Darker blue color from the top of the sky
  let bottomColor = color(135, 206, 250); // Lighter blue color from near the horizon
  
  setGradient(0, 0, width, height / 2, topColor, bottomColor);
  // Draw the horizon line
  stroke(0);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);

  // Canal setup
  let canalColor = color(0, 50, 100);
  let canalHeight = height * 0.3; 
  let canalTop = height - canalHeight;

 

  // Draw the canal
  fill(canalColor);
  noStroke();
  rect(0, canalTop, width, canalHeight);

  stroke(0, 0, 80); // Slightly darker blue for texture
  strokeWeight(1); // Thin lines for a subtle effect
  let waterSpeed = 1; // This should be the same as the grass speed
  let waterDetail = 0.7; // Determines the 'fineness' of the waves

  for (let y = canalTop; y < height; y += 2) {
    for (let x = 0; x < width; x += 10) {
      // Subtracting frameCount * waterSpeed to make it scroll left to right
      let waveHeight = noise((x - frameCount * waterSpeed) * waterDetail, y * waterDetail) * 10;
      line(x, y + waveHeight, x + 10, y + waveHeight);
    }
  }

  drawClouds();
  drawPuffyClouds();

  wind = wind * 0.9 + (noise(frameCount * 0.01) - 0.5) * 0.1;
  // Grass with wind effect and movement

  for (let i = backGrassBlades.length - 1; i >= 0; i--) {
    let blade = backGrassBlades[i];
    blade.x += 0.2; // Grass movement speed

    if (blade.x > width) {
      backGrassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawBackGrass(blade.x, (height/2)+20, blade.height, blade.noiseOffset, wind);
    }
  }

  for (let i = middleBackGrassBlades.length - 1; i >= 0; i--) {
    let blade = middleBackGrassBlades[i];
    blade.x += 0.4; // Grass movement speed

    if (blade.x > width) {
      middleBackGrassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawMiddleBackGrass(blade.x, blade.baseY, blade.height, blade.noiseOffset, wind);
    }
  }

  for (let i = middleFrontGrassBlades.length - 1; i >= 0; i--) {
    let blade = middleFrontGrassBlades[i];
    blade.x += .7; // Grass movement speed

    if (blade.x > width) {
      middleFrontGrassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawMiddleFrontGrass(blade.x, blade.baseY, blade.height, blade.noiseOffset, wind);
    }
  }


  for (let i = grassBlades.length - 1; i >= 0; i--) {
    let blade = grassBlades[i];
    blade.x += 1; // Grass movement speed

    if (blade.x > width) {
      grassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawFrontGrass(blade.x, blade.baseY, blade.height, blade.noiseOffset, wind);
    }
  }


  if (grassBlades.length < 2000) {
    addGrassBlade(); // Add new grass blade if needed
  }
  if (backGrassBlades.length < 2000) {
    addBackGrassBlade(); // Add new grass blade if needed
  }
  if (middleFrontGrassBlades.length < 2000) {
    addMiddleFrontGrassBlade(); // Add new grass blade if needed
  }
  if (middleBackGrassBlades.length < 2000) {
    addMiddleBackGrassBlade(); // Add new grass blade if needed
  }


}


// Initialize grass blades with variable parameters for initial full screen
function initializeGrass() {
  let numBlades = 2000; // Set initial number of blades
  for (let i = 0; i < numBlades; i++) {
    addBackGrassBlade(true)
    addMiddleBackGrassBlade(true)
    addGrassBlade(true);
    addMiddleFrontGrassBlade(true)
  }

}




function drawFrontGrass(x, baseY, height, noiseOffset, windStrength) {
  let grassBottomColor = color(245, 222, 179); // Beige color for grass bottom
  let grassTopColor = color(34, 139, 34); // Green color for grass top

  // Calculate the color based on the height of the grass
  let inter = map(height, 50, 100, 0, 1); // Assumes grass height ranges from 50 to 100
  let bladeColor = lerpColor(grassBottomColor, grassTopColor, inter);
  stroke(bladeColor);
  strokeWeight(2);

  // Adjust control points for a more natural, tapered curve
  let controlX1 = x + noise(noiseOffset) * 20 - 10 + 5 * windStrength; // Modified by wind
  let controlY1 = baseY - height * 0.3 + noise(noiseOffset + 5) * 10; 
  let controlX2 = x - noise(noiseOffset + 10) * 20 + 10 - 5 * windStrength; // Modified by wind
  let controlY2 = baseY - height * 0.6 + noise(noiseOffset + 15) * 10; 
  let endX = x; 
  let endY = baseY - height; 
  
  // Draw the curved grass blade
  noFill();
  beginShape();
  curveVertex(x, baseY); 
  curveVertex(x, baseY); 
  curveVertex(controlX1, controlY1); 
  curveVertex(controlX2, controlY2); 
  curveVertex(endX, endY); 
  curveVertex(endX, endY); 
  endShape();
}

function drawBackGrass(x, baseY, height, noiseOffset, windStrength) {
  let grassBottomColor = color(245, 222, 179); // Beige color for grass bottom
  let grassTopColor = color(34, 139, 34); // Green color for grass top

  // Calculate the color based on the height of the grass
  let inter = map(height, 15, 30, 0, 1); // Assumes grass height ranges from 50 to 100
  let bladeColor = lerpColor(grassBottomColor, grassTopColor, inter);
  stroke(bladeColor);
  strokeWeight(1);

  // Adjust control points for a more natural, tapered curve
  let controlX1 = x + noise(noiseOffset) * 20 - 10 + 5 * windStrength; // Modified by wind
  let controlY1 = baseY - height * 0.3 + noise(noiseOffset + 5) * 10; 
  let controlX2 = x - noise(noiseOffset + 10) * 20 + 10 - 5 * windStrength; // Modified by wind
  let controlY2 = baseY - height * 0.6 + noise(noiseOffset + 15) * 10; 
  let endX = x; 
  let endY = baseY - height; 
  
  // Draw the curved grass blade
  noFill();
  beginShape();
  curveVertex(x, baseY); 
  curveVertex(x, baseY); 
  curveVertex(controlX1, controlY1); 
  curveVertex(controlX2, controlY2); 
  curveVertex(endX, endY); 
  curveVertex(endX, endY); 
  endShape();
}

function drawMiddleBackGrass(x, baseY, height, noiseOffset, windStrength) {
  let grassBottomColor = color(245, 222, 179); // Beige color for grass bottom
  let grassTopColor = color(34, 139, 34); // Green color for grass top

  // Calculate the color based on the height of the grass
  let inter = map(height, 20, 40, 0, 1); // Assumes grass height ranges from 50 to 100
  let bladeColor = lerpColor(grassBottomColor, grassTopColor, inter);
  stroke(bladeColor);
  strokeWeight(1.2);

  // Adjust control points for a more natural, tapered curve
  let controlX1 = x + noise(noiseOffset) * 20 - 10 + 5 * windStrength; // Modified by wind
  let controlY1 = baseY - height * 0.3 + noise(noiseOffset + 5) * 10; 
  let controlX2 = x - noise(noiseOffset + 10) * 20 + 10 - 5 * windStrength; // Modified by wind
  let controlY2 = baseY - height * 0.6 + noise(noiseOffset + 15) * 10; 
  let endX = x; 
  let endY = baseY - height; 
  
  // Draw the curved grass blade
  noFill();
  beginShape();
  curveVertex(x, baseY); 
  curveVertex(x, baseY); 
  curveVertex(controlX1, controlY1); 
  curveVertex(controlX2, controlY2); 
  curveVertex(endX, endY); 
  curveVertex(endX, endY); 
  endShape();
}

function drawMiddleFrontGrass(x, baseY, height, noiseOffset, windStrength) {
  let grassBottomColor = color(245, 222, 179); // Beige color for grass bottom
  let grassTopColor = color(34, 139, 34); // Green color for grass top

  // Calculate the color based on the height of the grass
  let inter = map(height, 40, 80, 0, 1); // Assumes grass height ranges from 50 to 100
  let bladeColor = lerpColor(grassBottomColor, grassTopColor, inter);
  stroke(bladeColor);
  strokeWeight(1.65);

  // Adjust control points for a more natural, tapered curve
  let controlX1 = x + noise(noiseOffset) * 20 - 10 + 5 * windStrength; // Modified by wind
  let controlY1 = baseY - height * 0.3 + noise(noiseOffset + 5) * 10; 
  let controlX2 = x - noise(noiseOffset + 10) * 20 + 10 - 5 * windStrength; // Modified by wind
  let controlY2 = baseY - height * 0.6 + noise(noiseOffset + 15) * 10; 
  let endX = x; 
  let endY = baseY - height; 
  
  // Draw the curved grass blade
  noFill();
  beginShape();
  curveVertex(x, baseY); 
  curveVertex(x, baseY); 
  curveVertex(controlX1, controlY1); 
  curveVertex(controlX2, controlY2); 
  curveVertex(endX, endY); 
  curveVertex(endX, endY); 
  endShape();
}

function addGrassBlade(initial = false) {
  let xPosition = initial ? random(width) : random(-20, 0);
  let canalTop = height - (height * 0.3); // Same as the top of the canal
  grassBlades.push({
    x: xPosition,
    height: random(50, 100), // Adjust height if needed
    baseY: canalTop + random(-10,10), // Starting Y at the top of the canal
    noiseOffset: random(1000)
  });
}

function addBackGrassBlade(initial = false) {
  let xPosition = initial ? random(width) : random(-20, 0);
  let canalTop = height - (height * 0.3) // Same as the top of the canal
  backGrassBlades.push({
    x: xPosition,
    height: random(15, 30), // Adjust height if needed
    baseY: canalTop-40 + random(-10,10), // Starting Y at the top of the canal
    noiseOffset: random(1000)
  });
}


function addMiddleBackGrassBlade(initial = false) {
  let xPosition = initial ? random(width) : random(-20, 0);
  middleBackGrassBlades.push({
    x: xPosition,
    height: random(20, 40), // Adjust height if needed
    baseY: (height/2)+35 + random(-10,10), // Starting Y at the top of the canal
    noiseOffset: random(1000)
  });
}
function addMiddleFrontGrassBlade(initial = false) {
  let xPosition = initial ? random(width) : random(-20, 0);
  let canalTop = height - (height * 0.3); // Same as the top of the canal
  middleFrontGrassBlades.push({
    x: xPosition,
    height: random(35, 70), // Adjust height if needed
    baseY: canalTop -40 + random(-10,10), // Starting Y at the top of the canal
    noiseOffset: random(1000)
  });
}




function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}