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

function rotate(array, startIndex, node) {
  const subtrees = [];
  for (const childNode of node.children) {
    const subtree = array.splice(startIndex, childNode.totalNodes);
    subtrees.push(subtree);
  }
  for (const subtree of subtrees) {
    array.splice(startIndex, 0, ...subtree);
  }
}

export default function (layout, node) {
  const { preorderTraversal, postorderTraversal } = layout;

  rotate(preorderTraversal, preorderTraversal.indexOf(node) + 1, node);
  for (let i = 0; i < preorderTraversal.length; i++) {
    preorderTraversal[i].preIndex = i;
  }

  rotate(postorderTraversal, postorderTraversal.indexOf(node) - node.totalNodes + 1, node);
  for (let i = 0; i < postorderTraversal.length; i++) {
    postorderTraversal[i].postIndex = i;
  }

  node.children.reverse();
}
