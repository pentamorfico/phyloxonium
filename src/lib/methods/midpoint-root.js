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

import serialiseAsNewick from "../utils/serialise-as-newick";

function reroot(tree, treeRoot, parent, sourceNode) {
  const newRoot = {
    branchLength: sourceNode.branchLength,
    children: [],
    parent,
  };
  parent.children.push(newRoot);

  for (const child of sourceNode.parent.children) {
    if (child !== sourceNode) {
      newRoot.children.push(child);
    }
  }

  if (sourceNode.parent.parent && sourceNode.parent !== treeRoot) {
    reroot(tree, treeRoot, newRoot, sourceNode.parent);
  }
}

export default function () {
  const nodes = this.getGraphAfterLayout();
  const pathsFromRoot = [];
  for (const leaf of nodes.leaves) {
    const parentNodes = [];
    let node = leaf;
    while (node.parent) {
      parentNodes.unshift(node.parent);
      node = node.parent;
    }
    pathsFromRoot.push(parentNodes);
  }

  let longestDistance = 0;
  let longestDistanceLcaLeafA;
  let longestDistanceLcaLeafB;
  // let longestDistanceLca;
  for (let i = 0; i < nodes.leaves.length; i++) {
    for (let j = i + 1; j < nodes.leaves.length; j++) {
      const leafI = nodes.leaves[i];
      const leafJ = nodes.leaves[j];
      let lca;
      for (let parentIndex = 0; parentIndex < pathsFromRoot[i].length && parentIndex < pathsFromRoot[j].length; parentIndex++) {
        if (pathsFromRoot[i][parentIndex] !== pathsFromRoot[j][parentIndex]) {
          break;
        }
        lca = pathsFromRoot[i][parentIndex];
      }

      const distance = leafI.distanceFromRoot + leafJ.distanceFromRoot - 2 * lca.distanceFromRoot;
      if (distance > longestDistance) {
        longestDistance = distance;
        // longestDistanceLca = lca;
        longestDistanceLcaLeafA = leafI;
        longestDistanceLcaLeafB = leafJ;
      }
    }
  }

  const midpointDistance = longestDistance / 2;
  const leaf = (longestDistanceLcaLeafA.distanceFromRoot > midpointDistance) ? longestDistanceLcaLeafA : longestDistanceLcaLeafB;
  const path = pathsFromRoot[nodes.leaves.indexOf(leaf)];
  path.push(leaf);
  const distance = leaf.distanceFromRoot - midpointDistance;
  let midpointNode;
  for (const node of path) {
    if (node.distanceFromRoot > distance) {
      midpointNode = node;
      break;
    }
  }

  const newRootNode = {
    branchLength: 0,
    children: [],
  };

  midpointNode.branchLength = midpointNode.parent.distanceFromRoot - distance;
  reroot(this, nodes.root, newRootNode, midpointNode);

  newRootNode.children.push(midpointNode);
  midpointNode.branchLength = midpointNode.distanceFromRoot - distance;
  midpointNode.parent = newRootNode;

  const source = {
    type: "newick",
    original: this.props.source,
    data: serialiseAsNewick(newRootNode),
  };

  this.setSource(source);
}
