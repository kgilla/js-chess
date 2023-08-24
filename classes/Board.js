import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  CELL_COUNT,
  LINE_WIDTH,
  BOARD_COLORS,
  LETTERS,
  PIECE_COLORS,
  PIECE_TYPES,
} from "../const.js";

import Cell from "./Cell.js";
import Piece from "./Piece.js";

class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.data = {};
    this.init();
  }

  init = () => {
    this.drawGrid();
    this.createBoardData();
    this.colorGrid();
    this.drawPieces();
  };

  draw = () => {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
          CANVAS_HEIGHT - CELL_SIZE * y,
          y < 3 || y > 6 ? this.createPiece(x, y) : ""
        );
        this.data[LETTERS[x] + y] = cell;
      }
    }
    console.log(this.data);
  };

  createPiece = (x, y) => {
    if (y === 2 || y == 7) {
      return new Piece(
        PIECE_TYPES.pawn,
        y === 7 ? PIECE_COLORS.black : PIECE_COLORS.white
      );
    } else {
      if (x === 1 || x === 8) {
        return new Piece(
          PIECE_TYPES.rook,
          y === 8 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else if (x === 2 || x == 7) {
        return new Piece(
          PIECE_TYPES.knight,
          y === 8 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else if (x === 3 || x === 6) {
        return new Piece(
          PIECE_TYPES.bishop,
          y === 8 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else if (x === 4) {
        return new Piece(
          PIECE_TYPES.king,
          y === 8 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else {
        return new Piece(
          PIECE_TYPES.queen,
          y === 8 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      }
    }
  };

  colorGrid = () => {
    Object.values(this.data).forEach((cell) => {
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
    for (const [key, cell] of Object.entries(this.data)) {
      if (cell.piece.image && !cell.piece.isHidden) {
        this.ctx.drawImage(
          cell.piece.image,
          cell.x,
          cell.y,
          CELL_SIZE - 5,
          CELL_SIZE - 5
        );
      }

      // Added text for debugging
      this.ctx.fillStyle = "#000";
      this.ctx.font = "12px Arial";
      this.ctx.fillText(key, cell.x + 2, cell.y + CELL_SIZE / CELL_COUNT);
    }
  };
}

export default Board;
