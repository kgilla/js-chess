export const CANVAS_HEIGHT = 640;
export const CANVAS_WIDTH = 640;
export const LINE_WIDTH = 1.5;

export const CELL_COUNT = 8;
export const CELL_SIZE = CANVAS_HEIGHT / CELL_COUNT;

export const BOARD_COLORS = {
  white: "#ffffff",
  black: "#229954",
};

export const PIECE_COLORS = {
  white: "white",
  black: "black",
};

export const PIECE_TYPES = {
  pawn: "pawn",
  knight: "knight",
  rook: "rook",
  bishop: "bishop",
  king: "king",
  queen: "queen",
};

export const LETTERS = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
};

export const DIRECTIONS = {
  north: "north",
  south: "south",
  east: "east",
  west: "west",
  northWest: "northWest",
  northEast: "northEast",
  southWest: "southWest",
  southEast: "southEast",
};
