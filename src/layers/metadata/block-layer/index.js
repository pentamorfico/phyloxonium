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

import GL from "@luma.gl/constants";
import { Model, Geometry } from "@luma.gl/core";

import fs from "./scatterplot-layer-fragment.glsl";
import vs from "./scatterplot-layer-vertex.glsl";

export default class BlockLayer extends ScatterplotLayer {

  getShaders(id) {
    return {
      ...super.getShaders(),
      fs,
      vs,
    };
  }

  initializeState() {
    super.initializeState();
    const attributeManager = this.getAttributeManager();

    attributeManager.addInstanced({
      instanceAngles: {
        size: 1,
        transition: true,
        accessor: "getAngle",
      },
      instancePixelOffset: {
        size: 2,
        transition: true,
        accessor: "getPixelOffset",
      },
    });
  }

  draw({ uniforms }) {
    const {
      maxSizeRatio,
    } = this.props;

    this.state.model
      .setUniforms({ maxSizeRatio });

    super.draw({ uniforms });
  }

  _getModel(gl) {
    // a square that minimally cover the unit circle
    const positions = [ -1, -1, -1, 1, 1, 1, 1, -1 ];

    return new Model(
      gl,
      {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new Geometry({
          drawMode: GL.TRIANGLE_FAN,
          // vertexCount: 4,
          attributes: {
            // The size must be explicitly passed here otherwise luma.gl
            // will default to assuming that positions are 3D (x,y,z)
            positions: {
              size: 2,
              value: new Float32Array(positions),
            },
          },
        }),
        isInstanced: true,
      }
    );
  }

}

BlockLayer.defaultProps = {
  getAngle: { type: "accessor", value: 0 },
  getPixelOffset: { type: "accessor", value: [0, 0] },
};

BlockLayer.componentName = "BlockLayer";
