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
import colourToRGBA from "../utils/colour-to-rgba";

const NO_STYLE = {};

const graphWithStylesMemo = memoise(
  (tree) => tree.getGraphAfterLayout(),
  (tree) => tree.props.styles || defaults.styles,
  (tree) => tree.props.styleNodeEdges || defaults.styleNodeEdges,
  (tree) => tree.props.showPiecharts || defaults.showPiecharts,
  (tree) => tree.props.nodeShape ?? defaults.nodeShape,
  (tree) => tree.getFillColour(),
  (tree) => tree.getStrokeColour(),
  (
    graph,
    styles,
    styleNodeEdges,
    showPiecharts,
    defaultNodeShape,
    fillColour,
    strokeColour,
  ) => {
    {
      const firstIndex = graph.root.preIndex;
      const lastIndex = graph.root.preIndex + graph.root.totalNodes;
      for (let i = firstIndex; i < lastIndex; i++) {
        const node = graph.preorderTraversal[i];
        if (node.isLeaf) {
          const style = styles[node.id] || NO_STYLE;
          node.shape = (style.shape === undefined) ? defaultNodeShape : style.shape;
          node.fillColour = style.fillColour ? colourToRGBA(style.fillColour) : fillColour;
          node.strokeColour = (styleNodeEdges && style.strokeColour) ? colourToRGBA(style.strokeColour) : strokeColour;
          node.label = (style.label === undefined) ? node.id : style.label;
        }
        // skip collapsed subtrees
        if (!showPiecharts && node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }
    }

    if (styleNodeEdges) {
      const firstIndex = graph.root.postIndex - graph.root.totalNodes + 1;
      const lastIndex = graph.root.postIndex;
      for (let i = firstIndex; i <= lastIndex; i++) {
        const node = graph.postorderTraversal[i];
        if (!node.isLeaf) {
          node.strokeColour = node.children[0].strokeColour;
          for (const child of node.children) {
            if (child.strokeColour !== node.strokeColour) {
              node.strokeColour = strokeColour;
              break;
            }
          }
        }
      }
    }

    return { ...graph };
  }
);
graphWithStylesMemo.displayName = "graph-with-styles";

export default function getGraphWithStyles() {
  return graphWithStylesMemo(this);
}
