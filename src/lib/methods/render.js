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

export default function () {
  //#region Check if render is suspended
  if (this.deferred.count > 0) {
    this.deferred.render = true;
    this.log && this.log("render is suspended"); // eslint-disable-line no-unused-expressions
    return;
  }
  //#endregion

  const t0 = performance.now();

  this.getGraphAfterLayout();

  const t1 = performance.now();

  const deckglLayers = [];

  for (const layer of this.layers) {
    const visible = (layer.isVisible === true) || layer.isVisible(this.props);
    if (visible) {
      if (!layer.renderer) {
        layer.renderer = layer.renderLayer(this);
      }

      const deckglLayer = layer.renderer(this);
      deckglLayers.push(deckglLayer);
    }
    else {
      layer.renderer = null;
    }
  }

  const viewState = this.getView();
  const t2 = performance.now();
  this.view.style.width = `${this.props.size.width}px`;
  this.view.style.height = `${this.props.size.height}px`;

  this.deck.setProps({
    width: this.props.size.width,
    height: this.props.size.height,
    layers: deckglLayers,
  });

  const t3 = performance.now();

  this.log // eslint-disable-line no-unused-expressions
    && this.log(
      "layout took ", (t1 - t0), " milliseconds.",
      "\nrender took ", (t2 - t1), " milliseconds.",
      "\nupdate took ", (t3 - t2), " milliseconds.",
    );
}
