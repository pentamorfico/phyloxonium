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

/**
 * Filter input points by rounding to a grid defined by precisionX and precisionY.
 * Accepts separate x and y field names for generality.
 */
export function reduceOverPlotting(input, precisionX, precisionY, xType = 'x', yType = 'y') {
  if (!precisionX || !precisionY) {
    return input;
  }
  const seen = {};
  return input.filter(node => {
    const rx = Math.round(node[xType] * precisionX) / precisionX;
    const ry = Math.round(node[yType] * precisionY) / precisionY;
    seen[rx] = seen[rx] || {};
    if (seen[rx][ry]) {
      return false;
    }
    seen[rx][ry] = true;
    return true;
  });
}

function binarySearch(values, v) {
  let low = 0, high = values.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (values[mid] < v) low = mid + 1;
    else if (values[mid] > v) high = mid - 1;
    else return mid;
  }
  return low;
}

// Filter data by y-range using binary search indices
export function filterByY(input, yPositions, minY, maxY) {
  const start = binarySearch(yPositions, minY);
  const end = binarySearch(yPositions, maxY);
  return input.slice(start, end + 1);
}

// Include parent nodes for any selected leaves
export function addParents(data, leaves) {
  const selected = new Set(leaves.map(n => n.node_id));
  for (const leaf of leaves) {
    let cur = data[leaf.node_id];
    while (cur && cur.parent_id !== cur.node_id) {
      selected.add(cur.parent_id);
      cur = data[cur.parent_id];
    }
  }
  return data.filter(n => selected.has(n.node_id));
}

// Compute precision factor for rounding
export function getPrecision(min, max) {
  return 2000.0 / (max - min);
}

// Main nodes selection with overplotting reduction
export function getNodes(
  data,
  yPositions,
  minY,
  maxY,
  minX,
  maxX,
  xType,
  useHydratedMutations = false,
  mutations = []
) {
  const inRange = typeof minY === 'number'
    ? filterByY(data, yPositions, minY, maxY)
    : data;
  const leaves = inRange.filter(n => n.num_tips === 1);
  const px = getPrecision(minX, maxX);
  const py = getPrecision(minY, maxY);
  let reduced = reduceOverPlotting(leaves, px, py, xType);
  if (useHydratedMutations) {
    reduced = reduced.map(n => ({ ...n, mutations: n.mutations.map(i => mutations[i]) }));
  }
  return addParents(data, reduced);
}

// Add missing search function to avoid ReferenceError
export function search(input, search_spec) {
  // Proxy to searchFiltering utility
  return searchFiltering({ data: input, spec: search_spec });
}

/**
 * Get values of a given attribute for all leaf tips under a node.
 */
export function getTipAtts(data, nodeId, attribute) {
  const childrenMap = {};
  data.forEach(n => { childrenMap[n.node_id] = []; });
  data.forEach(n => {
    if (n.parent_id !== n.node_id) childrenMap[n.parent_id].push(n.node_id);
  });
  const results = [];
  const stack = [nodeId];
  while (stack.length) {
    const id = stack.pop();
    const children = childrenMap[id] || [];
    if (children.length === 0) {
      const node = data.find(n => n.node_id === id);
      if (node) results.push(node[attribute]);
    } else {
      children.forEach(c => stack.push(c));
    }
  }
  return results;
}

export default {
  customReroot,
  reduceOverPlotting,
  filterByY,
  addParents,
  getPrecision,
  getNodes,
  search,
  getTipAtts,
};
