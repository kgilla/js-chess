import { images } from "../images.js";
import {
  PIECE_TYPES,
  CELL_COUNT,
  PIECE_COLORS,
  DIRECTIONS,
  KNIGHT_DIRECTIONS,
} from "../const.js";

class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.image = images[this.type][this.color];
    this.moveCount = 0;
    this.isHidden = false;
  }

  // Checks if coordinates are within bounds
  insideBounds = (coords) => {
    const [x, y] = coords;
    if (x < 0 || y < 0 || x > 7 || y > 7) return false;
    return true;
  };

  // Serperate functions to increment coordinates
  directionFunctions = {
    north: (x, y) => [x, y - 1],
    south: (x, y) => [x, y + 1],
    east: (x, y) => [x + 1, y],
    west: (x, y) => [x - 1, y],
    northWest: (x, y) => [x - 1, y - 1],
    northEast: (x, y) => [x + 1, y - 1],
    southWest: (x, y) => [x - 1, y + 1],
    southEast: (x, y) => [x + 1, y + 1],
  };

  // Seperate functions for knight movement
  knightDirectionFunctions = {
    northWest: (x, y) => [x - 1, y - 2],
    northEast: (x, y) => [x + 1, y - 2],
    southWest: (x, y) => [x - 1, y + 2],
    southEast: (x, y) => [x + 1, y + 2],
    eastNorth: (x, y) => [x + 2, y - 1],
    eastSouth: (x, y) => [x + 2, y + 1],
    westNorth: (x, y) => [x - 2, y - 1],
    westSouth: (x, y) => [x - 2, y + 1],
  };

  //Creates move array based on direction and number of potential moves within the confines of the board
  calculateMoves = (start, moveArray, isKnight = false) => {
    if (moveArray.length < 1) return;

    const { x, y } = start;

    let moves = {};

    moveArray.forEach((moveData) => {
      const [moveDirection, amount] = moveData;
      const nextMove = isKnight
        ? this.knightDirectionFunctions[moveDirection](x, y)
        : this.directionFunctions[moveDirection](x, y);
      if (this.insideBounds(nextMove)) {
        if (amount > 1) {
          for (let i = 0; i < amount; i++) {
            if (i === 0) {
              const nextMove = isKnight
                ? this.knightDirectionFunctions[moveDirection](x, y)
                : this.directionFunctions[moveDirection](x, y);
              if (this.insideBounds(nextMove)) {
                !moves[moveDirection]
                  ? (moves[moveDirection] = [nextMove])
                  : moves[moveDirection].push(nextMove);
              } else {
                break;
              }
            } else {
              let oldMove =
                moves[moveDirection][moves[moveDirection].length - 1];
              const nextMove = this.directionFunctions[moveDirection](
                oldMove[0],
                oldMove[1]
              );
              if (this.insideBounds(nextMove)) {
                !moves[moveDirection]
                  ? (moves[moveDirection] = [nextMove])
                  : moves[moveDirection].push(nextMove);
              } else {
                break;
              }
            }
          }
        } else {
          !moves[moveDirection]
            ? (moves[moveDirection] = [nextMove])
            : moves[moveDirection].push(nextMove);
        }
      }
    });

    return moves;
  };

  // Shows all potential moves on game board within confines of board
  showMoves = (currentCell) => {
    if (this.type === PIECE_TYPES.pawn) {
      // Pawn
      if (this.color === PIECE_COLORS.white) {
        return this.calculateMoves(currentCell.coords, [
          [DIRECTIONS.north, this.moveCount === 0 ? 2 : 1],
          [DIRECTIONS.northEast, 1],
          [DIRECTIONS.northWest, 1],
        ]);
      } else {
        return this.calculateMoves(currentCell.coords, [
          [DIRECTIONS.south, this.moveCount === 0 ? 2 : 1],
          [DIRECTIONS.southEast, 1],
          [DIRECTIONS.southWest, 1],
        ]);
      }
    } else if (this.type === PIECE_TYPES.rook) {
      // Rook
      return this.calculateMoves(
        currentCell.coords,
        Object.values(DIRECTIONS)
          .slice(0, 4)
          .map((dir) => [dir, CELL_COUNT])
      );
    } else if (this.type === PIECE_TYPES.knight) {
      // Knight
      return this.calculateMoves(
        currentCell.coords,
        Object.values(KNIGHT_DIRECTIONS).map((dir) => [dir, 1]),
        true
      );
    } else if (this.type === PIECE_TYPES.bishop) {
      // Bishop
      return this.calculateMoves(
        currentCell.coords,
        Object.values(DIRECTIONS)
          .slice(4, 8)
          .map((dir) => [dir, CELL_COUNT])
      );
    } else if (this.type === PIECE_TYPES.king) {
      // King
      return this.calculateMoves(
        currentCell.coords,
        Object.values(DIRECTIONS).map((dir) => [dir, 1])
      );
    } else if (this.type === PIECE_TYPES.queen) {
      // Queen
      return this.calculateMoves(
        currentCell.coords,
        Object.values(DIRECTIONS).map((dir) => [dir, CELL_COUNT])
      );
    }
  };
}

export default Piece;
