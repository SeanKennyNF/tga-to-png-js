export const hexStringToNumericValue = (hexString: string): number => {
  // As it turns out, BMP files store numbers in a little endian format so I just turn it into big endian before converting.
  const bigEndianHexString = hexString
    .match(/..?/g)
    ?.reverse()
    ?.join('') ?? '';

  return parseInt(bigEndianHexString, 16);
}

export const hexStringToBitValues = (hexString: string): Array<0 | 1> => {
  return [...hexString]
    .map((character) => hexStringToNumericValue(character))
    .flatMap((numericValue) => {
      let numericValueRemaining = numericValue;

      return [8, 4, 2, 1].map((element) => {
        if(numericValueRemaining >= element) {
          numericValueRemaining -= element;
          return 1;
        } else {
          return 0;
        }
      })
    })
}