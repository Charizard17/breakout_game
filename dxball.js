var canvas = document.getElementById("dxball");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = Math.random() * 3;
var dy = -3;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 4;
var brickColumnCount = 7;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 85;

var score = 0;

var lives = 5;

var bricks = []; // The brick objects will also be used for collision detection purposes later
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "lime";
  ctx.stroke();
  ctx.fillStyle = "#ff9a29";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#354d68";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#800000";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 20);
}

function drawLives() {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Lives: ' + lives, canvas.width-90, 20)
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score = score + 10;
          if (score/10 == brickRowCount*brickColumnCount) {
            alert(`YOU WIN, Final score is ${score}. CONGRATULATIONS!`);
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  x += dx;
  y += dy;
  if (x - ballRadius <= 0 || x + ballRadius >= canvas.width) {
    dx = -dx;
  }
  if (y - ballRadius <= 0) {
    dy = -dy;
  } else if (y + ballRadius >= canvas.height) {
    if (x > paddleX && x <= paddleX + paddleWidth) {
      dy = -dy * 1.1;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER!");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = Math.random() * 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth >= canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX <= 0) {
      paddleX = 0;
    }
  }
  requestAnimationFrame(draw);
}

draw();