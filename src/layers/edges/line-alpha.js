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

import memoise from "@utils/memoise";
import logarithmicScale from "@utils/logarithmic-scale";

const minAlpha = 71; /* 0.28 x 255 */
// const minAlpha = 107 /* 0.42 x 255 */;
const maxAlpha = 255; /* 1 x 255 */
const minScale = 1;

// function linearScale(scale, maxScale) {
//   //  Scale    =>   Alpha
//   //  =======================
//   //      1    =>   0.28
//   //  scale    =>   lineAlpha
//   //  maxScale =>   1.00
// const alphaRange = maxAlpha - minAlpha;
//   const scaleRane = maxScale - minScale;
//   const lineAlpha = (scale - minScale) * alphaRange / scaleRane + minAlpha;
//   return lineAlpha;
// }

const lineAlphaMemo = memoise(
  (tree) => tree.getScale(),
  (tree) => tree.getMaxScale(),
  (tree) => tree.props.minLineAlpha ?? minAlpha,
  (
    scale,
    maxScale,
    minLineAlpha,
  ) => {
    if (scale <= minScale) {
      return minLineAlpha;
    }

    else if ((scale + 0.01) >= maxScale) {
      return maxAlpha;
    }

    else {
      const alphaScale = logarithmicScale([ minScale, maxScale ], [ minLineAlpha, maxAlpha ]);

      const alpha = alphaScale(scale);

      const roundedAlpha = Math.floor(alpha);

      return roundedAlpha;
    }
  }
);

export default function (tree) {
  if (tree.props.scaleLineAlpha) {
    return lineAlphaMemo(tree);
  }
  else {
    return maxAlpha;
  }
}
