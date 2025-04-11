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
 * Translates a point on the tree plane to a point on the screen.
 *
 * @param {Object} tree - a tree instance
 * @param {Array} point - the point on the tree plane.
 *
 * @example <caption>Example usage of projectPoint with a tree transform equals { x: 10, y: 20, z: 2 }.</caption>
 * // returns { x: 10, y: 100 }
 * projectPoint(0, 40);
 *
 * @returns {Object} A point
 */
export default function projectPoint(point, optionalScale) {
  const { target: viewportTarget } = this.getView(this);
  const scale = optionalScale ?? this.getScale();
  const canvasCentre = this.getCanvasCentrePoint();
  return [
    (point[0] - viewportTarget[0]) * scale + canvasCentre[0],
    (point[1] - viewportTarget[1]) * scale + canvasCentre[1],
  ];
}
