import { readFile } from "fs/promises";
import sharp from 'sharp';
import { parseTgaFileMetadata, TgaFileMetadata } from "./parse-tga-file-metadata.js";
import { parseTgaFileImageData } from "./parse-tga-file-image-data.js";


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

  const numberOfChannels = (metadata.imageSpecification.alphaChannelDepth === 1) ? 4 : 3;

  const { pixelArray, bytesReadForImageData } = parseTgaFileImageData({
    hexTgaFileData,
    bytesReadForMetadata,
    numberOfChannels,
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
        channels: numberOfChannels
      }
    }
  );

  await image.toFile(input.outputFilePath);

  return {
    metadata
  }
}