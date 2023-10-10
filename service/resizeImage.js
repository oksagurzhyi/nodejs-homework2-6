const Jimp = require("jimp");

const resizeImage = async (path, height, width) => {
  const image = await Jimp.read(path);
  await image.resize(Number(height), Number(width));
  await image.writeAsync(path);
};

module.exports = { resizeImage };
