// Phylocanvas.gl (https://phylocanvas.gl)
// Centre for Genomic Pathogen Surveillance.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Finds the bounds of a subtree (min and max points)
export default function calculateNodeBounds(
  nodes,
  firstIndex = 0,
  lastIndex = nodes.length - 1,
  xAxis = "x",
  yAxis = "y",
) {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  // Loop over all nodes while keeping track of the min and max points
  for (let i = firstIndex; i <= lastIndex; i++) {
    const node = nodes[i];

    if (node[xAxis] < minX) {
      minX = node[xAxis];
    }
    if (node[yAxis] < minY) {
      minY = node[yAxis];
    }
    if (node[xAxis] > maxX) {
      maxX = node[xAxis];
    }
    if (node[yAxis] > maxY) {
      maxY = node[yAxis];
    }
  }

  const midX = (maxX + minX) / 2;
  const midY = (maxY + minY) / 2;

  const width = (maxX - minX);
  const height = (maxY - minY);

  return {
    min: [ minX, minY ],
    max: [ maxX, maxY ],
    centre: [ midX, midY ],
    width,
    height,
  };
}
