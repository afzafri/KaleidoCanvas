let userData;
const totalShapes = 100; // Number of shapes to generate

function setup() {
  createCanvas(1800, 1200);

if (!localStorage.getItem('userArtData')) {
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

  // Generate a lot of shapes
  for (let i = 0; i < totalShapes; i++) {
    generateRandomShape();
  }

  // Add some accent shapes in yellow and pink
  for (let i = 0; i < 10; i++) {
    generateAccentShape();
  }

  // Display user's name and happiness status
  fill(0);
  textSize(32);
  text(userData.name, 50, height - 50);

  if (userData.isHappy) {
    fill(0, 255, 0);
    text("You're happy!", 50, height - 100);
  } else {
    fill(255, 0, 0);
    text("Stay strong!", 50, height - 100);
  }
}

// Function to generate random shapes with black or white colors
function generateRandomShape() {
  let shapeType = int(random(4)); // Random shape type (0: circle, 1: rect, 2: triangle, 3: ellipse)
  let posX = random(width);
  let posY = random(height);
  let size = random(20, 200);
  let shapeColor = random([0, 255]); // Randomly black or white
  
  fill(shapeColor);
  noStroke();

  switch (shapeType) {
    case 0:
      circle(posX, posY, size);
      break;
    case 1:
      rect(posX, posY, size, size * 0.6);
      break;
    case 2:
      triangle(posX, posY, posX + size, posY, posX + size / 2, posY - size);
      break;
    case 3:
      ellipse(posX, posY, size, size * 1.5);
      break;
  }
}

// Function to generate accent shapes in yellow and pink
function generateAccentShape() {
  let shapeType = int(random(4)); // Random shape type
  let posX = random(width);
  let posY = random(height);
  let size = random(50, 150);
  let accentColor = random([color(255, 204, 0), color(255, 105, 180)]); // Yellow or pink

  fill(accentColor);
  noStroke();

  switch (shapeType) {
    case 0:
      circle(posX, posY, size);
      break;
    case 1:
      rect(posX, posY, size, size * 0.6);
      break;
    case 2:
      triangle(posX, posY, posX + size, posY, posX + size / 2, posY - size);
      break;
    case 3:
      ellipse(posX, posY, size, size * 1.5);
      break;
  }
}