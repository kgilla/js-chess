import Board from "./Board.js";

import { DIRECTIONS, PIECE_COLORS, PIECE_TYPES } from "../const.js";

class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.board = new Board(ctx);
    this.turn = PIECE_COLORS.white;
    this.isDragging = false;
    this.currentCell = "";
    this.currentPiece = "";
    this.moveHistory = [];
    this.legalMoves = [];
  }

  createLegalMoves = () => {
    const moveData = this.currentCell.piece.showMoves(this.currentCell);
    let legalMoves = [];
    let currentDirection = "";

    if (
      this.currentPiece === PIECE_TYPES.pawn &&
      this.currentPiece.moveCount > 0
    ) {
      moveData.splice(1, 1);
    }

    for (const [direction, moves] of Object.entries(moveData)) {
      moves.forEach((move) => {
        const cellToTest = this.board.data[move.join("")];
        let data = { cell: cellToTest, isTake: false };
        if (this.currentPiece.type === PIECE_TYPES.pawn) {
          if (
            direction === DIRECTIONS.north ||
            direction === DIRECTIONS.south
          ) {
            legalMoves.push(data);
          } else if (
            cellToTest.piece &&
            cellToTest.piece.color !== this.currentPiece.color
          ) {
            legalMoves.push({ ...data, isTake: true });
          }
        } else {
          if (cellToTest.piece && currentDirection !== direction) {
            if (cellToTest.piece.color !== this.currentPiece.color) {
              legalMoves.push({ ...data, isTake: true });
            }
            currentDirection = direction;
          } else if (currentDirection !== direction) {
            legalMoves.push(data);
          }
        }
      });
    }

    this.board.highlightMoves(legalMoves);
    this.legalMoves = legalMoves.map((move) => move.cell);
  };

  handleTurnFinish = () => {
    //checkWin
    // check for check
    this.currentPiece.moveCount++;
    this.turn =
      this.turn === PIECE_COLORS.white
        ? PIECE_COLORS.black
        : PIECE_COLORS.white;
    this.clearState();
  };

  clearState = () => {
    this.currentPiece = "";
    this.currentCell = "";
  };

  handleMouseDown = (x, y) => {
    const cell = this.board.data[`${x}${y}`];
    this.currentCell = cell;
    if (cell.piece && cell.piece.color === this.turn) {
      this.isDragging = true;
      this.currentPiece = this.currentCell.piece;
      this.createLegalMoves();
    }
  };

  handleMouseMove = (x, y) => {
    if (!this.isDragging) return;
    this.currentPiece.isHidden = true;
    this.board.draw();
    this.board.drawCursorImage(this.currentPiece.image, x, y);
  };

  handleMouseUp = (x, y) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    const newCell = this.board.data[`${x}${y}`];
    if (this.legalMoves.some((move) => move === newCell)) {
      this.currentCell.piece = "";
      this.currentPiece.isHidden = false;
      newCell.piece = this.currentPiece;
      this.board.removeHighlights();
      this.board.draw();
      this.handleTurnFinish();
    } else {
      if (this.currentPiece) this.currentPiece.isHidden = false;
      this.board.removeHighlights();
      this.board.draw();
    }
    this.clearState();
  };
}

export default Game;
