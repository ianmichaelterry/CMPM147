let grassBlades = []; // Array to hold data for each grass blade


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

let wind = 0; 


let cloudNoiseOffset = 0; // Offset for cloud noise

function drawClouds() {
  let cloudColor = lerpColor(color(255), color(135, 206, 250), 0.3); // Bluish white
  noStroke();
  for (let y = height / 4; y < height / 2; y += 50) { // Change 50 to adjust cloud layers
    for (let x = 0; x < width; x += 10) { // Change 10 to adjust cloud detail
      let cloudDensity = noise(x * 0.005, y * 0.005 + cloudNoiseOffset);
      if (cloudDensity > 0.3) { // Change 0.75 to adjust cloud density
        fill(red(cloudColor), green(cloudColor), blue(cloudColor), map(cloudDensity, 0.75, 1, 0, 255));
        ellipse(x, y, cloudDensity * 50, cloudDensity * 20); // Change numbers to adjust cloud size
      }
    }
  }
}

function draw() {
  background(220); // Set the background to a light grey color

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
  let canalHeight = height * 0.1; // Make canal narrower
  let canalTop = height - canalHeight;

 

  // Draw the canal
  fill(canalColor);
  noStroke();
  rect(0, canalTop, width, canalHeight);

  stroke(0, 0, 80); // Slightly darker blue for texture
  strokeWeight(1); // Thin lines for a subtle effect
  let waterSpeed = 1; // This should be the same as the grass speed
  let waterDetail = 0.02; // Determines the 'fineness' of the waves

  for (let y = canalTop; y < height; y += 2) {
    for (let x = 0; x < width; x += 10) {
      // Subtracting frameCount * waterSpeed to make it scroll left to right
      let waveHeight = noise((x - frameCount * waterSpeed) * waterDetail, y * waterDetail) * 10;
      line(x, y + waveHeight, x + 10, y + waveHeight);
    }
  }

  drawClouds();

  // Grass with wind effect and movement
  wind = wind * 0.9 + (noise(frameCount * 0.01) - 0.5) * 0.1;
  for (let i = grassBlades.length - 1; i >= 0; i--) {
    let blade = grassBlades[i];
    blade.x += 1; // Grass movement speed

    if (blade.x > width) {
      grassBlades.splice(i, 1); // Remove grass blade if it moves outside the canvas
    } else {
      drawGrass(blade.x, height / 2, blade.height, blade.noiseOffset, wind);
    }
  }

  if (grassBlades.length < 300) {
    addGrassBlade(); // Add new grass blade if needed
  }


}


// Initialize grass blades with variable parameters for initial full screen
function initializeGrass() {
  let numBlades = 300; // Set initial number of blades
  for (let i = 0; i < numBlades; i++) {
    addGrassBlade(true);
  }
}




function drawGrass(x, baseY, height, noiseOffset, windStrength) {
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

function addGrassBlade(initial = false) {
  let xPosition = initial ? random(width) : random(-20, 0);
  let canalTop = height - (height * 0.1); // Same as the top of the canal
  grassBlades.push({
    x: xPosition,
    height: random(50, 100), // Adjust height if needed
    baseY: canalTop, // Starting Y at the top of the canal
    noiseOffset: random(1000)
  });
}




function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}