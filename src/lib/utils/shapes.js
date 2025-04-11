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

/* eslint-disable dot-notation */

import { Angles } from "../constants";

function regularPolygonPath(sides, x = 0, y = 0, size = 1) {
  const baseAngle = Angles.Degrees270;
  const angle = Angles.Degrees360 / sides;
  const path = [];
  for (let index = 0; index <= sides; index += 1) {
    path.push([
      x + size * Math.cos(baseAngle + index * angle),
      y + size * Math.sin(baseAngle + index * angle),
    ]);
  }
  path.push(path[0]);
  return path;
}

function starPolygonPath(spikes = 5, x = 0, y = 0, size = 1) {
  const outerRadius = size;
  const innerRadius = outerRadius * 0.5;
  const step = Math.PI / spikes;
  const path = [];

  let rot = Math.PI / 2 * 3;
  path.push([ x, y - outerRadius ]);
  for (let i = 0; i < spikes; i++) {
    path.push([ x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius ]);
    rot += step;
    path.push([ x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius ]);
    rot += step;
  }
  path.push([ x, y - outerRadius ]);
  return path;
}

function rotateShape(shapeDef, degrees = 180) {
  return {
    renderCanvas(x, y, radius, ctx) {
      ctx.rotate((degrees / 180) * Angles.Degrees180);
      return shapeDef.renderCanvas(x, y, radius, ctx);
    },
    renderSvg(x, y, radius, attributes) {
      return shapeDef.renderSvg(
        x,
        y,
        radius,
        `transform="rotate(${degrees},${x},${y})" ${attributes}`,
      );
    },
  };
}

function createPathShape(path) {
  return {
    renderCanvas(x, y, size, ctx) {
      ctx.moveTo(
        x + size * path[0][0],
        y + size * path[0][1],
      );
      for (let index = 0; index < path.length; index++) {
        const point = path[index];
        if (point === null) {
          ctx.moveTo(
            x + size * path[index + 1][0],
            y + size * path[index + 1][1],
          );
        }
        else {
          ctx.lineTo(
            x + size * point[0],
            y + size * point[1],
          );
        }
      }
    },
    renderSvg(x, y, size, attributes) {
      const points = [];
      points.push(`M ${x + size * path[0][0]},${y + size * path[0][1]}`);
      for (let index = 0; index < path.length; index++) {
        const point = path[index];
        if (point === null) {
          points.push(`M ${x + size * path[index + 1][0]},${y + size * path[index + 1][1]}`);
        }
        else {
          points.push(`L ${x + size * point[0]},${y + size * point[1]}`);
        }
      }
      return `<path d="${points.join(" ")}Z" ${attributes} />`;
    },
  };
}

const shapes = {};

shapes["circle"] = {
  renderCanvas(x, y, radius, ctx) {
    ctx.arc(x, y, radius, Angles.Degrees0, Angles.Degrees360);
  },
  renderSvg(x, y, radius, attributes) {
    return `<circle cx="${x}" cy="${y}" r="${radius}" ${attributes} />`;
  },
};

shapes["diamond"] = createPathShape(regularPolygonPath(4));

shapes["dot"] = {
  renderCanvas(x, y, radius, ctx) {
    ctx.arc(x, y, radius / 8, Angles.Degrees0, Angles.Degrees360);
  },
  renderSvg(x, y, radius, attributes) {
    return `<circle cx="${x}" cy="${y}" r="${radius / 8}" ${attributes} />`;
  },
};

shapes["heptagon"] = createPathShape(regularPolygonPath(7));

shapes["heptagon-inverted"] = rotateShape(shapes["heptagon"]);

shapes["heptagram"] = createPathShape(starPolygonPath(7));

shapes["heptagram-inverted"] = rotateShape(shapes["heptagram"]);

shapes["hexagon"] = createPathShape(regularPolygonPath(6));

shapes["hexagram"] = createPathShape(starPolygonPath(6));

shapes["octagon"] = createPathShape(regularPolygonPath(8));

shapes["octagram"] = createPathShape(starPolygonPath(8));

shapes["pentagon"] = createPathShape(regularPolygonPath(5));

shapes["pentagon-inverted"] = rotateShape(shapes["pentagon"]);

shapes["pentagram"] = createPathShape(starPolygonPath(5));

shapes["pentagram-inverted"] = rotateShape(shapes["pentagram"]);

shapes["plus"] = createPathShape([
  [ -(1 / 4), -1 ],
  [ (1 / 4), -1 ],
  [ (1 / 4), -(1 / 4) ],
  [ 1, -(1 / 4) ],
  [ 1, (1 / 4) ],
  [ (1 / 4), (1 / 4) ],
  [ (1 / 4), 1 ],
  [ -(1 / 4), 1 ],
  [ -(1 / 4), (1 / 4) ],
  [ -1, (1 / 4) ],
  [ -1, -(1 / 4) ],
  [ -(1 / 4), -(1 / 4) ],
  [ -(1 / 4), -1 ],
]);

shapes["cross"] = rotateShape(shapes["plus"], 45);

shapes["square"] = createPathShape([
  [ -1, -1 ],
  [ -1, 1 ],
  [ 1, 1 ],
  [ 1, -1 ],
  [ -1, -1 ],
]);

shapes["tetragram"] = createPathShape(starPolygonPath(4));

shapes["triangle"] = createPathShape(regularPolygonPath(3));

shapes["triangle-inverted"] = rotateShape(shapes["triangle"]);

shapes["triangle-right"] = rotateShape(shapes["triangle"], 90);

shapes["triangle-left"] = rotateShape(shapes["triangle"], -90);

shapes["chevron"] = createPathShape([
  [ 0, -1 ],
  [ 1, 0 ],
  [ 1, 1 ],
  [ 0, 0 ],
  [ -1, 1 ],
  [ -1, 0 ],
  [ 0, -1 ],
]);

shapes["double-chevron"] = createPathShape([
  [ 0, -1 ],
  [ 1, -0.5 ],
  [ 1, 0 ],
  [ 0, -0.5 ],
  [ -1, 0 ],
  [ -1, -0.5 ],
  [ 0, -1 ],
  null,
  [ 0, 0 ],
  [ 1, 0.5 ],
  [ 1, 1 ],
  [ 0, 0.5 ],
  [ -1, 1 ],
  [ -1, 0.5 ],
  [ 0, 0 ],
]);

shapes["chevron-inverted"] = rotateShape(shapes["chevron"]);
shapes["double-chevron-inverted"] = rotateShape(shapes["double-chevron"]);

shapes["chevron-right"] = rotateShape(shapes["chevron"], 90);
shapes["double-chevron-right"] = rotateShape(shapes["double-chevron"], 90);

shapes["chevron-left"] = rotateShape(shapes["chevron"], -90);
shapes["double-chevron-left"] = rotateShape(shapes["double-chevron"], -90);

shapes["wye"] = createPathShape([
  [ 0.366025, 0.211325 ],
  [ 0.366025, 0.943376 ],
  [ -0.366025, 0.943376 ],
  [ -0.366025, 0.211325 ],
  [ -1, -0.154701 ],
  [ -0.633975, -0.788675 ],
  [ 0, -0.42265 ],
  [ 0.633975, -0.788675 ],
  [ 1, -0.154701 ],
]);

shapes["wye-inverted"] = rotateShape(shapes["wye"]);

shapes["star"] = shapes["pentagram"];

export default shapes;
