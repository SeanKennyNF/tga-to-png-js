# tga-to-png-js

This is a TypeScript library which contains a function which converts a [Truevision TGA](https://en.wikipedia.org/wiki/Truevision_TGA) `.tga` image file into a `.png` file by using [sharp](https://sharp.pixelplumbing.com/).

[![Version](https://img.shields.io/npm/v/@sean_kenny/tga-to-png-js.svg)](https://www.npmjs.com/package/@sean_kenny/tga-to-png-js)
[![Downloads/week](https://img.shields.io/npm/dw/@sean_kenny/tga-to-png-js.svg)](https://www.npmjs.com/package/@sean_kenny/tga-to-png-js)

## Installation and Usage

```
$ npm install --save-dev @sean_kenny/tga-to-png-js
# or
$ yarn add -D @sean_kenny/tga-to-png-js
```

An output file can be generated by calling the `transformTgaFileToPngFile` function as below.
```
const { metadata } = transformTgaFileToPngFile({
  inputFilePath: 'path/to/the/file/you/want/to/read/file.tga',
  outputFilePath: 'path/to/wherever/you/want/to/write/to/file.png'
})
```
A `.png` file will be written to `outputFilePath` and you will receive metadata in the following format.
```
{
  "imageIdLengthBytes": 0,
  "colourMapPresent": false,
  "imageType": "RUN_LENGTH_ENCODED_TRUE_COLOUR_IMAGE",
  "colourMapSpecification": {
    "firstEntryIndex": 0,
    "numberOfEntriesInColourMap": 0,
    "colourMapEntrySizeBits": 0
  },
  "imageSpecification": {
    "xOrigin": 0,
    "yOrigin": 0,
    "imageWidthPx": 128,
    "imageHeightPx": 128,
    "imageBitsPerPixel": 24,
    "alphaChannelDepth": 1,
    "horizontalPixelOrdering": "RIGHT_TO_LEFT",
    "verticalPixelOrdering": "BOTTOM_TO_TOP"
  }
}
```

## Acknowledgements

All sample input files which are used for testing are pulled directly from the `ab937cf899b75f74662a17574bd0d46072793beb` version of [Anbennar](https://bitbucket.org/JayBean/anbennar-eu4-fork-public-build) which was published to Bitbucket on August 23rd 2024. All credit for those image files go to their creator.
