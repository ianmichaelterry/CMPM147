function getInspirations() {
  return [
    {
      name: "Man in a Suit Skateboarding through Central Park", 
      assetUrl: "img/skateboard_suit.jpg",
      credit: "Life Magazine, 1965"
    },
    {
      name: "Nightclubbing - Grace Jones", 
      assetUrl: "img/nightclubbing.jpeg",
      credit: "Grace Jones, 1981"
    },
    {
      name: "A checkerboard", 
      assetUrl: "img/checkerboard.jpg",
      credit: ""
    },
  ];
}

function initDesign(inspiration) {
  // Set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // Add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty().append(imgHTML);

  let design = {
    bg: 128,
    fg: []
  };

  // Use a switch statement to differentiate initialization based on the image name
  switch (inspiration.name) {
    case "Man in a Suit Skateboarding through Central Park":
      // Process for this specific image
      for (let i = 0; i < 700; i++) {
        design.fg.push({
          x: random(width),
          y: random(height),
          w: random(width/12),
          h: random(height/12),
          fill: random(255)
        });
      }
      break;

    case "A checkerboard":
      // Process for this specific image
      for (let i = 0; i < 3000; i++) {
        design.fg.push({
          x: random(width),
          y: random(height),
          w: width/20,
          h: height/20,
          fill: random(255)
        });
      }
      break;

    case "Nightclubbing - Grace Jones":
      // Process for this specific image
      for (let i = 0; i < 3000; i++) {
        design.fg.push({
          x: random(width),
          y: random(height),
          w: random(width/4),
          h: random(height/4),
          fill: random(255)
        });
      }
      break;

    default:
      // Default process if no specific instructions are given for an image
      for (let i = 0; i < 700; i++) {
        design.fg.push({
          x: random(width),
          y: random(height),
          w: random(width/2),
          h: random(height/2),
          fill: random(255)
        });
      }
      break;
  }

  return design;
}



function renderDesign(design, inspiration) {


  // Use a switch statement to differentiate rendering based on the inspiration name
  switch (inspiration.name) {
    case "Man in a Suit Skateboarding through Central Park":
      background(design.bg);
      noStroke();
      // Specific rendering process for this image
      for (let box of design.fg) {
        fill(box.fill, 128); // Set color and transparency
        rect(box.x, box.y, box.w, box.h); // Draw rectangle
      }
      break;

    case "A checkerboard":
      background(255);
      noStroke();
      // Specific rendering process for this image
      for (let box of design.fg) {
        fill(box.fill, 128); // Different color settings or shapes could be used
        rect(box.x, box.y, box.w, box.h); 
      }
      break;


    case "Nightclubbing - Grace Jones":
      background(design.bg);
      noStroke();
      // Render randomly rotated triangles
      for (let box of design.fg) {
        fill(box.fill, 128);

        // Calculate the center of the triangle
        let centerX = box.x + box.w / 2;
        let centerY = box.y + box.h / 2;

        // Apply rotation
        push(); // Save the current drawing state
        translate(centerX, centerY); // Move the origin to the center of the triangle
        rotate(random(TWO_PI)); // Rotate by a random angle

        // Draw the triangle around the new origin
        triangle(-box.w / 2, box.h / 2, 0, -box.h / 2, box.w / 2, box.h / 2);

        pop(); // Restore the original drawing state
      }
      break;


    default:

      for (let box of design.fg) {
        fill(box.fill, 128);
        let centerX = box.x + box.w / 2;
        let centerY = box.y + box.h / 2;

        push(); // Save the current drawing state
        translate(centerX, centerY); // Move the origin to the center of the ellipse
        rotate(random(TWO_PI)); // Rotate by a random angle
        ellipse(0, 0, box.w, box.h); // Draw the ellipse around the new origin
        pop(); // Restore the original drawing state
    }
    break;
  
  }
}


function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
