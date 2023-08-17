const imageSources = {
  pawn: {
    white: "./svgs/Chess_plt45.svg",
    black: "./svgs/Chess_pdt45.svg",
  },
  knight: {
    white: "./svgs/Chess_nlt45.svg",
    black: "./svgs/Chess_ndt45.svg",
  },
  bishop: {
    white: "./svgs/Chess_blt45.svg",
    black: "./svgs/Chess_bdt45.svg",
  },
  rook: {
    white: "./svgs/Chess_rlt45.svg",
    black: "./svgs/Chess_rdt45.svg",
  },
  king: {
    white: "./svgs/Chess_klt45.svg",
    black: "./svgs/Chess_kdt45.svg",
  },
  queen: {
    white: "./svgs/Chess_qlt45.svg",
    black: "./svgs/Chess_qdt45.svg",
  },
};

const loadImages = async () => {
  let loadedImages = {};

  for (const [key1, value1] of Object.entries(imageSources)) {
    loadedImages[key1] = {};
    for (const [key2, value2] of Object.entries(value1)) {
      loadedImages[key1][key2] = new Image();
      loadedImages[key1][key2].src = value2;
      await loadedImages[key1][key2].decode();
    }
  }
  return loadedImages;
};

const images = await loadImages();

export { images };
