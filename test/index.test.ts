import { expect, test } from 'vitest'
import path from 'path';
import { readFile } from 'fs/promises';
import { transformTgaFileToPngFile } from '../src';

const testCases = [{
  inputFilename: 'A01.tga',
  artifactFilename: 'A01-output.png',
  expectedOutputFilename: 'A01-expected-output.png'
}, {
  inputFilename: 'A19.tga',
  artifactFilename: 'A19-output.png',
  expectedOutputFilename: 'A19-expected-output.png'
}];

test.each(testCases)('transformTgaFileToPngFile should produce the right input for $inputFilename', async({
  inputFilename,
  artifactFilename,
  expectedOutputFilename
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
    expectedOutputFilename
  )

  const input = {
    inputFilePath,
    outputFilePath
  }

  await transformTgaFileToPngFile(input);

  const expectedOutput = await readFile(expectedOutputFilePath)
  const actualOutput = await readFile(outputFilePath)

  expect(expectedOutput.equals(actualOutput)).toBe(true);
})