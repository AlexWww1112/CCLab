let worldX = 3200;
let worldY = 2000;

let screenX = 0;
let screenY = 0;
// let navigationSpeed = 4;

let polygons = [];
let circles = [];
let squares = [];
let triangles = [];
let numPoly = 100;
let numCir = 80;
let numSqu = 60;
let numTri = 40;

//referrence point
let redpoint;

function setup() {
  let canvas = createCanvas(800, 500);
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

function draw() {
  background(220);

  push();
  translate(screenX,screenY);
  
  // fill(0);
  // text(polygons.length,20,20);
  // text(circles.length,20,40);
  // text(squares.length,20,60);
  // text(triangles.length,20,80);

  console.log(polygons.length);
  console.log(circles.length);
  console.log(squares.length);
  console.log(triangles.length);

  fill(100);
  rect(0,0,worldX, worldY);

  redpoint.display();

  managePolygons();
  manageCircles();
  manageSquares();
  manageTriangles();
  pop();

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
    this.radius = 15;
    this.scaleFactor = random(0.8,1);

    this.speedx = random(-5,5);
    this.speedy = random(-5,5);

    this.surviveTime = 60;
    //to identify whether this object is being eaten or not
    this.Eaten = false;
    
  }

  update(){
    this.scaleFactor += 0.001;
    this.surviveTime -= 1/30;

    this.x += this.speedx;
    this.y += this.speedy;

    //bound, can't go out of the world
    if(this.x > worldX - this.radius*this.scaleFactor/2  || this.x < this.radius*this.scaleFactor/2){
      this.speedx = -this.speedx;
    }
    if(this.y > worldY - this.radius*this.scaleFactor/2 || this.y < this.radius*this.scaleFactor/2){
      this.speedy = -this.speedy;
    }
  }

  display(){
    push();
    translate(this.x,this.y);
    fill("skyblue");
    noStroke();
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
    this.speedx = random(-5, 5);
    this.speedy = random(-5, 5);
    this.surviveTime = 60;
    this.Eaten = false;
    this.reproduceCooldown = 0; // Cooldown timer for reproduction
  }

  update() {
    // this.scaleFactor -= 0.001;
    this.surviveTime -= 1/30;

    this.x += this.speedx;
    this.y += this.speedy;

    // Decrease the cooldown timer
    if (this.reproduceCooldown > 0) {
      this.reproduceCooldown--;
    }

    // Boundaries
    if (this.x > worldX - this.radius * this.scaleFactor/2 || this.x < this.radius * this.scaleFactor/2) {
      this.speedx = -this.speedx;
    }
    if (this.y > worldY - this.radius * this.scaleFactor/2 || this.y < this.radius * this.scaleFactor/2) {
      this.speedy = -this.speedy;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    fill("lightgreen");
    noStroke();
    circle(0, 0, this.radius * this.scaleFactor);
    pop();
  }

  reproduce() {
    if (this.scaleFactor >= 2 && this.reproduceCooldown <= 0) {
      let newCircle = new CIRCLE(this.x + random(-5, 5), this.y + random(-5, 5));
      this.scaleFactor = random(0.8, 1);
      this.reproduceCooldown = 120; // Set a cooldown period
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
}


function manageCircles(){
  for (let i = circles.length - 1; i >= 0; i--) {
    let cir = circles[i];

    //circle eat polygon
    for(let j = polygons.length - 1;j >= 0; j--){
      let poly = polygons[j];
      if(checkCollision(cir.x,cir.y,poly.x,poly.y,cir.radius*cir.scaleFactor,poly.radius*poly.scaleFactor)){
        poly.Eaten = true;
        cir.scaleFactor += 0.8; //grow when eat a polygon
      }
    }

    cir.update();
    cir.display();
    cir.die();
    cir.reproduce();
   
  }
}


class SQUARE {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 20;
    this.scaleFactor = random(0.8, 1);
    this.speedx = random(-5, 5);
    this.speedy = random(-5, 5);
    this.surviveTime = 60;
    this.Eaten = false;
    this.reproduceCooldown = 0; // Cooldown timer for reproduction
  }

  update() {
    // this.scaleFactor -= 0.001;
    this.surviveTime -= 1/30;

    this.x += this.speedx;
    this.y += this.speedy;

    // Boundaries
    if (this.x > worldX - this.size * this.scaleFactor / 2 || this.x < this.size * this.scaleFactor / 2) {
      this.speedx = -this.speedx;
    }
    if (this.y > worldY - this.size * this.scaleFactor / 2 || this.y < this.size * this.scaleFactor / 2) {
      this.speedy = -this.speedy;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    fill("orange");
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size * this.scaleFactor, this.size * this.scaleFactor);
    pop();
  }

  reproduce() {
    if (this.scaleFactor >= 2) {
      let newSquare = new SQUARE(this.x + random(-5, 5), this.y + random(-5, 5));
      this.scaleFactor = random(0.8, 1);
      this.reproduceCooldown = 120; // Set a cooldown period
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
}


function manageSquares(){
  for (let i = squares.length - 1; i >= 0; i--) {
    let sqr = squares[i];

    //circle eat polygon
    for(let j = circles.length - 1;j >= 0; j--){
      let cir = circles[j];
      if(checkCollision(sqr.x+sqr.size/2,sqr.y+sqr.size/2,cir.x,cir.y,sqr.size*sqr.scaleFactor/2,cir.radius*cir.scaleFactor)){
        cir.Eaten = true;
        sqr.scaleFactor += 0.8; //grow when eat a circle
      }
    }

    sqr.update();
    sqr.display();
    sqr.die();
    sqr.reproduce();
   
  }
}


class TRIANGLE {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 20;
    this.scaleFactor = random(0.8, 1);
    this.speedx = random(-5, 5);
    this.speedy = random(-5, 5);
    this.surviveTime = 100;
    this.reproduceCooldown = 0; // Cooldown timer for reproduction
  }

  update() {
    // this.scaleFactor -= 0.001;
    this.surviveTime -= 1/30;

    this.x += this.speedx;
    this.y += this.speedy;

    // Boundaries
    if (this.x > worldX - this.size * this.scaleFactor / 2 || this.x < this.size * this.scaleFactor / 2) {
      this.speedx = -this.speedx;
    }
    if (this.y > worldY - this.size * this.scaleFactor / 2 || this.y < this.size * this.scaleFactor / 2) {
      this.speedy = -this.speedy;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    fill("purple");
    noStroke();
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
      this.reproduceCooldown = 120; // Set a cooldown period
      triangles.push(newTriangle);
    }
  }

  die() {
    if (this.surviveTime <= 0) {
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
      if(checkCollision(sqr.x+sqr.size/2,sqr.y+sqr.size/2,tri.x,tri.y,sqr.size*sqr.scaleFactor/2,tri.size*tri.scaleFactor)){
        sqr.Eaten = true;
        tri.scaleFactor += 1; //grow when eat a circle
      }
    }

    tri.update();
    tri.display();
    tri.die();
    tri.reproduce();
   
  }
}


//a class used to control the screen movement
class Camera{
  constructor(){
    this.x = width/2;
    this.y = height/2+10;
    this.speed = 20;
  }

  display(){
    push();
    translate(this.x,this.y);
    fill("red");
    circle(0, 0, 5);
    pop()
  }

  moveRight(){
    if(this.x < worldX){
      this.x += this.speed;
      screenX -= this.speed;
    }
    
  }
  moveLeft(){
    if(this.x > 0){
      this.x -= this.speed;
      screenX += this.speed;
    }
  }
  moveUp(){
    if(this.y > 0){
      this.y -= this.speed;
      screenY += this.speed;
    }
  }
  moveDown(){
    if(this.y < worldY){
      this.y += this.speed;
      screenY -= this.speed;
    }
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
