// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import { LineLayer, PathLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { TreeTypes } from '@lib/constants';
import { CollisionFilterExtension } from '@deck.gl/extensions';

// ─────────────────────────────────────────────────────────────────────────────
// Inline CircularCurveLayer implementation
// ─────────────────────────────────────────────────────────────────────────────
class CircularCurveLayer extends PathLayer {
  static layerName = 'CircularCurveLayer';

  static defaultProps = {
    ...PathLayer.defaultProps,
    widthUnits: 'pixels',
    widthScale: 1,
    widthMinPixels: 1,
    widthMaxPixels: Number.MAX_SAFE_INTEGER,

    // How many segments per arc
    numSegments: { type: 'number', min: 2, value: 20 },

    // Accessors (still available if you want to tweak in props)
    getCentrePoint: { type: 'accessor', value: [0, 0] },
    getRadius:      { type: 'accessor', value: 100 },
    getStartAngle:  { type: 'accessor', value: 0 },
    getEndAngle:    { type: 'accessor', value: Math.PI / 2 }
  };

  // Fallback method (won’t actually be used once getPath prop is supplied below)
  getPath(object) {
    const { getCentrePoint, getRadius, getStartAngle, getEndAngle, numSegments } = this.props;
    const center    = getCentrePoint(object);
    const radius    = getRadius(object);
    const start     = getStartAngle(object);
    const end       = getEndAngle(object);
    const points    = [];
    const delta     = (end - start) / numSegments;
    for (let i = 0; i <= numSegments; i++) {
      const a = start + delta * i;
      points.push([center[0] + radius * Math.cos(a), center[1] + radius * Math.sin(a)]);
    }
    return points;
  }
}

const EMPTY_ARRAY = Object.freeze([]);

// ─────────────────────────────────────────────────────────────────────────────
// Main EdgesLayer
// ─────────────────────────────────────────────────────────────────────────────
export default class EdgesLayer extends CompositeLayer {
  static get componentName() {
    return 'EdgesLayer';
  }

  updateState({ props, oldProps, changeFlags }) {
    if (changeFlags.dataChanged || props.treeType !== oldProps.treeType) {

      const updater = {
        roots: [props.data.root],
        nodes: [],
        nodesWithChildren: []
      };

      for (let i = props.data.firstIndex + 1; i < props.data.lastIndex; i++) {
        const node = props.data.preorderTraversal[i];
        updater.nodes.push(node);
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }

      if (props.treeType === TreeTypes.Circular) {
        updater.nodesWithChildren = updater.nodes.filter(
          node => node.children && node.children.length > 1
        );
      }

      this.setState(updater);
    }
  }

  renderLayers() {
    const { nodes, nodesWithChildren } = this.state;

    const layers = [];

    switch (this.props.treeType) {
      case TreeTypes.Rectangular:
        layers.push(...this.renderRectangularEdges(nodes));
        break;

      case TreeTypes.Hierarchical:
        layers.push(...this.renderHierarchicalEdges(nodes));
        break;

      case TreeTypes.Diagonal:
      case TreeTypes.Radial:
        layers.push(...this.renderDiagonalEdges(nodes));
        break;

      case TreeTypes.Circular: {
        // ─── 1) Central “spokes” ──────────────────────────────────────────────
        layers.push(
          new LineLayer(
            this.getSubLayerProps({
              id: 'circular-central-lines',
              data: nodes,
              getSourcePosition: node => [node.x, node.y],
              getTargetPosition: node => [node.cx, node.cy],
              getColor: this.props.getColor,
              getWidth: this.props.lineWidth,
              pickable: true,
              updateTriggers: this.props.updateTriggers
            })
          )
        );

        // ─── 2) Curved arcs ───────────────────────────────────────────────────
        const center = [this.props.data.root.x, this.props.data.root.y];
        const numSeg = CircularCurveLayer.defaultProps.numSegments.value;
        layers.push(
          new CircularCurveLayer(
            this.getSubLayerProps({
              id: 'circular-edges',
              data: nodesWithChildren,
              getColor: this.props.getColor,
              getWidth: this.props.lineWidth,
              widthUnits: 'pixels',
              widthMinPixels: this.props.lineWidth,
              widthMaxPixels: this.props.lineWidth,
              pickable: true,
              autoHighlight: true,
              updateTriggers: this.props.updateTriggers,

              // Keep these for flexibility
              getCentrePoint: center,
              getStartAngle: node => node.children[0].angle,
              getEndAngle:   node => node.children[node.children.length - 1].angle,
              getRadius:     node => node.dist,

              // ★ THE KEY: supply the actual path accessor ★
              getPath: node => {
                const start  = node.children[0].angle;
                const end    = node.children[node.children.length - 1].angle;
                const radius = node.dist;
                const pts    = [];
                const delta  = (end - start) / numSeg;
                for (let i = 0; i <= numSeg; i++) {
                  const a = start + delta * i;
                  pts.push([center[0] + radius * Math.cos(a), center[1] + radius * Math.sin(a)]);
                }
                return pts;
              }
            })
          )
        );
        break;
      }

      default:
        layers.push(...this.renderNormalEdges(nodes));
        break;
    }

    return layers;
  }

  renderNormalEdges(nodes) {
    const safeNodes = nodes.filter(n => n.parent);
    return [
      new LineLayer({
        id: 'edges-layer',
        data: safeNodes,
        getSourcePosition: node => [node.parent.x, node.parent.y],
        getTargetPosition: node => [node.x, node.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        updateTriggers: {
          getWidth: this.props.lineWidth,
          getColor: this.props.getColor
        }
      })
    ];
  }

  renderRectangularEdges(nodes) {
    const safeNodes = nodes.filter(n => n.parent);
    return [
      new LineLayer({
        id: 'rectangular-edges-vertical',
        data: safeNodes,
        getSourcePosition: node => [node.parent.x, node.y],
        getTargetPosition: node => [node.x, node.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        collisionEnabled: false,
        updateTriggers: this.props.updateTriggers,
        extensions: [new CollisionFilterExtension()],
        collisionGroup: 'edges',
        sizeUnits: 'meters'
      }),
      new LineLayer({
        id: 'rectangular-edges-horizontal',
        data: safeNodes,
        getSourcePosition: node => [node.parent.x, node.parent.y],
        getTargetPosition: node => [node.parent.x, node.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        collisionEnabled: false,
        updateTriggers: this.props.updateTriggers,
        extensions: [new CollisionFilterExtension()],
        collisionGroup: 'edges'
      })
    ];
  }

  renderHierarchicalEdges(nodes) {
    const safeNodes = nodes.filter(n => n.parent);
    return [
      new LineLayer({
        id: 'hierarchical-edges',
        data: safeNodes,
        getSourcePosition: node => [node.x, node.parent.y],
        getTargetPosition: node => [node.x, node.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        updateTriggers: this.props.updateTriggers
      }),
      new LineLayer({
        id: 'hierarchical-edges-horizontal',
        data: safeNodes,
        getSourcePosition: node => [node.parent.x, node.parent.y],
        getTargetPosition: node => [node.x, node.parent.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        updateTriggers: this.props.updateTriggers
      })
    ];
  }

  renderDiagonalEdges(nodes) {
    const safeNodes = nodes.filter(n => n.parent);
    return [
      new LineLayer({
        id: 'diagonal-edges',
        data: safeNodes,
        getSourcePosition: node => [node.parent.x, node.parent.y],
        getTargetPosition: node => [node.x, node.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        updateTriggers: this.props.updateTriggers
      })
    ];
  }

  // (Legacy) Path/Line-based circular fallback if you ever need it:
  renderCircularEdges(nodes) {
    const center = [this.props.data.root.x, this.props.data.root.y];
    const edgeSegments = [];
    const parentToChildren = this.groupChildrenByParent(nodes);

    for (const [parent, children] of parentToChildren) {
      if (children.length < 2) continue;
      // …same arc/line logic you already had…
    }

    const lineData = edgeSegments.filter(e => e.type === 'line');
    const arcData  = edgeSegments.filter(e => e.type === 'arc');

    return [
      new LineLayer({ /* … */ }),
      new PathLayer({ /* … */ })
    ];
  }

  generateArcPoints(center, startAngle, endAngle, radius, segments) {
    let delta = endAngle - startAngle;
    if (Math.abs(delta) > Math.PI) {
      if (delta > 0) startAngle -= 2 * Math.PI;
      else          endAngle   += 2 * Math.PI;
    }
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = startAngle + t * (endAngle - startAngle);
      pts.push([center[0] + radius * Math.cos(a), center[1] + radius * Math.sin(a)]);
    }
    return pts;
  }

  groupChildrenByParent(nodes) {
    const groups = new Map();
    for (const node of nodes) {
      const p = node.parent;
      if (!p) continue;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(node);
    }
    return groups;
  }
}
