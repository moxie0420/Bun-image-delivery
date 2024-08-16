import config from "./config";
import jimp from "jimp";
/**
import webpfy from 'webpfy';

async function convertToWebp(path: string, width?: number, height?: number) {
  const cached =
    config.cachePath +
    path.substring(0, path.length - 4) +
    "_" +
    width +
    "_" +
    height +
    path.substring(path.length - 4);
  const image = Bun.file(cached);
  const 
}
  */

async function tranformImage(path: string, width?: number, height?: number) {
  if (!width) width = jimp.AUTO;
  if (!height) height = jimp.AUTO;

  const cached =
    config.cachePath +
    path.substring(0, path.length - 4) +
    "_" +
    width +
    "_" +
    height +
    path.substring(path.length - 4);

  if (await Bun.file(cached).exists()) {
    const cachedImage = Bun.file(cached);
    return cachedImage;
  } else {
    console.log("Couldnt find cached Image, making a new one");
    const resized = (await jimp.read(config.imagePath + path)).resize(
      width,
      height
    );


    await resized.writeAsync(cached);
    return Bun.file(cached);
  }
}

async function fetchImage(path: string) {
  if (path === "/") {
    return "Please Specify A File";
  } else {
    if (await Bun.file(config.imagePath + path).exists())
      return Bun.file(config.imagePath + path);
    else {
      return "Image not Found :(";
    }
  }
}

export { tranformImage, fetchImage, convertToWebp };
