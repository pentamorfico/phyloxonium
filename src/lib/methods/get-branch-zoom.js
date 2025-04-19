import defaults from "../defaults";

export default function getBranchZoom() {
  // Check if 'viewState' and 'zoom' are defined in this.deck
  if (this.deck && this.deck.viewState && this.deck.viewState.zoom) {
    const [zoomX, zoomY] = this.deck.viewState.zoom;
    // Determine the step zooming axis
    const axis = this.getStepZoomingAxis();
    if (axis === "y") {
      return zoomY;  // Inverted: returning zoomY when axis is 'x'
    } else if (axis === "x") {
      return zoomX;  // Inverted: returning zoomX when axis is 'y'
    } else {
      // If no specific axis, return the average
      return (zoomX + zoomY) / 2;
    }
  } else {
    // If no viewState or zoom, return default values
    return defaults.branchZoom;
  }
}
