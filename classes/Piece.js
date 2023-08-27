class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.hasMoved = false;
    this.isHidden = false;
  }
}

export default Piece;
