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
  static get componentName() {
    return 'CircleSectorLayer';
  }

  getShaders() {
    return {
      ...super.getShaders(),
      modules: [
        ...super.getShaders().modules || [],
        {
          name: 'circle-sector',
          vs: `
            attribute float instanceStartAngle;
            attribute float instanceEndAngle;
            varying float startAngle;
            varying float endAngle;

            void DECKGL_MUTATE_VS_CODE(inout vec4 position) {
              startAngle = instanceStartAngle;
              endAngle = instanceEndAngle;
            }
          `,
          fs: `
            varying float startAngle;
            varying float endAngle;

            void DECKGL_MUTATE_FS_COLOR(inout vec4 color) {
              float angle = atan(-geometry.uv.x, geometry.uv.y) + 3.1415926535897932384626433832795;
              if (angle < startAngle || angle > endAngle) {
                discard;
              }
            }
          `
        }
      ]
    };
  }

  initializeState() {
    super.initializeState();
    const attributeManager = this.getAttributeManager();

    attributeManager.add({
      instanceStartAngle: {
        size: 1,
        accessor: 'getStartAngle',
        defaultValue: 0
      },
      instanceEndAngle: {
        size: 1,
        accessor: 'getEndAngle',
        defaultValue: Math.PI * 2
      }
    });
  }
}

CircleSectorLayer.defaultProps = {
  ...ScatterplotLayer.defaultProps,
  getStartAngle: { type: 'accessor', value: 0 },
  getEndAngle: { type: 'accessor', value: Math.PI * 2 }
};

export default CircleSectorLayer;
