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
let baseSpeed = 1;       // Base speed for grass and water movement
let currentSpeed = 1;    // Current speed, starts at base speed
let speedMultiplier = 1.7;  // Multiplier to increase speed by 30%

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

let alligator = {
  x: -250,  // Start off-screen to the left
  visible: false,
  timer: 0,
  interval: 10000,  // Initial short interval for first appearance
  firstTime: true   // Flag to check if it's the first appearance
};

function drawAlligator() {
  if (alligator.visible) {
      fill(58, 95, 11); 
      noStroke();
      // Draw the alligator head
      ellipse(alligator.x, height - 40, 120, 30);
      ellipse(alligator.x + 40, height - 50, 40, 30);
      fill(0); 
      ellipse(alligator.x + 40, height - 50, 15, 15);
      fill(58, 95, 11); 
      ellipse(alligator.x-100, height - 40, 190, 30);
      ellipse(alligator.x-200, height - 40, 120, 20);
      ellipse(alligator.x-350, height - 40, 100, 15);

      //snout
      ellipse(alligator.x + 150, height - 40, 20, 20);

      // Move the alligator
      alligator.x += 2.5 * currentSpeed;  // Increase speed for visibility
      // Check if the alligator has moved beyond the canvas
      if (alligator.x > width + 500) {  // Ensure it fully crosses the screen
          alligator.visible = false;
          alligator.x = -100; // Reset position off-screen to the left
          if (alligator.firstTime) {
              // After first appearance, set random intervals around one minute
              alligator.interval = random(45000, 65000); // Randomize interval for next appearances
              alligator.firstTime = false;
          }
          alligator.timer = 0; // Reset timer after it fully exits, ensuring the interval is handled correctly
      }
  }
}

function updateAlligator() {
  // Only update timer if alligator is not currently visible
  if (!alligator.visible) {
    alligator.timer += deltaTime;
  }
  
  // Check if it's time to show the alligator based on the interval
  if (alligator.timer >= alligator.interval) {
      alligator.visible = true;
      alligator.x = -100; // Start off screen to the left
      alligator.timer = 0; // Reset timer immediately upon visibility to prevent immediate re-triggering
  }
}



let windBase = 0.1;  // Base wind level
let windGustStrength = 10;
let windGustDuration = 100;  // Duration of the entire gust cycle in frames
let windGustCounter = 0;

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
  let waterSpeed = 1 * currentSpeed; // This should be the same as the grass speed
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

  

  if (windGustCounter > 0) {
    // Calculate gust effect using a sine wave for smooth rise and fall
    windGustStrength = 0.5 * Math.sin(Math.PI * windGustCounter / windGustDuration);
    windGustCounter--;
  } else if (random(1) < 0.5) {  // Random chance to start a new gust
    windGustCounter = windGustDuration;
  }

  // Update wind using the base level and any gust strength
  wind = windBase + windGustStrength;
  // Grass with wind effect and movement

  for (let i = backGrassBlades.length - 1; i >= 0; i--) {
    let blade = backGrassBlades[i];
    blade.x += 0.2 * currentSpeed; // Grass movement speed

    if (blade.x > width) {
      backGrassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawBackGrass(blade.x, (height/2)+20, blade.height, blade.noiseOffset, wind);
    }
  }

  for (let i = middleBackGrassBlades.length - 1; i >= 0; i--) {
    let blade = middleBackGrassBlades[i];
    blade.x += 0.4 * currentSpeed; // Grass movement speed

    if (blade.x > width) {
      middleBackGrassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawMiddleBackGrass(blade.x, blade.baseY, blade.height, blade.noiseOffset, wind);
    }
  }

  for (let i = middleFrontGrassBlades.length - 1; i >= 0; i--) {
    let blade = middleFrontGrassBlades[i];
    blade.x += .7 * currentSpeed; // Grass movement speed

    if (blade.x > width) {
      middleFrontGrassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawMiddleFrontGrass(blade.x, blade.baseY, blade.height, blade.noiseOffset, wind);
    }
  }


  for (let i = grassBlades.length - 1; i >= 0; i--) {
    let blade = grassBlades[i];
    blade.x += 1 * currentSpeed; // Grass movement speed

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

  drawAlligator()
  updateAlligator()
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

function mousePressed() {
  currentSpeed = baseSpeed * speedMultiplier;  // Increase speed by 30%
}

function mouseReleased() {
  currentSpeed = baseSpeed;  // Reset to base speed
}