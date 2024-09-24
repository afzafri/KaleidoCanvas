let userData;
let shapeData = []; // Array to store the shape data
const sections = 8; // Number of mirrored sections for the kaleidoscope

function setup() {
  createCanvas(1800, 1200);
  angleMode(DEGREES); // Use degrees for rotation

  if (!localStorage.getItem('userArtData') || !localStorage.getItem('shapeData')) {
    // Ask for user input
    // TODO: ask question in form frontend
    let name = prompt("What's your name?");
    let favNumber = prompt("What's your favorite number?");
    let favPerson = prompt("Who's your favorite person?");
    let keepsGoing = prompt("What keeps you going in life?");
    let isHappy = prompt("Are you happy?");

    userData = {
      name: name,
      favNumber: parseInt(favNumber) || 50, 
      favPerson: favPerson.length,
      keepsGoing: keepsGoing.length,
      isHappy: isHappy.toLowerCase() === 'yes' ? 1 : 0
    };

    localStorage.setItem('userArtData', JSON.stringify(userData));

    // Generate shapes and store their data
    let totalShapes = map(userData.keepsGoing, 1, 20, 50, 150); // More shapes if the answer is long
    let shapeSizeBase = map(userData.favNumber, 1, 100, 30, 100); // Larger favorite number, larger shapes

    for (let i = 0; i < totalShapes; i++) {
      shapeData.push(generateShapeData(shapeSizeBase)); // Store the shape data
    }

    localStorage.setItem('shapeData', JSON.stringify(shapeData)); // Save the shape data to localStorage
  } else {
    // Load the user data and shape data from localStorage
    userData = JSON.parse(localStorage.getItem('userArtData'));
    shapeData = JSON.parse(localStorage.getItem('shapeData'));
  }

  noLoop(); // Draw once
}

function draw() {
  background(255); // White background
  
  translate(width / 2, height / 2); // Move origin to the center of the canvas

  // Draw shapes using the stored data
  shapeData.forEach(data => {
    drawKaleidoscopeShape(data);
  });

  // Add user-specific name
  resetMatrix(); // Reset translation for text
  fill(0);
  textSize(32);
  text(userData.name, 50, height - 50);
}

// Function to generate random shape data
function generateShapeData(shapeSizeBase) {
  let posX = random(-width / 4, width / 4);
  let posY = random(-height / 4, height / 4);
  let size = random(shapeSizeBase * 0.5, shapeSizeBase * 1.5);
  let shapeType = int(random(4)); // Random shape type (0: circle, 1: rect, 2: triangle, 3: ellipse)
  
  let shapeColor;
  if (userData.isHappy) {
    shapeColor = random([
      [0, 0, 0], // Black
      [255, 255, 255], // White
      [255, 204, 0], // Yellow
      [255, 105, 180] // Pink
    ]); // Vibrant colors for happy
  } else {
    let colorProbability = random(1); // Adjust the likelihood of yellow and pink based on happiness
    shapeColor = (colorProbability < 0.8) 
      ? random([
          [0, 0, 0], // Black
          [255, 255, 255], // White
          [150, 150, 150] // Grey
        ]) 
      : random([
          [255, 204, 0], // Yellow
          [255, 105, 180] // Pink
        ]); // Less vibrant colors for unhappy
  }

  return {
    posX: posX,
    posY: posY,
    size: size,
    shapeType: shapeType,
    shapeColor: shapeColor // Store the color as an array of RGB values
  };
}

// Function to draw kaleidoscope shapes using stored data
function drawKaleidoscopeShape(data) {
  fill(data.shapeColor); // Use the stored shape color
  noStroke();

  // Draw shape in one section, and mirror it across other sections
  for (let i = 0; i < sections; i++) {
    push();
    rotate(i * (360 / sections)); // Rotate for kaleidoscope effect
    drawShape(data.shapeType, data.posX, data.posY, data.size);
    pop();
  }
}

// Helper function to draw individual shapes
function drawShape(shapeType, x, y, size) {
  switch (shapeType) {
    case 0:
      circle(x, y, size);
      break;
    case 1:
      rect(x, y, size, size * 0.6);
      break;
    case 2:
      triangle(x, y, x + size, y, x + size / 2, y - size);
      break;
    case 3:
      ellipse(x, y, size, size * 1.5);
      break;
  }
}

// Custom fill function to convert RGB arrays to p5.Color
function fill(colorArray) {
  // Use the color() function to create a p5.Color object from the RGB array
  let col = color(...colorArray);
  p5.prototype.fill.call(this, col);
}