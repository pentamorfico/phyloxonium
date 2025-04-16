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

import addLayer from "./add-layer";
import ascendingNodeOrder from "./ascending-node-order";
import branchZoomingAxis from "./branch-zooming-axis";
import collapseNode from "./collapse-node";
import descendingNodeOrder from "./descending-node-order";
import destroy from "./destroy";
import exportJSON from "./export-json";
import exportNewick from "./export-newick";
import exportPNG from "./export-png";
import exportSVG from "./export-svg";
import findNodeById from "./find-node-by-id";
import fitInCanvas from "./fit-in-canvas";
import getAlignLeafLabels from "./get-align-leaf-labels";
import getBlockHeaderFontSize from "./get-block-header-font-size";
import getBlockPadding from "./get-block-padding";
import getBlockSize from "./get-block-size";
import getBranchScale from "./get-branch-scale";
import getBranchZoom from "./get-branch-zoom";
import getCanvasCentrePoint from "./get-canvas-centre-point";
import getCanvasSize from "./get-canvas-size";
import getDrawingArea from "./get-drawing-area";
import getFillColour from "./get-fill-colour";
import getFontFamily from "./get-font-family";
import getFontSize from "./get-font-size";
import getGraphAfterLayout from "./get-graph-after-layout";
import getGraphBeforeLayout from "./get-graph-before-layout";
import getGraphWithoutLayout from "./get-graph-without-layout";
import getGraphWithStyles from "./get-graph-with-styles";
import getHighlightedNode from "./get-highlighted-node";
import getMaxScale from "./get-max-scale";
import getMaxZoom from "./get-max-zoom";
import getMetadataColumnWidth from "./get-metadata-column-width";
import getMinScale from "./get-min-scale";
import getMinZoom from "./get-min-zoom";
import getNodeSize from "./get-node-size";
import getPadding from "./get-padding";
import getPixelOffsets from "./get-pixel-offsets";
import getScale from "./get-scale";
import getShowShapes from "./get-show-shapes";
import getStepScale from "./get-step-scale";
import getStepZoom from "./get-step-zoom";
import getStepZoomingAxis from "./get-step-zooming-axis";
import getStrokeColour from "./get-stroke-colour";
import getStrokeWidth from "./get-stroke-width";
import getTreeType from "./get-tree-type";
import getView from "./get-view";
import getWorldBounds from "./get-world-bounds";
import getZoom from "./get-zoom";
import handleClick from "./handle-click";
import handleHover from "./handle-hover";
import hasLeafLabels from "./has-leaf-labels";
import hasMetadata from "./has-metadata";
import hasMetadataHeaders from "./has-metadata-headers";
import hasMetadataLabels from "./has-metadata-labels";
import highlightNode from "./highlight-node";
import importJSON from "./import-json";
import init from "./init";
import isCanvasPointOnScreen from "./is-canvas-point-on-screen";
import isOrthogonal from "./is-orthogonal";
import isTreePointOnScreen from "./is-tree-point-on-screen";
import midpointRoot from "./midpoint-root";
import pickNodeAtCanvasPoint from "./pick-node-at-canvas-point";
import pickNodeFromLayer from "./pick-node-from-layer";
import projectPoint from "./project-point";
import render from "./render";
import rerootNode from "./reroot-node";
import resize from "./resize";
import resume from "./resume";
import rotateNode from "./rotate-node";
import selectLeafNodes from "./select-leaf-nodes";
import selectNode from "./select-node";
import setBranchZoom from "./set-branch-zoom";
import setProps from "./set-props";
import setRoot from "./set-root";
import setScale from "./set-scale";
import setSource from "./set-source";
import setStepZoom from "./set-step-zoom";
import setTooltip from "./set-tooltip";
import setTreeType from "./set-tree-type";
import setView from "./set-view";
import setZoom from "./set-zoom";
import suspend from "./suspend";
import unprojectPoint from "./unproject-point";

export {
  addLayer,
  ascendingNodeOrder,
  branchZoomingAxis,
  collapseNode,
  descendingNodeOrder,
  destroy,
  exportJSON,
  exportNewick,
  exportPNG,
  exportSVG,
  findNodeById,
  fitInCanvas,
  getAlignLeafLabels,
  getBlockHeaderFontSize,
  getBlockPadding,
  getBlockSize,
  getBranchScale,
  getBranchZoom,
  getCanvasCentrePoint,
  getCanvasSize,
  getDrawingArea,
  getFillColour,
  getFontFamily,
  getFontSize,
  getGraphAfterLayout,
  getGraphBeforeLayout,
  getGraphWithoutLayout,
  getGraphWithStyles,
  getHighlightedNode,
  getMaxScale,
  getMaxZoom,
  getMetadataColumnWidth,
  getMinScale,
  getMinZoom,
  getNodeSize,
  getPadding,
  getPixelOffsets,
  getScale,
  getShowShapes,
  getStepScale,
  getStepZoom,
  getStepZoomingAxis,
  getStrokeColour,
  getStrokeWidth,
  getTreeType,
  getView,
  getWorldBounds,
  getZoom,
  handleClick,
  handleHover,
  hasLeafLabels,
  hasMetadata,
  hasMetadataHeaders,
  hasMetadataLabels,
  highlightNode,
  importJSON,
  init,
  isCanvasPointOnScreen,
  isOrthogonal,
  isTreePointOnScreen,
  midpointRoot,
  pickNodeAtCanvasPoint,
  pickNodeFromLayer,
  projectPoint,
  render,
  rerootNode,
  resize,
  resume,
  rotateNode,
  selectLeafNodes,
  selectNode,
  setBranchZoom,
  setProps,
  setRoot,
  setScale,
  setSource,
  setStepZoom,
  setTooltip,
  setTreeType,
  setView,
  setZoom,
  suspend,
  unprojectPoint,
};
