import { ScatterplotLayer } from "@deck.gl/layers";
import { CollisionFilterExtension } from "@deck.gl/extensions";

export function createInternalNodesLayer(data) {
  return new ScatterplotLayer({
    id: "internal-nodes",
    data,
    getPosition: (n) => [n.x, n.y],
    getRadius: 0.02,
    getFillColor: [0, 0, 255], // Blue for internal nodes
    pickable: false,
    visible: false,
  });
}

export function createTerminalNodesLayer(data) {
  return new ScatterplotLayer({
    id: "terminal-nodes",
    data,
    getPosition: (n) => [n.x, n.y],
    getRadius: 0.1,
    getFillColor: [255, 0, 0, 100], // Red for terminal nodes
    pickable: true,
    autoHighlight: true,
  });
}