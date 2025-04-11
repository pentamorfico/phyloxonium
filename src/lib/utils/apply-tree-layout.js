// src/lib/utils/apply-tree-layout.js

import { Angles, TreeTypes } from "../constants.js";
import calculateNodeBounds from "./calculate-node-bounds.js";

/**
 * Center each node's position so the tree is well-centered
 * on (0,0).
 */
function centreNodes(nodes, firstIndex, lastIndex) {
  // Basic bounding box from node.x, node.y
  const bounds = calculateNodeBounds(nodes.postorderTraversal, firstIndex, lastIndex, "x", "y");
  const [minX, minY] = bounds.min;
  const [maxX, maxY] = bounds.max;

  // midpoints
  const dx = (maxX + minX) / 2;
  const dy = (maxY + minY) / 2;

  for (let i = firstIndex; i <= lastIndex; i++) {
    const node = nodes.postorderTraversal[i];
    node.x -= dx;
    node.y -= dy;
  }

  return {
    min: [ bounds.min[0] - dx, bounds.min[1] - dy ],
    max: [ bounds.max[0] - dx, bounds.max[1] - dy ],
  };
}

/**
 * Layout algorithm for each tree type, ensuring node.x, node.y
 * are assigned so the bounding-box can see them.
 *
 * @param {Object} nodes - { root, preorderTraversal, postorderTraversal, ... }
 * @param {string} treeType - a short code in { cr, dg, hr, rd, rc }
 * @param {boolean} alignableLabels - (unused for now)
 * @returns {Object} { min: [...], max: [...] } bounding box offsets
 */
export default function applyTreeLayout(nodes, treeType, alignableLabels) {
  // Important: the node structure is in nodes.root, nodes.postorderTraversal, etc.
  const { root } = nodes;
  const firstPostIndex = root.postIndex - root.totalNodes + 1;
  const lastPostIndex = root.postIndex;

  // Safety check: if there's no node indexing
  if (!root || root.postIndex === undefined) {
    throw new Error("Invalid root node or missing postIndex. Did you run treeTraversal?");
  }

  // We do a big switch on the short codes from your constants
  if (treeType === TreeTypes.Circular) {
    // circular
    let stepOffset = 0;
    // For each node in postorder
    for (let i = firstPostIndex; i < lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];
      if (node.isLeaf) {
        node.angle = stepOffset * (Angles.Degrees360 / root.visibleLeaves);
      } else {
        const startAngle = node.children[0].angle;
        const endAngle = node.children[node.children.length - 1].angle;
        node.angle = (endAngle + startAngle) / 2;
      }
      node.coangle = node.angle + Angles.Degrees90;

      // Use node.distanceFromRoot for radius
      const xComponent = Math.cos(node.angle);
      const yComponent = Math.sin(node.angle);
      // We'll store them in node.x, node.y
      node.x = node.distanceFromRoot * xComponent;
      node.y = node.distanceFromRoot * yComponent;

      // If leaf or collapsed, increment step offset
      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset++;
      }
    }
    // root is always (0,0)
    root.x = 0;
    root.y = 0;
    return centreNodes(nodes, firstPostIndex, lastPostIndex);

  } else if (treeType === TreeTypes.Diagonal) {
    let stepOffset = 0;
    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];
      // horizontally
      node.x = (root.visibleLeaves - node.visibleLeaves) / 2;

      if (node.isLeaf || node.isCollapsed) {
        node.y = stepOffset;
      } else {
        const subTreeHeight = (node.visibleLeaves - node.children[0].visibleLeaves);
        node.y = node.children[0].y + (subTreeHeight / 2);
      }
      if (node.isLeaf) {
        stepOffset += 1;
      }
    }
    return centreNodes(nodes, firstPostIndex, lastPostIndex);

  } else if (treeType === TreeTypes.Hierarchical) {
    let stepOffset = 0;
    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];
      // vertically
      node.y = node.distanceFromRoot;
      if (node.isLeaf) {
        node.x = -stepOffset;
      } else if (node.isCollapsed) {
        node.x = stepOffset;
      } else {
        const startX = node.children[0].x;
        const endX = node.children[node.children.length - 1].x;
        node.x = (endX + startX) / 2;
      }
      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset++;
      }
    }
    return centreNodes(nodes, firstPostIndex, lastPostIndex);

  } else if (treeType === TreeTypes.Radial) {
    // radial short code is 'rd'
    let stepOffset = 0;
    // pass 1: compute angles
    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];
      if (node.isLeaf) {
        node.angle = stepOffset * (Angles.Degrees360 / root.visibleLeaves);
      } else {
        let angleSum = 0;
        for (const child of node.children) {
          angleSum += (child.angle * child.totalLeaves);
        }
        node.angle = angleSum / node.totalLeaves;
      }
      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset++;
      }
    }
    // root coords
    root.x = root.branchLength * Math.cos(root.angle);
    root.y = root.branchLength * Math.sin(root.angle);

    // pass 2: from root downwards for node coords
    for (let i = 1; i < root.totalNodes; i++) {
      const node = nodes.preorderTraversal[root.preIndex + i];
      const px = node.parent.x;
      const py = node.parent.y;
      node.x = px + node.branchLength * Math.cos(node.angle);
      node.y = py + node.branchLength * Math.sin(node.angle);
    }
    return centreNodes(nodes, firstPostIndex, lastPostIndex);

  } else if (treeType === TreeTypes.Rectangular) {
    // 'rc'
    let stepOffset = 0;
    for (let i = firstPostIndex; i <= lastPostIndex; i++) {
      const node = nodes.postorderTraversal[i];
      // horizontally
      node.x = node.distanceFromRoot;
      if (node.isLeaf || node.isCollapsed) {
        node.y = stepOffset;
      } else {
        const startY = node.children[0].y;
        const endY = node.children[node.children.length - 1].y;
        node.y = (endY + startY) / 2;
      }
      if (!node.isHidden && (node.isLeaf || node.isCollapsed)) {
        stepOffset++;
      }
    }
    return centreNodes(nodes, firstPostIndex, lastPostIndex);
  }

  throw new Error("Invalid tree type: " + treeType);
}
