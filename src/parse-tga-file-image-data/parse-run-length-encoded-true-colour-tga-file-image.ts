import { bitValuesToNumericValue, hexStringToBitValues, hexStringToNumericValue } from "../hex-helpers.js";
import { HorizontalPixelOrdering, VerticalPixelOrdering } from "../parse-tga-file-metadata.js";
import { ParseTgaFileImageDataInput, ParseTgaFileImageDataOutput } from "./parse-tga-file-image-data.js";

export const parseRunLengthEncodedTrueColourTgaFileImageData = (
  input: ParseTgaFileImageDataInput
): ParseTgaFileImageDataOutput => {
  const totalExpectedPixelCount = input.imageHeightPx * input.imageWidthPx;
  let pixelArray: number[] = []

  let bytesReadForImageData = 0;
  let pixelsWritten = 0;

  while(pixelsWritten < totalExpectedPixelCount) {
    let currentIndexInMetadata = (input.bytesReadForMetadata + bytesReadForImageData) * 2;
    const isRunLengthEncodedPacket = hexStringToBitValues(input.hexTgaFileData.slice(
      currentIndexInMetadata,
      currentIndexInMetadata + 2
    )).slice(0, 1).at(0) === 1 ? true : false;
    const pixelCountForRun = bitValuesToNumericValue(hexStringToBitValues(input.hexTgaFileData.slice(
      currentIndexInMetadata,
      currentIndexInMetadata + 2
    )).slice(1, 8)) + 1;
    bytesReadForImageData += 1;
    currentIndexInMetadata += 2;

    if(isRunLengthEncodedPacket) {
      const green = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata, currentIndexInMetadata + 2));
      const blue = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata + 2, currentIndexInMetadata + 4));
      const red = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata + 4, currentIndexInMetadata + 6));
      bytesReadForImageData += 3;
      currentIndexInMetadata += 6;

      let newElements: number[] = [];

      if(input.imageBitsPerPixel === 24) {
        newElements = Array(pixelCountForRun)
          .fill(null)
          .map((element) => [ red, blue, green, 255 ])
          .flatMap((element) => element);
      } else {
        const alpha = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata, currentIndexInMetadata + 2));
        bytesReadForImageData += 1;
        currentIndexInMetadata += 2;

        newElements = Array(pixelCountForRun)
          .fill(null)
          .map((element) => [ red, blue, green, alpha ])
          .flatMap((element) => element);
      }

      pixelArray = [
        ...pixelArray,
        ...newElements
      ]
    } else {
      let pixelIndex = 0;

      while(pixelIndex < pixelCountForRun) {
        const green = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata, currentIndexInMetadata + 2));
        const blue = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata + 2, currentIndexInMetadata + 4));
        const red = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata + 4, currentIndexInMetadata + 6));
        bytesReadForImageData += 3;
        currentIndexInMetadata += 6;

        if(input.imageBitsPerPixel === 24) {
          pixelArray.push(red);
          pixelArray.push(blue);
          pixelArray.push(green);
          pixelArray.push(255);
        } else {
          const alpha = hexStringToNumericValue(input.hexTgaFileData.slice(currentIndexInMetadata, currentIndexInMetadata + 2));
          bytesReadForImageData += 1;
          currentIndexInMetadata += 2;

          pixelArray.push(red);
          pixelArray.push(blue);
          pixelArray.push(green);
          pixelArray.push(alpha);
        }
        pixelIndex++;
      }
    }

    pixelsWritten += pixelCountForRun;
  }

  let twoDimensionalPixelArray = pixelArray
    .map((element, index, originalArray) => (index % (input.imageWidthPx * 4) === 0)
      ? originalArray.slice(index, index + (input.imageWidthPx * 4))
        .map((innerElement, innerIndex, innerOriginalArray) => (innerIndex % 4 === 0)
          ? innerOriginalArray.slice(innerIndex, innerIndex + 4)
          : []
        )
        .filter((array) => array.length > 0)
      : []
    )
    .filter((array) => array.length > 0)

  // Logically this makes sense. I have no idea why this appears to produce wrong results.
  // if(input.horizontalPixelOrdering === HorizontalPixelOrdering.RIGHT_TO_LEFT) {
  //   twoDimensionalPixelArray = twoDimensionalPixelArray.map((innerArray) => innerArray
  //     .map((element, index, originalArray) => originalArray[originalArray.length - (index + 1)])
  //   )
  // }

  if(input.verticalPixelOrdering === VerticalPixelOrdering.BOTTOM_TO_TOP) {
    twoDimensionalPixelArray = twoDimensionalPixelArray
      .map((element, index, originalArray) => originalArray[originalArray.length - (index + 1)])
  }

  return {
    pixelArray: Uint8Array.from(twoDimensionalPixelArray
      .flatMap((array) => array
        .flatMap((innerArray) => innerArray)
      )
    ),
    bytesReadForImageData
  }
}