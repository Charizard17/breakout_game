const cvs = document.getElementById("breakOut");

const ctx = cvs.getContext("2d");

// Add Border To Canvas
cvs.style.border = "1px solid #0ff";

// Make Line Thik When Drawing To Canvas
ctx.lineWidth = 3;

// Game Variables and Constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
let LIFE = 3; // Player has 3 lives
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

// Create Ball
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 3,
  dx: 3,
  dy: -3,
};

// Draw Ball Function
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcd05";
  ctx.fill();
  ctx.strokeStyle = "#2e3548";
  ctx.stroke();
  ctx.closePath();
}

// Draw Paddle Function
function drawPaddle() {
  ctx.fillStyle = "#2e3548";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeStyle = "#ffcd05";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Move Paddle Function
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37) {
    leftArrow = true;
  } else if (e.keyCode == 39) {
    rightArrow = true;
  }
});
document.addEventListener("keyup", function (e) {
  if (e.keyCode == 37) {
    leftArrow = false;
  } else if (e.keyCode == 39) {
    rightArrow = false;
  }
});

function movePaddle() {
  if (rightArrow && paddle.x + paddle.width <= cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x >= 0) {
    paddle.x -= paddle.dx;
  }
}

// Move Ball Function
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// Ball Wall Collision
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }
  if (ball.y + ball.radius > cvs.height) {
    LIFE--;
    LIFE_LOST.play();
    resetBall();
  }
}

function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

// Ball Paddle Collision
function ballPaddleCollision() {
  if (
    ball.y > paddle.y &&
    ball.y < paddle.y + paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    // play sound
    PADDLE_HIT.play();
    // check where the ball hit the paddle
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    // normalize the values
    collidePoint = collidePoint / (paddle.width / 2);
    // calculate the angle of the ball
    let angle = collidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

// Create The Bricks
const brick = {
  row: 1,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#2e3548",
  strokeColor: "#fff",
};

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}
createBricks();

// Draw The Bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);

        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// Ball Brick Collision
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          ball.dy = -ball.dy;
          b.status = false;
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

// Show Game Stats
function showGameStats(text, textX, textY, img, imgX, imgY) {
  //draw text
  ctx.fillStyle = "#fff";
  ctx.font = "25px Germania One";
  ctx.fillText(text, textX, textY);

  // draw image
  ctx.drawImage(img, imgX, imgY, (width = 25), (height = 25));
}

// Draw Function
function draw() {
  drawPaddle();

  drawBall();

  drawBricks();

  // Show Score
  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
  // Show Lives
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
  // Show Level
  showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}

// Game Over
function gameOver() {
  if (LIFE <= 0) {
    showYouLose();
    GAME_OVER = true;
  }
}

// Level Up
function levelUp() {
  let isLevelDone = true;

  // check if all bricks are broken
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }
  if (isLevelDone) {
    WIN.play();

    if (LEVEL >= MAX_LEVEL) {
      showYouWin();
      GAME_OVER = true;
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetBall();
    LEVEL++;
  }
}

// Update Game Function
function update() {
  moveBall();

  movePaddle();

  ballWallCollision();

  ballPaddleCollision();

  ballBrickCollision();

  gameOver();

  levelUp();
}

// Game Loop
function loop() {
  // Clear the canvas
  ctx.drawImage(BG_IMG, 0, 0);

  draw();

  update();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}
loop();

// Select Sound Element
const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager() {
  // change image sound on/off
  let imgSrc = soundElement.getAttribute("src");
  let SOUND_IMG =
    imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

  soundElement.setAttribute("src", SOUND_IMG);

  // mute and unmute sounds
  WALL_HIT.muted = WALL_HIT.muted ? false : true;
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
  WIN.muted = WIN.muted ? false : true;
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// Show Game Over Message
// Select Elements //
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// Click On Play Again Button
restart.addEventListener("click", function () {
  location.reload(); // reload the page
});

// Show You Win
function showYouWin() {
  gameover.style.display = "block";
  youwon.style.display = "block";
}

// Show You Lose
function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
}
