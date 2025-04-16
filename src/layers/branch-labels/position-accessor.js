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
import { TreeTypes } from "@lib/constants";

export default memoise(
  (tree) => tree.getTreeType(),
  (tree) => tree.getBranchScale(),
  (tree) => tree.getFontSize(),
  (tree) => tree.getScale(),
  (
    treeType,
    branchScale,
    fontSize,
    scale,
  ) => {
    return (node) => {
      if (treeType === TreeTypes.Diagonal) {
        return [
          (node.x + node.parent.x) / 2,
          (node.y + node.parent.y) / 2,
        ];
      }
      else {
        const offsetX = (node.branchLength * branchScale) / -2;
        if (treeType === TreeTypes.Rectangular) {
          return [
            node.x + offsetX,
            node.y,
          ];
        }
        else if (treeType === TreeTypes.Hierarchical) {
          return [
            node.x,
            node.y + offsetX,
          ];
        }
        else {
          return [
            node.x + offsetX * Math.cos(node.angle),
            node.y + offsetX * Math.sin(node.angle),
          ];
        }
      }
    };
  }
);
