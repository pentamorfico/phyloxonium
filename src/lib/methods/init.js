/* eslint-disable no-plusplus */
/* eslint-disable prefer-rest-params */
import { Deck, OrthographicView, OrthographicController} from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { TreeTypes } from "../constants";
import defaults from "../defaults";
import hasInteraction from "@utils/has-interaction";
import targetToCentre from "@utils/target-to-centre";


import renderBranchLabels from "@layers/branch-labels";
import renderEdges from "@layers/edges";
import renderHighlight from "@layers/highlight";
import renderInternalLabels from "@layers/internal-labels";
import renderLeafLabels from "@layers/leaf-labels";
import renderMetadata from "@layers/metadata";
import renderPiecharts from "@layers/piecharts";
import renderSelection from "@layers/selection";
import renderShapes from "@layers/shapes";
import renderMockScatterplot from "@layers/mockscatterplot";

const logoDataUrl = "url(\"data:image/png;base64,iVBOCC\")";

function init() {
  
  this.deck = new Deck({
    parent: this.container,
    pickingRadius: 2,
    useDevicePixels: true,
    views: [
      new OrthographicView({
        id: 'main',
        flipY: true,
      })
    ],
    initialViewState: {
      target: [0, 0, 0],
      zoom: [this.getZoom(), this.getZoom()], // Use an array for independent axis zoom
      minZoom: this.getMinZoom(),
      maxZoom: this.getMaxZoom(),
      width: this.props.size.width,
      height: this.props.size.height
    },
    onHover: (info, event) => this.handleHover(info, event),
    onClick: (info, event) => this.handleClick(info, event),
    getCursor: ({isDragging}) => isDragging ? 'grabbing' : 'grab',
    parameters: {
      depthTest: true,
      blend: true,
      blendFunc: [
        WebGLRenderingContext.SRC_ALPHA,
        WebGLRenderingContext.ONE_MINUS_SRC_ALPHA
      ]
    }
  });

  // Store a reference to 'this' for use in event handlers
  const self = this;

  // Update the controller after Deck is initialized with default zoomAxis
this.deck.setProps({
  views: [new OrthographicView({
    id: 'main',
    controller: {
      type: OrthographicController,
      zoomAxis: 'all'  // Initial default zoom axis
    },
    flipY: true,
  })]
});

// Add window blur event listener to reset zoom axis
window.addEventListener('blur', function() {
  self.deck.setProps({
    views: [new OrthographicView({
      id: 'main',
      controller: {
        type: OrthographicController,
        zoomAxis: 'all'  // Reset to default when window loses focus
      },
      flipY: true,
    })]
  });
});

// Track pressed keys
const pressedKeys = new Set();

document.addEventListener('keydown', function(event) {
  // Add key to pressed keys set
  pressedKeys.add(event.key);
  
  if (pressedKeys.has('Shift')) {
    // Change to X-axis zoom when Shift is pressed
    self.deck.setProps({
      views: [new OrthographicView({
        id: 'main',
        controller: {
          type: OrthographicController,
          zoomAxis: 'X' // X-axis only zoom
        },
        flipY: true,
      })]
    });
  } else if (pressedKeys.has('Control') || pressedKeys.has('Meta')) {
    // Change to XY-axis zoom (both axes) when Control/Command is pressed
    self.deck.setProps({
      views: [new OrthographicView({
        id: 'main',
        controller: {
          type: OrthographicController,
          zoomAxis: 'Y' // Zoom on both axes
        },
        flipY: true,
      })]
    });
  }
});

document.addEventListener('keyup', function(event) {
  // Remove key from pressed keys set
  pressedKeys.delete(event.key);
  
  // Check remaining pressed keys to determine zoom axis
  if (pressedKeys.has('Shift')) {
    // Still have Shift pressed
    self.deck.setProps({
      views: [new OrthographicView({
        id: 'main',
        controller: {
          type: OrthographicController,
          zoomAxis: 'X'
        },
        flipY: true,
      })]
    });
  } else if (pressedKeys.has('Control') || pressedKeys.has('Meta')) {
    // Still have Control/Meta pressed
    self.deck.setProps({
      views: [new OrthographicView({
        id: 'main',
        controller: {
          type: OrthographicController,
          zoomAxis: 'all'
        },
        flipY: true,
      })]
    });
  } else {
    // No modifier keys pressed, reset to default Y-axis zoom
    self.deck.setProps({
      views: [new OrthographicView({
        id: 'main',
        controller: {
          type: OrthographicController,
          zoomAxis: 'all' // Default back to Y-axis zoom
        },
        flipY: true,
      })]
    });
  }
});

  this.view.style.position = "relative";
  this.view.style.backgroundImage = logoDataUrl;
  this.view.style.backgroundRepeat = "no-repeat";
  this.view.style.backgroundPosition = "right bottom";

  this.addLayer(
    "edges",
    (props) => (props.showEdges ?? defaults.showEdges),
    (props) => renderEdges({ ...this.props, lineWidth: this.props.lineWidth }), // Pass lineWidth explicitly
  );

  this.addLayer(
    "leaf-labels",
    (props) => props.showLabels && props.showLeafLabels,
    renderLeafLabels,
  );

  this.addLayer(
    "shapes",
    (props) => (props.showShapes ?? defaults.showShapes),
    renderShapes,
  );

  this.addLayer(
    "internal-labels",
    (props) => props.showLabels && props.showInternalLabels,
    renderInternalLabels,
  );

  this.addLayer(
    "branch-labels",
    (props) => props.showLabels && props.showBranchLengths,
    renderBranchLabels,
  );

  this.addLayer(
    "piecharts",
    (props) => props.showPiecharts !== false && props.collapsedIds && props.collapsedIds.length,
    renderPiecharts,
  );

  this.addLayer(
    "metadata",
    (props) => props.type !== TreeTypes.Radial && props.metadata && props.blocks && props.blocks.length,
    renderMetadata,
  );

  this.addLayer(
    "selection",
    (props) => props.selectedIds && props.selectedIds.length,
    renderSelection,
  );

  // this.addLayer(
  //   "highlights",
  //   true,
  //   renderHighlight,
  // );

  // this.addLayer(
  //   "mock-scatterplot",
  //   true, // Always visible for testing purposes
  //   renderMockScatterplot,
  // );

}

export default init;