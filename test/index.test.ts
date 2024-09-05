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