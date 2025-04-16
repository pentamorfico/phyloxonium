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
import memoise from "@utils/memoise";
import fontColourMemo from "./font-colour";
import internalNodesMemo from "./internal-nodes";
import pixelOffsetMemo from "./pixel-offset";

function getText(datum) {
  return datum.name;
}

function getNodePosition(node) {
  return [
    node.x,
    node.y,
  ];
}

function getTextAnchor(datum) {
  return (datum.inverted) ? "end" : "start";
}

export default () => memoise(
  internalNodesMemo,
  (tree) => tree.props.internalLabelsFontSize ?? tree.getFontSize(),
  (tree) => tree.getFontFamily(),
  fontColourMemo,
  pixelOffsetMemo,
  (tree) => tree.props.showInternalLabels,
  (
    internalNodes,
    fontSize,
    fontFamily,
    fontColour,
    pixelOffset,
  ) => {
    const layer = new TextLayer({
      id: "internal-labels",
      data: internalNodes,
      getSize: fontSize,
      getColor: fontColour,
      fontFamily,
      getPosition: getNodePosition,
      getText,
      getPixelOffset: pixelOffset,
      getTextAnchor,
    });
    return layer;
  }
);
