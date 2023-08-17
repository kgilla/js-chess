import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  CELL_COUNT,
  LINE_WIDTH,
  BOARD_COLORS,
  LETTERS,
} from "../const.js";

import Cell from "./Cell.js";
import Piece from "./Piece.js";
import { blackPawn, whitePawn } from "../images.js";

class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.boardData = {};
    this.init();
  }

  init = () => {
    this.drawGrid();
    this.createBoardData();
    this.colorGrid();
    this.drawPieces();
  };

  draw = () => {
    this.drawGrid();
    this.colorGrid();
    this.drawPieces();
  };

  drawGrid = () => {
    this.ctx.strokeStyle = "#000";

    // draws x axis
    for (let x = 0; x < CELL_COUNT + 1; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
      this.ctx.stroke();
    }

    // draws y axis
    for (let y = 0; y < CELL_COUNT + 1; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
      this.ctx.stroke();
    }
  };

  createBoardData = () => {
    // creates board data cells
    for (let x = 1; x < CELL_COUNT + 1; x++) {
      for (let y = 1; y < CELL_COUNT + 1; y++) {
        const cell = new Cell(
          (x - 1) * CELL_SIZE,
          (y - 1) * CELL_SIZE,
          this.isPiece(x, y) ? new Piece("pawn", this.isPiece(x, y)) : ""
        );
        this.boardData[LETTERS[x] + y] = cell;
      }
    }
    console.log(this.boardData);
  };

  isPiece = (x, y) => {
    if (y === 1 || y === 2) {
      return "black";
    } else if (y === 7 || y === 8) {
      return "white";
    } else {
      return;
    }
  };

  colorGrid = () => {
    Object.values(this.boardData).forEach((cell) => {
      const xEven = (cell.x / CELL_SIZE) % 2;
      const yEven = (cell.y / CELL_SIZE) % 2;
      const color = xEven === yEven ? BOARD_COLORS.white : BOARD_COLORS.black;
      this.fillCell(cell.x, cell.y, color);
    });
  };

  fillCell = (x, y, color) => {
    this.ctx.beginPath();
    this.ctx.rect(
      x + LINE_WIDTH,
      y + LINE_WIDTH,
      CELL_SIZE - LINE_WIDTH * 2,
      CELL_SIZE - LINE_WIDTH * 2
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
  };

  drawPieces = () => {
    Object.values(this.boardData).forEach((cell) => {
      if (cell.piece) {
        if (cell.piece.color === "black") {
          this.ctx.drawImage(blackPawn, cell.x, cell.y, CELL_SIZE, CELL_SIZE);
        } else {
          this.ctx.drawImage(whitePawn, cell.x, cell.y, CELL_SIZE, CELL_SIZE);
        }
      }
    });
  };
}

export default Board;
