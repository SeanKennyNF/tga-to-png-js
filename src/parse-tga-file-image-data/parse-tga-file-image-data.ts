import { HorizontalPixelOrdering, ImageType, VerticalPixelOrdering } from "../parse-tga-file-metadata.js";
import { parseRunLengthEncodedTrueColourTgaFileImageData } from "./parse-run-length-encoded-true-colour-tga-file-image.js";
import { parseUnencodedTrueColourTgaFileImageData } from "./parse-unencoded-true-colour-tga-file-image-data.js";

export const isSupportedImageBitsPerPixel = (input: number): input is 24 | 32 => input === 24 || input === 32;

export interface ParseTgaFileImageDataInput {
  hexTgaFileData: string;
  imageType: ImageType | 'UNKNOWN';
  bytesReadForMetadata: number;
  imageBitsPerPixel: 24 | 32;
  imageWidthPx: number;
  imageHeightPx: number;
  horizontalPixelOrdering: HorizontalPixelOrdering;
  verticalPixelOrdering: VerticalPixelOrdering;
}

export interface ParseTgaFileImageDataOutput {
  pixelArray: Uint8Array;
  bytesReadForImageData: number;
}

export const parseTgaFileImageData = (
  input: ParseTgaFileImageDataInput
): ParseTgaFileImageDataOutput => {

  if(input.imageType === ImageType.UNCOMPRESSED_TRUE_COLOUR_IMAGE) {
    return parseUnencodedTrueColourTgaFileImageData(input);
  }

  if(input.imageType === ImageType.RUN_LENGTH_ENCODED_TRUE_COLOUR_IMAGE) {
    return parseRunLengthEncodedTrueColourTgaFileImageData(input);
  }

  throw new Error(`Unsupported image type: ${input.imageType}`)
}