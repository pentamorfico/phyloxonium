import { OrthographicController } from "@deck.gl/core";

class TreeController extends OrthographicController {
  constructor(props) {
    super(props);
    this.zoomAxis = 'all';  // Default zoom axis
  }

  handleKeyEvent(event) {
    // Update the zoom axis based on key press
    if (event.type === 'keydown') {
      if (event.key === 'x') {
        this.zoomAxis = 'X';
      } else if (event.shiftKey) {
        this.zoomAxis = 'Y';
      }
    } else if (event.type === 'keyup') {
      this.zoomAxis = 'all';
    }
    this.updateZoomAxis();
  }

  updateZoomAxis() {
    // Force a refresh of the controller to apply the new zoom axis
    this.deck.setProps({
      controller: { ...this.deck.props.controller, zoomAxis: this.zoomAxis }
    });
  }

  _onWheel(event) {
    return super._onWheel(event);
  }
}

export function createController(deck) {
  const controller = new TreeController({ deck });

  // Attach key event listeners to handle zoom axis updates
  document.addEventListener('keydown', controller.handleKeyEvent.bind(controller));
  document.addEventListener('keyup', controller.handleKeyEvent.bind(controller));

  return controller;
}
