import { writeFile } from "fs/promises";


interface TransformTgaFileToPngFileInput {
  inputFilePath: string;
  outputFilePath: string;
}

export const transformTgaFileToPngFile = async(input: TransformTgaFileToPngFileInput): Promise<void> => {
  writeFile(input.outputFilePath, 'test output');
}