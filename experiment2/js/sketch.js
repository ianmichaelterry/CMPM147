// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

let xOffset = 0; // Initialize xOffset for the moving effect
let yOffset = 10000; // A large yOffset to avoid visible tiling in the noise pattern
let islandFrequency = 0.005; // Controls how often islands appear, adjust as needed
let maxElevation = 20; // Maximum elevation for the islands
let islandThreshold = 0.6; // Threshold to control when islands are generated


// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized


    // Seed the noise function for procedural generation
    noiseSeed(millis());

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  frameRate(30); // Lower frame rate for smoother animation
  noiseDetail(8, 0.65); // Adjust noise detail for smoother landscape features
}

function draw() {
  background(220);

  // Parameters for the horizon and islands
  let noiseScale = 0.0003; // Adjust scale for broader noise changes
  let horizonSpeed = 10; // Adjust speed for a smoother scrolling effect

  // Base horizon line position
  let baselineY = height * 1/3;

  // Increment the xOffset for animation
  xOffset += horizonSpeed;

  // Drawing the horizon line with one or two smooth islands
  stroke(100); // Set line color to a gray tone
  strokeWeight(2); // Set line thickness
  noFill();
  beginShape();

  // Variables to determine if we are currently drawing an island
  let drawingIsland = false;

  for (let x = 0; x <= width; x++) {
    // Generate elevation using noise
    let elevationNoise = noise(x * noiseScale, yOffset);
    let elevation = map(elevationNoise, 0, 1, -maxElevation, maxElevation);
    
    // Check if the noise value crosses the threshold for starting or ending an island
    if (elevationNoise > islandThreshold && !drawingIsland) {
      drawingIsland = true; // Start drawing an island
    } else if (elevationNoise < islandThreshold / 2 && drawingIsland) {
      drawingIsland = false; // Stop drawing an island
    }

    // If we are drawing an island, amplify the elevation
    if (drawingIsland) {
      elevation *= 2;
    }

    vertex(x, baselineY - elevation);
  }
  endShape();
  
  // If xOffset goes beyond the noise's period, reset it to keep the scrolling seamless
  if (xOffset > width / noiseScale) {
    xOffset -= width / noiseScale;
  }
}








// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}