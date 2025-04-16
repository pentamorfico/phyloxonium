// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

export default `\
#version 300 es
#define SHADER_NAME circular-curve-layer-vertex-shader
#define TWO_PI radians(360.0)

// Attributes
in vec3 positions;
in vec3 instanceCentrePoints;
in vec4 instanceColors;
in vec3 instancePickingColors;
in float instanceRadius;
in float instanceStartAngle;
in float instanceEndAngle;

// Uniforms
uniform float numSegments;
uniform float strokeWidth;
uniform float opacity;

// Varyings
out vec4 vColor;

// Offset vector by strokeWidth pixels
// offset_direction is -1 (left) or 1 (right)
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // Normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);
  // Rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  vec2 offset_screenspace = dir_screenspace * offset_direction * strokeWidth / 2.0;
  vec2 offset_clipspace = project_pixel_size_to_clipspace(offset_screenspace).xy;

  return offset_clipspace;
}

float getSegmentRatio(float index) {
  return smoothstep(0.0, 1.0, index / numSegments);
}

vec4 computeArcCurve(vec3 centrePoint, float radius, float startAngle, float arcAngle, float segmentRatio) {  
  float angle = startAngle + (arcAngle * segmentRatio);

  vec3 instancePoint = vec3(
    centrePoint.x + (cos(angle) * radius),
    centrePoint.y + (sin(angle) * radius),
    0.0
  );

  vec3 pointPos = project_position(instancePoint);
  vec4 point = project_common_position_to_clipspace(vec4(pointPos, 1.0));

  return point;
}

void main(void) {
  float arcAngle = (instanceEndAngle > instanceStartAngle) ? 
    (instanceEndAngle - instanceStartAngle) : 
    (TWO_PI + (instanceEndAngle - instanceStartAngle));

  // Linear interpolation of source & target to pick the right coordinate
  float segmentIndex = positions.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  vec4 p = computeArcCurve(instanceCentrePoints, instanceRadius, instanceStartAngle, arcAngle, segmentRatio);

  // Next point
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  vec4 nextP = computeArcCurve(instanceCentrePoints, instanceRadius, instanceStartAngle, arcAngle, nextSegmentRatio);

  // Extrude
  float direction = float(positions.y);
  direction = indexDir * direction;
  vec2 offset = getExtrusionOffset(nextP.xy - p.xy, direction);

  gl_Position = p + vec4(offset, 0.0, 0.0);

  // Color
  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.0;

  // Set color to be rendered to picking FBO (also used to check for selection highlight).
  picking_setPickingColor(instancePickingColors);
}
`;
