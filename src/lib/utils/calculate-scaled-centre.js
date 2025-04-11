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

import targetToCentre from "./target-to-centre";

export default function calculateScaledCentre(tree, startScale, newScale, canvasPoint, axis = "xy") {
  // find the corrosponding point in the tree space
  const treePoint = tree.unprojectPoint(canvasPoint);

  // scale the corrosponding tree point
  const scaleRatio = newScale / startScale;
  const scaledTreePoint = [
    treePoint[0] * scaleRatio,
    treePoint[1] * scaleRatio,
  ];

  // project the scaled point from the tree space back to the canvas
  const scaledScreenPoint = tree.projectPoint(scaledTreePoint);

  const scale = tree.getScale();
  const pixelDeltaX = (axis === "x" || axis === "xy") ? (scaledScreenPoint[0] - canvasPoint[0]) / scale : 0;
  const pixelDeltaY = (axis === "y" || axis === "xy") ? (scaledScreenPoint[1] - canvasPoint[1]) / scale : 0;

  const viewState = tree.getView();
  const newTarget = [
    viewState.target[0] + pixelDeltaX,
    viewState.target[1] + pixelDeltaY,
  ];

  const newCentre = targetToCentre(tree, newTarget);

  return newCentre;
}
