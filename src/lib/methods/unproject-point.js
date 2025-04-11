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

/**
 * Translates a point on the screen to a point on the tree plane.
 *
 * @param {Array} canvasPoint - the [X,Y] coordinates of the point in the canvas spcae.
 *
 * @example <caption>Example usage of unprojectPoint with a tree transform equals { x: 10, y: 20, z: 2 }.</caption>
 * // returns { x: 0, y: 40 }
 * unprojectPoint(10, 100);
 *
 * @returns {Object} A point
 */
export default function unprojectPoint(canvasPoint) {
  const { target: viewportTarget } = this.getView(this);
  const scale = this.getScale();
  const canvasCentre = this.getCanvasCentrePoint();
  return [
    viewportTarget[0] + ((canvasPoint[0] - canvasCentre[0]) / scale),
    viewportTarget[1] + ((canvasPoint[1] - canvasCentre[1]) / scale),
  ];
}
