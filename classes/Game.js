import Board from "./Board.js";

import {
  DIRECTIONS,
  KNIGHT_DIRECTIONS,
  PIECE_COLORS,
  PIECE_TYPES,
} from "../const.js";

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
    const { type, color, moveCount } = this.currentPiece;
    if (type === PIECE_TYPES.pawn) {
      // Pawn
      if (color === PIECE_COLORS.white) {
        return this.calculateMoves(currentCell, [
          [DIRECTIONS.north, moveCount === 0 ? 2 : 1],
          [DIRECTIONS.northEast, 1],
          [DIRECTIONS.northWest, 1],
        ]);
      } else {
        return this.calculateMoves(currentCell, [
          [DIRECTIONS.south, moveCount === 0 ? 2 : 1],
          [DIRECTIONS.southEast, 1],
          [DIRECTIONS.southWest, 1],
        ]);
      }
    } else if (type === PIECE_TYPES.rook) {
      // Rook
      return this.calculateMoves(
        currentCell,
        Object.values(DIRECTIONS)
          .slice(0, 4)
          .map((dir) => [dir, CELL_COUNT])
      );
    } else if (type === PIECE_TYPES.knight) {
      // Knight
      return this.calculateMoves(
        currentCell,
        Object.values(KNIGHT_DIRECTIONS).map((dir) => [dir, 1]),
        true
      );
    } else if (type === PIECE_TYPES.bishop) {
      // Bishop
      return this.calculateMoves(
        currentCell,
        Object.values(DIRECTIONS)
          .slice(4, 8)
          .map((dir) => [dir, CELL_COUNT])
      );
    } else if (type === PIECE_TYPES.king) {
      // King
      return this.calculateMoves(
        currentCell,
        Object.values(DIRECTIONS).map((dir) => [dir, 1])
      );
    } else if (type === PIECE_TYPES.queen) {
      // Queen
      return this.calculateMoves(
        currentCell,
        Object.values(DIRECTIONS).map((dir) => [dir, CELL_COUNT])
      );
    }
  };

  createLegalMoves = () => {
    const moveData = this.showMoves(this.currentCell);
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

  // Event handlers
  handleMouseDown = (x, y) => {
    const cell = this.board.data[`${x}${y}`];
    const clone = structuredClone(this.board.data);
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
    this.board.drawCursorImage(this.currentPiece, x, y);
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
