import applyPlugins from "@utils/apply-plugins";
import * as methods from "@lib/methods";
import { Deck } from '@deck.gl/core';
//import createController from "@lib/utils/create-controller";

class PhyloxoniumGL {
  constructor(view = document.body, props = {}, plugins = [    phylocanvas.plugins.scalebar,
]) {
    if (!view || !(view instanceof HTMLElement)) {
      throw new Error('Invalid view element provided to PhyloxoniumGL');
    }

    this.cache = new Map();
    this.view = view;
    this.deferred = {
      count: 0,
      render: false,
    };
    this.layers = [];

    const size = props?.size || view.getBoundingClientRect();
    this.props = {
      ...props,
      size,
    };

    if (plugins.length) {
      applyPlugins(this, plugins);
    }
    

    // Create a container div for deck.gl canvas
    this.container = document.createElement('div');
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.position = 'absolute';
    this.view.appendChild(this.container);

    this.init();

    if (props) {
      this.setProps(this.props);
    }

    return this;
  }

  init() {
    // Initialize fhe controller
    if (this.props.interactive) {
      // Removed redundant custom controller initialization
      // this.props.controller = createController(this);
    } else {
      this.props.controller = null; // Disable controller if not interactive
    }

    this.deck = new Deck({
      container: this.container,
      initialViewState: {
        zoom: this.props.branchZoom ?? this.props.zoom,
        target: [0, 0]
      },
      controller: this.props.interactive,
      onViewStateChange: ({viewState, interactionState}) => {
        // ignore hover or pointer-move events; only update on actual pan/zoom
        if (interactionState.isHovering || !interactionState.isPanning && !interactionState.isZooming) {
          return;
        }
        if (interactionState.isPanning || interactionState.isZooming) {
          this.props.branchZoom = viewState.zoom;
          this.props.stepZoom = viewState.zoom;
          this.render();
        }
      },
      layers: []
    });

    this.addLayer(
      "edges",
      (props) => (props.showEdges ?? defaults.showEdges),
      (props) => renderEdges({ ...props, lineWidth: this.props.lineWidth }), // Pass dynamic lineWidth
    );
  }

  setProps(props) {
    if (!props) return;
    this.render();
  }

  render() {
    const visibleLayers = this.layers
      .filter(layer => layer.isVisible(this.props))
      .map(layer => {
        const renderedLayer = layer.renderLayer(this.props);
        return renderedLayer;
      });

    if (this.deck) {
      this.deck.setProps({ layers: visibleLayers });
    }
  }

  destroy() {
    if (this.deck) {
      this.deck.finalize();
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.view = null;
    this.container = null;
    this.deck = null;
  }
}

Object.assign(PhyloxoniumGL.prototype, methods);

PhyloxoniumGL.create = function (...args) {
  return new this(...args);
};

export default PhyloxoniumGL;