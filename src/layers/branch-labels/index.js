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

import { TextLayer } from "@deck.gl/layers";

import fontColourMemo from "./font-colour";
import internalNodesMemo from "./internal-nodes";
import pixelOffsetAccessorMemo from "./pixel-offset-accessor";
import positionAccessorMemo from "./position-accessor";
import textAccessorMemo from "./text-accessor";

import nodeAngleInDegrees from "../../utils/node-angle-in-degrees";
import memoise from "../../utils/memoise";

export default () => memoise(
  internalNodesMemo,
  (tree) => tree.props.branchLabelsFontSize ?? tree.getFontSize() * 0.6,
  (tree) => tree.getFontFamily(),
  fontColourMemo,
  pixelOffsetAccessorMemo,
  positionAccessorMemo,
  textAccessorMemo,
  (
    internalNodes,
    fontSize,
    fontFamily,
    fontColour,
    pixelOffsetAccessor,
    positionAccessor,
    textAccessor,
  ) => {
    const layer = new TextLayer({
      data: internalNodes,
      fontFamily,
      getAngle: nodeAngleInDegrees,
      getColor: fontColour,
      getPixelOffset: pixelOffsetAccessor,
      getPosition: positionAccessor,
      getSize: fontSize,
      getText: textAccessor,
      getTextAnchor: "middle",
      id: "branch-labels",
      updateTriggers: {
        getPixelOffset: pixelOffsetAccessor,
        getText: textAccessor,
      },
    });
    return layer;
  }
);
