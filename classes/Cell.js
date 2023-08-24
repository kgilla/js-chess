import { CELL_SIZE, LETTERS } from "../const.js";

class Cell {
  constructor(x, y, piece) {
    this.x = x;
    this.y = y;
    this.piece = piece;
    this.coords = { x: x / CELL_SIZE, y: y / CELL_SIZE };
    this.text = `${LETTERS[this.coords.x]}${this.coords.y + 1}`;
    this.isHighlighted = false;
  }
}

export default Cell;
