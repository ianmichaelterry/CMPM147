function getInspirations() {
  return [
    {
      name: "Man in a Suit Skateboarding through Central Park, 1965", 
      assetUrl: "img/skateboard_suit.jpg",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
    },
    {
      name: "Nightclubbing - Grace Jones, 1981", 
      assetUrl: "img/nightclubbing.jpeg",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
    },
    {
      name: "A checkerboard", 
      assetUrl: "img/checkerboard.jpg",
      credit: ""
    },
    {
      name: "Wallace Shawn, inconcievable", 
      assetUrl: "img/wallace-shawn.jpg",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
    },
  ];
}

// function initDesign(inspiration) {
//   // set the canvas size based on the container
//   let canvasContainer = $('.image-container'); // Select the container using jQuery
//   let canvasWidth = canvasContainer.width(); // Get the width of the container
//   let aspectRatio = inspiration.image.height / inspiration.image.width;
//   let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
//   resizeCanvas(canvasWidth, canvasHeight);
//   $(".caption").text(inspiration.credit); // Set the caption text

//   // add the original image to #original
//   const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
//   $('#original').empty();
//   $('#original').append(imgHTML);

  
//   let design = {
//     bg: 128,
//     fg: []
//   }
  
//   for(let i = 0; i < 700; i++) {
//     design.fg.push({x: random(width),
//                     y: random(height),
//                     w: random(width/12),
//                     h: random(height/12),
//                     fill: random(255)})
//   }
//   return design;
// }

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
    case "Man in a Suit Skateboarding through Central Park, 1965":
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

    case "Nightclubbing - Grace Jones, 1981":
      // Process for this specific image
      for (let i = 0; i < 4000; i++) {
        design.fg.push({
          x: random(width),
          y: random(height),
          w: random(width/60),
          h: random(height/60),
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
          w: random(width/12),
          h: random(height/12),
          fill: random(255)
        });
      }
      break;
  }

  return design;
}


// function renderDesign(design, inspiration) {
  
//   background(design.bg);
//   noStroke();
//   for(let box of design.fg) {
//     fill(box.fill, 128);
//     rect(box.x, box.y, box.w, box.h);
//   }
// }

function renderDesign(design, inspiration) {


  // Use a switch statement to differentiate rendering based on the inspiration name
  switch (inspiration.name) {
    case "Man in a Suit Skateboarding through Central Park, 1965":
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
        rect(box.x, box.y, box.w, box.h); // Use ellipses for this image
      }
      break;

    case "Wallace Shawn, inconcievable":
      background(design.bg);
      noStroke();
      // Specific rendering process for this image
      for (let box of design.fg) {
        fill(box.fill, 128); // You could modify color processing or shapes
        triangle(box.x, box.y, box.x - box.w/2, box.y + box.h, box.x + box.w/2, box.y + box.h); // Example of using triangles
      }
      break;

    default:
      background(design.bg);
      noStroke();
      // Default rendering process if no specific instructions are given for an image
      for (let box of design.fg) {
        fill(box.fill, 128); // Default color and transparency settings
        rect(box.x, box.y, box.w, box.h); // Default shape is rectangle
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
