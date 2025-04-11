// src/lib/newickParser.js
export function parseNewick(newickStr) {
    let tokens = newickStr.replace(/\s+/g, "").split(/(;|\(|\)|,|:)/).filter((t) => t !== "");
    let stack = [];
    let root = {};
    let current = root;
    
    for (let token of tokens) {
      if (token === "(") {
        let child = {};
        current.children = current.children || [];
        current.children.push(child);
        stack.push(current);
        current = child;
      } else if (token === ",") {
        let sibling = {};
        stack[stack.length - 1].children.push(sibling);
        current = sibling;
      } else if (token === ")") {
        current = stack.pop();
      } else if (token === ":") {
        // The next token will be branch length; handle in next iteration.
      } else {
        if (!current.name) {
          current.name = token;
        } else if (current.branchLength === undefined) {
          current.branchLength = parseFloat(token);
        }
      }
    }
    return root;
  }
  