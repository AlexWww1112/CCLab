//sound
let buttonSound;

function preload(){
  buttonSound = loadSound("assets/sounds/button.mp3");
}

let worldX = 3200;
let worldY = 2000;
let worldSpeed = 0.5;

let screenX = 0;
let screenY = 0;
// let navigationSpeed = 4;

let polygons = [];
let circles = [];
let squares = [];
let triangles = [];
let numPoly = 200;
let numCir = 50;
let numSqu = 10;
let numTri = 5;
let scaletimes = 1;

let stage = 0;


//referrence point
let redpoint;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
  for(let i = 0; i < numPoly; i++){
    polygons.push(new POLYGON(random(100,worldX-100),random(100,worldY-100)));
  }
  for(let i = 0; i < numCir; i++){
    circles.push(new CIRCLE(random(100,worldX-100),random(100,worldY-100)));
  }
  for(let i = 0; i < numSqu; i++){
    squares.push(new SQUARE(random(100,worldX-100),random(100,worldY-100)));
  }
  for(let i = 0; i < numTri; i++){
    triangles.push(new TRIANGLE(random(100,worldX-100),random(100,worldY-100)));
  }
  redpoint = new Camera();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas dynamically
}

function draw() {
  if(stage == 0 || stage == 1){
    background(0);
  }
  if(stage == 2){
    background(0,10); 
    worldSpeed = 1;
  }

  //scale of the map
  push();
  // turn the control point to the center of the screen
  translate(width/2, height/2);
  scale(map(scaletimes, 0, 1, 0.15, 1));
  // turn the control point back
  translate(-width/2, -height/2);
  

  push();
  translate(screenX,screenY);

  // fill(0);
  // rect(0,0,worldX, worldY); 
  drawWorldBoundey();
  // redpoint.display();

  // Manage environment (rivers and mountains)
  manageEnvironment();

  // if(stage == 0){

  // }
  // console.log(polygons.length);
  // console.log(circles.length);
  // console.log(squares.length);
  // console.log(triangles.length);

  if(stage == 1 || stage == 2){
    managePolygons();
    manageCircles();
    manageSquares();
    manageTriangles();
  }

  // fill(255);
  // text(polygons.length,20,20);
  // text(circles.length,20,40);
  // text(squares.length,20,60);
  // text(triangles.length,20,80);

  pop();

  drawUI();
  push();
  translate(screenX,screenY);
  drawScaleBar();
  
  pop();
  drawStartButton();
  drawPatternCounters();
  drawEnvironmentButtons();
  drawEvilButton();
  
  // change color gradually
  // hue += 1;

  //camera movement
  if(keyIsPressed == true){
    if(key == "a"){
      redpoint.moveLeft();
    }else if(key == "d"){
      redpoint.moveRight();
    }else if(key == "w"){
      redpoint.moveUp();
    }else if(key == "s"){
      redpoint.moveDown();
    }
  }
}


class POLYGON{
  constructor(startX,startY){
    this.x = startX;
    this.y = startY;
    this.radius = 10;
    this.scaleFactor = random(0.8,1);

    this.speedx = random(-6,6) * worldSpeed;
    this.speedy = random(-6,6) * worldSpeed;

    this.originalSpeedX = this.speedx; // Store the original horizontal speed
    this.originalSpeedY = this.speedy; // Store the original vertical speed

    this.surviveTime = random(45,60);
    //to identify whether this object is being eaten or not
    this.Eaten = false;
    this.noiseOffset = noise(1000);
  }

  update() {
    this.surviveTime -= 2 * worldSpeed *( 1 / 30);
  
    let inRiver = false;
    let inForest = false;
  
    // Check if inside a river
    for (let river of rivers) {
      if (river.contains(this.x, this.y)) {
        inRiver = true;
        break;
      }
    }
  
    // Check if colliding with a mountain
    for (let mountain of mountains) {
      if (mountain.contains(this.x, this.y)) {
        this.speedx = -this.speedx;
        this.speedy = -this.speedy;
      }
    }
  
    // Check if inside a forest
    for (let forest of forests) {
      if (forest.contains(this.x, this.y)) {
        inForest = true;
        break;
      }
    }

    // use noise to control the angle
    let angle = noise(this.noiseOffset) * TWO_PI;
    let speedAdjusted = sqrt(this.originalSpeedX * this.originalSpeedX + this.originalSpeedY * this.originalSpeedY);
    // Update speeds based on noise angle
    this.speedx = cos(angle) * speedAdjusted;
    this.speedy = sin(angle) * speedAdjusted;
    this.noiseOffset += 0.01;

  
    // Adjust speed and growth based on environment
    if (inRiver) {
      // Slow down, but not less than 0.5*original speed
      this.speedx = constrain(this.originalSpeedX * 0.5, this.originalSpeedX * 0.5, this.originalSpeedX);
      this.speedy = constrain(this.originalSpeedY * 0.5, this.originalSpeedY * 0.5, this.originalSpeedY);
    } else if (inForest) {
      // Speed up, but not more than 2*original speed
      this.speedx = constrain(this.originalSpeedX * 2, this.originalSpeedX, this.originalSpeedX * 2);
      this.speedy = constrain(this.originalSpeedY * 2, this.originalSpeedY, this.originalSpeedY * 2);
      this.scaleFactor += 0.004; // Grow faster in forest
    } else {
      // Normal speed and growth
      this.speedx = this.originalSpeedX;
      this.speedy = this.originalSpeedY;
      this.scaleFactor += 0.002;
    }
  
    // Update position
    this.x += this.speedx;
    this.y += this.speedy;
  
    // Bounce at world edges
    if (this.x > worldX - this.radius * this.scaleFactor / 2) {
      this.x = worldX - this.radius * this.scaleFactor / 2;
      this.speedx = -this.speedx;
      this.originalSpeedX = -this.originalSpeedX;
    }
    if (this.x < this.radius * this.scaleFactor / 2) {
      this.x = this.radius * this.scaleFactor / 2;
      this.speedx = -this.speedx;
      this.originalSpeedX = -this.originalSpeedX;
    }
    if (this.y > worldY - this.radius * this.scaleFactor / 2) {
      this.y = worldY - this.radius * this.scaleFactor / 2;
      this.speedy = -this.speedy;
      this.originalSpeedY = -this.originalSpeedY;
    }
    if (this.y < this.radius * this.scaleFactor / 2) {
      this.y = this.radius * this.scaleFactor / 2;
      this.speedy = -this.speedy;
      this.originalSpeedY = -this.originalSpeedY;
    }
  }

  display(){
    push();
    translate(this.x,this.y);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color("skyblue");
    noFill();
    strokeWeight(3);
    stroke("skyblue");
    beginShape();
    vertex(this.radius * this.scaleFactor, 0); // Right
    vertex(this.radius * this.scaleFactor * 0.5, this.radius * this.scaleFactor * sqrt(3) / 2); // Bottom-right
    vertex(-this.radius * this.scaleFactor * 0.5, this.radius * this.scaleFactor * sqrt(3) / 2); // Bottom-left
    vertex(-this.radius * this.scaleFactor, 0); // Left
    vertex(-this.radius * this.scaleFactor * 0.5, -this.radius * this.scaleFactor * sqrt(3) / 2); // Top-left
    vertex(this.radius * this.scaleFactor * 0.5, -this.radius * this.scaleFactor * sqrt(3) / 2); // Top-right
    endShape(CLOSE);
    pop();
  }

  reproduce() {
    if (this.scaleFactor >= 2) {
      let newPolygon = new POLYGON(this.x + random(-5, 5), this.y + random(-5, 5));
      
      // Reset the current Polygon
      this.scaleFactor = random(0.8, 1);
      polygons.push(newPolygon);
    }
  }

  //after the living time, the creature will be deleted
  die(){
    if (this.surviveTime <= 0 || this.Eaten == true) {
      let index = polygons.indexOf(this);
      if (index > -1) {
          polygons.splice(index, 1);
      }
    }
  }
}


function managePolygons() {
  for (let i = polygons.length - 1; i >= 0; i--) {
    let poly = polygons[i];
    poly.update();
    poly.display();
    poly.reproduce();
    poly.die();
  }
}


class CIRCLE {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.radius = 20;
    this.scaleFactor = random(1, 1.2);
    this.speedx = random(-4, 4) * worldSpeed;
    this.speedy = random(-4, 4) * worldSpeed;
    this.originalSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
    this.surviveTime = random(35,55);
    this.escapeTimer = 0; // frames left for escape burst
    this.hasEscaped = false;
    this.Eaten = false;
  }

  update() {
    this.surviveTime -= 2 * worldSpeed * (1 / 30);
  
    let inForest = false;
    let inMountain = false;
  
    // Try to go around or turn back before hitting the mountain
    for (let mountain of mountains) {
      if (mountain.contains(this.x, this.y)) {
        inMountain = true;
        break;
      }
    }
    if (inMountain) {
      let mountainSpeed = min(0.2 * this.originalSpeed, abs(this.originalSpeed));
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      this.speedx = (this.speedx / currentSpeed) * mountainSpeed;
      this.speedy = (this.speedy / currentSpeed) * mountainSpeed;
    }
  
    // Move very slow in forest (but not less than 0.5*original speed)
    for (let forest of forests) {
      if (forest.contains(this.x, this.y)) {
        inForest = true;
        break;
      }
    }
    if (inForest) {
      let forestSpeed = min(0.5 * this.originalSpeed, abs(this.originalSpeed));
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      this.speedx = (this.speedx / currentSpeed) * forestSpeed;
      this.speedy = (this.speedy / currentSpeed) * forestSpeed;
    }
  
    // Escape when square is near, speed up (no more than 2x original), reduce lifetime
    let nearestSquare = null;
    let minDist = Infinity;
    for (let sqr of squares) {
      let d = dist(this.x, this.y, sqr.x, sqr.y);
      if (d < minDist) {
        minDist = d;
        nearestSquare = sqr;
      }
    }
    if (!this.hasEscaped && nearestSquare && minDist < 150) {
      // Start escape burst
      this.escapeTimer = 60; 
      this.hasEscaped = true;
      let escapeSpeed = min( 2 * this.originalSpeed, abs(this.originalSpeed) + 4);
      this.speedx = escapeSpeed;
      this.speedy = escapeSpeed;
    } else if (this.escapeTimer > 0) {
      // Continue escape burst, slow down gradually
      let burstSpeed = lerp(2 * this.originalSpeed, this.originalSpeed, 1 - this.escapeTimer / 60);
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      this.speedx = (this.speedx / currentSpeed) * burstSpeed;
      this.speedy = (this.speedy / currentSpeed) * burstSpeed;
      this.escapeTimer--;
    } else if (!inForest && !inMountain) {
      // Normal speed if not escaping and not in forest
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      this.speedx = (this.speedx / currentSpeed) * this.originalSpeed;
      this.speedy = (this.speedy / currentSpeed) * this.originalSpeed;
    }

    // Move
    this.x += this.speedx;
    this.y += this.speedy;
  
    // Bounce at world edges
    if (this.x > worldX - this.radius * this.scaleFactor / 2) {
      this.x = worldX - this.radius * this.scaleFactor / 2;
      this.speedx = -this.speedx;
    }
    if (this.x < this.radius * this.scaleFactor / 2) {
      this.x = this.radius * this.scaleFactor / 2;
      this.speedx = -this.speedx;
    }
    if (this.y > worldY - this.radius * this.scaleFactor / 2) {
      this.y = worldY - this.radius * this.scaleFactor / 2;
      this.speedy = -this.speedy;
    }
    if (this.y < this.radius * this.scaleFactor / 2) {
      this.y = this.radius * this.scaleFactor / 2;
      this.speedy = -this.speedy;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color("lightgreen");
    strokeWeight(3);
    stroke("lightgreen");
    noFill();
    circle(0, 0, this.radius * this.scaleFactor);
    pop();
  }

  reproduce() {
    if (this.scaleFactor >= 2 ) {
      let newCircle = new CIRCLE(this.x + random(-5, 5), this.y + random(-5, 5));
      this.scaleFactor = random(0.8, 1);
      circles.push(newCircle);
    }
  }

  die() {
    //no food to eat will die as well
    if (this.surviveTime <= 0 || this.scaleFactor <= 0.1 || this.Eaten == true) {
      let index = circles.indexOf(this);
      if (index > -1) {
        circles.splice(index, 1);
      }
    }
  }

  chase() {
    let nearest = null;
    let minDist = Infinity;
  
    // Find the nearest polygon
    for (let i = 0; i < polygons.length; i++) {
      let poly = polygons[i];
      let d = dist(this.x, this.y, poly.x, poly.y);
      if (d < minDist) {
        minDist = d;
        nearest = poly;
      }
    }
  
    // If a target is found and within chase range, adjust direction
    let chaseRange = 200;
    if (nearest && minDist <= chaseRange) {
      let dx = nearest.x - this.x;
      let dy = nearest.y - this.y;
      let z = sqrt(dx * dx + dy * dy);
  
      dx /= z;
      dy /= z;
  
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
  
      this.speedx = dx * currentSpeed;
      this.speedy = dy * currentSpeed;
    }
  }
}


function manageCircles(){
  for (let i = circles.length - 1; i >= 0; i--) {
    let cir = circles[i];

    //circle eat polygon
    for(let j = polygons.length - 1;j >= 0; j--){
      let poly = polygons[j];
      if(checkCollision(cir.x,cir.y,poly.x,poly.y,cir.radius*cir.scaleFactor*0.7,poly.radius*poly.scaleFactor)){
        poly.Eaten = true;
        cir.scaleFactor += 0.7; //grow when eat a polygon
        cir.reproduce();
      }
    }

    cir.update();
    cir.chase();
    cir.display();
    cir.die();
    
  }
}


class SQUARE {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 30;
    this.scaleFactor = random(0.8, 1);
    this.speedx = random(-4, 4) * worldSpeed;
    this.speedy = random(-4, 4) * worldSpeed;
    this.originalSpeedX = this.speedx;
    this.originalSpeedY = this.speedy;
    this.surviveTime = random(75,100);
    this.Eaten = false;
  }

  update() {
    this.surviveTime -= 2 * worldSpeed * (1 / 30);
  
    let inRiver = false;
    let inForest = false;
    let inMountain = false;
    let escapeTriangle = false;
  
    // Check river
    for (let river of rivers) {
      if (river.contains(this.x, this.y)) {
        inRiver = true;
        break;
      }
    }
  
    // Check forest
    for (let forest of forests) {
      if (forest.contains(this.x, this.y)) {
        inForest = true;
        break;
      }
    }
  
    // Check mountain
    for (let mountain of mountains) {
      if (mountain.contains(this.x, this.y)) {
        inMountain = true;
        break;
      }
    }
  
    // Escape triangle (direction only, speed unchanged)
    let nearestTriangle = null;
    let minTriDist = Infinity;
    for (let tri of triangles) {
      let d = dist(this.x, this.y, tri.x, tri.y);
      if (d < minTriDist) {
        minTriDist = d;
        nearestTriangle = tri;
      }
    }
    if (nearestTriangle && minTriDist < 300) {
      escapeTriangle = true;
      let dx = this.x - nearestTriangle.x;
      let dy = this.y - nearestTriangle.y;
      let len = sqrt(dx * dx + dy * dy) || 1;
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      this.speedx = (dx / len) * currentSpeed;
      this.speedy = (dy / len) * currentSpeed;
    }
  
    // Chase nearest circle (unless escaping triangle)
    let nearestCircle = null;
    let minCircleDist = Infinity;
    for (let cir of circles) {
      let d = dist(this.x, this.y, cir.x, cir.y);
      if (d < minCircleDist) {
        minCircleDist = d;
        nearestCircle = cir;
      }
    }
    if (!escapeTriangle && nearestCircle) {
      let dx = nearestCircle.x - this.x;
      let dy = nearestCircle.y - this.y;
      let len = sqrt(dx * dx + dy * dy) || 1;
      this.speedx = (dx / len) * abs(this.originalSpeedX);
      this.speedy = (dy / len) * abs(this.originalSpeedY);
    }
  
    // Adjust speed based on environment
    if (inRiver) {
      let riverSpeedX = 0.3 * this.originalSpeedX;
      let riverSpeedY = 0.3 * this.originalSpeedY;
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      let riverSpeed = sqrt(riverSpeedX * riverSpeedX + riverSpeedY * riverSpeedY);
      this.speedx = (this.speedx / currentSpeed) * riverSpeed;
      this.speedy = (this.speedy / currentSpeed) * riverSpeed;
    } else if (inMountain) {
      let mountainSpeedX = 3 * this.originalSpeedX;
      let mountainSpeedY = 3 * this.originalSpeedY;
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      let mountainSpeed = sqrt(mountainSpeedX * mountainSpeedX + mountainSpeedY * mountainSpeedY);
      this.speedx = (this.speedx / currentSpeed) * mountainSpeed;
      this.speedy = (this.speedy / currentSpeed) * mountainSpeed;
    } else if (inForest) {
      let forestSpeedX = 0.7 * this.originalSpeedX;
      let forestSpeedY = 0.7 * this.originalSpeedY;
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      let forestSpeed = sqrt(forestSpeedX * forestSpeedX + forestSpeedY * forestSpeedY);
      this.speedx = (this.speedx / currentSpeed) * forestSpeed;
      this.speedy = (this.speedy / currentSpeed) * forestSpeed;
    } else if (!escapeTriangle) {
      // Normal speed if not in special environment and not escaping
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
      let normalSpeed = sqrt(this.originalSpeedX * this.originalSpeedX + this.originalSpeedY * this.originalSpeedY);
      this.speedx = (this.speedx / currentSpeed) * normalSpeed;
      this.speedy = (this.speedy / currentSpeed) * normalSpeed;
    }
  
    // Move
    this.x += this.speedx;
    this.y += this.speedy;
  
    // Bounce at world edges
    if (this.x > worldX - this.size * this.scaleFactor / 2) {
      this.x = worldX - this.size * this.scaleFactor / 2;
      this.speedx = -this.speedx;
      this.originalSpeedX = -this.originalSpeedX;
    }
    if (this.x < this.size * this.scaleFactor / 2) {
      this.x = this.size * this.scaleFactor / 2;
      this.speedx = -this.speedx;
      this.originalSpeedX = -this.originalSpeedX;
    }
    if (this.y > worldY - this.size * this.scaleFactor / 2) {
      this.y = worldY - this.size * this.scaleFactor / 2;
      this.speedy = -this.speedy;
      this.originalSpeedY = -this.originalSpeedY;
    }
    if (this.y < this.size * this.scaleFactor / 2) {
      this.y = this.size * this.scaleFactor / 2;
      this.speedy = -this.speedy;
      this.originalSpeedY = -this.originalSpeedY;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color("orange");
    stroke("orange");
    strokeWeight(3);
    noFill();
    rectMode(CENTER);
    rect(0, 0, this.size * this.scaleFactor, this.size * this.scaleFactor);
    pop();
  }

  reproduce() {
    if (this.scaleFactor >= 2) {
      let newSquare = new SQUARE(this.x + random(-5, 5), this.y + random(-5, 5));
      this.scaleFactor = random(0.5, 0.7);
      squares.push(newSquare);
    }
  }

  die() {
    if (this.surviveTime <= 0 || this.scaleFactor <= 0.1 || this.Eaten == true) {
      let index = squares.indexOf(this);
      if (index > -1) {
        squares.splice(index, 1);
      }
    }
  }

  chase() {
    let nearest = null;
    let minDist = Infinity;
  
    // Find the nearest circle
    for (let i = 0; i < circles.length; i++) {
      let cir = circles[i];
      let d = dist(this.x, this.y, cir.x, cir.y);
      if (d < minDist) {
        minDist = d;
        nearest = cir;
      }
    }
  
    let chaseRange = 500;
    if (nearest && minDist <= chaseRange) {
      let dx = nearest.x - this.x;
      let dy = nearest.y - this.y;
      let z = sqrt(dx * dx + dy * dy);
  
      dx /= z;
      dy /= z;
  
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
  
      this.speedx = dx * currentSpeed;
      this.speedy = dy * currentSpeed;
    }
  }
  
}


function manageSquares(){
  for (let i = squares.length - 1; i >= 0; i--) {
    let sqr = squares[i];

    //circle eat polygon
    for(let j = circles.length - 1;j >= 0; j--){
      let cir = circles[j];
      if(checkCollision(sqr.x+sqr.size/2,sqr.y+sqr.size/2,cir.x,cir.y,sqr.size*sqr.scaleFactor/4,cir.radius*cir.scaleFactor)){
        cir.Eaten = true;
        sqr.scaleFactor += 0.3; //grow when eat a circle
      }
    }

    sqr.update();
    sqr.chase();
    sqr.display();
    sqr.die();
    sqr.reproduce();
   
  }
}


class TRIANGLE {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 50;
    this.scaleFactor = random(0.8, 1);
    this.speedx = random(-5, 5) * worldSpeed;
    this.speedy = random(-5, 5) * worldSpeed;
    this.originalSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
    this.surviveTime = random(150,200);
    this.restTimer = 0; // Frames to pause after eating
  }
  
  update() {
    // Decrease life; if resting after eating, do not move.
    this.surviveTime -= 2 * worldSpeed * (1 / 30);
    if (this.restTimer > 0) {
      this.restTimer--;
      // After rest, reset speed to original magnitude (keeping current direction)
      let angle = atan2(this.speedy, this.speedx);
      this.speedx = cos(angle) * this.originalSpeed;
      this.speedy = sin(angle) * this.originalSpeed;
      return;
    }
  
    // Environment checks
    let inRiver = false, inForest = false, inMountain = false;
    for (let river of rivers) {
      if (river.contains(this.x, this.y)) {
        inRiver = true;
        break;
      }
    }
    for (let forest of forests) {
      if (forest.contains(this.x, this.y)) {
        inForest = true;
        break;
      }
    }
    for (let mountain of mountains) {
      if (mountain.contains(this.x, this.y)) {
        inMountain = true;
        break;
      }
    }
  
    // Detect if there is a nearby square (chase range = 350)
    let chasing = false;
    let minDist = Infinity, nearestSquare = null;
    for (let sqr of squares) {
      let d = dist(this.x, this.y, sqr.x, sqr.y);
      if (d < minDist) {
        minDist = d;
        nearestSquare = sqr;
      }
    }
    if (minDist <= 250) {
      chasing = true;
    }
  
    if (chasing && nearestSquare) {
      // Simple chase: move toward the nearest square at 1.5×originalSpeed.
      let dx = nearestSquare.x - this.x;
      let dy = nearestSquare.y - this.y;
      let len = sqrt(dx * dx + dy * dy) || 1;
      dx /= len;
      dy /= len;
      this.speedx = dx * 1.5 * this.originalSpeed;
      this.speedy = dy * 1.5 * this.originalSpeed;
    } else {
      // Not chasing – set speed based on environment
      if (inRiver) {
        let targetSpeed = 3 * this.originalSpeed;
        let curr = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
        this.speedx = (this.speedx / curr) * targetSpeed;
        this.speedy = (this.speedy / curr) * targetSpeed;
      } else if (inForest) {
        let targetSpeed = 0.6 * this.originalSpeed;
        let curr = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
        this.speedx = (this.speedx / curr) * targetSpeed;
        this.speedy = (this.speedy / curr) * targetSpeed;
      } else if (inMountain) {
        let targetSpeed = 0.3 * this.originalSpeed;
        let curr = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
        this.speedx = (this.speedx / curr) * targetSpeed;
        this.speedy = (this.speedy / curr) * targetSpeed;
      } else {
        let targetSpeed = 0.8 * this.originalSpeed;
        let curr = sqrt(this.speedx * this.speedx + this.speedy * this.speedy) || 1;
        this.speedx = (this.speedx / curr) * targetSpeed;
        this.speedy = (this.speedy / curr) * targetSpeed;
      }
    }
  
    // Move the triangle
    this.x += this.speedx;
    this.y += this.speedy;
  
    // Bounce at world edges
    if (this.x > worldX - this.size * this.scaleFactor / 2 || this.x < this.size * this.scaleFactor / 2) {
      this.speedx = -this.speedx;
    }
    if (this.y > worldY - this.size * this.scaleFactor / 2 || this.y < this.size * this.scaleFactor / 2) {
      this.speedy = -this.speedy;
    }
  }
  
  // The chase() function remains unchanged
  chase() {
    let nearest = null;
    let minDist = Infinity;
  
    // Find the nearest square
    for (let i = 0; i < squares.length; i++) {
      let sqr = squares[i];
      let d = dist(this.x, this.y, sqr.x, sqr.y);
      if (d < minDist) {
        minDist = d;
        nearest = sqr;
      }
    }
  
    let chaseRange = 350;
    if (nearest && minDist <= chaseRange) {
      let dx = nearest.x - this.x;
      let dy = nearest.y - this.y;
      let z = sqrt(dx * dx + dy * dy);
  
      dx /= z;
      dy /= z;
  
      let currentSpeed = sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
  
      this.speedx = dx * currentSpeed;
      this.speedy = dy * currentSpeed;
    }
  }
  
  // Call this method to pause the triangle after it eats something.
  restAfterEat() {
    this.restTimer = 80; // e.g., 60 frames (1 second at 60 fps)
  }
  
  display() {
    push();
    translate(this.x, this.y);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color("purple");
    stroke("purple");
    strokeWeight(3);
    noFill();
    beginShape();
    vertex(0, -this.size * this.scaleFactor / sqrt(3)); // Top vertex
    vertex(-this.size * this.scaleFactor / 2, this.size * this.scaleFactor / (2 * sqrt(3))); // Bottom-left vertex
    vertex(this.size * this.scaleFactor / 2, this.size * this.scaleFactor / (2 * sqrt(3))); // Bottom-right vertex
    endShape(CLOSE);
    pop();
  }
  
  reproduce() {
    if (this.scaleFactor >= 2) {
      let newTriangle = new TRIANGLE(this.x + random(-5, 5), this.y + random(-5, 5));
      this.scaleFactor = random(0.8, 1);
      triangles.push(newTriangle);
    }
  }
  
  die() {
    if (this.surviveTime <= 0 || this.scaleFactor <= 0.05) {
      let index = triangles.indexOf(this);
      if (index > -1) {
        triangles.splice(index, 1);
      }
    }
  }
}


function manageTriangles(){
  for (let i = triangles.length - 1; i >= 0; i--) {
    let tri = triangles[i];

    //circle eat polygon
    for(let j = squares.length - 1;j >= 0; j--){
      let sqr = squares[j];
      if(checkCollision(sqr.x+sqr.size/2,sqr.y+sqr.size/2,tri.x,tri.y,sqr.size*sqr.scaleFactor/2,tri.size*0.6*tri.scaleFactor)){
        sqr.Eaten = true;
        tri.scaleFactor += 0.2; //grow when eat a square
        tri.restAfterEat();
      }
    }

    tri.update();
    tri.chase();
    tri.display();
    tri.die();
    tri.reproduce();
  }
}


//a class used to control the screen movement
class Camera{
  constructor(){
    this.x = windowWidth/2;
    this.y = height/2;
    this.speed = 15;
  }

  display(){
    push();
    translate(this.x,this.y);
    fill("red");
    circle(0, 0, 5);
    pop()
  }

  moveRight(){
    this.x += this.speed;
    screenX -= this.speed;
    // if(this.x < worldX * scaletimes){
    //   this.x += this.speed;
    //   screenX -= this.speed;
    // }
    //annotating because I'm not able to make same boundaries for both sides
  }
  moveLeft(){
    this.x -= this.speed;
    screenX += this.speed;
    // if(this.x > 0){
    //   this.x -= this.speed;
    //   screenX += this.speed;
    // }
  }
  moveUp(){
    this.y -= this.speed;
    screenY += this.speed;
    // if(this.y > 0){
    //   this.y -= this.speed;
    //   screenY += this.speed;
    // }
  }
  moveDown(){
    this.y += this.speed;
    screenY -= this.speed;
    // if(this.y < worldY * scaletimes){
    //   this.y += this.speed;
    //   screenY -= this.speed;
    // }
  }
}


//ALL EAT Realtion
//x,y are coordinate and r is radius
function checkCollision(x1,y1,x2,y2,r1,r2){
  let distance = dist(x1,y1,x2,y2);
  if(distance < r1+r2){
    return true;
  }
  else{
    return false
  }
}


class River {
  constructor(startX, startY, width, height) {
    this.x = startX;
    this.y = startY;
    this.width = width;
    this.height = height;
  }

  display() {
    push();
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color("blue");
    fill("blue");
    noStroke();
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  contains(x, y) {
    // Check if a point (x, y) is inside the river
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }
}

class Mountain {
  constructor(centerX, centerY, size) {
    this.x = centerX;
    this.y = centerY;
    this.size = size; // Size of the triangle
  }

  display() {
    push();
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color("brown");
    fill("brown");
    noStroke();
    translate(this.x, this.y);
    beginShape();
    vertex(0, -this.size / 2); // Top vertex
    vertex(-this.size / 2, this.size / 2); // Bottom-left vertex
    vertex(this.size / 2, this.size / 2); // Bottom-right vertex
    endShape(CLOSE);
    pop();
  }

  contains(x, y) {
    // Check if a point (x, y) is inside the triangle
    // Approximation: Check if the point is within the bounding box of the triangle
    return (
      x > this.x - this.size / 2 &&
      x < this.x + this.size / 2 &&
      y > this.y - this.size / 2 &&
      y < this.y + this.size / 2
    );
  }
}


class Forest {
  constructor(centerX, centerY, size, numTrees) {
    this.x = centerX;
    this.y = centerY;
    this.size = size;
    this.numTrees = numTrees; // 可用于后续扩展
  }
  
  display() {
    push();
    translate(this.x, this.y);
    // 统一视觉风格设置
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color("darkgreen");
    stroke("darkgreen");
    strokeWeight(3);
    
    // 绘制树形图案：首先绘制树干
    push();
    rectMode(CENTER);
    noStroke();
    fill("saddlebrown");
    // 树干高度与宽度根据 size 调整
    rect(0, this.size * 0.25, this.size * 0.15, this.size * 0.4);
    pop();
    
    // 绘制树冠（使用三角形表示）
    push();
    fill("forestgreen");
    stroke("darkgreen");
    beginShape();
      vertex(0, -this.size * 0.3);                 // 顶部
      vertex(-this.size * 0.5, this.size * 0.2);     // 左下角
      vertex(this.size * 0.5, this.size * 0.2);      // 右下角
    endShape(CLOSE);
    pop();
    
    pop();
  }
  
  contains(x, y) {
    return (
      x > this.x - this.size / 2 &&
      x < this.x + this.size / 2 &&
      y > this.y - this.size / 2 &&
      y < this.y + this.size / 2
    );
  }
}

let rivers = [];
let mountains = [];
let forests = [];
let drawMode = false;
let environmentMode = "none"; // Modes: "river", "mountain", "none"

function manageEnvironment() {
  // Draw rivers continuously when in "river" mode
  // if (environmentMode === "river" && mouseIsPressed) {
  //   rivers.push(new River(mouseX - screenX, mouseY - screenY, 50, 50));
  // }

  // // Draw mountains continuously when in "mountain" mode
  // if (environmentMode === "mountain" && mouseIsPressed) {
  //   mountains.push(new Mountain(mouseX - screenX, mouseY - screenY, 50));
  // }

  // Display all rivers
  for (let i = rivers.length - 1; i >= 0; i--) {
    rivers[i].display();
  }

  // Display all mountains
  for (let i = mountains.length - 1; i >= 0; i--) {
    mountains[i].display();
  }

  // Display all forests
  for (let i = forests.length - 1; i >= 0; i--) {
    forests[i].display();
  }
}

// Add this inside your existing mouseDragged() function at the top
function mouseDragged() {
  // Check if the mouse is over the scale bar area.
  let barWidth = 300;
  let barHeight = 20;
  let barX = (width - barWidth) / 2;
  let barY = height - 40;
  
  if (mouseY > barY && mouseY < barY + barHeight &&
      mouseX > barX && mouseX < barX + barWidth) {
    // Map mouseX to the scale range.
    scaletimes = map(mouseX, barX, barX + barWidth, 0.15, 1.0);
  } else {
    // Determine the current scale applied to the world (same as in draw())
    let currentScale = map(scaletimes, 0, 1, 0.15, 1);
    // Convert screen mouse coordinates to world coordinates.
    let worldMouseX = ((mouseX - screenX*currentScale) - width/2) / currentScale + width/2;
    let worldMouseY = ((mouseY - screenY*currentScale) - height/2) / currentScale + height/2;
    // let cellSize = 50;
    // worldMouseX = floor(worldMouseX / cellSize) * cellSize + cellSize / 2;
    // worldMouseY = floor(worldMouseY / cellSize) * cellSize + cellSize / 2;
    
    //draw environment by dragging mouse
    if (environmentMode === "river") {
      rivers.push(new River(worldMouseX, worldMouseY, 50, 50));
    } else if (environmentMode === "mountain") {
      mountains.push(new Mountain(worldMouseX, worldMouseY, 50));
    } else if (environmentMode === "forest") {
      forests.push(new Forest(worldMouseX, worldMouseY, 100, 10));
    }
  }
}

// function keyPressed() {
//   if (key === "r") {
//     environmentMode = "river";
//   } else if (key === "m") {
//     environmentMode = "mountain";
//   } else if (key === "n") {
//     environmentMode = "none";
//   } else if (key === "f") {
//     environmentMode = "forest";
//   }
// }

function drawWorldBoundey() {
  push();
  drawingContext.shadowBlur = 100;
  drawingContext.shadowColor = color(220);
  strokeWeight(7);
  stroke(220);
  noFill();
  rect(-10,-10,worldX+20, worldY+20);
  pop();
}

function drawUI() {
  push();
  resetMatrix(); // Remove any camera transforms
  
  let borderThickness = 50;
  
  noStroke();
  fill(100);

  // Top border:
  rect(0, 0, width, borderThickness);
  // Bottom border:
  rect(0, height - borderThickness, width, borderThickness);
  // Left border:
  rect(0, 0, borderThickness+125, height);
  // Right border:
  rect(width - borderThickness-125, 0, borderThickness+125, height);
  
  pop();
}

function drawScaleBar() {
  push();
  resetMatrix(); // Remove camera transforms
  
  // Define bar dimensions and position so that it's centered at the bottom.
  let barWidth = 300;
  let barHeight = 20;
  let barX = (width - barWidth) / 2;
  let barY = height - 40; // 70 px from the bottom (adjust as needed)
  
  // Draw the bar background.
  fill(220);
  stroke(0);
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Map the current scale (scaletimes) to a slider handle position.
  // Adjust minScale and maxScale to whatever range you desire.
  let minScale = 0.15;
  let maxScale = 1.0;
  let sliderX = map(scaletimes, minScale, maxScale, barX, barX + barWidth);
  
  // Draw the slider handle.
  noStroke();
  fill(150);
  ellipse(sliderX, barY + barHeight / 2, barHeight * 1.5, barHeight * 1.5);
  
  pop();
}


function drawStartButton() {
  push();
  resetMatrix();
  let startButtonWidth = 100;
  let startButtonHeight = 40;
  // 在每次绘制时根据当前的canvas高度动态计算位置
  let startButtonX = 35;
  let startButtonY = height - 50 - startButtonHeight - 10;
  fill(50, 150, 50);
  stroke(0);
  strokeWeight(2);
  rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight, 5);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("START", startButtonX + startButtonWidth / 2, startButtonY + startButtonHeight / 2);
  pop();
}

function drawEnvironmentButtons() {
  push();
  resetMatrix(); // 使用屏幕坐标绘制UI
  let buttonWidth = 100;
  let buttonHeight = 40;
  let gap = 30;
  // 右侧边框内，离右边留一定间距（例如10像素），从上边开始排列
  let startX = width - buttonWidth - 35;
  let startY = 100; // 可根据需要调整

  // River 按钮
  fill(200);
  stroke(0);
  strokeWeight(1);
  rect(startX, startY, buttonWidth, buttonHeight, 5);
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("RIVER", startX + buttonWidth / 2, startY + buttonHeight / 2);

  // Mountain 按钮
  let mountainY = startY + buttonHeight + gap;
  fill(200);
  stroke(0);
  rect(startX, mountainY, buttonWidth, buttonHeight, 5);
  fill(0);
  text("MOUNTAIN", startX + buttonWidth / 2, mountainY + buttonHeight / 2);

  // Forest 按钮
  let forestY = mountainY + buttonHeight + gap;
  fill(200);
  stroke(0);
  rect(startX, forestY, buttonWidth, buttonHeight, 5);
  fill(0);
  text("FOREST", startX + buttonWidth / 2, forestY + buttonHeight / 2);

  // STOP 按钮
  let stopY = forestY + buttonHeight + gap;
  fill(200);
  stroke(0);
  rect(startX, stopY, buttonWidth, buttonHeight, 5);
  fill(0);
  text("NONE", startX + buttonWidth / 2, stopY + buttonHeight / 2);
  
  pop();
}

// for buttons
function mousePressed() {
  let baseX = 10, baseY = 100;
  let buttonWidth = 30, buttonHeight = 20, gapY = 70;

  // POLYGON: “+”
  if (mouseX >= baseX + 60 && mouseX <= baseX + 60 + buttonWidth &&
      mouseY >= baseY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= baseY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    polygons.push(new POLYGON(random(100, worldX - 100), random(100, worldY - 100)));
    buttonSound.play();
    return;
  }
  // POLYGON: “-”
  if (mouseX >= baseX + 95 && mouseX <= baseX + 95 + buttonWidth &&
      mouseY >= baseY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= baseY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    if (polygons.length > 0) polygons.pop();
    buttonSound.play();
    return;
  }
  // CIRCLE: “+”
  let circlesY = baseY + gapY;
  if (mouseX >= baseX + 60 && mouseX <= baseX + 60 + buttonWidth &&
      mouseY >= circlesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= circlesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    circles.push(new CIRCLE(random(100, worldX - 100), random(100, worldY - 100)));
    buttonSound.play();
    return;
  }
  // CIRCLE: “-”
  if (mouseX >= baseX + 95 && mouseX <= baseX + 95 + buttonWidth &&
      mouseY >= circlesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= circlesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    if (circles.length > 0) circles.pop();
    buttonSound.play();
    return;
  }
  // SQUARE: “+”
  let squaresY = baseY + 2 * gapY;
  if (mouseX >= baseX + 60 && mouseX <= baseX + 60 + buttonWidth &&
      mouseY >= squaresY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= squaresY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    squares.push(new SQUARE(random(100, worldX - 100), random(100, worldY - 100)));
    buttonSound.play();
    return;
  }
  // SQUARE: “-”
  if (mouseX >= baseX + 95 && mouseX <= baseX + 95 + buttonWidth &&
      mouseY >= squaresY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= squaresY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    if (squares.length > 0) squares.pop()
    buttonSound.play();
    return;
  }
  // TRIANGLE: “+”
  let trianglesY = baseY + 3 * gapY;
  if (mouseX >= baseX + 60 && mouseX <= baseX + 60 + buttonWidth &&
      mouseY >= trianglesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= trianglesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    triangles.push(new TRIANGLE(random(100, worldX - 100), random(100, worldY - 100)));
    buttonSound.play();
    return;
  }
  // TRIANGLE: “-”
  if (mouseX >= baseX + 95 && mouseX <= baseX + 95 + buttonWidth &&
      mouseY >= trianglesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) &&
      mouseY <= trianglesY + 40 + ((gapY - 40) / 2 - buttonHeight/2) + buttonHeight) {
    if (triangles.length > 0) triangles.pop();
    buttonSound.play();
    return;
  }
  
  // environment button
  let buttonWidthEnv = 100;
  let buttonHeightEnv = 40;
  let gap = 30;
  let startXEnv = width - buttonWidthEnv - 35;
  let startYEnv = 100;
  
  if (mouseX >= startXEnv && mouseX <= startXEnv + buttonWidthEnv &&
      mouseY >= startYEnv && mouseY <= startYEnv + buttonHeightEnv) {
    environmentMode = "river";
    buttonSound.play();
    return;
  }
  let mountainY = startYEnv + buttonHeightEnv + gap;
  if (mouseX >= startXEnv && mouseX <= startXEnv + buttonWidthEnv &&
      mouseY >= mountainY && mouseY <= mountainY + buttonHeightEnv) {
    environmentMode = "mountain";
    buttonSound.play();
    return;
  }
  let forestY = mountainY + buttonHeightEnv + gap;
  if (mouseX >= startXEnv && mouseX <= startXEnv + buttonWidthEnv &&
      mouseY >= forestY && mouseY <= forestY + buttonHeightEnv) {
    environmentMode = "forest";
    buttonSound.play();
    return;
  }
  let stopY = forestY + buttonHeightEnv + gap;
  if (mouseX >= startXEnv && mouseX <= startXEnv + buttonWidthEnv &&
      mouseY >= stopY && mouseY <= stopY + buttonHeightEnv) {
    environmentMode = "none";
    buttonSound.play();
    return;
  }
  
  //stage 1
  let startButtonWidth = 100;
  let startButtonHeight = 40;
  let startButtonX = 35;
  let startButtonY = height - 50 - startButtonHeight - 10;
  if (mouseX >= startButtonX && mouseX <= startButtonX + startButtonWidth &&
      mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight) {
    stage = 1;
    buttonSound.play();
  }

  // Evil Button 
  let btnWidth = 100;
  let btnHeight = 40;
  let marginX = 35;
  let btnX = width - btnWidth - marginX;
  let btnY = height - 50 - btnHeight - 10;
  if (mouseX >= btnX && mouseX <= btnX + btnWidth &&
      mouseY >= btnY && mouseY <= btnY + btnHeight && stage == 1) {
      stage = 2;
      buttonSound.play();
      return;
  }
}

// 在左侧绘制计数器及“+”“-”按钮
function drawPatternCounters() {
  push();
  resetMatrix(); // Use screen coordinates for UI drawing

  // Set a unified font for all button labels and counter text.
  textFont("Arial");
  textSize(14);

  // Basic settings (smaller counter box)
  let baseX = 10;
  let baseY = 100;         // Top position for the first counter box
  let containerWidth = 140;
  let containerHeight = 40;
  let buttonWidth = 30, buttonHeight = 20;
  let gapY = 70;           // Total slot height for each counter (box + button gap)
  // Compute the vertical offset for buttons (centered in the gap below the container)
  let gapBelow = gapY - containerHeight;
  let buttonYOffset = gapBelow / 2 - buttonHeight / 2;

  // POLYGON counter
  fill(240);
  stroke(0);
  rect(baseX, baseY, containerWidth, containerHeight, 5);
  fill(0);
  textAlign(LEFT, CENTER);
  text("Polygons: " + polygons.length, baseX + 10, baseY + containerHeight / 2);

  // Move buttons to left (placed at baseX + 60 and baseX + 95)
  let buttonsY = baseY + containerHeight + buttonYOffset;
  fill(200);
  rect(baseX + 60, buttonsY, buttonWidth, buttonHeight, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text("+", baseX + 60 + buttonWidth / 2, buttonsY + buttonHeight / 2);
  fill(200);
  rect(baseX + 95, buttonsY, buttonWidth, buttonHeight, 5);
  fill(0);
  text("-", baseX + 95 + buttonWidth / 2, buttonsY + buttonHeight / 2);

  // CIRCLE counter
  let containerY2 = baseY + gapY;
  fill(240);
  stroke(0);
  rect(baseX, containerY2, containerWidth, containerHeight, 5);
  fill(0);
  textAlign(LEFT, CENTER);
  text("Circles: " + circles.length, baseX + 10, containerY2 + containerHeight / 2);
  let buttonsY2 = containerY2 + containerHeight + buttonYOffset;
  fill(200);
  rect(baseX + 60, buttonsY2, buttonWidth, buttonHeight, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text("+", baseX + 60 + buttonWidth / 2, buttonsY2 + buttonHeight / 2);
  fill(200);
  rect(baseX + 95, buttonsY2, buttonWidth, buttonHeight, 5);
  fill(0);
  text("-", baseX + 95 + buttonWidth / 2, buttonsY2 + buttonHeight / 2);

  // SQUARE counter
  let containerY3 = baseY + 2 * gapY;
  fill(240);
  stroke(0);
  rect(baseX, containerY3, containerWidth, containerHeight, 5);
  fill(0);
  textAlign(LEFT, CENTER);
  text("Squares: " + squares.length, baseX + 10, containerY3 + containerHeight / 2);
  let buttonsY3 = containerY3 + containerHeight + buttonYOffset;
  fill(200);
  rect(baseX + 60, buttonsY3, buttonWidth, buttonHeight, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text("+", baseX + 60 + buttonWidth / 2, buttonsY3 + buttonHeight / 2);
  fill(200);
  rect(baseX + 95, buttonsY3, buttonWidth, buttonHeight, 5);
  fill(0);
  text("-", baseX + 95 + buttonWidth / 2, buttonsY3 + buttonHeight / 2);

  // TRIANGLE counter
  let containerY4 = baseY + 3 * gapY;
  fill(240);
  stroke(0);
  rect(baseX, containerY4, containerWidth, containerHeight, 5);
  fill(0);
  textAlign(LEFT, CENTER);
  text("Triangles: " + triangles.length, baseX + 10, containerY4 + containerHeight / 2);
  let buttonsY4 = containerY4 + containerHeight + buttonYOffset;
  fill(200);
  rect(baseX + 60, buttonsY4, buttonWidth, buttonHeight, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text("+", baseX + 60 + buttonWidth / 2, buttonsY4 + buttonHeight / 2);
  fill(200);
  rect(baseX + 95, buttonsY4, buttonWidth, buttonHeight, 5);
  fill(0);
  text("-", baseX + 95 + buttonWidth / 2, buttonsY4 + buttonHeight / 2);

  pop();
}

// 新的诡异笑脸按钮，放置于 frame 右下方，与 start button 平行
function drawEvilButton() {
  push();
  resetMatrix();  // 使用屏幕坐标绘制 UI
  
  // 使用与 start button 相同的尺寸和底边对齐
  let btnWidth = 100;
  let btnHeight = 40;
  let marginX = 35;  // 与右边框的间距
  // 与 start button 保持同一垂直位置
  let btnX = width - btnWidth - marginX;
  let btnY = height - 50 - btnHeight - 10;
  
  // 绘制按钮背景
  fill(200);
  stroke(0);
  strokeWeight(2);
  rect(btnX, btnY, btnWidth, btnHeight, 5);
  
  // 在按钮内部绘制带有白色光环的“诡异笑脸”
  push();
    // 将坐标原点移动到按钮中心
    translate(btnX + btnWidth / 2, btnY + btnHeight / 2);
    
    // 绘制白色光环
    noFill();
    stroke(255);
    strokeWeight(4);
    ellipse(0, 0, btnWidth * 1.1, btnHeight * 1.1);
    
    // 绘制脸部（深黑色圆形）
    noStroke();
    fill(0);
    ellipse(0, 0, btnWidth * 0.7, btnHeight * 0.7);
    
    // 绘制眼睛（白色眼球与红色瞳孔）
    fill(255);
    ellipse(-btnWidth * 0.12, -btnHeight * 0.1, btnWidth * 0.15, btnWidth * 0.15);
    ellipse(btnWidth * 0.12, -btnHeight * 0.1, btnWidth * 0.15, btnWidth * 0.15);
    fill(255, 0, 0);
    ellipse(-btnWidth * 0.12, -btnHeight * 0.1, btnWidth * 0.07, btnWidth * 0.07);
    ellipse(btnWidth * 0.12, -btnHeight * 0.1, btnWidth * 0.07, btnWidth * 0.07);
    
    // 绘制嘴巴（白色弧形）
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(0, btnHeight * 0.05, btnWidth * 0.3, btnHeight * 0.2, 0, PI);
  pop();
  
  pop();
}