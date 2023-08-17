import { images } from "../images.js";

class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.image = images[this.type][this.color];
  }
}

export default Piece;
