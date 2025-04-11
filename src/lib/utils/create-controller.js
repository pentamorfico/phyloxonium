// Phylocanvas.gl (https://phylocanvas.gl)
// Centre for Genomic Pathogen Surveillance.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable class-methods-use-this */

import { OrthographicController } from "@deck.gl/core";

import scaleToZoom from "./scale-to-zoom";

export default function createController(tree) {
  class TreeController extends OrthographicController {
    getPointFromEvent(event) {
      // return [ 204, 250 ];
      const screenPoint = this.getCenter(event);
      if (!this.isPointInBounds(screenPoint, event)) {
        return false;
      }

      return screenPoint;
    }

    calculateScaleDeltaFromWheelDelta(delta) {
      const scaleDelta = 2 / (1 + Math.exp(-Math.abs(delta * 0.01)));
      if (delta < 0 && scaleDelta !== 0) {
        return 1 / scaleDelta;
      }
      else {
        return scaleDelta;
      }
    }

    _onWheel(event) {
      if (event.srcEvent.metaKey || event.srcEvent.ctrlKey) {
        event.preventDefault();
        const screenPoint = this.getPointFromEvent(event);
        if (screenPoint) {
          const scaleDelta = this.calculateScaleDeltaFromWheelDelta(event.delta);
          const zoomDelta = scaleToZoom(scaleDelta);
          const startZoom = tree.getBranchZoom();
          const newZoom = startZoom + zoomDelta;
          tree.setBranchZoom(newZoom, screenPoint);
        }
        return true;
      }
      else if (event.srcEvent.altKey || event.srcEvent.shiftKey) {
        event.preventDefault();
        const screenPoint = this.getPointFromEvent(event);
        if (screenPoint) {
          const scaleDelta = this.calculateScaleDeltaFromWheelDelta(event.delta);
          const zoomDelta = scaleToZoom(scaleDelta);
          const startZoom = tree.getStepZoom();
          const newZoom = startZoom + zoomDelta;
          tree.setStepZoom(newZoom, screenPoint);
        }
        return true;
      }
      else {
        return super._onWheel(event);
      }
    }

    zoomIn(delta = 64, point = tree.getCanvasCentrePoint()) {
      const scaleDelta = this.calculateScaleDeltaFromWheelDelta(delta);
      this.zoom(scaleDelta, point);
    }

    zoomOut(delta = 64, point = tree.getCanvasCentrePoint()) {
      const scaleDelta = this.calculateScaleDeltaFromWheelDelta(-delta);
      this.zoom(scaleDelta, point);
    }

    zoom(scaleDelta, pos = tree.getCanvasCentrePoint()) {
      const { ControllerState } = this;
      this.controllerState = new ControllerState({
        makeViewport: this.makeViewport,
        ...this.controllerStateProps,
        ...this._state,
      });
      const newControllerState = this.controllerState.zoom({ pos, scale: scaleDelta });
      this.updateViewport(
        newControllerState,
        { transitionDuration: 0 },
        {
          isZooming: true,
          isPanning: true,
        },
      );
    }
  }

  return TreeController;
}
