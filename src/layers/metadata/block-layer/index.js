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
import { Model } from "@luma.gl/engine";
import fs from "./scatterplot-layer-fragment.glsl";
import vs from "./scatterplot-layer-vertex.glsl";

export default class BlockLayer extends ScatterplotLayer {
  static get componentName() {
    return 'BlockLayer';
  }

  getShaders() {
    return {
      ...super.getShaders(),
      fs,
      vs,
      modules: [
        ...super.getShaders().modules || [],
        {
          name: 'block-layer',
          fs: `
            varying float startAngle;
            varying float endAngle;
          `,
          vs: `
            attribute float instanceStartAngle;
            attribute float instanceEndAngle;
            varying float startAngle;
            varying float endAngle;

            void DECKGL_MUTATE_VS_CODE(inout vec4 position) {
              startAngle = instanceStartAngle;
              endAngle = instanceEndAngle;
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
      instanceAngles: {
        size: 1,
        accessor: "getAngle",
        defaultValue: 0
      },
      instancePixelOffset: {
        size: 2,
        accessor: "getPixelOffset",
        defaultValue: [0, 0]
      }
    });
  }

  draw(params) {
    const { uniforms } = params;
    const { maxSizeRatio } = this.props;

    super.draw({
      ...params,
      uniforms: {
        ...uniforms,
        maxSizeRatio
      }
    });
  }
}

BlockLayer.defaultProps = {
  getAngle: { type: "accessor", value: 0 },
  getPixelOffset: { type: "accessor", value: [0, 0] }
};
