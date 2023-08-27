class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.moveCount = 0;
    this.isHidden = false;
  }
}

export default Piece;
