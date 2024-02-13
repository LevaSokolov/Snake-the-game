const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let box = 32;

let score = 0;

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

document.addEventListener("keydown", direction);
document.addEventListener("keydown", restartFromSpace);

let dir;
let game;

function direction(event) {
  if (event.keyCode == 37 && dir != "right") dir = "left";
  else if (event.keyCode == 38 && dir != "down") dir = "up";
  else if (event.keyCode == 39 && dir != "left") dir = "right";
  else if (event.keyCode == 40 && dir != "up") dir = "down";
}

function restartFromSpace(event) {
  if (event.keyCode == 32) gameRestart();
}

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++)
    if (head.x == arr[i].x && head.y == arr[i].y) clearInterval(game);
}

function showGameOver() {
  let modal = document.getElementById("modal");
  modal.setAttribute("class", "visible");
}

function drawGame() {
  ctx.drawImage(ground, 0, 0);

  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "limegreen" : "darkgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }

  // CHECKING FOR OUT OF BOUNDS AND CALLING THE RESTART FUNCTION
  if (
    snakeX < box ||
    snakeX > box * 17 ||
    snakeY < 3 * box ||
    snakeY > box * 17
  ) {
    showGameOver();
    clearInterval(game);
  }

  if (dir == "left") snakeX -= box;
  if (dir == "right") snakeX += box;
  if (dir == "up") snakeY -= box;
  if (dir == "down") snakeY += box;

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
}

function gameStart() {
  game = setInterval(drawGame, 120);
}

function gameRestart() {
  dir = undefined;
  score = 0;
  snake = [
    {
      x: 9 * box,
      y: 10 * box,
    },
  ];
  gameStart();
  let modal = document.getElementById("modal");
  modal.setAttribute("class", "hidden");
}
const playAgainButton = document.getElementById("play-again-btn");
playAgainButton.addEventListener("click", gameRestart);

gameStart();
