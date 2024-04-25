function generateGrid(numCols, numRows) {
    let grid = [];
    // Fill the entire grid with the background character '_'
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }
  
    // Helper function to check if the room overlaps with existing rooms
    function doesOverlap(grid, top, left, bottom, right) {
      for (let i = top - 1; i <= bottom + 1; i++) {
        for (let j = left - 1; j <= right + 1; j++) {
          if (grid[i][j] !== "_") {
            return true; // Found an overlap
          }
        }
      }
      return false; // No overlap
    }
  
    // Function to place walls around a point
    function surroundWithWalls(grid, x, y) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (grid[y + dy] && grid[y + dy][x + dx] === "_") {
            grid[y + dy][x + dx] = ".";
          }
        }
      }
    }
  
    // Function to create a pathway between two points
    function createPathway(grid, startX, startY, endX, endY) {
      let x = startX;
      let y = startY;
    
      // First align horizontally, then vertically
      while (x !== endX) {
        grid[y][x] = " ";
        surroundWithWalls(grid, x, y);
        x += (x < endX) ? 1 : -1;
      }
      while (y !== endY) {
        grid[y][x] = " ";
        surroundWithWalls(grid, x, y);
        y += (y < endY) ? 1 : -1;
      }
    
      // Mark the final position
      grid[endY][endX] = " ";
      surroundWithWalls(grid, endX, endY);
    }
    
    // Helper function to create a room
    function createRoom(grid, margin, maxWidth, maxHeight) {
      let top, left, bottom, right, centerX, centerY;
      let overlap;
      do {
        // Determine room dimensions
        let interiorWidth = Math.floor(random(2, 6)); // Random interior width 2-4
        let interiorHeight = Math.floor(random(2, 6)); // Random interior height 2-4
  
        // Calculate top-left corner
        top = Math.floor(random(margin, maxHeight - interiorHeight - margin));
        left = Math.floor(random(margin, maxWidth - interiorWidth - margin));
  
        // Calculate bottom-right corner based on top-left + interior size
        bottom = top + interiorHeight + 1; // +1 for the wall
        right = left + interiorWidth + 1; // +1 for the wall
  
        // Find the center of the room and return it for the pathway connection
        centerX = Math.floor((left + right) / 2);
        centerY = Math.floor((top + bottom) / 2);
  
        overlap = doesOverlap(grid, top, left, bottom, right);
      } while (overlap); // Keep trying until no overlap
  
      // Create the walls and interior space
      for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
          if (i === top || i === bottom || j === left || j === right) {
            grid[i][j] = "."; // Wall character
          } else {
            grid[i][j] = " "; // Interior space character
          }
        }
      }
      return [centerX, centerY];
    }
  
    // Define margins to avoid placing the rooms at the very edges of the grid
    let margin = 2;
  
    // Create the first room without worrying about overlap
    let rooms = [];
    rooms.push(createRoom(grid, margin, numCols - margin, numRows - margin));
    rooms.push(createRoom(grid, margin, numCols - margin, numRows - margin));
    rooms.push(createRoom(grid, margin, numCols - margin, numRows - margin));
  
    // Adding a pathway connecting the rooms
    let pathStartEdge = Math.floor(random(4)); // 0: top, 1: right, 2: bottom, 3: left
    let pathStart;
    if (pathStartEdge === 0) pathStart = [0, Math.floor(random(1, numCols - 1))];
    else if (pathStartEdge === 1)
      pathStart = [Math.floor(random(1, numRows - 1)), numCols - 1];
    else if (pathStartEdge === 2)
      pathStart = [numRows - 1, Math.floor(random(1, numCols - 1))];
    else if (pathStartEdge === 3)
      pathStart = [Math.floor(random(1, numRows - 1)), 0];

    let pathEndEdge = (pathStartEdge+2)%4
    let pathEnd

    if (pathEndEdge === 0) pathEnd = [0, Math.floor(random(1, numCols - 1))];
    else if (pathEndEdge === 1)
      pathEnd = [Math.floor(random(1, numRows - 1)), numCols - 1];
    else if (pathEndEdge === 2)
      pathEnd = [numRows - 1, Math.floor(random(1, numCols - 1))];
    else if (pathEndEdge === 3)
      pathEnd = [Math.floor(random(1, numRows - 1)), 0];
    
    // Creating the pathway from the start edge to the first room
    createPathway(grid, pathStart[0], pathStart[1], rooms[0][0], rooms[0][1]);
  
    // Creating the pathway between the rooms
    createPathway(grid, rooms[0][0], rooms[0][1], rooms[1][0], rooms[1][1]);
    createPathway(grid, rooms[1][0], rooms[1][1], rooms[2][0], rooms[2][1]);

    createPathway(grid, pathEnd[0], pathEnd[1], rooms[2][0], rooms[2][1]);

    // Randomly select one of the rooms to place the treasure chest
    const treasureRoomIndex = Math.floor(random(rooms.length));
    const treasureRoom = rooms[treasureRoomIndex];
    const treasureX = treasureRoom[0]; // centerX of the room
    const treasureY = treasureRoom[1]; // centerY of the room
    grid[treasureY][treasureX] = "T"; // 'T' represents a closed treasure chest

    return grid;
  }

  // Creating an entry pathway from an edge of the grid
function createEntryPath(grid, rooms) {
  let pathStartEdge = Math.floor(random(4)); // 0: top, 1: right, 2: bottom, 3: left
  let pathStart;
  switch (pathStartEdge) {
    case 0: // top
      pathStart = [0, Math.floor(random(numCols))];
      break;
    case 1: // right
      pathStart = [Math.floor(random(numRows)), numCols - 1];
      break;
    case 2: // bottom
      pathStart = [numRows - 1, Math.floor(random(numCols))];
      break;
    case 3: // left
      pathStart = [Math.floor(random(numRows)), 0];
      break;
  }
  createPathway(grid, pathStart[0], pathStart[1], rooms[0][0], rooms[0][1]);
}

// Creating an exit pathway to an edge of the grid opposite the entry
function createExitPath(grid, rooms) {
  let lastRoom = rooms[rooms.length - 1];
  let pathEndEdge = (Math.floor(random(4)) + 2) % 4; // Ensure it's opposite by adding 2 and modulo 4
  let pathEnd;
  switch (pathEndEdge) {
    case 0: // top
      pathEnd = [0, Math.floor(random(numCols))];
      break;
    case 1: // right
      pathEnd = [Math.floor(random(numRows)), numCols - 1];
      break;
    case 2: // bottom
      pathEnd = [numRows - 1, Math.floor(random(numCols))];
      break;
    case 3: // left
      pathEnd = [Math.floor(random(numRows)), 0];
      break;
  }
  createPathway(grid, lastRoom[0], lastRoom[1], pathEnd[0], pathEnd[1]);
}


function autotileWall(grid, x, y) {
  let up = (grid[y-1] && grid[y-1][x] === ' ');
  let right = (grid[y][x+1] === ' ');
  let down = (grid[y+1] && grid[y+1][x] === ' ');
  let left = (grid[y][x-1] === ' ');
  

  // Default wall tile
  let tileIndex = { ti: 5, tj: 4 }; // Default wall center tile

  let isInteriorCorner = true;

  // Edge tiles
  if (up && !right && !down && !left) {
    tileIndex = { ti: 6/* edge top */, tj:23/* index */ };
    isInteriorCorner = false;
  } else if (!up && right && !down && !left) {
    tileIndex = { ti: 5/* edge right */, tj: 22 /* index */ };
    isInteriorCorner = false;
  } else if (!up && !right && down && !left) {
    tileIndex = { ti: 6 /* edge bottom */, tj:21 /* index */ };
    isInteriorCorner = false;
  } else if (!up && !right && !down && left) {
    tileIndex = { ti: 7 /* edge left */, tj: 22/* index */ };
    isInteriorCorner = false;
  }


  if (up && left) {
    tileIndex = { ti: 7/* corner top-left */, tj: 3/* index */ };
    isInteriorCorner = false;
  } else if (up && right) {
    tileIndex = { ti: 8/* corner top-right */, tj: 3/* index */ };
    isInteriorCorner = false;
  } else if (down && left) {
    tileIndex = { ti: 7/* corner bottom-left */, tj: 4/* index */ };
    isInteriorCorner = false;
  } else if (down && right) {
    tileIndex = { ti: 8/* corner bottom-right */, tj: 4/* index */ };
    isInteriorCorner = false;
  }
  
  if(isInteriorCorner){
    if (grid[y][x+1] && grid[y+1][x] && grid[y][x+1] === '_' && grid[y+1][x] === '_'){
      tileIndex = { ti: 7/* corner bottom-right */, tj: 23/* index */ };
    }else if (grid[y][x-1] && grid[y+1][x] && grid[y][x-1] === '_' && grid[y+1][x] === '_'){
      tileIndex = { ti: 5/* corner bottom-right */, tj: 23/* index */ };
    }else if (grid[y][x] && grid[y-1][x] && grid[y][x+1] === '_' && grid[y-1][x] === '_'){
      tileIndex = { ti: 7/* corner bottom-right */, tj: 21/* index */ };
    }else if (grid[y][x-1] && grid[y-1][x] && grid[y][x-1] === '_' && grid[y-1][x] === '_'){
      tileIndex = { ti: 5/* corner bottom-right */, tj: 21/* index */ };
    }
  

  }


  return tileIndex;
}



  function drawGrid(grid) {
    background(128); // Assuming a grey background is desired
  
    // Loop over every cell in the grid
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        // Determine what character is in the current cell
        let tileChar = grid[i][j];
  
        // Variables to hold the tile indices for the tileset
        let ti, tj;
  
        // Check the character and set the tile indices accordingly
        switch (tileChar) {
          case "_": // Background tile
            ti = floor(random(1,4)); // Tile index for background (ti) in the tileset image
            tj = floor(random(21,24)); // Tile index for background (tj) in the tileset image
            break;
          case ".": // Wall tile
            placeTile(i, j, floor(random(21,24)), floor(random(21,24)))
            let wallIndices = autotileWall(grid, j, i); // Get the autotile indices for the wall
            ti = wallIndices.ti; // Set the tile index for the wall
            tj = wallIndices.tj; // Set the tile index for the wall
            break;
          case " ": // Floor tile
            ti = floor(random(21,24)); // Tile index for floor (ti) in the tileset image
            tj = floor(random(21,24));; // Tile index for floor (tj) in the tileset image
            break;
          case "T": // Closed treasure chest
            placeTile(i, j, floor(random(21,24)), floor(random(21,24)))
            ti = 2; // Set the index for closed chest
            tj = 28;
            break;
          case "O": // Open treasure chest
            placeTile(i, j, floor(random(21,24)), floor(random(21,24)))
            ti = 5; // Set the index for open chest
            tj = 28;
            break;
          default:
            // Default tile if character is unrecognized
            ti = 1; // Default tile index (ti) in the tileset image
            tj = 1; // Default tile index (tj) in the tileset image
        }
  
        // Place the tile on the canvas
        placeTile(i, j, ti, tj);
      
      }
    }
  }


  