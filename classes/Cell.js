import { CELL_SIZE, LETTERS } from "../const.js";

class Cell {
  constructor(x, y, color, piece) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece;
    this.coords = { x: x / CELL_SIZE, y: y / CELL_SIZE };
    this.key = [LETTERS[this.coords.x], this.coords.y + 1];
    this.isHighlighted = false;
    this.isTake = false;
  }
}

export default Cell;
