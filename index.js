import { CANVAS_WIDTH, CANVAS_HEIGHT, LINE_WIDTH, CELL_SIZE } from "./const.js";

import Game from "./classes/Game.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = LINE_WIDTH;

const game = new Game(ctx);

const determineCoords = (e, cell = false) => {
  const rect = e.target.getBoundingClientRect();
  const { clientX, clientY } = e;

  if (cell) {
    const x = Math.floor((clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((clientY - rect.top) / CELL_SIZE);
    return { x, y };
  } else {
    const x = clientX - rect.left - CELL_SIZE / 2;
    const y = clientY - rect.top - CELL_SIZE / 2;
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

// Event Listeners
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
