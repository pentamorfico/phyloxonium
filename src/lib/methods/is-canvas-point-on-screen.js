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
 * Checks whether a point in the screen space is visible on the screen.
 *
 * @param {Object} tree - a tree instance
 * @param {Array} screenPoint - a point in the screen space (i.e. in pixels).
 * @param {Number} padding - an optional padding in pixels.
 *
 * @example <caption>Example usage of iPointOnScreen.</caption>
 * // returns true
 * this.iPointOnScreen([ 0, 0 ]);
 *
 * @returns {Array} A point
 */
export default function isCanvasPointOnScreen(screenPoint, padding = 0) {
  const size = this.getCanvasSize();
  const inside = (
    screenPoint[0] >= padding
    &&
    screenPoint[0] <= size.width - padding
    &&
    screenPoint[1] >= padding
    &&
    screenPoint[1] <= size.height - padding
  );
  return inside;
}
