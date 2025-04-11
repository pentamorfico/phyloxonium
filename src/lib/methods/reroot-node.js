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

import getPostorderTraversal from "../utils/postorder-traversal";

function reroot(tree, originalRoot, parent, sourceNode) {
  const newRoot = {
    branchLength: sourceNode.branchLength,
    children: [],
    parent,
    name: sourceNode.name,
  };
  parent.children.push(newRoot);

  for (const child of sourceNode.parent.children) {
    if (child !== sourceNode) {
      newRoot.children.push(child);
    }
  }

  if (sourceNode.parent.parent && sourceNode.parent !== originalRoot) {
    reroot(tree, originalRoot, newRoot, sourceNode.parent);
  }
}

function getSource(newRoot) {
  const postorderTraversal = getPostorderTraversal(newRoot);
  const subtrees = [];
  for (const node of postorderTraversal) {
    if (node.isLeaf) {
      subtrees.push(`${node.id}:${node.branchLength}`);
    } else if (node !== newRoot) {
      const chunks = subtrees.splice(subtrees.length - node.children.length, node.children.length);
      subtrees.push(`(${chunks.join(",")})${node.name || ""}:${node.branchLength}`);
    }
  }

  return `(${subtrees.join(",")});`;
}

export default function (nodeOrId) {
  const node = this.findNodeById(nodeOrId);
  const graph = this.getGraphAfterLayout();

  if (node.parent) {
    const newRoot = {
      branchLength: 0,
      children: [],
    };

    reroot(this, graph.root, newRoot, node);
    newRoot.children.push(node);

    const source = {
      type: "newick",
      original: this.props.source,
      data: getSource(newRoot),
    };

    this.setSource(source);
  }
}
