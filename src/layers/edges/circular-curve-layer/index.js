// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import { PathLayer } from "@deck.gl/layers";

export default class CircularCurveLayer extends PathLayer {
  static layerName = 'CircularCurveLayer';

  static defaultProps = {
    ...PathLayer.defaultProps,
    // Modern units configuration
    widthUnits: 'pixels',
    widthScale: 1,
    widthMinPixels: 0,
    widthMaxPixels: Number.MAX_SAFE_INTEGER,
    billboard: true,
    capRounded: true,
    jointRounded: true,
    
    // Curve properties
    numSegments: { type: 'number', min: 2, value: 60 },
    
    // Curve parameter accessors
    getCentrePoint: { type: 'accessor', value: [0, 0] },
    getRadius: { type: 'accessor', value: 100 },
    getStartAngle: { type: 'accessor', value: 0 },
    getEndAngle: { type: 'accessor', value: Math.PI / 2 }
  };

  getPathGeometry(object) {
    const centerPoint = this.props.getCentrePoint(object);
    const radius = this.props.getRadius(object);
    const startAngle = this.props.getStartAngle(object);
    const endAngle = this.props.getEndAngle(object);
    const { numSegments } = this.props;

    // Generate points along the arc
    const points = [];
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      const angle = startAngle + t * (endAngle - startAngle);
      points.push([
        centerPoint[0] + radius * Math.cos(angle),
        centerPoint[1] + radius * Math.sin(angle)
      ]);
    }
    
    return points;
  }

  _getModel(gl) {
    return super._getModel(gl);
  }
}