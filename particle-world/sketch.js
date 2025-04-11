// CCLab Mini Project - 9.R Particle World Template

let NUM_OF_PARTICLES = 50; // Decide the initial number of particles.
let MAX_OF_PARTICLES = 500; // Decide the maximum number of particles.

let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  // generate particles
  // for (let i = 0; i < NUM_OF_PARTICLES; i++) {
  //   particles[i] = new Particle(random(-50,50)+mouseX, random(-30,30)+mouseY);
  // }
}

function draw() {
  background(20,15);
  
  // consider generating particles in draw(), using Dynamic Array
  for(let i = 0; i < 2; i++){
    particles.push(new Particle(mouseX+random(-10,10),mouseY+random(-10,10)));
  }
  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.checkOutOfCanvas();
    p.display();
  }

  // limit the number of particles
  for(let i = particles.length-1; i >= 0; i--){
    if(particles[i].onCanvas == false){
      particles.splice(i,1);
    }
  }
  
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    this.dia = random(1,10);
    this.speedX = 0;
    this.speedY = 0;
    this.accelerateX = random(-0.08,0.08);
    this.accelerateY = random(0.01,-0.01);
    this.red = 0;
    this.green = 255;
    this.blue = 0;
    this.deg = 0;
    this.speedD = 120;
    this.onCanvas = true;
  }
  // methods (functions): particle's behaviors
  update() {
    // (add) 
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX += this.accelerateX;
    this.speedY += this.accelerateY;
    this.deg += this.speedD;
    this.dia+=0.01;
    if(this.green>=0){
      this.green -= 1;
      this.red += 1
    }
    else{
      this.green += 1;
      this.red -=1;
    }
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    rotate(radians(this.deg));
    noStroke();
    fill(this.red,this.green,this.blue);
    square(0,0, this.dia);

    pop();
  }

  checkOutOfCanvas(){
    if(this.y > height+100 || this.y < -100 || this.x<-100 || this.x> width +100){
      this.onCanvas = false;
    }
  }
}

function mousePressed(){
  for(let i = 0; i < NUM_OF_PARTICLES; i++){
    particles.push(new Particle(mouseX+random(-30,30),mouseY+random(-30,30)));
  }
}