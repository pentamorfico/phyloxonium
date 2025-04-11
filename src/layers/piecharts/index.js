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

import defaults from "../../defaults";

import memoise from "../../utils/memoise";

import borderColourMemo from "../shapes/border-colour";
import slicesDataMemo from "./slices-data";

import CircleSectorLayer from "./circle-sector-layer";

export default () => memoise(
  slicesDataMemo,
  (tree) => tree.getNodeSize(),
  (tree) => tree.props.showShapeBorders,
  (tree) => tree.props.shapeBorderWidth ?? defaults.shapeBorderWidth,
  borderColourMemo,
  (tree) => tree.getScale(),
  (
    slicesData,
    nodeSize,
    showShapeBorders,
    shapeBorderWidth,
    borderColour,
    scale,
  ) => {
    const nodeRadius = nodeSize / 2;

    const layer = new CircleSectorLayer({
      id: "piecharts",
      data: slicesData,
      getLineColor: borderColour,
      getLineWidth: showShapeBorders ? shapeBorderWidth : 0,
      getPosition: (slice) => [ slice.node.x, slice.node.y ],
      getFillColor: (slice) => slice.colour,
      getCentrePoint: (edge) => [ edge.rootX, edge.rootY ],
      getRadius: (slice) => nodeRadius + (slice.node.ratio * nodeRadius),
      getStartAngle: (edge) => edge.startAngle,
      getEndAngle: (edge) => edge.endAngle,
      pickable: true,
      radiusUnits: "pixels",
    });

    return layer;
  }
);
