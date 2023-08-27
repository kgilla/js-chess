import { LETTERS } from "../const.js";

class Cell {
  constructor(x, y, color, piece) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece;
    this.key = [LETTERS[x], 8 - y];
    this.isMove = false;
    this.isTake = false;
  }
}

export default Cell;
