let userData;
const sections = 8; // Number of mirrored sections for the kaleidoscope

function setup() {
  createCanvas(1800, 1200);
  angleMode(DEGREES); // Use degrees for rotation

  if (!localStorage.getItem('userArtData')) {
    // TODO: ask question in frontend form
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
  } else {
    userData = JSON.parse(localStorage.getItem('userArtData'));
  }

  noLoop(); // Draw once
}

function draw() {
  background(255); // White background
  
  translate(width / 2, height / 2); // Move origin to the center of the canvas

  // Generate shapes based on user input
  let totalShapes = map(userData.keepsGoing, 1, 20, 50, 150); // More shapes if the answer is long
  let shapeSizeBase = map(userData.favNumber, 1, 100, 30, 100); // Larger favorite number, larger shapes

  for (let i = 0; i < totalShapes; i++) {
    generateKaleidoscopeShape(shapeSizeBase);
  }

  // Add user-specific name
  resetMatrix(); // Reset translation for text
  fill(0);
  textSize(32);
  text(userData.name, 50, height - 50);
}

// Function to generate kaleidoscope shapes with different color schemes based on happiness
function generateKaleidoscopeShape(shapeSizeBase) {
  let posX = random(-width / 4, width / 4);
  let posY = random(-height / 4, height / 4);
  let size = random(shapeSizeBase * 0.5, shapeSizeBase * 1.5);

  let shapeType = int(random(4)); // Random shape type (0: circle, 1: rect, 2: triangle, 3: ellipse)
  let shapeColor;

  // Adjust the likelihood of yellow and pink based on happiness
  if (userData.isHappy) {
    // If happy, more vibrant colors (yellow/pink)
    shapeColor = random([color(0), color(255), color(255, 204, 0), color(255, 105, 180)]); // Black, White, Yellow, Pink
  } else {
    // If unhappy, less vibrant colors (more black and white, fewer accent colors)
    shapeColor = random([color(0), color(255), color(150)]); // Mostly Black, White, and Grey for a muted effect
  }

  fill(shapeColor);
  noStroke();

  // Draw shape in one section, and mirror it across other sections
  for (let i = 0; i < sections; i++) {
    push();
    rotate(i * (360 / sections)); // Rotate for kaleidoscope effect
    drawShape(shapeType, posX, posY, size);
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