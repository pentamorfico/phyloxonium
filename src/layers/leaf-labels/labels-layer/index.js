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

import { TextLayer, LineLayer } from "@deck.gl/layers";
import { CompositeLayer } from "@deck.gl/core";

import nodeAngleInDegrees from "../../../utils/node-angle-in-degrees";

function getTextAnchor(datum) {
  return (datum.inverted) ? "end" : "start";
}

function getText(datum) {
  return datum.label;
}

function getNodePosition(node) {
  return [
    node.x,
    node.y,
  ];
}

export default class LeafLabelsLayer extends CompositeLayer {

  renderLayers() {
    const layers = [
      new TextLayer({
        id: "leaf-labels-text",
        data: this.props.data,
        getSize: this.props.fontSize,
        getPosition: this.props.getTextPosition,
        getText,
        getAngle: nodeAngleInDegrees,
        getColor: this.props.fontColour,
        fontFamily: this.props.fontFamily,
        getTextAnchor,
        backgroundColor: this.props.backgroundColour,
        updateTriggers: { getPosition: this.props.updateTriggers.getTextPosition },
        pickable: true,
      }),
    ];

    if (this.props.highlightedNode) {
      layers.push(
        new TextLayer({
          id: "leaf-labels-highlight",
          data: [ this.props.highlightedNode ],
          getSize: this.props.fontSize,
          getPosition: this.props.getTextPosition,
          getText,
          getAngle: nodeAngleInDegrees,
          getColor: this.props.highlightColour,
          fontFamily: this.props.fontFamily,
          getTextAnchor,
          backgroundColor: this.props.backgroundColour,
        })
      );
    }

    if (this.props.alignLeafLabels) {
      layers.push(
        new LineLayer({
          id: "leaf-labels-lines",
          data: this.props.data,
          getSourcePosition: this.props.getTextPosition,
          getTargetPosition: getNodePosition,
          getColor: this.props.lineColour,
          getWidth: this.props.lineWidth,
          opacity: 0.54,
          updateTriggers: { getSourcePosition: this.props.updateTriggers.getTextPosition },
        })
      );
    }

    return layers;
  }

}

LeafLabelsLayer.componentName = "LeafLabelsLayer";

LeafLabelsLayer.defaultProps = {
  // Shared accessors
  alignLeafLabels: false,
  getTextPosition: { type: "accessor", value: (node) => [ node.x, node.y ] },

  // text accessors
  fontSize: 16,
  fontFamily: "Monaco, monospace",
  fontColour: [ 0, 0, 0, 255 ],

  // line properties
  lineWidth: 1,
  lineColour: [ 0, 0, 0, 255 ],
};
