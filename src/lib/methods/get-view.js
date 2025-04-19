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

import memoise from "../utils/memoise";

const viewportCentreMemo = memoise(
  (tree) => tree.props.centre ?? defaults.centre,
  (tree) => tree.getCanvasSize(),
  (tree) => tree.getDrawingArea(),
  (
    centre,
    size,
    area,
  ) => {
    // const x = (centre[0] - 0.5) * area.width + area.left;
    // const y = (centre[1] - 0.5) * area.height + area.top;

    const canvasCentre = [
      size.width / 2,
      size.height / 2,
    ];
    const areaCentre = [
      area.width / 2 + area.left,
      area.height / 2 + area.top,
    ];
    const diff = [
      canvasCentre[0] - areaCentre[0],
      canvasCentre[1] - areaCentre[1],
    ];

    const x = (centre[0] - 0.5) * size.width - diff[0];
    const y = (centre[1] - 0.5) * size.height - diff[1];

    return [ -x, -y ];
  }
);

const getViewMemo = memoise(
  viewportCentreMemo,
  (tree) => tree.props.zoom ?? defaults.zoom,
  (tree) => tree.getMaxZoom(),
  (tree) => tree.getMinZoom(),
  (
    viewportCentre,
    zoom,
    maxZoom,
    minZoom,
  ) => {
    return {
      target: viewportCentre,
      zoom,
      maxZoom,
      minZoom,
    };
  },
);

export default function getView() {
  const viewState = getViewMemo(this);
  return viewState;
  
}
