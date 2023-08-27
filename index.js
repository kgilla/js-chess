import { LINE_WIDTH, CELL_COUNT } from "./const.js";
import Game from "./classes/Game.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = LINE_WIDTH;

const determineCoords = (e) => {
  const rect = e.target.getBoundingClientRect();
  const { clientX, clientY } = e;
  const cellSize = canvas.width / CELL_COUNT;
  return {
    cursor: {
      x: clientX - rect.left - cellSize / 2,
      y: clientY - rect.top - cellSize / 2,
    },
    cell: {
      x: Math.floor((clientX - rect.left) / cellSize),
      y: Math.floor((clientY - rect.top) / cellSize),
    },
  };
};

// Event Handlers
const handleMouseDown = (e) => {
  if (e.which !== 1) return;
  const { cell } = determineCoords(e);
  const { x, y } = cell;
  game.handleMouseDown(x, y);
};

const handleMouseMove = (e) => {
  const { cursor, cell } = determineCoords(e);
  const { x, y } = cursor;
  changeCursor(cell);
  game.handleMouseMove(x, y);
};

const handleMouseUp = (e) => {
  const { cell } = determineCoords(e);
  const { x, y } = cell;
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
  if (game) game.board.draw();
};

const changeCursor = (cell) => {
  const data = game.board.data[`${cell.x}${cell.y}`];
  if (game.isDragging) {
    canvas.style.cursor = "grabbing";
  } else if (
    data &&
    data.piece &&
    game.turn === data.piece.color &&
    !game.isDragging
  ) {
    canvas.style.cursor = "grab";
  } else {
    canvas.style.cursor = "auto";
  }
};

// Event Listeners
window.addEventListener("resize", handleResize);
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

resizeCanvas();
const game = new Game(ctx);

// Todo //
/* 
Calculate when in check
Calculate when checkmate
reformat code to stop mutating board.data state directly 
Add history stepping
add move timers
Add sounds for piece placement
Add ui elements to show more information
Add backend for multiplayer
Add chat
 */
