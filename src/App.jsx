import React, { useState, useEffect } from 'react';
import PhyloxoniumTree from './components/Phyloxonium';
import { customReroot } from './lib/phyloUtils';

const INITIAL_NEWICK = `(Bovine:0.69395,(Gibbon:0.36079,(Orangutan:0.33636,(Gorilla:0.17147,(Chimp:1.19268,Human:0.11927):0.08386):0.06124):0.15057):0.54939,Mouse:1.21460);`;

function App() {
  const [source, setSource] = useState(INITIAL_NEWICK);
  const [treeType, setTreeType] = useState('radial'); // default tree type

  useEffect(() => {
    if (window.phylojs) {
      try {
        const parsed = window.phylojs.readNewick(source);
        console.log("Parsed tree from phylojs:", parsed);
        window.parsedTree = parsed;
      } catch (error) {
        console.error("Error parsing Newick:", error);
      }
    }
  }, [source]);

  function onClickReroot() {
    if (
      window.phylojs &&
      typeof window.phylojs.readNewick === 'function' &&
      typeof window.phylojs.writeNewick === 'function'
    ) {
      let tree = window.phylojs.readNewick(source);
      const randomIndex = Math.floor(Math.random() * tree.nodeList.length);
      const randomNode = tree.nodeList[randomIndex];
      tree = customReroot(tree, randomNode);
      const newSource = window.phylojs.writeNewick(tree);
      setSource(newSource);
    }
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
          <option value="radial">Radial</option>
          <option value="circular">Circular</option>
          <option value="rectangular">Rectangular</option>
        </select>
      </div>

      <div style={{ position: 'relative', width: '400px', height: '300px', border: '1px solid #ccc' }}>
        <PhyloxoniumTree
          newickData={source}
          width={400}
          height={300}
          showLeafLabels={true}
          treeType={treeType}
        />
      </div>
      <button onClick={onClickReroot} style={{ marginTop: '10px' }}>
        Random Reroot Tree
      </button>
    </div>
  );
}

export default App;
