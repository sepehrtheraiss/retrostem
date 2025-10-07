function createImage(size, noDraw = false){
  const img = document.createElement("canvas");
  img.width = size;
  img.height = size;
  if (noDraw) { return img }
  const ctx = img.getContext("2d");
  ctx.lineWidth = 4;
  ctx.fillStyle = "#" + ((0x1000000+(Math.random() * 0xFFFFFF | 0)).toString(16).substr(1));
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  return img;
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

const offScreen = createImage(512,true);
const offCtx = offScreen.getContext("2d");

// ball
const ballRadius = canvas.width / 100;
const ballX = canvas.width / 2;
const ballY = canvas.height - (canvas.height / 12);
const ballVelocity = 0.2;
const ballDx = ballRadius * ballVelocity;
const ballDy = -ballRadius * ballVelocity;


// paddle
const paddleWidth = canvas.width / 14;
const paddleHeight = canvas.height / 50;
const paddleX = (canvas.width - paddleWidth) / 2;
const paddleY = (canvas.height - paddleHeight) - 10;
const paddleVelocity = 0.3
const paddleDx = paddleWidth * paddleVelocity;
const paddle = new Paddle({ position: {x: paddleX, y: paddleY},
                            velocity: {dx: paddleDx, dy: 0},
                            size: {width: paddleWidth, height: paddleHeight},
                            color: "#0095DD",
                            keyPressed: keyPressed,
                            imageSrc: "img/paddle.png"
                          });
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// bricks
const brickWidth = canvas.width / 20;
const brickHeight = canvas.height / 20;
const brickRow = 3;
const brickColumn = canvas.width / brickWidth -1 ;
const brickPadding = 0;//1;//brickWidth * 0.05;
const brickOffsetTop = canvas.height * 0.05;
const brickOffsetLeft = 5;

const bricks = new Bricks({ 
                            row: brickRow,
                            column: brickColumn,
                            padding: brickPadding,
                            offsetTop: brickOffsetTop,
                            offsetLeft: brickOffsetLeft,
                            size: {width: brickWidth, height: brickHeight},
                            color: "black",
                            //imageSrc: "img/assets.png",
                          });

const item_drop_plus_balls = new DropItem({ 
                            position: {x: paddleX, y: -50},
                            velocity: {dx: ballDx, dy: ballDy},
                            size: {width: brickWidth, height: brickHeight},
                            color: "brown",
                            imageSrc: "img/assets.png",
                          });


let user_lives = 3;
let global_score = 0;
let global_state = "pause";

let balls = []
add_balls(1, global_state);

function animate() {
    // page refresh
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //backgroundDraw("img/background.png","black");
    backgroundDraw("/Users/sraissian/Downloads/joe-biden.png","black");

    // remove dead balls
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].state == "dead") {
            balls.splice(i,1);
        }
    }
    // animate balls
    for (var i = 0; i < balls.length; i++) {
        balls[i].animate(paddle.position, paddle.size, bricks);
    }

    paddle.animate();
    drawScore(global_score);

    if (global_state != "game over" && balls.length == 0) {
       user_lives--;
       add_balls(1, "pause");
    }

    drawLives(user_lives);
    bricks.animate();
    // when to drop the item ?
    if (global_state == "run" && global_score >= 0) {
      item_drop_plus_balls.state = "run";
      item_drop_plus_balls.animate();
    }

    if (item_drop_plus_balls.collisionDetection(paddle.position, paddle.size)) {
        if (balls.length <= 1) {
            add_balls(3, "run");
        }
    }


    if (global_score == bricks.row * bricks.column) {
      global_state = "game over";
      drawYouWin();
    }

    if (user_lives < 1) {
      global_state = "game over";
      drawGameOver();
  }

  requestAnimationFrame(animate);
}

function startGame() {
  animate();
}

startGame();

document.getElementById("runButton").addEventListener("click", function () {
  ball.state = "run";
  this.disabled = true;
});
