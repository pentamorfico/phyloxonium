export function customReroot(tree, newRoot) {
  const originalNodeCount = tree.nodeList.length;

  // Build the path from newRoot up to the old root
  let current = newRoot;
  const path = [];
  while (current) {
    path.push(current);
    current = current.parent;
  }

  // Reverse pointers along the path
  for (let i = 0; i < path.length; i++) {
    const node = path[i];
    const oldParent = node.parent;

    if (oldParent) {
      // Detach node from old parent's children
      oldParent.children = oldParent.children.filter(c => c !== node);

      // Attach old parent as child of current node if not already present
      if (!node.children.includes(oldParent)) {
        node.children.push(oldParent);
      }
    }

    // Update parent pointers
    node.parent = path[i - 1] || undefined;
  }

  // Update the tree root
  tree.root = newRoot;
  tree.root.parent = undefined;

  // Ensure no nodes are isolated or duplicated
  if (typeof tree.clearCaches === 'function') tree.clearCaches();
  if (typeof tree.computeNodeHeights === 'function') tree.computeNodeHeights();
  if (typeof tree.reassignNodeIDs === 'function') tree.reassignNodeIDs();

  // Validate node count to ensure structural integrity
  const newNodeCount = tree.nodeList.length;
  if (newNodeCount !== originalNodeCount) {
    throw new Error(`Node count mismatch after rerooting! Original: ${originalNodeCount}, New: ${newNodeCount}`);
  }

  return tree;
}
