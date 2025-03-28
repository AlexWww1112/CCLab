/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new NecroDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class NecroDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    this.scaleFactor = 1
    this.angle1 = 0;
    this.angle2 = 0;
    this.angle3 = 0;
    this.angle4 = 0;
    this.angle5 = 0;
    this.headgoal = 90;
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    this.x += 3*sin(frameCount*0.1);
    this.y += 3 * cos(frameCount * 0.08);

    if (floor((frameCount % 40) / 20) == 0) {
      this.angle1 = 25;
    } else {
      this.angle1 = -10;
    }
    if (floor((frameCount % 40) / 20) == 0) {
      this.angle2 = -20;
    } else {
      this.angle2 = 30;
    }

    this.angle3 = map(sin(frameCount * 0.05), -1, 1, -70, 50);
    this.angle4 = map(cos(frameCount * 0.05), -1, 1, -70, 50);
    // if (floor((frameCount % 40) / 20) == 0) {
    //   this.angle5 = 60;
    // } else {
    //   this.angle5 = -60;
    // }

    this.angle5 = lerp(this.angle5,this.headgoal,0.4);
    if(frameCount%40 == 0){
      this.headgoal += 60;
    }

    this.scaleFactor = 0.9 + 0.05*sin(frameCount*0.03);
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);
    scale(this.scaleFactor);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    this.drawhead();
    this.drawbody();
    this.drawarm();
    this.drawfoot();




    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes()

    pop();
  }
  drawhead() {
    push();
    translate(0,-70);
    rotate(radians(this.angle5));
    noStroke();
    fill(255);
    circle(0, 0, 60);
    fill(0);
    // rect(-15,-55,10,20);
    // rect(5,-55,10,20);
    triangle(0, 5, -5, 10, 5, 10);
    circle(-13, -5, 18);
    circle(13, -5, 18);
    rect(-25, 20, 50, 3);
    for (let i = 0; i < 6; i++) {
      fill(0);
      rect(i * 10 - 30, 17, 3, 10);
    }
    pop();
  }

  drawbody() {
    fill(255);
    rect(-5, -40, 10, 80);
    for (let i = 0; i < 5; i++) {
      fill(255);
      rect(-30, i * 15 - 30, 60, 7);
    }
  }

  drawfoot() {
    fill(255);
    //higher left
    push();
    translate(-30,30);
    rotate(radians(this.angle1));
    rect(0,0,10,40);
    pop();
    //higher right
    push();
    translate(20,30);
    rotate(radians(this.angle1));
    rect(0,0,10,40);
    pop();
    //lower left
    push();
    translate(-30,70);
    rotate(radians(this.angle2));
    rect(-5,-5,10,30);
    pop();
    //higher right
    push();
    translate(20,70);
    rotate(radians(this.angle2));
    rect(-5,-5,10,30);
    pop();
  }

  drawarm() {
    //left higher
    push();
    translate(-30,-30);
    rotate(radians(this.angle4));
    fill(255);
    rect(0,0,-65,7);
    pop();
    //left lower
    // push();
    // translate(-60,-30);
    // rotate(radians());
    // fill(255);
    // rect(0,0,-30,7);
    // pop();
    //right higher
    push();
    translate(30,-30);
    rotate(radians(this.angle3));
    fill(255);
    rect(0,0,65,7);
    pop();
    //right lower
    // push();
    // translate(60,-30);
    // rotate(radians(this.angle3));
    // fill(255);
    // rect(0,0,30,7);
    // pop();
  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/