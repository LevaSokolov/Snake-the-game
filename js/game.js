const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/apple.png";

const BOX = 32;

let score = 0;

let food = {
  x: Math.floor(Math.random() * 17 + 1) * BOX,
  y: Math.floor(Math.random() * 15 + 3) * BOX,
};

let snake = [];
snake[0] = {
  x: 9 * BOX,
  y: 10 * BOX,
};

let dir;
let game;
let isBtnPressed;

let onDirectionChange = (event) => {
  if (isBtnPressed) return;

  if (event.keyCode == 37 && dir != "right") dir = "left";
  else if (event.keyCode == 38 && dir != "down") dir = "up";
  else if (event.keyCode == 39 && dir != "left") dir = "right";
  else if (event.keyCode == 40 && dir != "up") dir = "down";
  isBtnPressed = true;
};
document.addEventListener("keydown", onDirectionChange);

let eatTail = (head, arr) => {
  for (let i = 0; i < arr.length; i++)
    if (head.x == arr[i].x && head.y == arr[i].y) showGameOver();
};

let showGameOver = () => {
  clearInterval(game);
  let modal = document.getElementById("modal");
  modal.setAttribute("class", "visible");
  document.addEventListener("keydown", gameStart);
};

let drawGame = () => {
  isBtnPressed = false;
  ctx.drawImage(ground, 0, 0);

  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "limegreen" : "darkgreen";
    ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);
  }

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, BOX * 2.5, BOX * 1.7);

  let snakeHeadX = snake[0].x;
  let snakeHeadY = snake[0].y;

  if (snakeHeadX == food.x && snakeHeadY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * BOX,
      y: Math.floor(Math.random() * 15 + 3) * BOX,
    };
  } else {
    snake.pop();
  }

  // CHECKING FOR OUT OF BOUNDS AND CALLING THE RESTART FUNCTION
  if (
    snakeHeadX < BOX ||
    snakeHeadX > BOX * 17 ||
    snakeHeadY < 3 * BOX ||
    snakeHeadY > BOX * 17
  ) {
    showGameOver();
    return;
  }

  if (dir == "left") snakeHeadX -= BOX;
  if (dir == "right") snakeHeadX += BOX;
  if (dir == "up") snakeHeadY -= BOX;
  if (dir == "down") snakeHeadY += BOX;

  const NEWHEAD = {
    x: snakeHeadX,
    y: snakeHeadY,
  };

  eatTail(NEWHEAD, snake);

  snake.unshift(NEWHEAD);
};

let gameStart = () => {
  document.removeEventListener("keydown", gameStart);
  let modal = document.getElementById("modal");
  dir = undefined;
  score = 0;
  snake = [
    {
      x: 9 * BOX,
      y: 10 * BOX,
    },
  ];
  game = setInterval(drawGame, 100);
  modal.setAttribute("class", "hidden");
};

gameStart();
