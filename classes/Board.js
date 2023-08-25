import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  CELL_COUNT,
  LINE_WIDTH,
  BOARD_COLORS,
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
    this.highlightedCells = [];
  }

  init = () => {
    this.createBoardData();
    this.drawBoard();
    this.drawPieces();
  };

  draw = () => {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.drawBoard();
    this.drawPieces();
  };

  // Creates board data cells containing cells and pieces
  createBoardData = () => {
    for (let x = 0; x < CELL_COUNT; x++) {
      for (let y = 0; y < CELL_COUNT; y++) {
        const cell = new Cell(
          x * CELL_SIZE,
          y * CELL_SIZE,
          x % 2 === y % 2 ? BOARD_COLORS.white : BOARD_COLORS.black,
          y < 2 || y > 5 ? this.createPiece(x, y) : ""
        );
        this.data[`${x}${y}`] = cell;
      }
    }
  };

  // Creates pieces
  createPiece = (x, y) => {
    const color = y === 0 || y === 1 ? PIECE_COLORS.black : PIECE_COLORS.white;
    if (y === 1 || y == 6) {
      return new Piece(PIECE_TYPES.pawn, color);
    } else if (x === 0 || x === 7) {
      return new Piece(PIECE_TYPES.rook, color);
    } else if (x === 1 || x == 6) {
      return new Piece(PIECE_TYPES.knight, color);
    } else if (x === 2 || x === 5) {
      return new Piece(PIECE_TYPES.bishop, color);
    } else if (x === 3) {
      return new Piece(PIECE_TYPES.king, color);
    } else {
      return new Piece(PIECE_TYPES.queen, color);
    }
  };

  // Draws the board
  drawBoard = () => {
    Object.values(this.data).forEach((cell) => {
      const { x, y, isHighlighted, isTake } = cell;
      this.ctx.beginPath();
      this.ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
      this.ctx.fillStyle = isTake ? BOARD_COLORS.take : cell.color;
      this.ctx.fill();
      if (isHighlighted && !isTake) this.drawHighlight(x, y);
    });
  };

  drawHighlight = (x, y) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = BOARD_COLORS.highlight;
    this.ctx.arc(
      x + CELL_SIZE / 2,
      y + CELL_SIZE / 2,
      CELL_SIZE / 5,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  };

  // Draws pieces and text on board
  drawPieces = () => {
    Object.values(this.data).forEach((cell) => {
      if (cell.piece.image && !cell.piece.isHidden) {
        this.ctx.drawImage(
          cell.piece.image,
          cell.x,
          cell.y,
          CELL_SIZE - 5,
          CELL_SIZE - 5
        );
      }

      // Added text to cells
      if (cell.coords.x === 0) {
        this.fillText(
          cell.key[1],
          cell.x + CELL_SIZE / 16,
          cell.y + CELL_SIZE / 5,
          cell
        );
      }
      if (cell.coords.y === 7) {
        this.fillText(
          cell.key[0],
          cell.x + CELL_SIZE / 1.2,
          cell.y + CELL_SIZE / 1.05,
          cell
        );
      }
    });
  };

  fillText = (text, x, y, cell) => {
    this.ctx.fillStyle =
      cell.color === BOARD_COLORS.white
        ? BOARD_COLORS.black
        : BOARD_COLORS.white;
    this.ctx.font = "bold 14px Arial";
    this.ctx.fillText(text, x, y);
  };

  // Creates an array of cells to highlight to show the user where piece can move
  highlightMoves = (legalMoves) => {
    legalMoves.forEach((move) => {
      const { cell, isTake } = move;
      cell.isHighlighted = true;
      cell.isTake = isTake;
      this.highlightedCells.push(cell);
    });
  };

  removeHighlights = () => {
    this.highlightedCells.forEach((cell) => {
      cell.isHighlighted = false;
      cell.isTake = false;
    });
  };
}

export default Board;
