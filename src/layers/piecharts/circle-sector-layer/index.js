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

class CircleSectorLayer extends ScatterplotLayer {
  getShaders(id) {
    return {
      ...super.getShaders(),
      inject: {
        "vs:#decl": `
          attribute float instanceStartAngle;
          attribute float instanceEndAngle;
          varying float startAngle;
          varying float endAngle;
        `,
        "vs:#main-start": `
          startAngle = instanceStartAngle ;
          endAngle = instanceEndAngle ;
      `,
        "fs:#decl": `
          varying float startAngle;
          varying float endAngle;
      `,
        "fs:DECKGL_FILTER_COLOR": `
          float angle = atan(-geometry.uv.x, geometry.uv.y) + 3.1415926535897932384626433832795;
          if (angle < startAngle || angle > endAngle) {
            discard;
          }
        `,
      },
    };
  }

  initializeState() {
    super.initializeState();
    this.getAttributeManager().addInstanced({
      instanceStartAngle: {
        size: 1,
        transition: true,
        accessor: "getStartAngle",
        defaultValue: 1,
      },
      instanceEndAngle: {
        size: 1,
        transition: true,
        accessor: "getEndAngle",
        defaultValue: 1,
      },
    });
  }
}
CircleSectorLayer.componentName = "CircleSectorLayer";

export default CircleSectorLayer;
