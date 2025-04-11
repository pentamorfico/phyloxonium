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

import treeTraversal from "./tree-traversal";

const newickParser = require("./newick");

export default function (source) {
  performance.mark("parse");

  let sourceDef = source;
  if (typeof source === "string") {
    sourceDef = { type: "newick", data: source };
  }

  const { type, data, ...options } = sourceDef;
  let rootNode = null;
  if (type === "newick" || type === undefined) {
    performance.mark("parse newick");
    rootNode = newickParser.parse_newick(data);
    performance.measure("  parse newick", "parse newick");
  } else if (type === "biojs") {
    rootNode = data;
  } else {
    throw new Error(`Source type is not supported: ${type}`);
  }

  performance.mark("treeTraversal");
  const nodes = treeTraversal(rootNode, options);
  performance.measure("  treeTraversal", "treeTraversal");
  performance.measure("parse", "parse");
  return nodes;
}
