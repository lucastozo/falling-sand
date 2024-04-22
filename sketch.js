const w = 10;
const gravity = 0.1;

let grid;
let cols, rows;
let grains = 0;
let yellowValue = 0;
let speeds;

function generateArray(rows, cols) {
  let array = new Array(rows);
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(cols);
    for (let j = 0; j < array[i].length; j++) {
      array[i][j] = 0;
    }
  }
  return array;
}

function setup() {
  createCanvas(400, 600);
  colorMode(HSB, 360, 255, 255);
  rows = height / w;
  cols = width / w;
  grid = generateArray(rows, cols);
  speeds = generateArray(rows, cols);
}

function mouseDragged() {
  let mouseRow = floor(mouseY / w);
  let mouseCol = floor(mouseX / w);
  if (mouseRow >= rows) {
    mouseRow = rows - 1;
  }
  if (mouseCol >= cols) {
    mouseCol = cols - 1;
  }

  let brushSize = 1;
  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      if(mouseRow + i < 0 || mouseRow + i >= rows || mouseCol + j < 0 || mouseCol + j >= cols || random(1) < 0.50) {
        continue;
      }
      let row = mouseRow + i;
      let col = mouseCol + j;
      if (grid[row][col] > 0) {
        continue;
      }
      grid[row][col] = yellowValue;
      speeds[row][col] = 1; // start speed
    }
  }
  grains++;

  //yellowValue > 360 ? yellowValue = 0 : yellowValue += 1;
  yellowValue = 60;
}
  
function draw() {
  background(0);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      noStroke();

      if(grid[i][j] > 0) {
        fill(grid[i][j], 255, 255);
        let x = j*w;
        let y = i*w;
        square(x, y, w);
      }
    }
  }

  let nextFrame = generateArray(rows, cols);
  let nextSpeeds = generateArray(rows, cols);

  for (let i = rows - 1; i >= 0; i--) {
    for (let j = 0; j < cols; j++) {
      const state = grid[i][j];
      if (state <= 0) {
        continue;
      }

      let velocity = speeds[i][j];
      velocity += gravity; // acceleration
      let nextRow = Math.min(i + Math.floor(velocity), rows - 1);

      let direction = Math.random() > 0.5 ? 1 : -1;
      let nextCol = j + direction;
      if (nextCol < 0) nextCol = 0;
      if (nextCol >= cols) nextCol = cols - 1;

      let canMoveDown = nextRow < rows && grid[nextRow][j] == 0;
      let canMoveSideways = i+1 < rows && grid[i+1][nextCol] == 0;

      if (canMoveDown) {
        nextFrame[nextRow][j] = state;
        nextSpeeds[nextRow][j] = velocity;
      } else if (canMoveSideways) {
        nextFrame[i+1][nextCol] = state;
        nextSpeeds[i+1][nextCol] = 1; // reset speed when moving sideways
      } else {
        nextFrame[i][j] = state;
        nextSpeeds[i][j] = 1; // reset speed
      }
    }
  }
  grid = nextFrame;
  speeds = nextSpeeds;
}