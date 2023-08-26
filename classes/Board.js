import {
  CELL_COUNT,
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
    this.highlightedCells = [];
    this.cellSize = () => this.ctx.canvas.width / CELL_COUNT;
    this.init();
  }

  init = () => {
    this.createBoardData();
    this.drawBoard();
    this.drawPieces();
  };

  draw = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawBoard();
    this.drawPieces();
  };

  // Creates board data cells containing cells and pieces
  createBoardData = () => {
    for (let x = 0; x < CELL_COUNT; x++) {
      for (let y = 0; y < CELL_COUNT; y++) {
        const cell = new Cell(
          x,
          y,
          x % 2 === y % 2 ? BOARD_COLORS.white : BOARD_COLORS.black,
          y < 2 || y > 5 ? this.createPiece(x, y) : "",
          this.canvasState
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
      const xCoord = x * this.cellSize();
      const yCoord = y * this.cellSize();
      this.ctx.beginPath();
      this.ctx.rect(xCoord, yCoord, this.cellSize(), this.cellSize());
      this.ctx.fillStyle = isTake ? BOARD_COLORS.take : cell.color;
      this.ctx.fill();
      if (isHighlighted && !isTake) this.drawHighlight(x, y);
    });
  };

  drawHighlight = (x, y) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = BOARD_COLORS.highlight;
    this.ctx.arc(
      x * this.cellSize() + this.cellSize() / 2,
      y * this.cellSize() + this.cellSize() / 2,
      this.cellSize() / 5,
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
          cell.x * this.cellSize(),
          cell.y * this.cellSize(),
          this.cellSize() - 5,
          this.cellSize() - 5
        );
      }

      // Added text to cells
      if (cell.x === 0) {
        this.fillText(
          cell.key[1],
          cell.x * this.cellSize() + this.cellSize() / 40,
          cell.y * this.cellSize() + this.cellSize() / 6,
          cell
        );
      }
      if (cell.y === 7) {
        this.fillText(
          cell.key[0],
          cell.x * this.cellSize() + this.cellSize() * 0.85,
          cell.y * this.cellSize() + this.cellSize() * 0.95,
          cell
        );
      }
    });
  };

  drawCursorImage = (image, x, y) => {
    this.ctx.drawImage(image, x, y, this.cellSize() - 5, this.cellSize() - 5);
  };

  fillText = (text, x, y, cell) => {
    const fontSize = Math.floor(this.cellSize() / 6);
    this.ctx.fillStyle =
      cell.color === BOARD_COLORS.white
        ? BOARD_COLORS.black
        : BOARD_COLORS.white;
    this.ctx.font = `bold ${fontSize + "px"} Arial`;
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

  handleCanvasResize = () => {
    this.draw();
  };
}

export default Board;
