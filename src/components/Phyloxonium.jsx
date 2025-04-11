// src/components/Phyloxonium.jsx

import React, { useState, useEffect, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

import EdgesLayer from "../layers/edges/edges-layer";
import { parseNewick } from "../lib/utils/newick.js";
import treeTraversal from "../lib/utils/tree-traversal.js";
import applyTreeLayout from "../lib/utils/apply-tree-layout.js";
import { TreeTypes } from "../lib/constants.js";

// your short code map
const shortCodeMap = {
  radial: "rd",
  circular: "cr",
  rectangular: "rc",
  hierarchical: "hr",
  diagonal: "dg",
};

function computeBounds(nodes) {
  let xMin = Infinity, xMax = -Infinity;
  let yMin = Infinity, yMax = -Infinity;
  for (const n of nodes) {
    if (Number.isFinite(n.x) && Number.isFinite(n.y)) {
      if (n.x < xMin) xMin = n.x;
      if (n.x > xMax) xMax = n.x;
      if (n.y < yMin) yMin = n.y;
      if (n.y > yMax) yMax = n.y;
    }
  }
  return { xMin, xMax, yMin, yMax };
}

export default function PhyloxoniumTree({
  newickData,
  width = 800,
  height = 600,
  treeType = "radial",
}) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    if (!newickData) return;

    try {
      // 1) Parse + traverse
      const parsed = parseNewick(newickData);
      const traversed = treeTraversal(parsed);

      // 2) Force all nodes visible
      for (const node of traversed.postorderTraversal) {
        node.isCollapsed = false; // ensure no subtree collapses
        node.isHidden = false;    // ensure node is shown
      }

      // 3) Prepare for layout
      const shortType = shortCodeMap[treeType.toLowerCase()] || "rd";
      const nodes = {
        root: traversed.rootNode,
        preorderTraversal: traversed.preorderTraversal,
        postorderTraversal: traversed.postorderTraversal,
        nodeById: traversed.nodeById,
      };

      // 4) Layout
      const layout = applyTreeLayout(nodes, shortType, true);

      for (const node of nodes.preorderTraversal) {
        console.log("Node debug:", {
          id: node.id,
          parent: node.parent?.id || null, // see who the parent is
          x: node.x,
          y: node.y
        });
      }

      // 5) Combine
      setGraph({ ...nodes, ...layout });
    } catch (error) {
      console.error("Error building tree layout:", error);
    }
  }, [newickData, treeType]);

  const layers = useMemo(() => {
    // skip if no data
    if (!graph?.root) return [];

    // debug scatterplot to confirm node coords
    const debugLayer = new ScatterplotLayer({
      id: "debug-nodes",
      data: graph.preorderTraversal,
      getPosition: (n) => [n.x, n.y],
      getRadius: 0.01,
      getFillColor: [255, 0, 0],
      pickable: false,
    });

    const edges = new EdgesLayer({
      id: "edges-layer",
      data: {
        root: graph.root,
        preorderTraversal: graph.preorderTraversal,
        firstIndex: graph.root.preIndex,
        lastIndex: graph.root.preIndex + graph.root.totalNodes - 1,
      },
      treeType: shortCodeMap[treeType.toLowerCase()],
      getColor: () => [0, 0, 0, 255],
      lineWidth: 2,
    });

    return [edges, debugLayer];
  }, [graph, treeType]);

  return (
    <DeckGL
      // We'll keep it simple with a fixed initialViewState
      initialViewState={{ target: [0, 0], zoom: 10 }}
      controller={true}
      width={width}
      height={height}
      views={[new OrthographicView()]}
      layers={layers}
    />
  );
}
