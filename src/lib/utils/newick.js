export function parseNewick(s) {
	const ancestors = [];
	let tree = {};
	const tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
	for (let i = 0; i < tokens.length; i++) {
	  const token = tokens[i];
	  switch (token) {
		case '(': {
		  const subtree1 = {};
		  tree.children = [subtree1];
		  ancestors.push(tree);
		  tree = subtree1;
		  break;
		}
		case ',': {
		  const subtree2 = {};
		  ancestors[ancestors.length - 1].children.push(subtree2);
		  tree = subtree2;
		  break;
		}
		case ')': {
		  tree = ancestors.pop();
		  break;
		}
		case ':': {
		  break;
		}
		default: {
		  const prev = tokens[i - 1];
		  if (prev === ')' || prev === '(' || prev === ',') {
			tree.name = token;
		  } else if (prev === ':') {
			tree.branch_length = parseFloat(token);
		  }
		  break;
		}
	  }
	}
	return tree;
}
