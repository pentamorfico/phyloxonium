// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import { PathLayer } from "@deck.gl/layers";

export default class CircularCurveLayer extends PathLayer {
  static layerName = 'CircularCurveLayer';

  
  static defaultProps = {
    ...PathLayer.defaultProps,
    widthUnits: 'pixels',
    widthScale: 1,
    widthMinPixels: 1,
    widthMaxPixels: Number.MAX_SAFE_INTEGER,

    // Curve properties
    numSegments: { type: 'number', min: 2, value: 60 },

    // Curve parameter accessors
    getCentrePoint: { type: 'accessor', value: [0, 0] },
    getRadius: { type: 'accessor', value: 100 },
    getStartAngle: { type: 'accessor', value: 0 },
    getEndAngle: { type: 'accessor', value: Math.PI / 2 }
  };

  getPath(object) {
    const { getCentrePoint, getRadius, getStartAngle, getEndAngle, numSegments } = this.props;
    const centerPoint = getCentrePoint(object);
    const radius = getRadius(object);
    const startAngle = getStartAngle(object);
    const endAngle = getEndAngle(object);

    const points = [];
    const deltaAngle = (endAngle - startAngle) / numSegments;

    for (let i = 0; i <= numSegments; i++) {
      const angle = startAngle + deltaAngle * i;
      points.push([
        centerPoint[0] + radius * Math.cos(angle),
        centerPoint[1] + radius * Math.sin(angle)
      ]);
    }

    return points;
  }
}
