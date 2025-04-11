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

import defaults from "../defaults";
import calculateScaledCentre from "../utils/calculate-scaled-centre";
import zoomToScale from "../utils/zoom-to-scale";

export default function setBranchZoom(branchZoom, screenPoint = this.getCanvasCentrePoint()) {
  const axis = this.branchZoomingAxis();
  if (axis) {
    const newZoom = branchZoom ?? defaults.branchZoom;
    if (screenPoint) {
      const startZoom = this.props.branchZoom ?? defaults.branchZoom;
      const startScale = zoomToScale(startZoom);
      const newScale = zoomToScale(newZoom);
      const centre = calculateScaledCentre(this, startScale, newScale, screenPoint, axis);
      this.setProps({
        centre,
        branchZoom: newZoom,
      });
    }
    else {
      this.setProps({ branchZoom: newZoom });
    }
  }
}
