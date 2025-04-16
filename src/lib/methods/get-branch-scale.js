import zoomToScale from "../utils/zoom-to-scale";
import defaults from "../defaults";
import { TreeTypes } from "../constants";
import memoise from "../utils/memoise";

const branchRatioMemo = memoise(
  (tree) => tree.getGraphBeforeLayout(),
  (tree) => tree.getTreeType(),
  (tree) => tree.getDrawingArea(),
  (graph, treeType, area) => {
    if (graph.root.totalSubtreeLength > 0) {
      switch (treeType) {
        case TreeTypes.Diagonal:
        case TreeTypes.Rectangular:
          return area.width / graph.root.totalSubtreeLength;
        case TreeTypes.Hierarchical:
          return area.height / graph.root.totalSubtreeLength;
        case TreeTypes.Circular:
        case TreeTypes.Radial: {
          const { width, height } = graph;
          const xAspectRatio = area.width / width;
          const yAspectRatio = area.height / height;
          if (xAspectRatio > yAspectRatio) {
            return (area.height) / height;
          } else {
            return (area.width) / width;
          }
        }
      }
    }
    throw new Error("Cannot compute default branch scale");
  }
);

export default function getBranchScale() {
  const branchRatio = branchRatioMemo(this);
  // Get X zoom from deck, fallback to default
  let zoom = this.deck?.viewState?.zoom;
  if (typeof zoom === "object" && zoom !== null) {
    zoom = zoom.x ?? zoom.y ?? defaults.branchZoom;
  }
  zoom = zoom ?? defaults.branchZoom;
  return branchRatio * zoomToScale(zoom);
}