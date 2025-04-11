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

import { TreeTypes } from "../constants";
import memoise from "../utils/memoise";
import zoomToScale from "../utils/zoom-to-scale";

const branchRatioMemo = memoise(
  (tree) => tree.getGraphBeforeLayout(),
  (tree) => tree.getTreeType(),
  (tree) => tree.getDrawingArea(),
  (
    graph,
    treeType,
    area,
  ) => {
    if (graph.root.totalSubtreeLength > 0) {
      switch (treeType) {
        case TreeTypes.Diagonal:
        case TreeTypes.Rectangular:
          return area.width / graph.root.totalSubtreeLength;

        case TreeTypes.Hierarchical:
          return area.height / graph.root.totalSubtreeLength;

        case TreeTypes.Circular:
        case TreeTypes.Radial: {
          const { width, height } = graph;
          const xAspectRatio = area.width / width;
          const yAspectRatio = area.height / height;
          if (xAspectRatio > yAspectRatio) {
            return (area.height) / height;
          }
          else {
            return (area.width) / width;
          }
        }
      }
    }

    throw new Error("Cannot compute default branch scale");
  }
);
branchRatioMemo.displayName = "branchRatio";

const branchScaleMemo = memoise(
  branchRatioMemo,
  (tree) => tree.getBranchZoom(),
  (
    branchRatio,
    branchZoom,
  ) => {
    return branchRatio * zoomToScale(branchZoom);
  },
);
branchScaleMemo.displayName = "branch-scale";

export default function getBranchScale() {
  return branchScaleMemo(this);
}
