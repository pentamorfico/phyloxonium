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

import memoise from "../utils/memoise";
import applyTreeLayout from "../utils/apply-tree-layout";

const graphBeforeLayoutMemo = memoise(
  (tree) => tree.getGraphWithoutLayout(),
  (tree) => tree.getTreeType(),
  (tree) => (tree.getAlignLeafLabels() && tree.hasLeafLabels()),
  (
    graph,
    type,
    alignableLabels,
  ) => {
    const bounds = applyTreeLayout(graph, type, alignableLabels);

    return {
      ...graph,
      width: Math.max(-bounds.min[0], bounds.max[0]) * 2,
      height: Math.max(-bounds.min[1], bounds.max[1]) * 2,
      bounds,
    };
  }
);
graphBeforeLayoutMemo.displayName = "graph-before-layout";

export default function getGraphBeforeLayout() {
  return graphBeforeLayoutMemo(this);
}
