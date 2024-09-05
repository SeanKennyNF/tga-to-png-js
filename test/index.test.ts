import { expect, test } from 'vitest'
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { transformTgaFileToPngFile } from '../src';

const testCases = [{
  inputFilename: 'A01.tga',
  artifactFilename: 'A01-output.png',
  metadataArtifactFilename: 'A01-metadata.json',
  expectedOutputImageFilename: 'A01-expected-output.png',
  expectedOutputMetadataFilename: 'A01-expected-metadata.json'
}, {
  inputFilename: 'A19.tga',
  artifactFilename: 'A19-output.png',
  metadataArtifactFilename: 'A19-metadata.json',
  expectedOutputImageFilename: 'A19-expected-output.png',
  expectedOutputMetadataFilename: 'A19-expected-metadata.json'
}, {
  inputFilename: 'A20.tga',
  artifactFilename: 'A20-output.png',
  metadataArtifactFilename: 'A20-metadata.json',
  expectedOutputImageFilename: 'A20-expected-output.png',
  expectedOutputMetadataFilename: 'A20-expected-metadata.json'
}, {
  inputFilename: 'B07.tga',
  artifactFilename: 'B07-output.png',
  metadataArtifactFilename: 'B07-metadata.json',
  expectedOutputImageFilename: 'B07-expected-output.png',
  expectedOutputMetadataFilename: 'B07-expected-metadata.json'
}, {
  inputFilename: 'B79.tga',
  artifactFilename: 'B79-output.png',
  metadataArtifactFilename: 'B79-metadata.json',
  expectedOutputImageFilename: 'B79-expected-output.png',
  expectedOutputMetadataFilename: 'B79-expected-metadata.json'
}, {
  inputFilename: 'F66.tga',
  artifactFilename: 'F66-output.png',
  metadataArtifactFilename: 'F66-metadata.json',
  expectedOutputImageFilename: 'F66-expected-output.png',
  expectedOutputMetadataFilename: 'F66-expected-metadata.json'
}, {
  inputFilename: 'F81.tga',
  artifactFilename: 'F81-output.png',
  metadataArtifactFilename: 'F81-metadata.json',
  expectedOutputImageFilename: 'F81-expected-output.png',
  expectedOutputMetadataFilename: 'F81-expected-metadata.json'
}, {
  inputFilename: 'G45.tga',
  artifactFilename: 'G45-output.png',
  metadataArtifactFilename: 'G45-metadata.json',
  expectedOutputImageFilename: 'G45-expected-output.png',
  expectedOutputMetadataFilename: 'G45-expected-metadata.json'
}, {
  inputFilename: 'J91.tga',
  artifactFilename: 'J91-output.png',
  metadataArtifactFilename: 'J91-metadata.json',
  expectedOutputImageFilename: 'J91-expected-output.png',
  expectedOutputMetadataFilename: 'J91-expected-metadata.json'
}, {
  inputFilename: 'J92.tga',
  artifactFilename: 'J92-output.png',
  metadataArtifactFilename: 'J92-metadata.json',
  expectedOutputImageFilename: 'J92-expected-output.png',
  expectedOutputMetadataFilename: 'J92-expected-metadata.json'
}, {
  inputFilename: 'R06.tga',
  artifactFilename: 'R06-output.png',
  metadataArtifactFilename: 'R06-metadata.json',
  expectedOutputImageFilename: 'R06-expected-output.png',
  expectedOutputMetadataFilename: 'R06-expected-metadata.json'
}, {
  inputFilename: 'V06.tga',
  artifactFilename: 'V06-output.png',
  metadataArtifactFilename: 'V06-metadata.json',
  expectedOutputImageFilename: 'V06-expected-output.png',
  expectedOutputMetadataFilename: 'V06-expected-metadata.json'
}, {
  inputFilename: 'V11.tga',
  artifactFilename: 'V11-output.png',
  metadataArtifactFilename: 'V11-metadata.json',
  expectedOutputImageFilename: 'V11-expected-output.png',
  expectedOutputMetadataFilename: 'V11-expected-metadata.json'
}, {
  inputFilename: 'V12.tga',
  artifactFilename: 'V12-output.png',
  metadataArtifactFilename: 'V12-metadata.json',
  expectedOutputImageFilename: 'V12-expected-output.png',
  expectedOutputMetadataFilename: 'V12-expected-metadata.json'
}];

test.each(testCases)('transformTgaFileToPngFile should produce the right input for $inputFilename', async({
  inputFilename,
  artifactFilename,
  expectedOutputImageFilename,
  metadataArtifactFilename,
  expectedOutputMetadataFilename
}) => {
  const inputFilePath = path.join(
    __dirname,
    'sample-inputs',
    inputFilename
  );
  const outputFilePath = path.join(
    __dirname,
    'artifacts',
    artifactFilename
  );
  const expectedOutputFilePath = path.join(
    __dirname,
    'expected-outputs',
    expectedOutputImageFilename
  )
  const outputMetadataFilePath = path.join(
    __dirname,
    'artifacts',
    metadataArtifactFilename
  )
  const expectedOutputMetadataFilePath = path.join(
    __dirname,
    'expected-outputs',
    expectedOutputMetadataFilename
  )

  const input = {
    inputFilePath,
    outputFilePath
  }

  const { metadata } = await transformTgaFileToPngFile(input);

  await writeFile(outputMetadataFilePath, JSON.stringify(metadata));

  const expectedOutput = await readFile(expectedOutputFilePath)
  const actualOutput = await readFile(outputFilePath)
  const expectedMetadata = await readFile(expectedOutputMetadataFilePath)
    .then((data) => JSON.parse(data.toString()));

  expect(metadata).toEqual(expectedMetadata);
  expect(expectedOutput.equals(actualOutput)).toBe(true);
})