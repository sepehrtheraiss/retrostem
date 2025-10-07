function backgroundDraw(imageSrc, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    let img = new Image();
    img.src = imageSrc;
    ctx.drawImage(img, 100, 0, canvas.width - 200, canvas.height/3);
    //offCtx.drawImage(img, 100, 0, canvas.width - 200, canvas.height/3);
}

const keyPressed = {
    right: false,
    left: false,
}

function keyDownHandler(e) {
    if (global_state == "game over") {
        return;
    }
    if (e.key == "Enter" || e.keyCode == 13) {
        global_state = "run";
        for (var i = 0; i < balls.length; i++) {
            balls[i].state = "run";
        }   
    }

    if (e.key == "Right" || e.key == "ArrowRight") {
        keyPressed.right = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        keyPressed.left = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        keyPressed.right = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        keyPressed.left = false;
    }
}

function drawScore(score) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives(lives) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawGameOver() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
}

function drawYouWin() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("YOU WIN!", canvas.width/2, canvas.height/2);
}

function add_balls(num, global_state) {
    var direction = -1;
    for (var i = 0; i < num; i++) {
        balls.push(new Ball({position: {x: ballX, y: ballY - 30}, 
                               velocity: {dx: ballDx * direction, dy: ballDy},
                               size: {radius: ballRadius * 4}, 
                               color: "#0095DD",
                               imageSrc: "/Users/sraissian/Downloads/trump-happy.jpg",
                               state: global_state,
                              }));
                              direction *= -1;
    }
}
