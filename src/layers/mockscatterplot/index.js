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

import { ScatterplotLayer } from "@deck.gl/layers";
import memoise from "@utils/memoise";

// Mock data for the scatterplot layer
const MOCK_SCATTERPLOT_DATA = [
  { position: [0, 0], color: [255, 0, 0], radius: 100 },
  { position: [100, 100], color: [0, 255, 0], radius: 200 },
  { position: [-50, -50], color: [0, 0, 255], radius: 150 },
];

export default () => memoise(
  () => MOCK_SCATTERPLOT_DATA,
  (tree) => tree.props.mockScatterplotRadius ?? 100,
  (tree) => tree.props.mockScatterplotColor ?? [255, 0, 0],
  (
    data,
    radius,
    color
  ) => {
    const layer = new ScatterplotLayer({
      id: "mock-scatterplot-layer",
      data,
      getPosition: (d) => d.position,
      getFillColor: (d) => d.color,
      getRadius: (d) => d.radius,
    });
    return layer;
  }
);