export function reduceOverPlotting(input, precisionX, precisionY, xType) {
  const includedPoints = {};
  precisionX = precisionX / 5; // Adjust precision for x

  const filtered = input.filter((node) => {
    const roundedX = Math.round(node[xType] * precisionX) / precisionX;
    const roundedY = Math.round(node.y * precisionY) / precisionY;

    if (includedPoints[roundedX]) {
      if (includedPoints[roundedX][roundedY]) {
        return false; // Skip if the grid cell is already occupied
      } else {
        includedPoints[roundedX][roundedY] = true;
        return true;
      }
    } else {
      includedPoints[roundedX] = { [roundedY]: true };
      return true;
    }
  });

  return filtered;
}