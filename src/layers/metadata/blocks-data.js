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
import colourToRGBA from "@utils/colour-to-rgba";
import { EmptyArray, EmptyObject } from "@lib/constants";

export default memoise(
  (tree) => tree.getGraphWithStyles(),
  (tree) => tree.getAlignLeafLabels(),
  (tree) => tree.props.metadata || EmptyObject,
  (tree) => tree.props.blocks || EmptyArray,
  (tree) => tree.getMetadataColumnWidth(),
  (tree) => tree.getBranchScale(),
  (
    graph,
    shouldAlignLabels,
    metadataValues,
    metadataColumns,
    columnWidth,
    branchScale,
  ) => {
    const data = [];

    for (const node of graph.leaves) {
      if (node.shape && !node.isHidden && (node.id in metadataValues)) {

        const nodeMetadata = metadataValues[node.id];

        const nodePositionOffset = (
          shouldAlignLabels
            ?
            (branchScale * (graph.root.totalSubtreeLength - node.distanceFromRoot))
            :
            0
        );

        const nodePosition = [
          node.x + (nodePositionOffset * Math.cos(node.angle)),
          node.y + (nodePositionOffset * Math.sin(node.angle)),
        ];

        let xOffset = 0;
        for (let index = 0; index < metadataColumns.length; index++) {
          const columnName = metadataColumns[index];
          const metadataValue = nodeMetadata[columnName];

          if (metadataValue) {
            if (metadataValue.colour) {
              data.push({
                position: nodePosition,
                offsetX: xOffset + (columnWidth / 2),
                colour: colourToRGBA(metadataValue.colour),
                columnName,
                block: metadataValue,
                node,
              });
            }
          }

          xOffset += columnWidth;
        }
      }
    }

    return data;
  }
);
