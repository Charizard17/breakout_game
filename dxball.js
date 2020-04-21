var canvas = document.getElementById("dxball");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = Math.random() * 2;
var dy = -Math.random() * 2;
var ballRadius = 10;

var paddleHeight = 20;
var paddleWidth = 150;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = (canvas.height - paddleHeight);
var rightPressed = false;
var leftPressed = false;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  x += dx;
  y += dy;
  if (x - ballRadius <= 0 || x + ballRadius >= canvas.width) {
    dx = -dx;
  }
  if (y - ballRadius <= 0) {
    dy = -dy;
  } else if (y + ballRadius >= canvas.height) {
    if (x > paddleX && x <= paddleX + paddleWidth) {
        dy = -dy*1.1;
    } else {
      alert("GAME OVER!");
      document.location.reload();
      clearInterval(interval); // Needed for Chrome to end game
    }
  }

  drawPaddle();
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
}

var interval = setInterval(draw, 10);
