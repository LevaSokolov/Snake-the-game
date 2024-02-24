const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const foodImg = new Image();
foodImg.src = "img/apple.png";

const BOX = 32;

let score = 0;

let food = {
  x: Math.floor(Math.random() * 16) * BOX,
  y: Math.floor(Math.random() * 16) * BOX,
};

let dir;
let game;
let isBtnPressed;
const field = 544;
const scoreTable = document.getElementById("score-table");

let onDirectionChange = (event) => {
  if (isBtnPressed) return;
  if (event.keyCode === 37 && dir !== "right") dir = "left";
  else if (event.keyCode === 38 && dir !== "down") dir = "up";
  else if (event.keyCode === 39 && dir !== "left") dir = "right";
  else if (event.keyCode === 40 && dir !== "up") dir = "down";
  isBtnPressed = true;
};
document.addEventListener("keydown", onDirectionChange);

let eatTail = (head, arr) => {
  for (let i = 0; i < arr.length; i++)
    if (head.x === arr[i].x && head.y === arr[i].y) showGameOver();
};

let showGameOver = () => {
  clearInterval(game);
  let modal = document.getElementById("modal");
  modal.setAttribute("class", "visible");
  document.addEventListener("keydown", gameStart);
};

let drawGame = () => {
  let snakeHeadX = snake[0].x;
  let snakeHeadY = snake[0].y;
  // CHECKING FOR OUT OF BOUNDS AND CALLING THE RESTART FUNCTION
  if (
    snakeHeadX < 0 ||
    snakeHeadY < 0 ||
    snakeHeadX > BOX * 16 ||
    snakeHeadY > BOX * 16
  ) {
    showGameOver();
    return;
  }

  isBtnPressed = false;
  // Холст. Поле 17 на 17 кубов. 544px
  canvas.width = field;
  canvas.height = field;
  // Закрашиваем внутреннюю область
  ctx.fillStyle = "#75A828";
  ctx.fillRect(0, 0, field, field);
  // Закрашиваем квадратами поле в шахматном порядке
  for (let i = 0; i < 17; i += 1)
    for (let j = 0; j < 17; j += 1) {
      if ((i + j * 17) % 2 === 0) {
        ctx.fillStyle = "#92C34A";
        ctx.fillRect(0 + i * 32, j * 32, 32, 32);
      }
    }

  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "limegreen" : "darkgreen";
    ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);
  }

  if (snakeHeadX === food.x && snakeHeadY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 16) * BOX,
      y: Math.floor(Math.random() * 16) * BOX,
    };
  } else {
    snake.pop();
  }

  scoreTable.textContent = `Your score is ${score}`;

  if (dir === "left") snakeHeadX -= BOX;
  if (dir === "right") snakeHeadX += BOX;
  if (dir === "up") snakeHeadY -= BOX;
  if (dir === "down") snakeHeadY += BOX;

  const NEWHEAD = {
    x: snakeHeadX,
    y: snakeHeadY,
  };

  eatTail(NEWHEAD, snake);

  snake.unshift(NEWHEAD);
};

let gameStart = () => {
  document.removeEventListener("keydown", gameStart);
  const modal = document.getElementById("modal");
  dir = undefined;
  score = 0;
  snake = [
    {
      x: 8 * BOX,
      y: 8 * BOX,
    },
  ];
  game = setInterval(drawGame, 100);
  modal.setAttribute("class", "hidden");
};

gameStart();
