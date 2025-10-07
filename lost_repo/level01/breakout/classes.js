class Ball {
    constructor({
        position,
        velocity, 
        size,
        color,
        imageSrc,
        state,
    }) {
        this.position = position;
        this.origPosition = structuredClone(position); 
        this.velocity = velocity;
        this.origVelocity = structuredClone(velocity);
        this.size = size;
        this.color = color;
        this.state = state;
        this.img = new Image();
        this.img.src = imageSrc;
    }

    draw() {
        if (this.img.height != 0) {
            ctx.drawImage(this.img, this.position.x, this.position.y, this.size.radius * 1.5, this.size.radius * 1.5)
        } else {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y , this.size.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    move(paddlePosition, paddleSize, bricks) {
        if (this.state != "run") {
            return;
        } 

        if (this.position.y - this.size.radius*2 > canvas.height) {
            this.state = "dead";
            this.position.x = this.origPosition.x;
            this.position.y = this.origPosition.y;
            this.velocity.dx = this.origVelocity.dx;
            this.velocity.dy = this.origVelocity.dy;
        }


        this.position.x +=  this.velocity.dx;
        this.position.y +=  this.velocity.dy;
        // if ball hits walls, reverse direction
        if (this.position.x > canvas.width - this.size.radius ||
            this.position.x < this.size.radius) {
                
            this.velocity.dx = -this.velocity.dx;
        }

        // ball hit by ceiling
        if (this.position.y < this.size.radius) {
            this.velocity.dy = -this.velocity.dy;
        }

        // paddle collision
        if (this.position.x >= paddlePosition.x &&
            this.position.x <= paddlePosition.x + paddleSize.width &&
            this.position.y + this.size.radius >= paddlePosition.y) {

            this.velocity.dy = -this.velocity.dy;
        }

        // bricks
        if(bricks.collisionDetection(this)) {
            this.velocity.dy = -this.velocity.dy;
            global_score++;
        }
    }

    animate(paddlePosition, paddleSize, bricks) {
        if (this.state != "run") {
            return;
        }
        this.draw();
        this.move(paddlePosition, paddleSize, bricks);
    }
}

class Paddle {
    constructor({
        position,
        velocity, 
        size,
        color,
        keyPressed,
        imageSrc,
    }) {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.color = color;
        this.keyPressed = keyPressed;
        this.img = new Image();
        this.img.src = imageSrc;
    }
    
    draw() {

        if (this.img.height != 0) {
            ctx.drawImage(this.img, this.position.x, this.position.y, this.size.width * 1.5, this.size.height* 1.5)
        } else {
            ctx.beginPath();
            ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    move() {
        if (this.keyPressed.right) {
            //this.position.x +=  this.velocity.dx;
            this.position.x =  Math.min(this.position.x + this.velocity.dx, canvas.width - this.size.width);
        } else if (this.keyPressed.left) {
            //this.position.x -=  this.velocity.dx;
            this.position.x = Math.max(this.position.x - this.velocity.dx, 0);
        }
    }

    animate() {
        this.draw();
        this.move();
    }
}

class Bricks {
    constructor({
        row,
        column,
        padding,
        offsetTop,
        offsetLeft,
        size,
        color,
        imageSrc,
    }) {
        this.row = row;
        this.column = column;
        this.padding = padding;
        this.offsetTop = offsetTop;
        this.offsetLeft = offsetLeft;
        this.size = size;
        this.color = color;
        this.img = new Image();
        //this.img.src = imageSrc;

        this.bricks = [];
        for (let c = 0; c < this.column; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.row; r++) {
                this.bricks[c][r] = { x: 0, y: 0 , status: 1};
            }
        }
    } 

    draw() {
        for (let c = 0; c < this.column; c++) {
          for (let r = 0; r < this.row; r++) {
            if (this.bricks[c][r].status == 0) {
              const brickX = c * (this.size.width + this.padding) + this.offsetLeft;
              const brickY = r * (this.size.height + this.padding) + this.offsetTop;
              this.bricks[c][r].x = brickX;
              this.bricks[c][r].y = brickY;
              if(this.img.height != 0) {
                ctx.drawImage(this.img, 20, 240, 170, 55, brickX, brickY, brickWidth, brickHeight);
              } else {
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
              }
            } else {
              const brickX = c * (this.size.width + this.padding) + this.offsetLeft;
              const brickY = r * (this.size.height + this.padding) + this.offsetTop;
              this.bricks[c][r].x = brickX;
              this.bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.strokeStyle = "black";
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "rgba(0, 255, 186, 0)";
                ctx.fill();
                ctx.closePath();
            }
          }
        }
      }

      collisionDetection(ball) {
        const ballPosition = ball.position;
        for (let c = 0; c < bricks.column; c++) {
            for (let r = 0; r < bricks.row; r++) {
                const b = this.bricks[c][r];
                if (b.status == 1) {
                    if (ballPosition.x > b.x &&
                        ballPosition.x < b.x + bricks.size.width &&
                        ballPosition.y - ball.size.radius > b.y &&
                        ballPosition.y - ball.size.radius< b.y + bricks.size.height) {
                        b.status = 0;
                        return true;
                    }
                }
            }
        }
    }

    animate() {
        this.draw();
    }
}

class DropItem {
    constructor({
        position,
        velocity, 
        size,
        color,
        imageSrc,
    }) {
        this.position = position;
        this.origPosition = structuredClone(position); 
        this.velocity = velocity;
        this.origVelocity = structuredClone(velocity);
        this.size = size;
        this.color = color;
        this.state = "pause";
        this.img = new Image();
        this.img.src = imageSrc;

    }

    draw() {
        ctx.drawImage(this.img, 390, 240, 170, 55, this.position.x, this.position.y, brickWidth, brickHeight);
    }

    move() {
        this.position.y -=  this.velocity.dy;
    }

    collisionDetection(paddlePosition, paddleSize) {
        if (this.position.x >= paddlePosition.x &&
            this.position.x <= paddlePosition.x + paddleSize.width &&
            this.position.y >= paddlePosition.y &&
            this.position.y <= paddlePosition.y + paddleSize.height) {
            return true;
        }
        return false;
    }
    animate() {
        if (this.state != "run") {
            return;
        }
        this.draw();
        this.move();
    }
}
