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

export const PIECE_PLACES = {
  a: PIECE_TYPES.rook,
  b: PIECE_TYPES.knight,
  c: PIECE_TYPES.bishop,
  d: PIECE_TYPES.king,
  e: PIECE_TYPES.queen,
  f: PIECE_TYPES.bishop,
  g: PIECE_TYPES.knight,
  h: PIECE_TYPES.rook,
};

export const LETTERS = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
  7: "g",
  8: "h",
};
