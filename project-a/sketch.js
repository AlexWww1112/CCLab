function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
    background(20, 50, 100);
    frameRate(7);
}

let pixelsize = 10;
let secondCount;
let boatX = 400;
let boatY = 250;
let Second;
let hitCount = 0;
let creatureX, creatureY;

function draw() {
    drawWave();

    //let the creature fade away
    if (Second >= 59) {
        creatureX = creatureX - 20;
    }
    else {
        creatureX = 450;
    }
    creatureY = 250;
    creatureY = creatureY + 60 * sin(frameCount * 0.05);
    creatureX = creatureX + 30 * cos(frameCount * 0.1);

    fire(boatX, boatY, creatureX, creatureY);
    drawCreature(creatureX, creatureY);
    // y = 10 * sin(frameCount * 0.05)
    sand();
    boat();
    HP();
    drawInstruct();
    processing();
    victory();
}

let sx1, sy1, sx2, sy2, sx3, sy3;
//color of the fireball
let firered = 255;
let firegreen = 255;
//angle of fireball
// let fire1 = -360;
// let fire2 = 0;
// let fire3 = -360;

function fire(x, y, cx, cy) {
    Second = Math.floor(frameCount / 7);
    // fire1 = fire1 + 12;
    // fire2 = fire2 - 10;
    // fire3 = fire3 + 5;
    if (Second >= 6 && Second < 61) {
        sx1 = 250 * sin(frameCount * 0.15) + cx - 300;
        sy1 = 250 * cos(frameCount * 0.15) + cy;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                noStroke();
                if (Hitbox(x + 20, y + 10, i * pixelsize + sx1, j * pixelsize + sy1, 10) && protection() == false) {
                    hitCount++;
                }
                firered = 220 + random(-10, 35);
                firegreen = 220 + random(-10, 35);
                fill(firered, firegreen, 0);
                square(i * pixelsize + sx1, j * pixelsize + sy1, 10)
            }
        }
    }
    if (Second >= 9 && Second < 61) {
        sx2 = 400 * sin(-frameCount * 0.1) + cx - 300;
        sy2 = 400 * cos(-frameCount * 0.1) + cy;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                noStroke();
                if (Hitbox(x, y, i * pixelsize + sx2, j * pixelsize + sy2, 20)) {
                    firered = 255;
                    firegreen = 0;
                }
                // else{
                //   firered = 220+random(-10,35);
                //   firegreen = 220+random(-10,35);
                // }
                fill(firered, firegreen, 0);
                square(i * pixelsize + sx2, j * pixelsize + sy2, 10)
            }
        }
    }
    if (Second >= 14 && Second < 61) {
        sx3 = 550 * sin(frameCount * 0.25) + cx - 300;
        sy3 = 550 * cos(frameCount * 0.25) + cy;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                noStroke();
                if (Hitbox(x + 20, y + 10, i * pixelsize + sx3, j * pixelsize + sy3, 20)) {
                    firered = 255;
                    firegreen = 0;
                }
                firered = 220 + random(-10, 35);
                firegreen = 220 + random(-10, 35);

                fill(firered, firegreen, 0);
                square(i * pixelsize + sx3, j * pixelsize + sy3, 10)
            }
        }
    }
    //   push();
    //   translate(cx-300,cy);
    //   rotate(radians(fire1));
    //   if(Second>=2){
    //     for(let i=0;i<3;i++){
    //       for(let j=0;j<3;j++){
    //         noStroke();
    //         if(Hitbox(x,y,10,i*pixelsize-50,j*pixelsize)){
    //           firered = 255;
    //           firegreen = 0;
    //         }
    //         else{
    //           firered = 220+random(-10,35);
    //           firegreen = 220+random(-10,35);
    //         }
    //         fill(firered,firegreen,0);
    //         square(i*pixelsize+250,j*pixelsize,10)

    //       }
    //     }
    //   }
    //   pop();
    //   push();
    //   translate(cx-300,cy);
    //   rotate(radians(fire2));
    //   if(Second>=5){
    //     for(let i=0;i<3;i++){
    //       for(let j=0;j<3;j++){
    //         firered = 220+random(-10,35);
    //         firegreen = 220+random(-10,35);
    //         noStroke();
    //         fill(firered,firegreen,0);
    //         square(i*pixelsize+400,j*pixelsize,10)
    //       }
    //     }
    //   }
    //   pop();
    //   push();
    //   translate(cx-300,cy);
    //   rotate(radians(fire3));
    //   if(Second>=10){
    //     for(let i=0;i<3;i++){
    //       for(let j=0;j<3;j++){
    //         firered = 220+random(-10,35);
    //         firegreen = 220+random(-10,35);
    //         noStroke();
    //         fill(firered,firegreen,0);
    //         square(i*pixelsize+550,j*pixelsize,10)
    //       }
    //     }
    //   }
    //   pop();
}

let pCount = 0;
let prostatus = false;
function Hitbox(x, y, px, py, r) {
    if (dist(x, y, px, py) < r) {
        prostatus = true
        return true;
    }
}

function protection() {
    if (prostatus == true && pCount <= 10) {
        pCount = pCount + frameCount;
        return true;
    }
    if (pCount > 10) {
        pCount = 0;
        prostatus = false;
        return false;
    }
}

function HP() {
    if (hitCount == 0) {
        drawHeart(730, 10);
        drawHeart(650, 10);
        drawHeart(570, 10);
    }
    else if (hitCount == 1) {
        drawHeart(730, 10);
        drawHeart(650, 10);
    }
    else if (hitCount == 2) {
        drawHeart(730, 10);
    }
}

function drawHeart(heartX, heartY) {
    // let heartX = 700 - 3 * pixelsize;
    // let heartY = 50 - 3 * pixelsize;
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 7; x++) {
            if (
                (y == 0 && (x == 1 || x == 2 || x == 4 || x == 5)) ||
                (y == 1 && x != 0 && x != 6) ||
                (y == 2) ||
                (y == 3 && x != 0 && x != 6) ||
                (y == 4 && x >= 1 && x <= 5) ||
                (y == 5 && x >= 2 && x <= 4)
            ) {
                fill(255, 0, 0);
                square(heartX + x * pixelsize, heartY + y * pixelsize, pixelsize);
            }
        }
    }
}


function boat() {
    //WASD to control the boat
    push();
    translate(boatX, boatY)
    fill(220);
    beginShape();
    vertex(0, 0);
    vertex(40, 0);
    vertex(50, 10);
    vertex(40, 20);
    vertex(0, 20);
    endShape();
    fill(0);
    square(20, 5, 10);
    if (key == "w" || key == "W") {
        boatY = constrain(boatY - 15, 0, 480);
        // boatX = constrain(boatX + 3,300,700);
    }
    if (key == "a" || key == "A") {
        boatX = constrain(boatX - 20, 300, 700);
    }
    if (key == "s" || key == "S") {
        boatY = constrain(boatY + 15, 0, 480);
        // boatX = constrain(boatX + 3,300,700);
    }
    if (key == "d" || key == "D") {
        boatX = constrain(boatX + 20, 300, 700);
    }
    // boatX = constrain(boatX - 5,300,700);
    pop();
}

function drawCreature(x, y) {
    push();
    translate(x, y);

    push();
    translate(0, 0);
    scale(1, 1.4);
    drawTentacle(-370, 22, 0);
    drawTentacle(-330, 22, PI / 8);
    drawTentacle(-290, 22, PI / 4);
    pop();

    //mirror, another side of tentacles
    push();
    translate(-330, 0);
    rotate(radians(180));
    scale(-1, 1.4);
    drawTentacle(-40, 22, 0);
    drawTentacle(0, 22, PI / 8);
    drawTentacle(40, 22, PI / 4);

    //helper point
    // fill("red");
    // circle(0,0,5);
    pop();

    drawTail(-380, 0);
    drawBody(-310, 0);
    drawEyeOuter(-300, 0);
    drawEyeInner(-300, 0);

    pop();
}

function drawEyeInner(x, y) {
    //The eye of the creature
    //x1, y1 are for eye movement
    push();
    translate(x, y);

    //x1, y1 are used to move the eye with boat.
    let x1 = 0;
    let y1 = 0;
    x1 = map(boatX, 300, 700, 0, 10, [0, 10]);
    y1 = map(boatY, 0, 500, -10, 10, [-10, 10]);

    push();
    translate(x1, y1);
    //eyecolor, originally purple
    noStroke();

    //change mode after 40s
    if (Second > 40) {
        fill("red")
    }
    else {
        fill(148, 0, 211);
    }
    rect(-1 * pixelsize + 10, -5 * pixelsize, 2 * pixelsize, 10 * pixelsize);
    rect(-2 * pixelsize + 10, -4 * pixelsize, 4 * pixelsize, 8 * pixelsize);
    rect(-3 * pixelsize + 10, -3 * pixelsize, 6 * pixelsize, 6 * pixelsize);

    //helper point
    fill(255);
    // circle(0,0,5);
    rect(2 * pixelsize, -2 * pixelsize, pixelsize, 2 * pixelsize);
    pop();
    pop();
}

function drawEyeOuter(x, y) {
    push();
    translate(x, y);
    noStroke();
    fill("skyblue");
    rect(-5 * pixelsize, -4 * pixelsize, 10 * pixelsize, 8 * pixelsize);
    rect(-4 * pixelsize, -5 * pixelsize, 8 * pixelsize, 10 * pixelsize);
    rect(-6 * pixelsize, -3 * pixelsize, 12 * pixelsize, 6 * pixelsize);
    rect(-3 * pixelsize, -6 * pixelsize, 6 * pixelsize, 12 * pixelsize);
    fill(230);
    rect(-5 * pixelsize, -3 * pixelsize, 10 * pixelsize, 6 * pixelsize);
    rect(-4 * pixelsize, -4 * pixelsize, 8 * pixelsize, 8 * pixelsize);
    rect(-6 * pixelsize, -2 * pixelsize, 12 * pixelsize, 4 * pixelsize);
    rect(-3 * pixelsize, -5 * pixelsize, 6 * pixelsize, 10 * pixelsize);
    pop();
}

function drawBody(x, y) {
    let orangeRed, orangeGreen;
    push();
    translate(x, y)
    // fill(255,69,0);//orange
    for (let i = -6; i < 6; i++) {
        for (let j = -6; j < 6; j++) {
            orangeRed = 200 + random(0, 55);
            orangeGreen = 69;
            noStroke();
            fill(orangeRed, orangeGreen, 0);
            square(i * pixelsize, j * pixelsize, pixelsize);
        }
    }

    for (let k = -7; k < 7; k++) {
        for (let p = -5; p < 5; p++) {
            orangeRed = 200 + random(0, 55);
            orangeGreen = 69;
            noStroke();
            fill(orangeRed, orangeGreen, 0);
            square(k * pixelsize, p * pixelsize, pixelsize);
        }
    }

    for (let k = -5; k < 5; k++) {
        for (let p = -7; p < 7; p++) {
            orangeRed = 200 + random(0, 55);
            orangeGreen = 69;
            noStroke();
            fill(orangeRed, orangeGreen, 0);
            square(k * pixelsize, p * pixelsize, pixelsize);
        }
    }

    for (let k = -8; k < 8; k++) {
        for (let p = -4; p < 4; p++) {
            orangeRed = 200 + random(0, 55);
            orangeGreen = 69;
            noStroke();
            fill(orangeRed, orangeGreen, 0);
            square(k * pixelsize, p * pixelsize, pixelsize);
        }
    }

    for (let k = -3; k < 3; k++) {
        orangeRed = 200 + random(0, 55);
        orangeGreen = 69;
        noStroke();
        fill(orangeRed, orangeGreen, 0);
        square(-9 * pixelsize, k * pixelsize, pixelsize);
    }

    for (let k = -2; k < 2; k++) {
        orangeRed = 200 + random(0, 55);
        orangeGreen = 69;
        noStroke();
        fill(orangeRed, orangeGreen, 0);
        square(-10 * pixelsize, k * pixelsize, pixelsize);
    }
    pop();
}

function drawTentacle(x, y, offset) {
    let angle = 20
    push();
    translate(x + 5, y);
    rotate(radians(angle) * (sin(frameCount * 0.5 + offset * 0.3) + 0.5));
    for (let i = 0; i < 3; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));//pink
        square(i * pixelsize, y, pixelsize);
    }
    for (let i = 0; i < 4; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i - 1) * pixelsize, y + 10, pixelsize);
    }
    for (let i = 0; i < 4; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square(i * pixelsize, y + 20, pixelsize);
    }
    for (let i = 0; i < 4; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i) * pixelsize, y + 30, pixelsize);
    }
    for (let i = 0; i < 3; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i + 1) * pixelsize, y + 40, pixelsize);
    }
    for (let i = 0; i < 3; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i) * pixelsize, y + 50, pixelsize);
    }
    for (let i = 0; i < 3; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i - 1) * pixelsize, y + 60, pixelsize);
    }
    for (let i = 0; i < 2; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i - 2) * pixelsize, y + 70, pixelsize);
    }
    for (let i = 0; i < 1; i++) {
        noStroke();
        fill(220 + random(-10, 20), 192 + random(-10, 10), 203 + random(-10, 40));
        square((i - 2) * pixelsize, y + 80, pixelsize);
    }
    pop();
}

function drawTail(x, y) {
    push();
    translate(x, y);
    secondCount = Math.floor(frameCount / 7);
    //using if to let the tail wag
    if (secondCount % 4 == 0 || secondCount % 4 == 2) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < i; j++) {
                fill(220 + random(-20, 35), 220 + random(-20, 35), 0);
                square(-i * pixelsize, -j * pixelsize - 10, pixelsize);
                square(-i * pixelsize, j * pixelsize, pixelsize);
            }
        }
    }
    if (secondCount % 4 == 1) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < i; j++) {
                fill(220 + random(-20, 35), 220 + random(-20, 35), 0);
                square(-i * pixelsize, -j * pixelsize - 10, pixelsize);
                square(-i * pixelsize, j * pixelsize, pixelsize);
            }
        }
    }
    if (secondCount % 4 == 3) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < i; j++) {
                fill(220 + random(-20, 35), 220 + random(-20, 35), 0);
                square(-i * pixelsize, -j * pixelsize - 10, pixelsize);
                square(-i * pixelsize, j * pixelsize, pixelsize);
                if (j >= 5) {
                    for (let j = 0; j < i + 2; j++) {
                        fill(220 + random(-20, 35), 220 + random(-20, 35), 0);
                        square(-i * pixelsize, -j * pixelsize - 10, pixelsize);
                        square(-i * pixelsize, j * pixelsize, pixelsize);
                    }
                }
            }
        }
    }
    pop();
}

//background
function drawWave() {
    let rows = width / pixelsize;
    let cols = height / pixelsize;
    let bluevalue, greenvalue, redvalue;
    for (let i = 0; i < rows + 1; i++) {
        // pixelsize += 1;
        for (let j = 0; j < cols + 1; j++) {
            wave = 50 * sin(frameCount + i * 0.4 + j * 0.3);
            greenvalue = constrain(wave + random(100, 200), 100, 200);
            redvalue = random(0, 50);
            bluevalue = random(220, 255);
            noStroke();
            // strokeWeight(1);
            // stroke("skyblue");
            fill(redvalue, greenvalue, bluevalue);
            square(i * pixelsize, j * pixelsize, pixelsize);
        }
    }
}

//instrution
function drawInstruct() {
    if (Second <= 4) {
        fill(0);
        textAlign(CENTER);
        textSize(26);
        // textFont("Arcade Classic");
        text("USE WASD TO CONTROL THE SHIP(don't keep pressing keyboard)", 400, 200);
        text("ESCAPE FROM THE ENERGY BALLS", 400, 300);
    }
}

let prolength;
//To indicate the process, total 60s
function processing() {
    prolength = constrain(map(Second, 4, 60, 0, 400), 0, 400);
    strokeWeight(3);
    fill("grey");
    rect(200, 460, 400, 20);
    //little flag to indiacate victory
    fill(0);
    rect(600, 440, 3, 40);
    fill("orange");
    noStroke();
    beginShape();
    vertex(600, 430);
    vertex(600, 450);
    vertex(620, 440);
    endShape();
    //processing bar
    fill(0, 255, 100);
    rect(200, 460, prolength, 20);
}

let landx = 0;
function sand() {
    if (Second > 57) {
        //246,220,289
        noStroke();
        fill(246, 220, 189);
        square(800 - landx, 0, 500);
        landx = constrain(landx + 5, 0, 100);
    }
}

function victory() {
    if (Second > 61) {
        textAlign(CENTER);
        textSize(40);
        fill("yellow")
        text("Successfully Esacped!", 400, 250);
    }
}