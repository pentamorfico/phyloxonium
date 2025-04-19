import defaults from "../../lib/defaults";
import memoise from "@utils/memoise";
import colourToRGBA from "@utils/colour-to-rgba";
import { CompositeLayer } from '@deck.gl/core';
import { TextLayer, LineLayer } from '@deck.gl/layers';
import { TreeTypes } from '@lib/constants';
import nodeAngleInDegrees from '@utils/node-angle-in-degrees';
import { CollisionFilterExtension } from '@deck.gl/extensions';
import zoomToScale from "../../lib/utils/zoom-to-scale";

const fontColourAccessorMemo = memoise(
  (tree) => tree.props.fontColour || defaults.fontColour,
  colourToRGBA,
);

const fontColourAccessor = (tree) => {
  const fontColour = fontColourAccessorMemo(tree);
  if (tree.props.styleLeafLabels || defaults.styleLeafLabels) {
    return (node) => {
      return node.fillColour ?? fontColour;
    };
  } else {
    return fontColour;
  }
};


// Inline text position accessor
const textPositionAccessorMemo = memoise(
  tree => tree.getAlignLeafLabels(),
  tree => tree.getGraphAfterLayout().root.totalSubtreeLength,
  tree => tree.getBranchScale(),
  tree => tree.getStepScale(),
  tree => (tree.getShowShapes() ? tree.getNodeSize() : 0),
  tree => tree.getTreeType(),

  // 7️⃣ Precompute leaf-centroid and radius of circle
  tree => {
    const graph = tree.getGraphAfterLayout();
    const root = graph.root;
    const nodeSize = tree.getShowShapes() ? tree.getNodeSize() : 0;
    // collect all leaves
    const leaves = [];
    (function dfs(n) {
      if (!n.children || n.children.length === 0) leaves.push(n);
      else n.children.forEach(dfs);
    })(root);
    // compute centroid
    let sumX = 0, sumY = 0;
    leaves.forEach(n => { sumX += n.x; sumY += n.y; });
    const cx = sumX / leaves.length;
    const cy = sumY / leaves.length;
    console.log(cx, cy);
    // compute maximum squared distance from centroid
    let maxD2 = 0;
    leaves.forEach(n => {
      const dx = n.x - cx, dy = n.y - cy;
      maxD2 = Math.max(maxD2, dx*dx + dy*dy);
    });
    const radius = Math.sqrt(maxD2) + nodeSize/2;
    return { cx, cy, radius };
  },

  // 8️⃣ the actual accessor
  (
    alignLeafLabels,
    totalSubtreeLength,
    branchScale,
    stepScale,
    nodeSize,
    treeType,
    { cx, cy, radius }
  ) => node => {
    if (treeType === TreeTypes.Radial && alignLeafLabels) {
      // For radial layout, just use the original node.angle
      // This preserves negative angles and proper orientation
      return [
        node.x + Math.cos(node.angle) * radius/2,
        node.y + Math.sin(node.angle) * radius/2
      ];
    }

    // Fallback for non-radial
    let offset = 0;
    if (alignLeafLabels) {
      offset += (totalSubtreeLength - node.distanceFromRoot) * branchScale;
    }
    return [
      node.x + offset * Math.cos(node.angle),
      node.y + offset * Math.sin(node.angle)
    ];
  }
);





class LeafLabelsLayer extends CompositeLayer {
  static layerName = 'LeafLabelsLayer';

  initializeState() {
    this.debounceTimer = null;
    const initialZoom = zoomToScale(this.context.viewport);
    this.setState({
      filteredIndices: [],
      lastZoom: initialZoom
    }, () => {
      this._recomputeFilteredIndices();
    });
  }

  shouldUpdateState({ changeFlags, context }) {
    if (changeFlags.propsChanged) {
      return true;
    }
    if (changeFlags.viewportChanged) {
      const newZoom = zoomToScale(context.viewport);
      return newZoom !== this.state.lastZoom;
    }
    return false;
  }

  updateState({ props, context, changeFlags }) {
    if (changeFlags.propsChanged) {
      this._recomputeFilteredIndices();
    }
    if (changeFlags.viewportChanged) {
      const newZoom = zoomToScale(context.viewport);
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this._recomputeFilteredIndices();
        this.setState({ lastZoom: newZoom });
      }, 200);
    }
  }

  _recomputeFilteredIndices() {
    const { data, treeType, fontSize } = this.props;
    const { viewport } = this.context;
    const { width, height } = viewport;
    const allData = data;
    const pixelThreshold = Math.max(10, fontSize * 1.2);
    const angleAggressiveness = 0.75;
    // flags for layout types
    const isRadial = treeType === TreeTypes.Radial;
    const isCircular = treeType === TreeTypes.Circular;
    const effectivePixelThreshold = (isRadial || isCircular) ? pixelThreshold * 1.5 : pixelThreshold;
    const effectiveAngleAgg = (isRadial || isCircular) ? 0.5 : angleAggressiveness;
    // use tighter 1° bins for radial/circular to ensure only one label per angular ray
    const fixedAngleBin = (Math.PI / 180) * 1; // 1° in radians
    const seen = new Set();
    const indices = [];

    // determine center: canvas center for radial, projected origin for circular or others
    const [cx, cy] = isRadial
      ? [width / 2, height / 2]
      : viewport.project([0, 0]);

    allData.forEach((datum, i) => {
      const [px, py] = viewport.project([datum.x, datum.y]);

      // 1) viewport cull: skip anything off-screen
      if (px < 0 || px > width || py < 0 || py > height) {
        return;
      }

      let key;
      switch (treeType) {
        case TreeTypes.Rectangular: // "rc"
        case TreeTypes.Diagonal:    // "dg"
          key = `y${Math.floor(py / effectivePixelThreshold)}`;
          break;

        case TreeTypes.Hierarchical: // "hr"
          key = `x${Math.floor(px / effectivePixelThreshold)}`;
          break;

        case TreeTypes.Radial:
        case TreeTypes.Circular: {
          // Use the leaf’s own layout angle
          // datum.angle ∈ [–π, +π] (or whatever your layout gives you)
          let rawAng = datum.angle % (2 * Math.PI);
          if (rawAng < 0) rawAng += 2 * Math.PI;   // normalize to [0,2π)
          const angKey = Math.floor(rawAng / fixedAngleBin);
          key = `a${angKey}`;
          break;
        }

        default:
          key = `g${Math.floor(px / effectivePixelThreshold)},${Math.floor(py / effectivePixelThreshold)}`;
      }

      if (!seen.has(key)) {
        seen.add(key);
        indices.push(i);
      }
    });

    this.setState({ filteredIndices: indices });
  }

  renderLayers() {
    const {
      alignLeafLabels,
      fontColour,
      fontFamily,
      fontSize,
      getTextPosition,
      id,
      lineColour,
      lineWidth
    } = this.props;

    // only render the culled & de‑duped leaves
    const data = this.state.filteredIndices.map(i => this.props.data[i]);

    const textLayer = new TextLayer({
      id: `${id}-text`,
      data,
      getPosition: getTextPosition,
      getText: d => d.label,
      getSize: fontSize,
      getTextAnchor: d => (d.inverted ? 'end' : 'start'),
      sizeUnits: 'pixels',
      getAngle: nodeAngleInDegrees,
      getColor: fontColour,
      fontFamily,
      alphaCutoff: -1,
      background: false,
      fontSettings: { sdf: true },
      pickable: false,
      collisionEnabled: false,
      extensions: [new CollisionFilterExtension()],
      collisionTestProps: {
        getSize: 10,
        sizeUnits: "pixels",
        maxWidth: 1
      },
    });
    const layers = [textLayer];
    if (alignLeafLabels) {
      layers.push(
        new LineLayer({
          data,
          getSourcePosition: getTextPosition,
          getTargetPosition: d => [d.x, d.y],
          getColor: fontColour,
          getWidth: lineWidth * 0.5,
          opacity: 0.5,
          pickable: false,
          updateTriggers: {
            getSourcePosition: getTextPosition,
            getTargetPosition: getTextPosition
          }
        })
      );
    }

    return layers;
  }
}

export default () => memoise(
  tree => tree,
  tree => tree.getGraphWithStyles().leaves,
  tree => tree.getBranchZoom(),
  tree => tree.getStepZoom(),
  tree => tree.getFontSize(),
  tree => tree.getFontFamily(),
  fontColourAccessor,
  tree => tree.props.backgroundColour || defaults.backgroundColour,
  tree => tree.getStrokeWidth(),
  tree => tree.getStrokeColour(),
  tree => tree.getAlignLeafLabels(),
  textPositionAccessorMemo,
  tree => tree.getHighlightedNode(),
  tree => colourToRGBA(tree.props.highlightColour ?? defaults.highlightColour),
  tree => tree.getTreeType(),
  (
    treeInstance,
    leaves,
    branchZoom,
    stepZoom,
    fontSize,
    fontFamily,
    fontColour,
    backgroundColour,
    lineWidth,
    lineColour,
    alignLeafLabels,
    getTextPosition,
    highlightedNode,
    highlightColour,
    treeType
  ) => new LeafLabelsLayer({
    tree: treeInstance,
    treeType,
    alignLeafLabels,
    backgroundColour,
    data: leaves,
    fontColour,
    fontFamily,
    fontSize,
    getTextPosition,
    highlightColour,
    highlightedNode,
    id: "leaf-labels",
    lineColour,
    alphaCutoff: -1,
    lineWidth: lineWidth * 0.5,
  })
);
