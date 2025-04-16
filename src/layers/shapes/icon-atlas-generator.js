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

import shapeRenderers from "@utils/shapes";
import memoise from "@utils/memoise";

function drawShapes(size, padding) {
  const shapeNames = Object.keys(shapeRenderers);

  const shapeSize = size - padding;
  const borderSize = shapeSize / 16;
  const imageSize = size;
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = shapeNames.length * imageSize;
  tmpCanvas.height = size;
  const ctx = tmpCanvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.strokeStyle = "red";
  ctx.lineWidth = borderSize;
  ctx.globalAlpha = 1;
  // ctx.font = `${size}px Segoe UI Emoji`;
  // ctx.textAlign = "center";
  // ctx.textBaseline = "top";

  for (let index = 0; index < shapeNames.length; index++) {
    const shape = shapeNames[index];

    ctx.save();

    ctx.translate(
      (index * imageSize) + (imageSize / 2),
      imageSize / 2,
    );

    ctx.beginPath();
    ctx.fillStyle = "black";
    shapeRenderers[shape].renderCanvas(0, 0, shapeSize / 2, ctx);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

  return tmpCanvas.toDataURL();
}

function createMapping(size, padding) {
  const shapeNames = Object.keys(shapeRenderers);

  const imageSize = size;
  const shapeSize = size - padding;

  const mapping = {};

  for (let index = 0; index < shapeNames.length; index++) {
    const shape = shapeNames[index];

    mapping[shape] = {
      x: (index * imageSize) + (padding / 2),
      y: padding / 2,
      width: shapeSize,
      height: shapeSize,
      mask: true,
    };
  }

  return mapping;
}

function generateAtlas(radius = 64, padding = 4) {
  const size = radius + padding;

  const image = drawShapes(size, padding);
  const mapping = createMapping(size, padding);

  return {
    image,
    mapping,
  };
}

let atlas;

export default function () {
  if (!atlas) {
    atlas = generateAtlas();
  }
  return atlas;
}
