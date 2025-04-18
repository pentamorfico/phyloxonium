import React, { useState, useRef, useEffect } from 'react';
import PhyloxoniumGLComponent from '@components/PhyloxoniumGLComponent';
import axios from 'axios';

// create a newick with 100 nodes (random)
const INITIAL_NEWICK = '(A:0.1,B:0.2,(C:0.3,D:0.4):0.5);';
// create a newick with 100 nodes (random)

// Inlined customReroot function
function customReroot(tree, newRoot) {
  const originalNodeCount = tree.nodeList.length;

  // Build the path from newRoot up to the old root
  let current = newRoot;
  const path = [];
  while (current) {
    path.push(current);
    current = current.parent;
  }

  // Reverse pointers along the path
  for (let i = 0; i < path.length; i++) {
    const node = path[i];
    const oldParent = node.parent;

    if (oldParent) {
      // Detach node from old parent's children
      oldParent.children = oldParent.children.filter(c => c !== node);

      // Attach old parent as child of current node if not already present
      if (!node.children.includes(oldParent)) {
        node.children.push(oldParent);
      }
    }

    // Update parent pointers
    node.parent = path[i - 1] || undefined;
  }

  // Update the tree root
  tree.root = newRoot;
  tree.root.parent = undefined;

  // Ensure no nodes are isolated or duplicated
  if (typeof tree.clearCaches === 'function') tree.clearCaches();
  if (typeof tree.computeNodeHeights === 'function') tree.computeNodeHeights();
  if (typeof tree.reassignNodeIDs === 'function') tree.reassignNodeIDs();

  // Validate node count to ensure structural integrity
  const newNodeCount = tree.nodeList.length;
  if (newNodeCount !== originalNodeCount) {
    throw new Error(`Node count mismatch after rerooting! Original: ${originalNodeCount}, New: ${newNodeCount}`);
  }

  return tree;
}

function App() {
  const [source, setSource] = useState(INITIAL_NEWICK);
  const [treeType, setTreeType] = useState("rc");
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [lineWidth, setLineWidth] = useState(2); // Add state for lineWidth
  const [stylesData, setStylesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [progressTree, setProgressTree] = useState(0);
  const [progressMeta, setProgressMeta] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });
      }
    }

    // Update size on mount and when the window resizes
    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    // fetch tree and metadata
    Promise.all([
      axios.request({
        url: 'https://cdn.jsdelivr.net/npm/@phylocanvas/examples/coguk-global-tree-public.newick',
        onDownloadProgress({ loaded, total }) {
          const pct = ((100 * loaded) / (total || 5332957)).toFixed(0);
          setProgressTree(pct);
        }
      }),
      axios.request({
        url: 'https://cdn.jsdelivr.net/npm/@phylocanvas/examples/coguk-global-tree-public.csv',
        onDownloadProgress({ loaded, total }) {
          const pct = ((100 * loaded) / (total || 4229639)).toFixed(0);
          setProgressMeta(pct);
        }
      })
    ])
      .then(([{ data: newick }, { data: metadata }]) => {
        setSource(newick);
        const styles = metadata
          .split('\n')
          .map(line => line.split(','))
          .reduce((acc, [id, fillColour]) => {
            acc[id] = { fillColour };
            return acc;
          }, {});
        setStylesData(styles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [treeType]);

  function onClickReroot() {
    if (window.phylojs?.readNewick && window.phylojs?.writeNewick) {
      let tree = window.phylojs.readNewick(source);
      const randomIndex = Math.floor(Math.random() * tree.nodeList.length);
      const randomNode = tree.nodeList[randomIndex];
      tree = customReroot(tree, randomNode);
      const newSource = window.phylojs.writeNewick(tree);
      setSource(newSource);
    }
  }

  function handleLineWidthChange(event) {
    setLineWidth(Number(event.target.value)); // Update lineWidth dynamically
  }

  return (
    <div className="App">
      <h1>Phyloxonium Tree Visualization</h1>
      <div>
        <label htmlFor="treeType-select">Choose Tree Type: </label>
        <select
          id="treeType-select"
          value={treeType}
          onChange={e => setTreeType(e.target.value)}
        >
          <option value={"rd"}>Radial</option>
          <option value={"cr"}>Circular</option>
          <option value={"rc"}>Rectangular</option>
          <option value={"dg"}>Diagonal</option>
          <option value={"hr"}>Hierarchical</option>
        </select>
      </div>

      <div>
        <label htmlFor="lineWidth-slider">Line Width: </label>
        <input
          id="lineWidth-slider"
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={handleLineWidthChange}
        />
        <span>{lineWidth}</span>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '500px', // Example height, can be adjusted
          border: '1px solid #ccc',
          marginBottom: '1rem',
        }}
      >
        {loading ? (
          <p>Loading tree data: {progressTree}% metadata: {progressMeta}%</p>
        ) : (
            size.width > 0 && size.height > 0 && (
              console.log('Rendering PhyloxoniumGLComponent with size:', stylesData),
            <PhyloxoniumGLComponent
              size={size}
              source={source}
              type={treeType} // Explicitly pass treeType
              interactive={true}
              plugins={[]}
              metadata={stylesData}
              alignLabels={true}
              lineWidth={lineWidth} // Pass lineWidth dynamically
              showLabels={true} // Enable labels
              showLeafLabels={true} // Enable leaf labels
              styles={stylesData}
              styleLeafLabels={true}
            />
          )
        )}
      </div>

      <button onClick={onClickReroot}>
        Random Reroot Tree
      </button>
    </div>
  );
}

export default App;
