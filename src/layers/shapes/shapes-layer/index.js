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

import { IconLayer } from "@deck.gl/layers";
import { CompositeLayer } from "@deck.gl/core";
import { CollisionFilterExtension } from "@deck.gl/extensions";

export default class ShapesLayer extends CompositeLayer {
  static get componentName() {
    return "ShapesLayer";
  }

  renderLayers() {
    return [
      // new IconLayer({
      //   id: "shapes-border",
      //   data: this.props.data,
      //   pickable: false,
      //   iconAtlas: this.props.iconAtlas,
      //   iconMapping: this.props.iconMapping,
      //   getIcon: this.props.getIcon,
      //   getPosition: this.props.getPosition,
      //   getSize: this.props.getSize,
      //   sizeScale: this.props.borderSizeScale,
      //   getColor: this.props.borderColour,
      //   visible: this.props.showBorders,
      //   updateTriggers: { getSize: this.props.getSize },

      // }),

      new IconLayer({
        id: "shapes-fill",
        data: this.props.data,
        pickable: true,
        iconAtlas: this.props.iconAtlas,
        iconMapping: this.props.iconMapping,
        getIcon: this.props.getIcon,
        getPosition: this.props.getPosition,
        getSize: this.props.getSize,
        getColor: this.props.getColor,
        updateTriggers: { getSize: this.props.getSize },
        stroked: true,
        extensions: [new CollisionFilterExtension()],
        collisionGroup: "shapes",
        sizeUnits: "meters",
        sizeMinPixels: 1,
        sizeMaxPixels: 9,
        autoHighlight: true,

        

      }),
    ];
  }
}

ShapesLayer.defaultProps = {
  // Shared accessors
  iconAtlas: { type: "object", value: null },
  iconMapping: { type: "object", value: {}, async: true },
  getPosition: { type: "accessor", value: (node) => [ node.x, node.y ] },
  getIcon: { type: "accessor", value: (x) => x.shape },
  getColor: { type: "accessor", value: (x) => x.fillColour },

  // shape accessors
  getSize: { type: "accessor", value: 1 },

  // border properties
  showBorders: false,
  borderColor: [ 0, 0, 0 ],
  borderSizeScale: 1,
};
