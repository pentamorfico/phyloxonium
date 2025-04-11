// src/lib/utils/tree-traversal.js

// 1) Postorder/traversal functions
function getPostorderTraversal(rootNode) {
  const nodes = [];
  const queue = [ rootNode ];
  while (queue.length) {
    const node = queue.pop();
    if (node.children) {
      Array.prototype.push.apply(queue, node.children);
    }
    nodes.push(node);
  }
  return nodes.reverse();
}

function getPreorderTraversal(rootNode) {
  const nodes = [];
  const queue = [ rootNode ];
  while (queue.length) {
    const node = queue.shift();
    nodes.push(node);
    if (node.children) {
      Array.prototype.unshift.apply(queue, node.children);
    }
  }
  return nodes;
}

// 2) Main function
export default function treeTraversal(rootNode, { trimQuotes = true } = {}) {
  performance.mark("getPostorderTraversal");
  const postorderTraversal = getPostorderTraversal(rootNode);
  performance.measure("    getPostorderTraversal", "getPostorderTraversal");

  performance.mark("getPreorderTraversal");
  const preorderTraversal = getPreorderTraversal(rootNode);
  performance.measure("    getPreorderTraversal", "getPreorderTraversal");

  // 3) If no branch lengths => cladogram => artificially set them
  const isCladogram = postorderTraversal.every(
    (x) => (x.branchLength || x.branch_length || 0) === 0
  );
  if (isCladogram) {
    rootNode.branchLength = 0;
    for (let nodeIndex = 0; nodeIndex < preorderTraversal.length; nodeIndex++) {
      const node = preorderTraversal[nodeIndex];
      if (node.children) {
        for (const child of node.children) {
          child.branchLength = node.branchLength + 1;
        }
      }
    }
  }

  performance.mark("bottom-up traversal");
  // 4) Bottom-up pass
  for (let nodeIndex = 0; nodeIndex < postorderTraversal.length; nodeIndex++) {
    const node = postorderTraversal[nodeIndex];
    node.postIndex = nodeIndex;

    node.isLeaf = !Array.isArray(node.children);
    node.branchLength = Math.abs(node.branchLength || node.branch_length || 0);
    delete node.branch_length;

    if (node.isLeaf && typeof node.name === "string") {
      if (trimQuotes) {
        node.id = node.name.trim().replace(/^['"]|['"]$/g, "");
      } else {
        node.id = node.name;
      }
      delete node.name;
    }
    node.totalNodes = 1;
    node.totalLeaves = 1;
    node.totalSubtreeLength = 0;

    if (!node.isLeaf) {
      node.totalNodes = 1;
      node.totalLeaves = 0;
      let totalSubtreeLength = 0;
      for (const child of node.children) {
        node.totalNodes += child.totalNodes;
        node.totalLeaves += child.totalLeaves;
        if (child.totalSubtreeLength + child.branchLength > totalSubtreeLength) {
          totalSubtreeLength = child.totalSubtreeLength + child.branchLength;
        }
        child.parent = node;
      }
      node.totalSubtreeLength = totalSubtreeLength;
    }
  }
  performance.measure("    bottom-up traversal", "bottom-up traversal");

  performance.mark("top-down traversal");
  // 5) Top-down pass
  const nodeById = {};
  for (let nodeIndex = 0; nodeIndex < preorderTraversal.length; nodeIndex++) {
    const node = preorderTraversal[nodeIndex];
    node.preIndex = nodeIndex;
    if (!node.id) {
      node.id = nodeIndex.toString();
    }
    nodeById[node.id] = node;
    node.visibleLeaves = node.totalLeaves;
    node.isCollapsed = false;
    node.isHidden = false;
  }
  performance.measure("    top-down traversal", "top-down traversal");

  // === NEW STEP: "distanceFromRoot" top-down ===
  //  The root is preIndex=0 => distanceFromRoot=0
  const root = rootNode;
  root.distanceFromRoot = 0;

  //  For each subsequent node in pre-order, sum parent's distance + branchLength
  for (let i = 1; i < root.totalNodes; i++) {
    const node = preorderTraversal[root.preIndex + i];
    node.distanceFromRoot = node.parent.distanceFromRoot + node.branchLength;
  }

  return {
    nodeById,
    rootNode,
    postorderTraversal,
    preorderTraversal,
  };
}
