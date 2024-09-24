let userData;

// Helper function to check if a number is prime
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function setup() {
  createCanvas(1800, 1200);

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
  
  noLoop();
}

function draw() {
  background(255); // White background

  // Use favorite number to determine shape type (prime or not)
  if (isPrime(userData.favNumber)) {
    fill(255, 204, 0); // Yellow
    triangle(200, 300, 200 + userData.favNumber * 2, 300, 250, 400); // Draw triangle
  } else {
    fill(255, 204, 0); // Yellow
    rect(100 + userData.favNumber * 3, 200, 80, 80); // Draw square
  }

  // Use favorite person's name length to determine shape (odd/even)
  if (userData.favPerson % 2 === 0) {
    fill(255, 105, 180); // Pink
    rect(200 + userData.keepsGoing * 2, 400, userData.favNumber * 2, 50); // Draw rectangle
  } else {
    fill(255, 105, 180); // Pink
    ellipse(300 + userData.keepsGoing * 3, 500, 100, 150); // Draw ellipse
  }

  fill(0);
  textSize(32);
  text(userData.name, 50, height - 50); // Display user's name
}
