import Board from "./Board.js";

import {
  CELL_COUNT,
  DIRECTIONS,
  KNIGHT_DIRECTIONS,
  PIECE_COLORS,
  PIECE_TYPES,
} from "../const.js";

class Game {
  constructor(ctx) {
    this.board = new Board(ctx);
    this.ctx = ctx;
    this.currentCell = "";
    this.currentPiece = "";
    this.dataToMutate = {};
    this.historyIndex = "";
    this.isDragging = false;
    this.isViewingHistory = false;
    this.legalMoves = [];
    this.moveHistory = [this.board.data];
    this.turn = PIECE_COLORS.white;
  }

  // Event handlers

  // Clones board data to use in mutations, flags ui functions, and creates move array for selected piece
  handleMouseDown = (x, y) => {
    if (this.isViewingHistory) {
      // If viewing history, swaps board back to current state
      this.board.draw();
      this.isViewingHistory = false;
      this.historyIndex = "";
    }
    const cellClicked = this.board.data[`${x}${y}`];
    if (cellClicked.piece && cellClicked.piece.color === this.turn) {
      this.dataToMutate = structuredClone(this.board.data);
      const cell = this.dataToMutate[`${x}${y}`];
      this.currentCell = cell;
      this.currentPiece = this.currentCell.piece;
      this.isDragging = true;
      const availableMoves = this.createLegalMoves(
        this.dataToMutate,
        this.currentPiece,
        true
      );
      this.legalMoves = this.filterChecks(availableMoves, this.currentPiece);
    }
  };

  // Hides selected piece and renders it on user's cursor instead
  handleMouseMove = (x, y) => {
    if (!this.isDragging) return;
    this.currentPiece.isHidden = true;
    this.board.draw(this.dataToMutate);
    this.board.drawCursorImage(this.currentPiece, x, y);
  };

  // Determines if move is allowed and finishes mutating data before
  handleMouseUp = (x, y) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    const newCell = this.dataToMutate[`${x}${y}`];
    newCell.piece = this.currentPiece;
    if (this.legalMoves.some((move) => move === newCell)) {
      this.currentPiece.coords = { x, y };
      this.handleTurnFinish();
      this.isCheckmate(structuredClone(this.board.data));
      const check = this.isInCheck(this.board.data);
      if (check) console.log(this.turn + " is in check");
    }
    this.board.draw();
    this.clearState();
  };

  getPieces = (color, boardState) => {
    return Object.values(boardState)
      .filter((cell) => cell.piece.color === color)
      .map((cell) => {
        return cell.piece;
      });
  };

  isCheckmate = (boardState) => {
    // array of current pieces -> for each piece -> generate legal moves -> this.filterChecks -> if ! moves, checkmate
    const pieceArray = this.getPieces(this.turn, boardState);
    let isCheckmate = true;

    for (let i = 0; i < pieceArray.length; i++) {
      const availableMoves = this.createLegalMoves(boardState, pieceArray[i]);
      this.legalMoves = this.filterChecks(availableMoves, pieceArray[i]);
      if (this.legalMoves.length > 0) {
        isCheckmate = false;
        break;
      }
    }

    if (isCheckmate) console.log("CHECKMATE");
    return isCheckmate;
  };

  filterChecks = (legalMoves, pieceToMove) => {
    // Filters out legal moves that leave the current player in check
    const pieceCopy = structuredClone(pieceToMove);
    const { x, y } = pieceCopy.coords;
    const filteredMoves = [];

    legalMoves.forEach((move) => {
      const boardCopy = structuredClone(this.board.data);
      const currentCell = boardCopy[`${x}${y}`];
      const cellToMoveTo = boardCopy[`${move.x}${move.y}`];
      currentCell.piece = "";
      cellToMoveTo.piece = pieceCopy;

      const isCheck = this.isInCheck(boardCopy);
      if (isCheck) {
        const cell = this.dataToMutate[`${move.x}${move.y}`];
        cell.isMove = false;
        cell.isTake = false;
      } else {
        filteredMoves.push(move);
      }
    });

    return filteredMoves;
  };

  isInCheck = (boardState) => {
    // Creates array of current pieces and their respecitve location, filters bases on function input
    const moves = [];
    const color =
      this.turn === PIECE_COLORS.white
        ? PIECE_COLORS.black
        : PIECE_COLORS.white;

    const pieceArray = this.getPieces(color, boardState);

    pieceArray.forEach((piece) => {
      const moveArr = this.createLegalMoves(boardState, piece);
      if (moveArr.length) moves.push(moveArr);
    });

    const isCheck = moves
      .flat()
      .some((move) => move.piece.type === PIECE_TYPES.king);

    return isCheck;
  };

  cleanCells = () => {
    this.currentCell.piece = "";
    this.currentPiece.isHidden = false;
    this.removeHighlights();
  };
  // Removes all highlight flags from cells
  removeHighlights = () => {
    this.legalMoves.forEach((cell) => {
      cell.isMove = false;
      cell.isTake = false;
    });
  };

  // Increments move counter
  handleTurnFinish = () => {
    this.cleanCells();
    this.currentPiece.hasMoved = true;
    this.board.data = this.dataToMutate;
    this.moveHistory.push(this.dataToMutate);
    this.turn =
      this.turn === PIECE_COLORS.white
        ? PIECE_COLORS.black
        : PIECE_COLORS.white;
  };

  clearState = () => {
    this.currentPiece = "";
    this.currentCell = "";
    this.legalMoves = [];
    this.dataToMutate = {};
  };

  viewHistory = (direction) => {
    if (this.moveHistory.length < 2) return;
    this.isViewingHistory = true;
    if (direction === "forwards") {
      if (this.historyIndex < this.moveHistory.length - 1) {
        this.historyIndex += 1;
        this.board.draw(this.moveHistory[this.historyIndex]);
      } else {
        return;
      }
    } else if (direction === "reverse") {
      if (this.historyIndex && this.historyIndex > -1) {
        this.historyIndex -= 1;
        this.board.draw(this.moveHistory[this.historyIndex]);
      } else {
        this.historyIndex = this.moveHistory.length - 2;
        this.board.draw(this.moveHistory[this.historyIndex]);
      }
    }
  };

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
  showMoves = (piece) => {
    const { type, color, hasMoved, coords } = piece;
    if (type === PIECE_TYPES.pawn) {
      // Pawn
      if (color === PIECE_COLORS.white) {
        return this.calculateMoves(coords, [
          [DIRECTIONS.north, hasMoved ? 1 : 2],
          [DIRECTIONS.northEast, 1],
          [DIRECTIONS.northWest, 1],
        ]);
      } else {
        return this.calculateMoves(coords, [
          [DIRECTIONS.south, hasMoved ? 1 : 2],
          [DIRECTIONS.southEast, 1],
          [DIRECTIONS.southWest, 1],
        ]);
      }
    } else if (type === PIECE_TYPES.rook) {
      // Rook
      return this.calculateMoves(
        coords,
        Object.values(DIRECTIONS)
          .slice(0, 4)
          .map((dir) => [dir, CELL_COUNT])
      );
    } else if (type === PIECE_TYPES.knight) {
      // Knight
      return this.calculateMoves(
        coords,
        Object.values(KNIGHT_DIRECTIONS).map((dir) => [dir, 1]),
        true
      );
    } else if (type === PIECE_TYPES.bishop) {
      // Bishop
      return this.calculateMoves(
        coords,
        Object.values(DIRECTIONS)
          .slice(4, 8)
          .map((dir) => [dir, CELL_COUNT])
      );
    } else if (type === PIECE_TYPES.king) {
      // King
      return this.calculateMoves(
        coords,
        Object.values(DIRECTIONS).map((dir) => [dir, 1])
      );
    } else if (type === PIECE_TYPES.queen) {
      // Queen
      return this.calculateMoves(
        coords,
        Object.values(DIRECTIONS).map((dir) => [dir, CELL_COUNT])
      );
    }
  };

  // Takes array of moves and determines which moves can happen within the context of the game
  createLegalMoves = (boardState, piece, addHints = false) => {
    const moveData = this.showMoves(piece);
    let currentDirection = "";
    let legalMoves = [];

    if (piece === PIECE_TYPES.pawn && piece.hasMoved) {
      moveData.splice(1, 1);
    }

    for (const [direction, moves] of Object.entries(moveData)) {
      moves.forEach((move) => {
        const cell = boardState[move.join("")];
        // Pawn Logic
        if (piece.type === PIECE_TYPES.pawn) {
          if (
            direction === DIRECTIONS.north ||
            direction === DIRECTIONS.south
          ) {
            if (!cell.piece) {
              if (addHints) cell.isMove = true;
              legalMoves.push(cell);
            }
          } else if (cell.piece && cell.piece.color !== piece.color) {
            if (addHints) cell.isTake = true;
            legalMoves.push(cell);
          }
          // Other Piece Logic
        } else {
          if (cell.piece && currentDirection !== direction) {
            if (cell.piece.color !== piece.color) {
              if (addHints) cell.isTake = true;
              legalMoves.push(cell);
            }
            currentDirection = direction;
          } else if (currentDirection !== direction) {
            if (addHints) cell.isMove = true;
            legalMoves.push(cell);
          }
        }
      });
    }
    return legalMoves;
  };
}

export default Game;
