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

import { TreeTypes, Angles } from "@lib/constants";
import memoise from "@utils/memoise";

const leavesPerLabelMemo = memoise(
  (tree) => tree.getTreeType(),
  (tree) => tree.getGraphAfterLayout(),
  (tree) => tree.getBranchScale(),
  (tree) => tree.getStepScale(),
  (tree) => tree.getScale(),
  (tree) => tree.getFontSize(),
  (
    treeType,
    graph,
    branchScale,
    stepScale,
    scale,
    fontSize,
  ) => {
    if (treeType === TreeTypes.Circular || treeType === TreeTypes.Radial) {
      const radius = (graph.root.totalSubtreeLength * branchScale) * scale;
      const chordLength = fontSize * 0.75;
      const angle = 2 * Math.asin(chordLength / (2 * radius));
      const maxNumOfLabels = Math.floor(Angles.Degrees360 / angle);
      const leavesPerLabel = Math.ceil(graph.root.totalLeaves / maxNumOfLabels);
      return leavesPerLabel;
    }
    else {
      // Calculate the total tree length in pixels
      const treeLength = (
        graph.root.totalLeaves // number of leaves
        *
        stepScale // pixel per leaf node
        *
        scale // zoom scalar
      );

      // Calculate how many labels can be displayed without overlapping
      // assuming that the height of each label is equivalent to fontSize
      const maxNumOfLabels = 10000;

      // Finally calculate the number of leaf nodes per one label
      const leavesPerLabel = graph.root.totalLeaves / (maxNumOfLabels);

      if (leavesPerLabel <= 1) {
        return 1;
      }
      else {
        // This should return the next multiple of 2
        return 2 ** Math.ceil(Math.log(leavesPerLabel) / Math.log(2));
      }
    }
  }
);

const labelledLeafNodesMemo = memoise(
  (tree) => tree.getGraphWithStyles(),
  (tree) => tree.getTreeType(),
  leavesPerLabelMemo,
  (
    graph,
    type,
    leavesPerLabel,
  ) => {
    if (leavesPerLabel <= 1) {
      const nodesWithLabels = [];
      for (const node of graph.leaves) {
        if (node.label) {
          nodesWithLabels.push(node);
        }
      }
      return nodesWithLabels;
    }

    const lastIndex = (
      graph.leaves.length
      -
      (
        (type === TreeTypes.Circular || type === TreeTypes.Radial)
          ?
          Math.ceil(leavesPerLabel / 2)
          :
          0
      )
    );
    const nodesWithLabels = [];
    for (let index = 0; index < graph.leaves.length; index++) {
      if (index < lastIndex && index % leavesPerLabel === 0) {
        const node = graph.leaves[index];
        if (node.label) {
          nodesWithLabels.push(node);
        }
      }
    }

    return nodesWithLabels;
  }
);
labelledLeafNodesMemo.displayName = "labelled-leaf-nodes";

export default labelledLeafNodesMemo;
