const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/apple.png";

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

document.addEventListener("keydown", onDirectionChange);

let dir;
let game;
let isBtnPressed;

function onDirectionChange(event) {
  if (isBtnPressed) return;

  if (event.keyCode == 37 && dir != "right") dir = "left";
  else if (event.keyCode == 38 && dir != "down") dir = "up";
  else if (event.keyCode == 39 && dir != "left") dir = "right";
  else if (event.keyCode == 40 && dir != "up") dir = "down";
  isBtnPressed = true;
}

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++)
    if (head.x == arr[i].x && head.y == arr[i].y) showGameOver();
}

function showGameOver() {
  clearInterval(game);
  let modal = document.getElementById("modal");
  modal.setAttribute("class", "visible");
  document.addEventListener("keydown", gameStart);
}

function drawGame() {
  isBtnPressed = false;
  ctx.drawImage(ground, 0, 0);

  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "limegreen" : "darkgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7);

  let snakeHeadX = snake[0].x;
  let snakeHeadY = snake[0].y;

  if (snakeHeadX == food.x && snakeHeadY == food.y) {
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
    snakeHeadX < box ||
    snakeHeadX > box * 17 ||
    snakeHeadY < 3 * box ||
    snakeHeadY > box * 17
  ) {
    showGameOver();
    return;
  }

  if (dir == "left") snakeHeadX -= box;
  if (dir == "right") snakeHeadX += box;
  if (dir == "up") snakeHeadY -= box;
  if (dir == "down") snakeHeadY += box;

  let newHead = {
    x: snakeHeadX,
    y: snakeHeadY,
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
}

function gameStart() {
  document.removeEventListener("keydown", gameStart);
  let modal = document.getElementById("modal");
  dir = undefined;
  score = 0;
  snake = [
    {
      x: 9 * box,
      y: 10 * box,
    },
  ];
  game = setInterval(drawGame, 100);
  modal.setAttribute("class", "hidden");
}

gameStart();
