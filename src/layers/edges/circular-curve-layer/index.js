// src/layers/edges/circular-curve-layer/CircularArcLayer.js

import {Layer, project32, picking} from '@deck.gl/core';
import {GL} from '@luma.gl/constants';
import {Model, Geometry} from '@luma.gl/engine';

// These are your GLSL shader files (import or inline them as needed)
import vs from './circular-curve-layer-vertex.glsl';
import fs from './circular-curve-layer-fragment.glsl';

// How many straight segments to approximate each arc
const NUM_SEGMENTS = 40;
const DEFAULT_COLOR = [0, 0, 0, 255];

const defaultProps = {
  // IMPORTANT: pickable=false ensures no picking pass is invoked
  // If you absolutely need picking/hover, set pickable=true
  // (but that can cause early "hover" passes before gl is ready)
  pickable: false,

  strokeWidth: {type: 'number', min: 0, value: 1},
  getCentrePoint: {type: 'accessor', value: d => d.centrePoint},
  getEndAngle: {type: 'accessor', value: d => d.endAngle},
  getStartAngle: {type: 'accessor', value: d => d.startAngle},
  getRadius: {type: 'accessor', value: d => d.radius},
  getColor: {type: 'accessor', value: DEFAULT_COLOR}
};

export default class CircularArcLayer extends Layer {
  /**
   * Provide your vertex & fragment shaders + the standard modules
   */
  getShaders() {
    return {
      vs,
      fs,
      modules: [project32, picking]  // project32 for 32-bit coords, picking for highlight color
    };
  }

  /**
   * Initialize deck.gl "attributeManager" for instanced attributes
   * BUT do not create the luma.gl Model yet (gl may not exist).
   */
  initializeState() {
    const attributeManager = this.getAttributeManager();

    attributeManager.addInstanced({
      instanceCentrePoints: {
        size: 3,
        accessor: 'getCentrePoint'
      },
      instanceColors: {
        size: 4,
        accessor: 'getColor',
        defaultValue: DEFAULT_COLOR
      },
      instanceRadius: {
        size: 1,
        accessor: 'getRadius',
        defaultValue: 1
      },
      instanceStartAngle: {
        size: 1,
        accessor: 'getStartAngle',
        defaultValue: 0
      },
      instanceEndAngle: {
        size: 1,
        accessor: 'getEndAngle',
        defaultValue: 0
      }
    });

    // We will lazily create the Model in draw() so we don't crash if gl isn't ready
    this.setState({ model: null });
  }

  /**
   * If deck.gl detects an extension change, we must rebuild the Model
   */
  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});

    if (changeFlags.extensionsChanged && this.state.model) {
      this.state.model.delete();
      this.setState({ model: null });
    }
  }

  /**
   * Called each time deck.gl attempts to draw the layer.
   * If we haven't built the Model yet, we do so here (once gl is ready).
   */
  draw({uniforms}) {
    let { model } = this.state;
    if (!model) {
      // Attempt to build a Model only now
      const { gl } = this.context;
      model = this._getModel(gl);
      // If gl is somehow still null, skip safely
      if (!model) return;

      this.setState({ model });
    }

    // supply strokeWidth, and any other uniforms
    model.setUniforms({
      ...uniforms,
      strokeWidth: this.props.strokeWidth
    });

    model.draw();
  }

  /**
   * Helper to create the luma.gl Model
   */
  _getModel(gl) {
    if (!gl) {
      // This means deck.gl tried to draw before we truly have a GL context
      // We'll skip building. We'll retry in a subsequent draw pass
      return null;
    }

    // Build a geometry with (NUM_SEGMENTS+1) * 2 vertices, e.g.:
    //   i, -1, 0
    //   i,  1, 0
    // so the shader can position them as a triangle strip forming arcs
    const positions = [];
    for (let i = 0; i <= NUM_SEGMENTS; i++) {
      positions.push(i, -1, 0);
      positions.push(i, 1, 0);
    }

    const geometry = new Geometry({
      drawMode: GL.TRIANGLE_STRIP,
      attributes: {
        positions: {
          size: 3,
          value: new Float32Array(positions)
        }
      }
    });

    const model = new Model(gl, {
      id: `${this.props.id || this.id}-arc-model`,
      geometry,
      vs: this.getShaders().vs,
      fs: this.getShaders().fs,
      modules: this.getShaders().modules,
      isInstanced: true
    });

    // We'll pass this uniform to the vertex shader
    model.setUniforms({ numSegments: NUM_SEGMENTS });
    return model;
  }
}

CircularArcLayer.layerName = 'CircularArcLayer';
CircularArcLayer.defaultProps = defaultProps;
