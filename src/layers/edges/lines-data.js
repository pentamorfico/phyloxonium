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

import { TreeTypes } from "../../constants";

import memoise from "../../utils/memoise";

const linesDataMemo = memoise(
  (tree) => tree.getGraphAfterLayout(),
  (tree) => tree.getTreeType(),
  (
    graph,
    treeType,
  ) => {
    const lines = [];

    if (treeType === TreeTypes.Rectangular) {
      for (let i = graph.firstIndex + 1; i < graph.lastIndex; i++) {
        const node = graph.preorderTraversal[i];
        lines.push({
          node,
          sourcePosition: [ node.parent.x, node.y ],
          targetPosition: [ node.x, node.y ],
        });
        lines.push({
          node,
          sourcePosition: [ node.parent.x, node.parent.y ],
          targetPosition: [ node.parent.x, node.y ],
        });
        // skip collapsed sub-trees
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }
    }

    else if (treeType === TreeTypes.Hierarchical) {
      for (let i = graph.firstIndex + 1; i < graph.lastIndex; i++) {
        const node = graph.preorderTraversal[i];
        lines.push({
          node,
          sourcePosition: [ node.parent.x, node.parent.y ],
          targetPosition: [ node.x, node.parent.y ],
        });
        lines.push({
          node,
          sourcePosition: [ node.x, node.parent.y ],
          targetPosition: [ node.x, node.y ],
        });
        // skip collapsed sub-trees
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }
    }

    else if (treeType === TreeTypes.Circular) {
      for (let i = graph.firstIndex + 1; i < graph.lastIndex; i++) {
        const node = graph.preorderTraversal[i];
        lines.push({
          node,
          sourcePosition: [ node.x, node.y ],
          targetPosition: [ node.cx, node.cy ],
        });
        // skip collapsed sub-trees
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }
    }

    else if (treeType === TreeTypes.Diagonal || treeType === TreeTypes.Radial) {
      for (let i = graph.firstIndex + 1; i < graph.lastIndex; i++) {
        const node = graph.preorderTraversal[i];
        lines.push({
          node,
          sourcePosition: [ node.x, node.y ],
          targetPosition: [ node.parent.x, node.parent.y ],
        });
        // skip collapsed sub-trees
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }
    }

    return lines;
  }
);
linesDataMemo.displayName = "lines-data";

export default linesDataMemo;
