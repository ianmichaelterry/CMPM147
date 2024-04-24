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
      for (let i = top-1; i <= bottom+1; i++) {
        for (let j = left-1; j <= right+1; j++) {
          if (grid[i][j] !== '_' && grid[i][j] !== '.') {
            return true; // Found an overlap
          }
        }
      }
      return false; // No overlap
    }
  
    // Helper function to create a room
    function createRoom(grid, margin, maxWidth, maxHeight) {
      let top, left, bottom, right;
      let overlap;
      do {
        // Determine room dimensions
        let interiorWidth = Math.floor(random(2, 5)); // Random interior width 2-4
        let interiorHeight = Math.floor(random(2, 5)); // Random interior height 2-4
  
        // Calculate top-left corner
        top = Math.floor(random(margin, maxHeight - interiorHeight - margin));
        left = Math.floor(random(margin, maxWidth - interiorWidth - margin));
  
        // Calculate bottom-right corner based on top-left + interior size
        bottom = top + interiorHeight + 1; // +1 for the wall
        right = left + interiorWidth + 1; // +1 for the wall
  
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
    }
  
    // Define margins to avoid placing the rooms at the very edges of the grid
    let margin = 1;
  
    // Create the first room without worrying about overlap
    createRoom(grid, margin, numCols - margin, numRows - margin);
  
    // Create the second room and check for overlap
    // If an overlap is detected, the createRoom function will try again
    createRoom(grid, margin, numCols - margin, numRows - margin);
    
    createRoom(grid, margin, numCols - margin, numRows - margin);
    return grid;
  }
  
// function generateGrid(numCols, numRows) {
//     let grid = [];
//     // Fill the entire grid with the background character '_'
//     for (let i = 0; i < numRows; i++) {
//         let row = [];
//         for (let j = 0; j < numCols; j++) {
//             row.push("_");
//         }
//         grid.push(row);
//     }

//     let rooms = [];

//     // Function to create rooms and check overlap
//     function createRoom() {
//         let interiorWidth = Math.floor(random(2, 5));
//         let interiorHeight = Math.floor(random(2, 5));
//         let margin = 1;
//         let top, left, bottom, right, overlap;

//         do {
//             top = Math.floor(random(margin, numRows - interiorHeight - margin));
//             left = Math.floor(random(margin, numCols - interiorWidth - margin));
//             bottom = top + interiorHeight + 1;
//             right = left + interiorWidth + 1;
//             overlap = checkOverlap(top, left, bottom, right);
//         } while (overlap);

//         // Set walls and interior space
//         for (let i = top; i <= bottom; i++) {
//             for (let j = left; j <= right; j++) {
//                 if (i === top || i === bottom || j === left || j === right) {
//                     grid[i][j] = ".";
//                 } else {
//                     grid[i][j] = " ";
//                 }
//             }
//         }
//         return [(top + bottom) / 2, (left + right) / 2]; // Return center for path
//     }

//     // Check for overlap with existing rooms
//     function checkOverlap(top, left, bottom, right) {
//         for (let i = top; i <= bottom; i++) {
//             for (let j = left; j <= right; j++) {
//                 if (grid[i][j] !== '_') {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     // Create rooms
//     rooms.push(createRoom());
//     rooms.push(createRoom());

//     // Create pathways
//     createPathway(rooms);

//     return grid;
// }

// Create pathways from a random edge to the rooms
function createPathway(rooms) {
    // Random edge start
    let startEdge = Math.floor(random(4)); // 0: top, 1: right, 2: bottom, 3: left
    let startX, startY;

    switch (startEdge) {
        case 0: // top
            startX = Math.floor(random(numCols));
            startY = 0;
            break;
        case 1: // right
            startX = numCols - 1;
            startY = Math.floor(random(numRows));
            break;
        case 2: // bottom
            startX = Math.floor(random(numCols));
            startY = numRows - 1;
            break;
        case 3: // left
            startX = 0;
            startY = Math.floor(random(numRows));
            break;
    }

    // Draw path from edge to first room
    drawPath(startX, startY, rooms[0][0], rooms[0][1]);

    // Draw path between rooms
    drawPath(rooms[0][0], rooms[0][1], rooms[1][0], rooms[1][1]);
}

// Function to draw path from point to point
function drawPath(startX, startY, endX, endY) {
    let x = startX;
    let y = startY;

    while (x !== endX || y !== endY) {
        if (x < endX) {
            x++;
        } else if (x > endX) {
            x--;
        }

        if (y < endY) {
            y++;
        } else if (y > endY) {
            y--;
        }

        grid[y][x] = ' ';
        surroundWithWalls(x, y);
    }
}

// Place walls around the path
function surroundWithWalls(x, y) {
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (x + dx >= 0 && x + dx < numCols && y + dy >= 0 && y + dy < numRows) {
                if (grid[y + dy][x + dx] === '_') {
                    grid[y + dy][x + dx] = '.';
                }
            }
        }
    }
}

function drawGrid(grid) {
    background(128); // Assuming a grey background is desired
    // Loop over every cell in the grid to draw tiles
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let tileChar = grid[i][j];
            let ti, tj;
            switch (tileChar) {
                case "_": // Background tile
                    ti = 0; tj = 0;
                    break;
                case ".": // Wall tile
                    ti = 2; tj = 23;
                    break;
                case " ": // Floor tile
                    ti = 0; tj = 13;
                    break;
                default:
                    ti = 0; tj = 0; // Default for unrecognized tiles
            }
            placeTile(i, j, ti, tj); // function to draw tile
        }
    }
}

  
//   function drawGrid(grid) {
//     background(128); // Assuming a grey background is desired
  
//     // Loop over every cell in the grid
//     for (let i = 0; i < grid.length; i++) {
//       for (let j = 0; j < grid[i].length; j++) {
//         // Determine what character is in the current cell
//         let tileChar = grid[i][j];
  
//         // Variables to hold the tile indices for the tileset
//         let ti, tj;
  
//         // Check the character and set the tile indices accordingly
//         switch (tileChar) {
//           case "_": // Background tile
//             ti = floor(random(4)); // Tile index for background (ti) in the tileset image
//             tj = 4; // Tile index for background (tj) in the tileset image
//             break;
//           case ".": // Wall tile
//             ti = 2; // Tile index for wall (ti) in the tileset image
//             tj = 23; // Tile index for wall (tj) in the tileset image
//             break;
//           case " ": // Floor tile
//             ti = 0; // Tile index for floor (ti) in the tileset image
//             tj = 13; // Tile index for floor (tj) in the tileset image
//             break;
//           // Add more cases as needed for other characters/tiles
//           default:
//             // Default tile if character is unrecognized
//             ti = 0; // Default tile index (ti) in the tileset image
//             tj = 0; // Default tile index (tj) in the tileset image
//         }
  
//         // Place the tile on the canvas
//         placeTile(i, j, ti, tj);
//       }
//     }
//   }
  