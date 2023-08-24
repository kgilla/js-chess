import Board from "./Board.js";

import { DIRECTIONS, PIECE_COLORS, PIECE_TYPES } from "../const.js";

class Game {
  constructor(ctx) {
    this.board = new Board(ctx);
    this.turn = PIECE_COLORS.white;
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
        if (this.currentPiece.type === PIECE_TYPES.pawn) {
          if (
            direction === DIRECTIONS.north ||
            direction === DIRECTIONS.south
          ) {
            legalMoves.push(cellToTest);
          } else if (
            cellToTest.piece &&
            cellToTest.piece.color !== this.currentPiece.color
          ) {
            legalMoves.push(cellToTest);
          }
        } else {
          if (cellToTest.piece && currentDirection !== direction) {
            if (cellToTest.piece.color !== this.currentPiece.color) {
              legalMoves.push(cellToTest);
            }
            currentDirection = direction;
          } else if (currentDirection !== direction) {
            legalMoves.push(cellToTest);
          }
        }
      });
    }

    this.board.highlightMoves(legalMoves);
    this.legalMoves = legalMoves;
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
}

export default Game;
