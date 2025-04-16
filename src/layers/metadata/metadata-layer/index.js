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
import { CompositeLayer } from "@deck.gl/core";

import iconAtlas from "@layers/shapes/icon-atlas-generator";

import BlockLayer from "../block-layer";

const highlightColor = [ 0, 0, 0, 64 ];

export default class MetadataLayer extends CompositeLayer {
  static get componentName() {
    return 'MetadataLayer';
  }

  renderLayers() {
    return [
      new BlockLayer({
        autoHighlight: true,
        data: this.props.blocks,
        getAngle: (datum) => datum.node.angleDegrees,
        getColor: (datum) => datum.colour,
        getFillColor: (datum) => datum.colour,
        getIcon: () => "square",
        getPixelOffset: this.props.getPixelOffset,
        getRadius: this.props.blockSize / 2,
        maxSizeRatio: (!this.props.isOrthogonal || (this.props.stepSize > this.props.blockSize)) ? 1.0 : (this.props.stepSize / this.props.blockSize),
        highlightColor,
        iconAtlas: iconAtlas.image,
        iconMapping: iconAtlas.mapping,
        id: "metadata-blocks",
        pickable: true,
        radiusUnits: "pixels",
        updateTriggers: { getPixelOffset: this.props.getPixelOffset },
      }),
      new TextLayer({
        data: this.props.headers,
        fontFamily: this.props.fontFamily,
        getAngle: (datum) => datum.angle,
        getColor: this.props.fontColour,
        getPixelOffset: this.props.getPixelOffset,
        getSize: this.props.fontSize,
        getTextAnchor: (datum) => (datum.inverted ? "end" : "start"),
        id: "metadata-headers",
        updateTriggers: { getPixelOffset: this.props.getPixelOffset },
        visible: this.props.hasHeaders,
      }),
    ];
  }
}
