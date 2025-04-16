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

import { Angles, TreeTypes } from "../constants";
import calculateNodeBounds from "./calculate-node-bounds";

function centreNodes(nodes, firstIndex, lastIndex, isCircular, centreRoot) {
  //#region Find the bounds of the tree (min and max points)
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  // When placing the tree root in the centre of the tree,
  // the bounds can be calculated quickly without looping over nodes
  if (centreRoot) {
    minX = -nodes.root.totalSubtreeLength;
    minY = -nodes.root.totalSubtreeLength;
    maxX = nodes.root.totalSubtreeLength;
    maxY = nodes.root.totalSubtreeLength;
  }
  else {
    // Loop over all nodes while keeping track of the min and max points
    const bounds = calculateNodeBounds(
      nodes.postorderTraversal,
      firstIndex,
      lastIndex,
      "bx",
      "by",
    );
    minX = bounds.min[0];
    minY = bounds.min[1];
    maxX = bounds.max[0];
    maxY = bounds.max[1];
  }
  //#endregion

  const dx = (maxX + minX) / 2;
  const dy = (maxY + minY) / 2;

  for (let i = firstIndex; i <= lastIndex; i++) {
    const node = nodes.postorderTraversal[i];
    node.bx -= dx;
    node.by -= dy;
    if (isCircular) {
      node.bcx -= dx;
      node.bcy -= dy;
    }

    node.angleDegrees = 360 - ((node.angle / Angles.Degrees360) * 360);
  }

  return {
    min: [ minX - dx, minY - dy ],
    max: [ maxX - dx, maxY - dy ],
  };
}

/**
 * Layout algorithm for each tree type.
 *
 * @param {Object} nodes - a tree nodes instance
 * @param {String} treeType - a valid tree type. @see TreeTypes.
 * @returns {Object} tree layout.
 */
export default function applyTreeLayout(nodes, treeType, alignableLabels) {
  const firstPostIndex = nodes.root.postIndex - nodes.root.totalNodes + 1;
  const lastPostIndex = nodes.root.postIndex;

  if (treeType === TreeTypes.Circular) {
    let stepOffset = 0;
    for (let i = firstPostIndex; i < lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];

      if (node.isLeaf) {
        // leaf nodes are angled at step offsets (use a fixed step angle for all leaf nodes)
        node.angle = stepOffset * (Angles.Degrees360 / nodes.root.visibleLeaves);
      }
      else {
        // internal nodes are angled half-way between first and last descendant
        const startAngle = node.children[0].angle;
        const endAngle = node.children[node.children.length - 1].angle;
        node.angle = (endAngle + startAngle) / 2;
      }
      node.coangle = node.angle + Angles.Degrees90;

      // calculate vector horizontal and vertical components to position the node
      const xComponent = Math.cos(node.angle);
      const yComponent = Math.sin(node.angle);
      node.bx = node.distanceFromRoot * xComponent;
      node.by = node.distanceFromRoot * yComponent;
      node.bcx = node.parent.distanceFromRoot * xComponent;
      node.bcy = node.parent.distanceFromRoot * yComponent;
      node.inverted = (node.angle > Angles.Degrees90) && (node.angle <= Angles.Degrees270);
      // node.quarter = Math.floor(node.angle / Angles.Degrees90) + 1;

      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset += 1;
      }
    }
    nodes.root.bx = 0;
    nodes.root.by = 0;
    nodes.root.inverted = (nodes.root.angle > Angles.Degrees90) && (nodes.root.angle <= Angles.Degrees270);
    // nodes.root.quarter = Math.floor(nodes.root.angle / Angles.Degrees90) + 1;

    return centreNodes(nodes, firstPostIndex, lastPostIndex, true, alignableLabels);
  }

  if (treeType === TreeTypes.Diagonal) {
    let stepOffset = 0;

    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];

      // render all nodes horizontally
      node.angle = Angles.Degrees0;
      node.inverted = false;

      // use subtree size to postion the current node away from tree root
      node.bx = (nodes.root.visibleLeaves - node.visibleLeaves) / 2;

      if (node.isLeaf) {
        // leaf nodes are positioned at step offsets
        node.by = stepOffset;
      }
      else if (node.isCollapsed) {
        // collapsed internal nodes are positioned at the first leaf in the subtree
        node.by = stepOffset;
      }
      else {
        // internal nodes are positioned in the middle point of the substree
        const subTreeHeight = (node.visibleLeaves - node.children[0].visibleLeaves);
        node.by = node.children[0].by + (subTreeHeight / 2);
      }

      if (node.isLeaf) {
        stepOffset += 1;
      }
    }

    return centreNodes(nodes, firstPostIndex, lastPostIndex);
  }

  if (treeType === TreeTypes.Hierarchical) {
    let stepOffset = 0;

    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];

      // render all nodes vertically
      node.angle = Angles.Degrees90;
      node.inverted = false;
      node.by = node.distanceFromRoot;

      if (node.isLeaf) {
        // leaf nodes are positioned at step offsets
        node.bx = -1 * stepOffset;
      }
      else if (node.isCollapsed) {
        // collapsed internal nodes are positioned at the first leaf in the subtree
        node.bx = stepOffset;
      }
      else {
        // internal nodes are positioned half-way between first and last descendant
        const startX = node.children[0].bx;
        const endX = node.children[node.children.length - 1].bx;
        node.bx = (endX + startX) / 2;
      }

      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset += 1;
      }
    }

    return centreNodes(nodes, firstPostIndex, lastPostIndex);
  }

  if (treeType === TreeTypes.Radial) {
    let stepOffset = 0;

    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];

      if (node.isLeaf) {
        // leaf nodes are angled at step offsets (use a fixed step angle for all leaf nodes)
        node.angle = stepOffset * (Angles.Degrees360 / nodes.root.visibleLeaves);
      }
      else {
        let angle = 0;
        for (const child of node.children) {
          angle += (child.angle * child.totalLeaves);
        }
        node.angle = angle / node.totalLeaves;
      }

      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset += 1;
      }
    }

    nodes.root.bx = nodes.root.branchLength * Math.cos(nodes.root.angle);
    nodes.root.by = nodes.root.branchLength * Math.sin(nodes.root.angle);
    nodes.root.inverted = (nodes.root.angle > Angles.Degrees90) && (nodes.root.angle <= Angles.Degrees270);
    nodes.root.quarter = Math.floor(nodes.root.angle / Angles.Degrees90) + 1;
    for (let i = 1; i < nodes.root.totalNodes; i++) {
      const node = nodes.preorderTraversal[nodes.root.preIndex + i];
      // calculate vector horizontal and vertical components to position the node
      node.bx = node.parent.bx + node.branchLength * Math.cos(node.angle);
      node.by = node.parent.by + node.branchLength * Math.sin(node.angle);

      node.inverted = (node.angle > Angles.Degrees90) && (node.angle <= Angles.Degrees270);
      node.quarter = Math.floor(node.angle / Angles.Degrees90) + 1;
    }

    return centreNodes(nodes, firstPostIndex, lastPostIndex);
  }

  if (treeType === TreeTypes.Rectangular) {
    let stepOffset = 0;

    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];

      // render nodes horizontally
      node.angle = Angles.Degrees0;
      node.inverted = false;
      node.bx = node.distanceFromRoot;

      if (node.isLeaf) {
        // leaf nodes are positioned at step offsets
        node.by = stepOffset;
      }
      else if (node.isCollapsed) {
        // collapsed internal nodes are positioned at the first leaf in the subtree
        node.by = stepOffset;
      }
      else {
        // internal nodes are positioned half-way between first and last descendant
        const startY = node.children[0].by;
        const endY = node.children[node.children.length - 1].by;
        node.by = (endY + startY) / 2;
      }

      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset += 1;
      }
    }

    return centreNodes(nodes, firstPostIndex, lastPostIndex);
  }

  throw new Error("Invalid tree type");
}
