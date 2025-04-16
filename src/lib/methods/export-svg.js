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

import labelledLeafNodesMemo from "@layers/leaf-labels/labelled-leaf-nodes";
import textPositionAccessorMemo from "@layers/leaf-labels/text-position-accessor";
import shapeBorderWidthMemo from "@layers/shapes/shape-border-width";
import shapeBorderColourMemo from "@layers/shapes/border-colour";
import blocksDataMemo from "@layers/metadata/blocks-data";
import headersDataMemo from "@layers/metadata/headers-data";
import pixelOffsetAccessorMemo from "@layers/metadata/pixel-offset-accessor";
import metadataHeaderFontSizeMemo from "@layers/metadata/font-size";
import lineColourMemo from "@layers/edges/line-colour";
import drawVectorShape from "@utils/draw-vector-shape";
import { Angles, TreeTypes } from "@lib/constants";

function colourArrayToCssRGBA(colourArray, ignoreAlpha = true) {
  const [ r, g, b, a = 255 ] = colourArray;

  if (a === 0) {
    return "none";
  }

  if (ignoreAlpha || a === 255) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  else {
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }
}

function polarToCartesian(centerX, centerY, radius, angleInRadians) {
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = (endAngle - startAngle) <= Math.PI ? "0" : "1";

  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ];

  return `<path fill="none" d="${d.join(" ")}" />`;
}

export default function exportSVG() {
  const nodes = this.getGraphAfterLayout();
  const size = this.getCanvasSize();
  const type = this.getTreeType();
  const nodeSize = this.getNodeSize();
  const nodeRadius = nodeSize * 0.5;

  const svg = [];

  const area = this.getDrawingArea();
  const centre = [
    (area.width / 2) + area.left,
    (area.height / 2) + area.top,
  ];

  svg.push(`<svg viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">\n`);

  {
    svg.push(`<g transform="translate(${centre.join(" ")})" >\n`);

    //#region Draw lines
    const lineWidth = this.getStrokeWidth();
    const lineColour = colourArrayToCssRGBA(lineColourMemo(this));

    svg.push(`<g stroke="${lineColour}" stroke-width="${lineWidth}" >\n`);

    for (let i = nodes.firstIndex + 1; i < nodes.lastIndex; i++) {
      const node = nodes.preorderTraversal[i];

      if (type === TreeTypes.Circular) {
        svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.cx}" y2="${node.cy}"  />\n`);

        if (node.children && node.children.length && !node.isCollapsed) {
          const firstChild = node.children[0];
          const lastChild = node.children[node.children.length - 1];
          svg.push(
            describeArc(
              nodes.root.x,
              nodes.root.y,
              node.dist,
              firstChild.angle,
              lastChild.angle,
            )
          );
        }
      }
      else if (type === TreeTypes.Diagonal || type === TreeTypes.Radial) {
        svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.parent.x}" y2="${node.parent.y}"  />\n`);
      }
      else if (type === TreeTypes.Hierarchical) {
        svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.x}" y2="${node.parent.y}"  />\n`);
        svg.push(`<line x1="${node.x}" y1="${node.parent.y}" x2="${node.parent.x}" y2="${node.parent.y}"  />\n`);
      }
      else if (type === TreeTypes.Rectangular) {
        svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.parent.x}" y2="${node.y}"  />\n`);
        svg.push(`<line x1="${node.parent.x}" y1="${node.y}" x2="${node.parent.x}" y2="${node.parent.y}"  />\n`);
      }

      // skip collapsed sub-trees
      if (node.isCollapsed) {
        i += node.totalNodes - 1;
      }
    }
    svg.push("</g>\n");

    //#endregion

    //#region Draw node shapes
    const showShapeBorders = this.props.showShapeBorders;

    let shapeBorderWidth = "";
    let shapeBorderColour = "";
    if (showShapeBorders) {
      shapeBorderWidth = shapeBorderWidthMemo(this);
      shapeBorderColour = colourArrayToCssRGBA(shapeBorderColourMemo(this));
    }

    svg.push("<g>\n");

    for (let i = nodes.firstIndex; i < nodes.lastIndex; i++) {
      const node = nodes.preorderTraversal[i];
      if (node.isLeaf && node.shape && !node.isHidden) {
        svg.push(
          drawVectorShape(
            node.shape,
            node.x,
            node.y,
            nodeRadius,
            colourArrayToCssRGBA(node.fillColour),
            shapeBorderColour,
            shapeBorderWidth,
          )
        );
        svg.push("\n");
      }
      // skip collapsed subtrees
      if (node.isCollapsed) {
        i += node.totalNodes - 1;
      }
    }

    svg.push("</g>\n");
    //#endregion

    //#region Draw labels

    if (this.props.showLabels && this.props.showLeafLabels) {
      const labelledLeafNodes = labelledLeafNodesMemo(this);
      const textPositionAccessor = textPositionAccessorMemo(this);
      const fontFamily = this.getFontFamily();
      const fontSize = this.getFontSize();
      svg.push(`<g font-family="${fontFamily.replace(/"/g, "'")}" font-size="${fontSize}">\n`);

      for (const node of labelledLeafNodes) {
        const [ x, y ] = textPositionAccessor(node);
        const degrees = ((node.angle / Angles.Degrees360) * 360) + (node.inverted ? 180 : 0);
        svg.push(`<text x="${x}" y="${y}" text-anchor="${node.inverted ? "end" : "start"}" dominant-baseline="middle" transform="rotate(${degrees},${x},${y})">${node.label}</text>\n`);
      }

      svg.push("</g>\n");
    }

    //#endregion

    //#region Metadata blocks

    const pixelOffset = this.getPixelOffsets().length;
    const blockWidth = this.getBlockSize();
    const blockHalfWidth = blockWidth / 2;
    const stepSize = this.getStepScale();
    const blockHeight = (!this.isOrthogonal() || (stepSize > blockWidth)) ? blockWidth : stepSize;
    const blockHalfHeight = blockHeight / 2;
    const blocks = blocksDataMemo(this);
    for (const datum of blocks) {
      const degrees = ((datum.node.angle / Angles.Degrees360) * 360) + (datum.node.inverted ? 180 : 0);
      const x = datum.position[0] + ((datum.offsetX + pixelOffset) * Math.cos(datum.node.angle));
      const y = datum.position[1] + ((datum.offsetX + pixelOffset) * Math.sin(datum.node.angle));
      svg.push(`<rect x="${x - blockHalfWidth}" y="${y - blockHalfHeight}" width="${blockWidth}" height="${blockHeight}" transform="rotate(${degrees},${x},${y})" fill="${colourArrayToCssRGBA(datum.colour)}" />\n`);
    }

    //#endregion

    //#region Metadata headers
    if (this.hasMetadataHeaders()) {
      const headersData = headersDataMemo(this);
      const fontFamily = this.getFontFamily();
      const fontSize = metadataHeaderFontSizeMemo(this);
      const pixelOffsetAccessor = pixelOffsetAccessorMemo(this);

      svg.push(`<g font-family="${fontFamily.replace(/"/g, "'")}" font-size="${fontSize}">\n`);

      for (const datum of headersData) {
        const [ offsetX, offsetY ] = pixelOffsetAccessor(datum);
        const [ positionX, positionY ] = datum.position;
        const x = positionX + offsetX;
        const y = positionY + offsetY;
        const degrees = (datum.angle) + 180;
        svg.push(`<text x="${x}" y="${y}" text-anchor="${datum.inverted ? "end" : "start"}" dominant-baseline="middle" transform="rotate(${degrees},${x},${y})">${datum.text}</text>\n`);
      }

      svg.push("</g>\n");
    }
    //#endregion

    svg.push("</g>\n");
  }

  svg.push("</svg>\n");

  return new Blob(
    svg,
    { type: "image/svg+xml" },
  );
}
