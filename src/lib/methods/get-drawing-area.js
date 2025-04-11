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

import defaults from "../defaults";

import memoise from "../utils/memoise";

const drawingAreaMemo = memoise(
  (tree) => tree.getCanvasSize(),
  (tree) => tree.props.treeToCanvasRatio || defaults.treeToCanvasRatio,
  (tree) => tree.getPadding(),
  (tree) => tree.getPixelOffsets(),
  (
    size,
    treeToCanvasRatio,
    padding,
    pixelOffsets,
  ) => {
    let left = padding + pixelOffsets.left;
    let top = padding + pixelOffsets.top;
    let right = size.width - padding - pixelOffsets.right;
    let bottom = size.height - padding - pixelOffsets.bottom;

    let width = (right - left);
    if (width < size.width * treeToCanvasRatio) {
      const minLeft = size.width * (0.5 - (treeToCanvasRatio / 2));
      const maxRight = size.width * (0.5 + (treeToCanvasRatio / 2));
      if (left > minLeft && right < maxRight) {
        left = minLeft;
        right = maxRight;
      }
      else if (left > minLeft) {
        left = size.width * treeToCanvasRatio;
      }
      else if (right < maxRight) {
        right = size.width * treeToCanvasRatio;
      }
      width = (right - left);
    }

    let height = (bottom - top);
    if (height < size.height * treeToCanvasRatio) {
      const minTop = size.height * (0.5 - (treeToCanvasRatio / 2));
      const maxBottom = size.height * (0.5 + (treeToCanvasRatio / 2));
      if (top > minTop && bottom < maxBottom) {
        top = minTop;
        bottom = maxBottom;
      }
      else if (top > minTop) {
        top = size.height * treeToCanvasRatio;
      }
      else if (bottom < maxBottom) {
        bottom = size.height * treeToCanvasRatio;
      }
      height = (bottom - top);
    }

    return {
      width,
      height,
      left,
      top,
      right,
      bottom,
    };
  }
);

drawingAreaMemo.displayName = "drawing-area";

export default function getDrawingArea() {
  return drawingAreaMemo(this);
}
