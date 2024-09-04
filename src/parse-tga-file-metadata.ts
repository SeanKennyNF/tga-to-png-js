import { hexStringToBitValues, hexStringToNumericValue } from "./hex-helpers.js";

export enum ImageType {
  NO_IMAGE_DATA_PRESENT = 'NO_IMAGE_DATA_PRESENT',
  UNCOMPRESSED_AND_COLOUR_MAPPED_IMAGE = 'UNCOMPRESSED_AND_COLOUR_MAPPED_IMAGE',
  UNCOMPRESSED_TRUE_COLOUR_IMAGE = 'UNCOMPRESSED_TRUE_COLOUR_IMAGE',
  UNCOMPRESSED_GRAYSCALE_IMAGE = 'UNCOMPRESSED_GRAYSCALE_IMAGE',
  RUN_LENGTH_ENCODED_AND_COLOUR_MAPPED_IMAGE = 'RUN_LENGTH_ENCODED_AND_COLOUR_MAPPED_IMAGE',
  RUN_LENGTH_ENCODED_TRUE_COLOUR_IMAGE = 'RUN_LENGTH_ENCODED_TRUE_COLOUR_IMAGE',
  RUN_LENGTH_ENCODED_GRAYSCALE_IMAGE = 'RUN_LENGTH_ENCODED_GRAYSCALE_IMAGE',
}

export enum VerticalPixelOrdering {
  BOTTOM_TO_TOP = 'BOTTOM_TO_TOP',
  TOP_TO_BOTTOM = 'TOP_TO_BOTTOM'
}

export enum HorizontalPixelOrdering {
  RIGHT_TO_LEFT = 'RIGHT_TO_LEFT',
  LEFT_TO_RIGHT = 'LEFT_TO_RIGHT'
}

export interface TgaFileMetadata {
  imageIdLengthBytes: number;
  colourMapPresent: boolean | 'UNKNOWN';
  imageType: ImageType | 'UNKNOWN';
  colourMapSpecification: {
    firstEntryIndex: number;
    numberOfEntriesInColourMap: number;
    colourMapEntrySizeBits: number;
  };
  imageSpecification: {
    xOrigin: number;
    yOrigin: number;
    imageWidthPx: number;
    imageHeightPx: number;
    imageBitsPerPixel: number;
    alphaChannelDepth: number;
    horizontalPixelOrdering: HorizontalPixelOrdering;
    verticalPixelOrdering: VerticalPixelOrdering;
  }
}

interface ParseTgaFileMetadataInput {
  hexTgaFileData: string;
}

interface ParseTgaFileMetadataOutput {
  metadata: TgaFileMetadata;
  bytesReadForMetadata: number;
}

const numericValueToImageTypeMap: Record<number, ImageType | undefined> = {
  [0]: ImageType.NO_IMAGE_DATA_PRESENT,
  [1]: ImageType.UNCOMPRESSED_AND_COLOUR_MAPPED_IMAGE,
  [2]: ImageType.UNCOMPRESSED_TRUE_COLOUR_IMAGE,
  [3]: ImageType.UNCOMPRESSED_GRAYSCALE_IMAGE,
  [9]: ImageType.RUN_LENGTH_ENCODED_AND_COLOUR_MAPPED_IMAGE,
  [10]: ImageType.RUN_LENGTH_ENCODED_TRUE_COLOUR_IMAGE,
  [11]: ImageType.RUN_LENGTH_ENCODED_GRAYSCALE_IMAGE
}

const verticalPixelOrderingBitToVerticalPixelOrdering: Record<number, VerticalPixelOrdering | undefined> = {
  [0]: VerticalPixelOrdering.BOTTOM_TO_TOP,
  [1]: VerticalPixelOrdering.TOP_TO_BOTTOM
}

const horizontalPixelOrderingBitToHorizontalPixelOrdering: Record<number, HorizontalPixelOrdering | undefined> = {
  [0]: HorizontalPixelOrdering.RIGHT_TO_LEFT,
  [1]: HorizontalPixelOrdering.LEFT_TO_RIGHT
}

export const parseTgaFileMetadata = (
  input: ParseTgaFileMetadataInput
): ParseTgaFileMetadataOutput => ({
  metadata: {
    imageIdLengthBytes: hexStringToNumericValue(input.hexTgaFileData.slice(0, 2)),
    colourMapPresent: hexStringToBitValues(input.hexTgaFileData.slice(2, 4))[0] === 1 ? true : false,
    imageType: numericValueToImageTypeMap[hexStringToNumericValue(input.hexTgaFileData.slice(4, 6))] ?? 'UNKNOWN',
    colourMapSpecification: {
      firstEntryIndex: hexStringToNumericValue(input.hexTgaFileData.slice(6, 10)),
      numberOfEntriesInColourMap: hexStringToNumericValue(input.hexTgaFileData.slice(10, 14)),
      colourMapEntrySizeBits: hexStringToNumericValue(input.hexTgaFileData.slice(14, 16)),
    },
    imageSpecification: {
      xOrigin: hexStringToNumericValue(input.hexTgaFileData.slice(16, 20)),
      yOrigin: hexStringToNumericValue(input.hexTgaFileData.slice(20, 24)),
      imageWidthPx: hexStringToNumericValue(input.hexTgaFileData.slice(24, 28)),
      imageHeightPx: hexStringToNumericValue(input.hexTgaFileData.slice(28, 32)),
      imageBitsPerPixel: hexStringToNumericValue(input.hexTgaFileData.slice(32, 34)),
      alphaChannelDepth: hexStringToBitValues(input.hexTgaFileData.slice(34, 36))
        .slice(0, 4)
        .reduce<number>((accumulator, value, index) => accumulator + (value === 1 ? (Math.pow(2, (3 - index))) : 0), 1),
      horizontalPixelOrdering: horizontalPixelOrderingBitToHorizontalPixelOrdering[
        hexStringToBitValues(input.hexTgaFileData.slice(34, 36)).at(4) ?? 0
      ] ?? HorizontalPixelOrdering.RIGHT_TO_LEFT,
      verticalPixelOrdering: verticalPixelOrderingBitToVerticalPixelOrdering[
        hexStringToBitValues(input.hexTgaFileData.slice(34, 36)).at(5) ?? 0
      ] ?? VerticalPixelOrdering.BOTTOM_TO_TOP
    }
  },
  bytesReadForMetadata: 18
});