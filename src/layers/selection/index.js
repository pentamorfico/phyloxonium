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

import { ScatterplotLayer } from "@deck.gl/layers";
import memoise from "@utils/memoise";
import selectedNodesMemo from "./selected-nodes";
import haloSizeMemo from "./halo-size";

import defaults from "@lib/defaults";
import colourToRGBA from "@utils/colour-to-rgba";

export default () => memoise(
  selectedNodesMemo,
  (tree) => colourToRGBA(tree.props.highlightColour || defaults.highlightColour),
  (tree) => tree.props.haloWidth || defaults.haloWidth,
  haloSizeMemo,
  (
    selectedNodes,
    highlightColour,
    haloWidth,
    haloSize,
  ) => {
    const layer = new ScatterplotLayer({
      id: "selection-halos",
      data: selectedNodes,
      getPosition: (node) => [ node.x, node.y ],
      getRadius: (node) => {
        let size = haloSize.leaf;
        if (!node.isLeaf) {
          if (node.isCollapsed) {
            size = node.size + 10;
          }
          else {
            size = haloSize.internal;
          }
        }
        return size;
      },
      getLineWidth: haloWidth,
      getLineColor: highlightColour,
      filled: false,
      stroked: true,
      radiusUnits: "pixels",
      lineWidthUnits: "pixels",
      visible: false,
    });
    return layer;
  }
);
