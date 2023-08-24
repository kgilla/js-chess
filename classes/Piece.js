import { images } from "../images.js";
import { PIECE_TYPES, CELL_COUNT } from "../const.js";

class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.image = images[this.type][this.color];
    this.isHidden = false;
    this.directions = {
      north: (x, y) => [x, y - 1],
      south: (x, y) => [x, y + 1],
      east: (x, y) => [x + 1, y],
      west: (x, y) => [x - 1, y],
      northWest: (x, y) => [x - 1, y - 1],
      northEast: (x, y) => [x + 1, y - 1],
      southWest: (x, y) => [x - 1, y + 1],
      southEast: (x, y) => [x + 1, y + 1],
    };
  }

  showMoves = (currentCell, newCell, piece) => {
    console.log(currentCell, newCell, piece);
    let moves = [];
    if (piece.type === PIECE_TYPES.pawn) {
      const cell = this.directions.north(currentCell.x, currentCell.y);
      console.log("a1" + 1);
      // const move1 = [currentCell.x, currentCell.y + 1];
      // const move2 = [currentCell.x, currentCell.y + 1 * 2];
      // const move3 = [currentCell.x, currentCell.y + 1];
      // const move3 = [currentCell.x, currentCell.y + 1];
    } else if (piece.type === PIECE_TYPES.rook) {
    } else if (piece.type === PIECE_TYPES.knight) {
    } else if (piece.type === PIECE_TYPES.bishop) {
    } else if (piece.type === PIECE_TYPES.king) {
    } else if (piece.type === PIECE_TYPES.queen) {
    }
  };
}

export default Piece;
