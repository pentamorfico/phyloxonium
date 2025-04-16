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

import defaults from "@lib/defaults";
import memoise from "@utils/memoise";
import colourToRGBA from "@utils/colour-to-rgba";

import lineColourMemo from "./line-colour";

export default memoise(
  lineColourMemo,
  (tree) => tree.props.styleNodeEdges ?? defaults.styleNodeEdges,
  (tree) => colourToRGBA(tree.props.highlightColour ?? defaults.highlightColour),
  (tree) => tree.getHighlightedNode(),
  (
    lineColour,
    styleNodeEdges,
    highlightColour,
    highlightedNode,
  ) => {
    if (highlightedNode || styleNodeEdges) {
      return (node) => {
        if (
          highlightedNode &&
          node.preIndex > highlightedNode.preIndex &&
          node.preIndex < highlightedNode.preIndex + highlightedNode.totalNodes
        ) {
          return highlightColour;
        }
        else if (styleNodeEdges) {
          const colourArray = [ ...node.strokeColour ];
          colourArray[3] = lineColour[3];
          return colourArray;
        }
        else {
          return lineColour;
        }
      };
    }
    else {
      return lineColour;
    }
  }
);
