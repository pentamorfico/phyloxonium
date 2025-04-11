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

/* eslint-disable quote-props */

export default {
  "addLayer": require("./add-layer").default,
  "ascendingNodeOrder": require("./ascending-node-order").default,
  "branchZoomingAxis": require("./branch-zooming-axis").default,
  "collapseNode": require("./collapse-node").default,
  "descendingNodeOrder": require("./descending-node-order").default,
  "destroy": require("./destroy").default,
  "exportJSON": require("./export-json").default,
  "exportNewick": require("./export-newick").default,
  "exportPNG": require("./export-png").default,
  "exportSVG": require("./export-svg").default,
  "findNodeById": require("./find-node-by-id").default,
  "fitInCanvas": require("./fit-in-canvas").default,
  "getAlignLeafLabels": require("./get-align-leaf-labels").default,
  "getBlockHeaderFontSize": require("./get-block-header-font-size").default,
  "getBlockPadding": require("./get-block-padding").default,
  "getBlockSize": require("./get-block-size").default,
  "getBranchScale": require("./get-branch-scale").default,
  "getBranchZoom": require("./get-branch-zoom").default,
  "getCanvasCentrePoint": require("./get-canvas-centre-point").default,
  "getCanvasSize": require("./get-canvas-size").default,
  "getDrawingArea": require("./get-drawing-area").default,
  "getFillColour": require("./get-fill-colour").default,
  "getFontFamily": require("./get-font-family").default,
  "getFontSize": require("./get-font-size").default,
  "getGraphAfterLayout": require("./get-graph-after-layout").default,
  "getGraphBeforeLayout": require("./get-graph-before-layout").default,
  "getGraphWithoutLayout": require("./get-graph-without-layout").default,
  "getGraphWithStyles": require("./get-graph-with-styles").default,
  "getHighlightedNode": require("./get-highlighted-node").default,
  "getMaxScale": require("./get-max-scale").default,
  "getMaxZoom": require("./get-max-zoom").default,
  "getMetadataColumnWidth": require("./get-metadata-column-width").default,
  "getMinScale": require("./get-min-scale").default,
  "getMinZoom": require("./get-min-zoom").default,
  "getNodeSize": require("./get-node-size").default,
  "getPadding": require("./get-padding").default,
  "getPixelOffsets": require("./get-pixel-offsets").default,
  "getScale": require("./get-scale").default,
  "getShowShapes": require("./get-show-shapes").default,
  "getStepScale": require("./get-step-scale").default,
  "getStepZoom": require("./get-step-zoom").default,
  "getStepZoomingAxis": require("./get-step-zooming-axis").default,
  "getStrokeColour": require("./get-stroke-colour").default,
  "getStrokeWidth": require("./get-stroke-width").default,
  "getTreeType": require("./get-tree-type").default,
  "getView": require("./get-view").default,
  "getWorldBounds": require("./get-world-bounds").default,
  "getZoom": require("./get-zoom").default,
  "handleClick": require("./handle-click").default,
  "handleHover": require("./handle-hover").default,
  "hasLeafLabels": require("./has-leaf-labels").default,
  "hasMetadata": require("./has-metadata").default,
  "hasMetadataHeaders": require("./has-metadata-headers").default,
  "hasMetadataLabels": require("./has-metadata-labels").default,
  "highlightNode": require("./highlight-node").default,
  "importJSON": require("./import-json").default,
  "init": require("./init").default,
  "isCanvasPointOnScreen": require("./is-canvas-point-on-screen").default,
  "isOrthogonal": require("./is-orthogonal").default,
  "isTreePointOnScreen": require("./is-tree-point-on-screen").default,
  "midpointRoot": require("./midpoint-root").default,
  "pickNodeAtCanvasPoint": require("./pick-node-at-canvas-point").default,
  "pickNodeFromLayer": require("./pick-node-from-layer").default,
  "projectPoint": require("./project-point").default,
  "render": require("./render").default,
  "rerootNode": require("./reroot-node").default,
  "resize": require("./resize").default,
  "resume": require("./resume").default,
  "rotateNode": require("./rotate-node").default,
  "selectLeafNodes": require("./select-leaf-nodes").default,
  "selectNode": require("./select-node").default,
  "setBranchZoom": require("./set-branch-zoom").default,
  "setProps": require("./set-props").default,
  "setRoot": require("./set-root").default,
  "setScale": require("./set-scale").default,
  "setSource": require("./set-source").default,
  "setStepZoom": require("./set-step-zoom").default,
  "setTooltip": require("./set-tooltip").default,
  "setTreeType": require("./set-tree-type").default,
  "setView": require("./set-view").default,
  "setZoom": require("./set-zoom").default,
  "suspend": require("./suspend").default,
  "unprojectPoint": require("./unproject-point").default,
};
