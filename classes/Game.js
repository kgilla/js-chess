import { PIECE_COLORS } from "../const.js";

class Game {
  constructor() {
    this.turn = PIECE_COLORS.white;
    this.currentCell = "";
    this.currentPiece = "";
    this.boardState = {};
    this.isDragging = false;
    this.moveHistory = [];
  }

  isLegalMove = (piece) => {
    if (piece.color === this.turn) {
      return true;
    } else {
      return false;
    }
  };

  handleMove = () => {
    this.turn =
      this.turn === PIECE_COLORS.white
        ? PIECE_COLORS.black
        : PIECE_COLORS.white;
  };

  clearState = () => {
    this.currentPiece = "";
    this.currentCell = "";
    this.boardState = {};
  };
}

export default Game;
