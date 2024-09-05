import { hexStringToNumericValue } from "../hex-helpers.js";
import { HorizontalPixelOrdering, VerticalPixelOrdering } from "../parse-tga-file-metadata.js";
import { ParseTgaFileImageDataInput, ParseTgaFileImageDataOutput } from "./parse-tga-file-image-data";

export const parseUnencodedTrueColourTgaFileImageData = (
  input: ParseTgaFileImageDataInput
): ParseTgaFileImageDataOutput => {
  let bytesReadForImageData = 0;

  const startRowIndex = input.verticalPixelOrdering === VerticalPixelOrdering.TOP_TO_BOTTOM
    ? 0
    : input.imageHeightPx - 1;
  const startColIndex = input.horizontalPixelOrdering === HorizontalPixelOrdering.LEFT_TO_RIGHT
    ? 0
    : input.imageWidthPx - 1;

  let currentRowIndex = startRowIndex;
  let currentColIndex = startColIndex;
  let indexInHexTgaFileData = 0;

  const twoDimensionalPixelArray: number[][] = []

  while(currentRowIndex >= 0 && currentRowIndex < input.imageHeightPx) {
    const currentRow: number[][] = [];

    while(currentColIndex >= 0 && currentColIndex < input.imageWidthPx) {
      if(input.numberOfChannels === 4) {
        const green = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 0,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 2,
        ));
        const blue = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 2,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 4,
        ));
        const red = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 4,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 6,
        ));
        const alpha = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 6,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 8,
        ));
        
        if(input.horizontalPixelOrdering === HorizontalPixelOrdering.LEFT_TO_RIGHT) {
          currentRow.push([ red, blue, green, alpha ]);
        } else {
          currentRow.unshift([ red, blue, green, alpha ]);
        }
        bytesReadForImageData += 4;
      } else {
        const green = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 0,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 2,
        ));
        const blue = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 2,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 4,
        ));
        const red = hexStringToNumericValue(input.hexTgaFileData.slice(
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 4,
          (input.bytesReadForMetadata * 2) + (bytesReadForImageData * 2) + 6,
        ));

        if(input.horizontalPixelOrdering === HorizontalPixelOrdering.LEFT_TO_RIGHT) {
          currentRow.push([ red, blue, green ]);
        } else {
          currentRow.unshift([ red, blue, green ]);
        }
        bytesReadForImageData += 3;
      }

      if(input.horizontalPixelOrdering === HorizontalPixelOrdering.LEFT_TO_RIGHT) {
        currentColIndex++;
      } else {
        currentColIndex--;
      }
    }

    if(input.verticalPixelOrdering === VerticalPixelOrdering.TOP_TO_BOTTOM) {
      currentRowIndex++;
      twoDimensionalPixelArray.push(currentRow.flatMap((element) => element))
    } else {
      currentRowIndex--;
      twoDimensionalPixelArray.unshift(currentRow.flatMap((element) => element))
    }

    currentColIndex = startColIndex;
  }

  return {
    pixelArray: Uint8Array.from(twoDimensionalPixelArray.flatMap((element) => element)),
    bytesReadForImageData
  }
}