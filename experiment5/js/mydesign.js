/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "Man in a Suit Skateboarding through Central Park, 1965", 
      assetUrl: "img/skateboard_suit.jpg",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
    },
    {
      name: "Dwyane Wade and Lebron James alley oop", 
      assetUrl: "img/dwyane_lebron.jpg",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
    },
    {
      name: "Wallace Shawn, inconcievable", 
      assetUrl: "img/wallace-shawn.jpg",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
    },
  ];
}

function weightedRandom(colors) {
  let total = colors.reduce((sum, color) => sum + color.count, 0);
  let threshold = Math.random() * total;
  let cumulative = 0;

  for (let color of colors) {
    cumulative += color.count;
    if (cumulative > threshold) {
      return color.color;
    }
  }
  return colors[colors.length - 1].color;
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)].color;
}


function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < 100; i++) {
    design.fg.push({x: random(width),
                    y: random(height),
                    w: random(width/2),
                    h: random(height/2),
                    //fill: randomColor(inspiration.palette)})
                    //fill: JSON.parse(JSON.stringify(randomColor(inspiration.palette)))})
                    fill: random(255)})
  }
  return design;
}

// function initDesign(inspiration) {
//   let canvasWidth = $('.image-container').width();
//   let aspectRatio = inspiration.image.height / inspiration.image.width;
//   let canvasHeight = canvasWidth * aspectRatio;
//   resizeCanvas(canvasWidth, canvasHeight);
//   $(".caption").text(inspiration.credit);

//   const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
//   $('#original').empty().append(imgHTML);

//   let design = { bg: [128, 128, 128], fg: [] };
//   for (let i = 0; i < 100; i++) {
//     design.fg.push({
//       x: random(width),
//       y: random(height),
//       w: random(width/2),
//       h: random(height/2),
//       fill: weightedRandom(inspiration.palette)
//     });
//   }
//   return design;
// }

function renderDesign(design, inspiration) {
  
  background(design.bg);
  noStroke();
  for(let box of design.fg) {
    fill(...box.fill);
    rect(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    //box.fill = JSON.parse(JSON.stringify(weightedRandom(inspiration.palette)));
    box.fill = JSON.parse(JSON.stringify(randomColor(inspiration.palette)));
    //box.fill = mut(box.fill, 0, 255, rate);
    if (Math.random() < rate / 100.0) {  // Convert rate to a probability
       box.fill = JSON.parse(JSON.stringify(randomColor(inspiration.palette)));
    }
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
