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

import memoise from "@utils/memoise";
import nodeAngleInDegrees from '@utils/node-angle-in-degrees';

function totalSubtreeLengthMemo(tree) {
  const graph = tree.getGraphAfterLayout();
  return graph.root.totalSubtreeLength;
}

export default memoise(
  (tree) => tree.getAlignLeafLabels(),
  totalSubtreeLengthMemo,
  (tree) => tree.getBranchScale(),
  (tree) => tree.getStepZoom(),
  (tree) => (tree.getShowShapes() ? tree.getNodeSize() : 0),
  (
    alignLeafLabels,
    totalSubtreeLength,
    branchScale,
    scale,
    nodeSize,
  ) => {
    return (node) => {
      let offset = 10;
      if (alignLeafLabels) {
        offset += (totalSubtreeLength - node.distanceFromRoot) * branchScale;
      }
      // use nodeAngleInDegrees for consistent label alignment
      const deg = nodeAngleInDegrees(node);
      const rad = (deg / 180) * Math.PI;
      return [
        node.x + offset * Math.cos(rad),
        node.y + offset * Math.sin(rad),
      ];
    };
  }
);
