class Piece {
  constructor(type, color, coords) {
    this.type = type;
    this.color = color;
    this.coords = { x: coords.x, y: coords.y };
    this.hasMoved = false;
    this.isHidden = false;
  }
}

export default Piece;
