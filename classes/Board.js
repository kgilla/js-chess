import {
  CELL_COUNT,
  BOARD_COLORS,
  PIECE_COLORS,
  PIECE_TYPES,
} from "../const.js";

import { images } from "../images.js";

import Cell from "./Cell.js";
import Piece from "./Piece.js";

class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.data = {};
    this.highlightedCells = [];
    this.getCellSize = () => this.ctx.canvas.width / CELL_COUNT;
    this.init();
  }

  init = () => {
    this.createBoardData();
    this.drawBoard();
  };

  draw = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawBoard();
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
    console.log("drawing");
    const cellSize = this.getCellSize();
    Object.values(this.data).forEach((cell) => {
      const { x, y, isHighlighted, isTake } = cell;

      // Draws board background
      const xCoord = x * cellSize;
      const yCoord = y * cellSize;
      this.ctx.beginPath();
      this.ctx.rect(xCoord, yCoord, cellSize, cellSize);
      this.ctx.fillStyle = isTake ? BOARD_COLORS.take : cell.color;
      this.ctx.fill();

      // Draws helpful circles to illustrate available moves
      if (isHighlighted && !isTake) {
        this.ctx.beginPath();
        this.ctx.fillStyle = BOARD_COLORS.highlight;
        this.ctx.arc(
          xCoord + cellSize / 2,
          yCoord + cellSize / 2,
          cellSize / 5,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }

      // Draws pieces and text on board
      if (cell.piece && !cell.piece.isHidden) {
        const { type, color } = cell.piece;
        this.ctx.drawImage(
          images[type][color],
          xCoord,
          yCoord,
          cellSize - 5,
          cellSize - 5
        );
      }

      // Added text to cells
      if (cell.x === 0) {
        this.fillText(
          cell.key[1],
          xCoord + cellSize / 40,
          yCoord + cellSize / 6,
          cell
        );
      }
      if (cell.y === 7) {
        this.fillText(
          cell.key[0],
          xCoord + cellSize * 0.85,
          yCoord + cellSize * 0.95,
          cell
        );
      }
    });
  };

  drawCursorImage = (piece, x, y) => {
    const cellSize = this.getCellSize();
    const { type, color } = piece;
    this.ctx.drawImage(images[type][color], x, y, cellSize - 5, cellSize - 5);
  };

  fillText = (text, x, y, cell) => {
    const fontSize = Math.floor(this.getCellSize() / 6);
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

  // Removes all highlight flags from cells
  removeHighlights = () => {
    this.highlightedCells.forEach((cell) => {
      cell.isHighlighted = false;
      cell.isTake = false;
    });
  };
}

export default Board;
