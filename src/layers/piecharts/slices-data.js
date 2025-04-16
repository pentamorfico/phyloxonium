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

import { Angles } from "@lib/constants";
import defaults from "@lib/defaults";
import memoise from "@utils/memoise";

export default memoise(
  (tree) => tree.getGraphWithStyles(),
  (tree) => tree.props.collapsedIds || defaults.collapsedIds,
  (
    graph,
    collapsedIds,
  ) => {
    const piechartSlices = [];

    let totalLeaves = 0;

    for (const nodeId of collapsedIds) {
      const node = graph.ids[nodeId];
      if (!node.isHidden) {
        const firstIndex = node.postIndex - node.totalNodes + 1;
        const lastIndex = node.postIndex;
        const slices = new Map();
        let numberOfActiveLeaves = 0;
        for (let i = firstIndex; i <= lastIndex; i++) {
          const childNode = graph.postorderTraversal[i];
          if (childNode.isLeaf && childNode.shape) {
            numberOfActiveLeaves += 1;
            slices.set(childNode.fillColour, (slices.get(childNode.fillColour) || 0) + 1);
          }
        }

        totalLeaves += numberOfActiveLeaves;
        let startAngle = Angles.Degrees0;
        for (const [ colour, count ] of slices.entries()) {
          const ratio = count / numberOfActiveLeaves;
          const endAngle = startAngle + (Angles.Degrees360 * ratio);
          piechartSlices.push({
            node,
            colour,
            startAngle,
            endAngle,
          });
          startAngle = endAngle;
        }

        node.numberOfActiveLeaves = numberOfActiveLeaves;
      }
    }

    const k = 1 / Math.log10(totalLeaves);
    for (const nodeId of collapsedIds) {
      const node = graph.ids[nodeId];
      if (!node.isHidden) {
        node.ratio = k * Math.log10(node.numberOfActiveLeaves);
      }
    }

    return piechartSlices;
  }
);
