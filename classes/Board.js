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

  // Draws grid based on canvas size
  drawGrid = () => {
    this.ctx.strokeStyle = "#000";

    for (let x = 0; x < CELL_COUNT + 1; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
      this.ctx.stroke();
    }

    for (let y = 0; y < CELL_COUNT + 1; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
      this.ctx.stroke();
    }
  };

  // Creates board data cells containing cells and pieces
  createBoardData = () => {
    for (let x = 0; x < CELL_COUNT; x++) {
      for (let y = 0; y < CELL_COUNT; y++) {
        const cell = new Cell(
          x * CELL_SIZE,
          y * CELL_SIZE,
          y < 2 || y > 5 ? this.createPiece(x, y) : ""
        );
        this.data[`${x}${y}`] = cell;
      }
    }
    console.log(this.data);
  };

  // Creates pieces
  createPiece = (x, y) => {
    if (y === 1 || y == 6) {
      return new Piece(
        PIECE_TYPES.pawn,
        y === 1 ? PIECE_COLORS.black : PIECE_COLORS.white
      );
    } else {
      if (x === 0 || x === 7) {
        return new Piece(
          PIECE_TYPES.rook,
          y === 0 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else if (x === 1 || x == 6) {
        return new Piece(
          PIECE_TYPES.knight,
          y === 0 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else if (x === 2 || x === 5) {
        return new Piece(
          PIECE_TYPES.bishop,
          y === 0 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else if (x === 3) {
        return new Piece(
          PIECE_TYPES.king,
          y === 0 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      } else {
        return new Piece(
          PIECE_TYPES.queen,
          y === 0 ? PIECE_COLORS.black : PIECE_COLORS.white
        );
      }
    }
  };

  // Fills cells to create checkerboard
  colorGrid = () => {
    Object.values(this.data).forEach((cell) => {
      const { x, y } = cell;
      const xEven = (x / CELL_SIZE) % 2;
      const yEven = (y / CELL_SIZE) % 2;
      const color =
        xEven === yEven
          ? cell.isHighlighted
            ? "orange"
            : BOARD_COLORS.white
          : cell.isHighlighted
          ? "orange"
          : BOARD_COLORS.black;
      this.ctx.beginPath();
      this.ctx.rect(
        x + LINE_WIDTH,
        y + LINE_WIDTH,
        CELL_SIZE - LINE_WIDTH * 2,
        CELL_SIZE - LINE_WIDTH * 2
      );
      this.ctx.fillStyle = color;
      this.ctx.fill();
    });
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

      // Added text to cells for debugging
      this.ctx.fillStyle = "#000";
      this.ctx.font = "12px Arial";
      this.ctx.fillText(cell.text, cell.x + 2, cell.y + CELL_SIZE / CELL_COUNT);
    });
  };

  highlightMoves = (cell) => {
    if (!cell.piece) return;
    const moveData = cell.piece.showMoves(cell);
    for (const [direction, moves] of Object.entries(moveData)) {
      moves.forEach((move) => {
        const cell = this.data[move.join("")];
        cell.isHighlighted = true;
        this.highlightedCells.push(cell);
      });
    }
  };

  removeHighlights = () => {
    this.highlightedCells.forEach((cell) => {
      cell.isHighlighted = false;
    });
  };
}

export default Board;
