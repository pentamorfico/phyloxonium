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

export default function exportNewick(nodeOrId, options = {}) {
  const nodes = this.getGraphAfterLayout();
  const rootNode = nodeOrId ? this.findNodeById(nodeOrId) : nodes.root;
  const { excludeCollapsed = true } = options;

  const strings = [];
  for (let i = rootNode.postIndex - rootNode.totalNodes + 1; i < rootNode.postIndex; i++) {
    const node = nodes.postorderTraversal[i];
    if (node.isLeaf) {
      strings.push(`${node.label || node.id}:${node.branchLength}`);
    }
    else if (excludeCollapsed && node.isCollapsed) {
      strings.push(`[${node.totalLeaves} hidden ${node.totalLeaves === 1 ? "leaf" : "leaves"}]:${node.branchLength}`);
    }
    else {
      const chunks = strings.splice(strings.length - node.children.length, node.children.length);
      strings.push(`(${chunks.join(",")}):${node.branchLength}`);
    }
  }

  return `(${strings.join(",")});`;
}
