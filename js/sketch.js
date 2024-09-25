document.addEventListener('DOMContentLoaded', () => {
    let userData = JSON.parse(localStorage.getItem('userArtData'));

    if (userData) {
        displayUserData(userData)

        let instance = new p5(initSketch);
    } else {
        // Handle form submission
        document.getElementById('userForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Get the user input values
            const name = document.getElementById('name').value;
            const favNumber = document.getElementById('favNumber').value;
            const favPerson = document.getElementById('favPerson').value;
            const keepsGoing = document.getElementById('keepsGoing').value;
            const isHappy = document.querySelector('input[name="isHappy"]:checked').value;

            // Save user data to localStorage
            userData = {
              name: name,
              favNumber: favNumber,
              favPerson: favPerson,
              keepsGoing: keepsGoing,
              isHappy: isHappy
            };

            localStorage.setItem('userArtData', JSON.stringify(userData));

            displayUserData(userData)

            let instance = new p5(initSketch);
        });
    }
});

function displayUserData(userData) {
    // Hide the form
    document.getElementById('userForm').style.display = 'none';
    
    // Populate the saved data
    document.getElementById('savedName').textContent = userData.name;
    document.getElementById('savedFavNumber').textContent = userData.favNumber;
    document.getElementById('savedFavPerson').textContent = userData.favPerson;
    document.getElementById('savedKeepsGoing').textContent = userData.keepsGoing;
    document.getElementById('savedIsHappy').textContent = userData.isHappy ? 'Yes' : 'No';

    // Show the saved data section
    document.getElementById('userDataSection').style.display = 'block';
}

let initSketch = function(p) {
  let userData;
  let shapeData = []; // Array to store the shape data
  const sections = 8; // Number of mirrored sections for the kaleidoscope

  p.setup = function() {
    let canvas = p.createCanvas(1800, 1200);
    canvas.parent('p5CanvasContainer'); // Attach canvas to the div
    p.angleMode(p.DEGREES); // Use degrees for rotation

    userData = JSON.parse(localStorage.getItem('userArtData'));
    let name = userData.name;
    let favNumber = parseInt(userData.favNumber) || 50;
    let favPersonLength = userData.favPerson.length;
    let keepsGoingLength = userData.keepsGoing.length;
    let isHappy = userData.isHappy.toLowerCase() === 'yes' ? 1 : 0;

     userData = {
        name: name,
        favNumber: favNumber,
        favPerson: favPersonLength,
        keepsGoing: keepsGoingLength,
        isHappy: isHappy
      };
    
    if (!localStorage.getItem('shapeData')) {
      // Generate shapes and store their data
      let totalShapes = p.map(userData.keepsGoing, 1, 20, 50, 150); // More shapes if the answer is long
      let shapeSizeBase = p.map(userData.favNumber, 1, 100, 30, 100); // Larger favorite number, larger shapes

      for (let i = 0; i < totalShapes; i++) {
        shapeData.push(generateShapeData(shapeSizeBase)); // Store the shape data
      }

      localStorage.setItem('shapeData', JSON.stringify(shapeData)); // Save the shape data to localStorage
    } else {
      // Load the user data and shape data from localStorage
      shapeData = JSON.parse(localStorage.getItem('shapeData'));
    }

    p.noLoop(); // Draw once
  };

  p.draw = function() {
    p.background(255); // White background
    
    p.translate(p.width / 2, p.height / 2); // Move origin to the center of the canvas

    // Draw shapes using the stored data
    shapeData.forEach(data => {
      drawKaleidoscopeShape(data);
    });

    // Add user-specific name
    p.resetMatrix(); // Reset translation for text
    p.fill(0);
    p.textSize(32);
    p.text(userData.name, 50, p.height - 50);
  };

  // Function to generate random shape data
  function generateShapeData(shapeSizeBase) {
    let posX = p.random(-p.width / 4, p.width / 4);
    let posY = p.random(-p.height / 4, p.height / 4);
    let size = p.random(shapeSizeBase * 0.5, shapeSizeBase * 1.5);
    let shapeType = p.int(p.random(4)); // Random shape type (0: circle, 1: rect, 2: triangle, 3: ellipse)

    let shapeColor;
    if (userData.isHappy) {
      shapeColor = p.random([
        [0, 0, 0], // Black
        [255, 255, 255], // White
        [255, 204, 0], // Yellow
        [255, 105, 180] // Pink
      ]); // Vibrant colors for happy
    } else {
      let colorProbability = p.random(1); // Adjust the likelihood of yellow and pink based on happiness
      shapeColor = (colorProbability < 0.8) 
        ? p.random([
            [0, 0, 0], // Black
            [255, 255, 255], // White
            [150, 150, 150] // Grey
          ]) 
        : p.random([
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
    p.fill(data.shapeColor); // Use the stored shape color
    p.noStroke();

    // Draw shape in one section, and mirror it across other sections
    for (let i = 0; i < sections; i++) {
      p.push();
      p.rotate(i * (360 / sections)); // Rotate for kaleidoscope effect
      drawShape(data.shapeType, data.posX, data.posY, data.size);
      p.pop();
    }
  }

  // Helper function to draw individual shapes
  function drawShape(shapeType, x, y, size) {
    switch (shapeType) {
      case 0:
        p.circle(x, y, size);
        break;
      case 1:
        p.rect(x, y, size, size * 0.6);
        break;
      case 2:
        p.triangle(x, y, x + size, y, x + size / 2, y - size);
        break;
      case 3:
        p.ellipse(x, y, size, size * 1.5);
        break;
    }
  }

  // Custom fill function to convert RGB arrays to p5.Color
  p.fill = function(colorArray) {
    let col = p.color(...colorArray);
    p5.prototype.fill.call(p, col);
  };
};