import { readFile } from "fs/promises";
import sharp from 'sharp';
import { parseTgaFileMetadata, TgaFileMetadata } from "./parse-tga-file-metadata.js";
import { isSupportedImageBitsPerPixel, parseTgaFileImageData } from "./parse-tga-file-image-data/parse-tga-file-image-data.js";

interface TransformTgaFileToPngFileInput {
  inputFilePath: string;
  outputFilePath: string;
}

interface TransformTgaFileToPngFileOutput {
  metadata: TgaFileMetadata;
}

export const transformTgaFileToPngFile = async(input: TransformTgaFileToPngFileInput): Promise<TransformTgaFileToPngFileOutput> => {
  const tgaFileDataBuffer = await readFile(input.inputFilePath);
  const hexTgaFileData = tgaFileDataBuffer.toString('hex');

  const { metadata, bytesReadForMetadata } = parseTgaFileMetadata({ hexTgaFileData })

  if(metadata.colourMapPresent === true || metadata.colourMapSpecification.colourMapEntrySizeBits) {
    throw new Error('TGA files with colour maps are currently unsupported.');
  }

  const { imageBitsPerPixel } = metadata.imageSpecification

  if(!isSupportedImageBitsPerPixel(imageBitsPerPixel)) {
    throw new Error('TGA files with bits per pixel values that are not 24 or 32 are not supported (Author of the library is unbelievably lazy).');
  }

  const { pixelArray, bytesReadForImageData } = parseTgaFileImageData({
    hexTgaFileData,
    imageType: metadata.imageType,
    bytesReadForMetadata,
    imageBitsPerPixel,
    imageWidthPx: metadata.imageSpecification.imageWidthPx,
    imageHeightPx: metadata.imageSpecification.imageHeightPx,
    horizontalPixelOrdering: metadata.imageSpecification.horizontalPixelOrdering,
    verticalPixelOrdering: metadata.imageSpecification.verticalPixelOrdering
  });

  const image = sharp(
    pixelArray,
    {
      raw: {
        width: metadata.imageSpecification.imageWidthPx,
        height: metadata.imageSpecification.imageHeightPx,
        channels: 4
      }
    }
  );

  await image.toFile(input.outputFilePath);

  return {
    metadata
  }
}