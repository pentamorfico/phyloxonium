import { LineLayer, PathLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { TreeTypes } from '@lib/constants';
import { CollisionFilterExtension } from '@deck.gl/extensions';

const EMPTY_ARRAY = Object.freeze([]);

export default class EdgesLayer extends CompositeLayer {
  static get componentName() {
    return 'EdgesLayer';
  }

  updateState({ props, changeFlags }) {
    if (changeFlags.dataChanged) {
      const updater = {
        roots: [props.data.root],
        nodes: []
      };

      for (let i = props.data.firstIndex; i < props.data.lastIndex; i++) {
        const node = props.data.preorderTraversal[i];
        updater.nodes.push(node);

        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }

      this.setState(updater);
    }
  }

  renderLayers() {
    const { nodes } = this.state;
    const layers = [];

    switch (this.props.treeType) {
      case TreeTypes.Rectangular:
        layers.push(...this.renderRectangularEdges(nodes));
        break;
      case TreeTypes.Hierarchical:
        layers.push(...this.renderHierarchicalEdges(nodes));
        break;
      case TreeTypes.Diagonal:
        layers.push(...this.renderDiagonalEdges(nodes));
      case TreeTypes.Radial:
        layers.push(...this.renderDiagonalEdges(nodes));
        break;
      case TreeTypes.Circular:
        layers.push(...this.renderCircularEdges(nodes));
        break;
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
          getColor: this.props.getColor,
        },
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
        collisionEnabled : false,
        updateTriggers: this.props.updateTriggers,
        extensions: [new CollisionFilterExtension()],
        collisionGroup: 'edges',
        sizeUnits: 'meters',
        
      }),
      new LineLayer({
        id: 'rectangular-edges-horizontal',
        data: safeNodes,
        getSourcePosition: node => [node.parent.x, node.parent.y],
        getTargetPosition: node => [node.parent.x, node.y],
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        pickable: true,
        collisionEnabled : false,
        updateTriggers: this.props.updateTriggers,
        extensions: [new CollisionFilterExtension()],
        collisionGroup: 'edges',
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

  renderCircularEdges(nodes) {
    const center = [this.props.data.root.x, this.props.data.root.y];
    const edgeSegments = [];

    const parentToChildren = this.groupChildrenByParent(nodes);

    for (const [parent, children] of parentToChildren) {
      if (children.length < 2) continue;

      children.sort((a, b) => {
        const angleA = Math.atan2(a.y - center[1], a.x - center[0]);
        const angleB = Math.atan2(b.y - center[1], b.x - center[0]);
        return angleA - angleB;
      });

      const normAngle = a => (a + 2 * Math.PI) % (2 * Math.PI);
      const angle1 = normAngle(Math.atan2(children[0].y - center[1], children[0].x - center[0]));
      const angle2 = normAngle(Math.atan2(children[children.length - 1].y - center[1], children[children.length - 1].x - center[0]));
      const angleMid = (angle1 + angle2) / 2;

      const rParent = Math.hypot(parent.x - center[0], parent.y - center[1]);
      const rMinChild = Math.min(...children.map(child =>
        Math.hypot(child.x - center[0], child.y - center[1])
      ));

      const rMid = (rMinChild + rParent) / 2;

      const anchor1 = [
        center[0] + rMid * Math.cos(angle1),
        center[1] + rMid * Math.sin(angle1)
      ];
      const anchor2 = [
        center[0] + rMid * Math.cos(angle2),
        center[1] + rMid * Math.sin(angle2)
      ];

      const midpoint = [
        center[0] + rMid * Math.cos(angleMid),
        center[1] + rMid * Math.sin(angleMid)
      ];

      edgeSegments.push({
        type: 'line',
        from: [parent.x, parent.y],
        to: midpoint
      });

      edgeSegments.push({
        type: 'arc',
        path: this.generateArcPoints(center, angle1, angle2, rMid, 100)
      });

      for (const child of children) {
        const angleChild = Math.atan2(child.y - center[1], child.x - center[0]);
        const anchor = [
          center[0] + rMid * Math.cos(angleChild),
          center[1] + rMid * Math.sin(angleChild)
        ];
        edgeSegments.push({
          type: 'line',
          from: anchor,
          to: [child.x, child.y]
        });
      }
    }

    const lineData = edgeSegments.filter(e => e.type === 'line');
    const arcData = edgeSegments.filter(e => e.type === 'arc');

    return [
      new LineLayer({
        id: 'circular-lines',
        data: lineData,
        getSourcePosition: d => d.from,
        getTargetPosition: d => d.to,
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth,
        widthMinPixels: 1,
        pickable: true
      }),
      new PathLayer({
        id: 'circular-arcs',
        data: arcData,
        getPath: d => d.path,
        getColor: this.props.getColor,
        getWidth: this.props.lineWidth/100,
        widthMinPixels: 1,
        pickable: true
      })
    ];
  }

  generateArcPoints(center, startAngle, endAngle, radius, segments) {
  let delta = endAngle - startAngle;
  if (Math.abs(delta) > Math.PI) {
    if (delta > 0) {
      startAngle -= 2 * Math.PI; // normalize angle
    } else {
      endAngle += 2 * Math.PI; // normalize angle
    }
  }

  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = startAngle + t * (endAngle - startAngle);
    points.push([
      center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle)
    ]);
  }
  return points;
}


  groupChildrenByParent(nodes) {
    const groups = new Map();
    for (const node of nodes) {
      const parent = node.parent;
      if (!parent) continue;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(node);
    }
    return groups;
  }
}
