import { LINE_WIDTH, CELL_COUNT } from "./const.js";
import Game from "./classes/Game.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = LINE_WIDTH;

const determineCoords = (e, cell = false) => {
  const rect = e.target.getBoundingClientRect();
  const { clientX, clientY } = e;
  const cellSize = canvas.width / CELL_COUNT;

  if (cell) {
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);
    return { x, y };
  } else {
    const x = clientX - rect.left - cellSize / 2;
    const y = clientY - rect.top - cellSize / 2;
    return { x, y };
  }
};

// Event Handlers
const handleMouseDown = (e) => {
  if (e.which !== 1) return;
  const { x, y } = determineCoords(e, true);
  game.handleMouseDown(x, y);
};

const handleMouseMove = (e) => {
  const { x, y } = determineCoords(e);
  game.handleMouseMove(x, y);
};

const handleMouseUp = (e) => {
  const { x, y } = determineCoords(e, true);
  game.handleMouseUp(x, y);
};

const resizeCanvas = () => {
  const { innerWidth, innerHeight } = window;
  let sideLength = 0;
  if (innerHeight > innerWidth) {
    // Phone screens use width to determine max board size
    sideLength = Math.floor(innerWidth * 0.9);
  } else {
    // Desktop screens use height to determine max board size
    sideLength = Math.floor(innerHeight * 0.8);
  }
  canvas.width = sideLength;
  canvas.height = sideLength;
};

const handleResize = () => {
  resizeCanvas();
  game.board.handleCanvasResize();
};

// Event Listeners
window.addEventListener("resize", handleResize);
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

resizeCanvas();
const game = new Game(ctx);
