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
 * Checks whether a point in the world space is visible on the screen.
 *
 * @param {Object} tree - a tree instance
 * @param {Point} worldPoint - a point in the world space.
 * @param {Number} padding - an optional padding in pixels.
 *
 * @example <caption>Example usage of isWorldPointOnScreen.</caption>
 * // returns true
 * this.isWorldPointOnScreen([ 0, 0 ]);
 *
 * @returns {Object} A point
 */
export default function isTreePointOnScreen(worldPoint, padding = 0) {
  const canvasPoint = this.projectPoint(worldPoint);
  return this.isCanvasPointOnScreen(canvasPoint, padding);
}
