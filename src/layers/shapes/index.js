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

import { CompositeLayer } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import memoise from "@utils/memoise";
import borderColourMemo from "./border-colour";
import shapeBorderWidthMemo from "./shape-border-width";
import visibleLeafNodesMemo from "./visible-leaf-nodes";
import { CollisionFilterExtension } from "@deck.gl/extensions";

import ShapesLayer from "./shapes-layer";

import generateIconAtlasMapping from "./icon-atlas-generator";

const getIcon = (node) => !node.fillColour.isTransparent && node.shape;
const getPosition = (node) => [ node.x, node.y ];
const getColor = (node) => node.fillColour;

export default () => memoise(
  visibleLeafNodesMemo,
  (tree) => tree.getNodeSize(),
  (tree) => tree.props.showShapeBorders,
  shapeBorderWidthMemo,
  borderColourMemo,
  (
    leafNodes,
    nodeSize,
    showShapeBorders,
    shapeBorderWidth,
    borderColour,
  ) => {
    const { image, mapping } = generateIconAtlasMapping();

    const layer = new ShapesLayer({
      id: "shapes",
      data: leafNodes,
      iconAtlas: image,
      iconMapping: mapping,
      getIcon,
      getPosition,
      getSize: nodeSize,
      getColor,
      showBorders: showShapeBorders,
      borderColour,
      borderSizeScale: 1 + ((2 * shapeBorderWidth) / nodeSize),
      updateTriggers: { getSize: nodeSize },
    });

    return layer;
  }
);
