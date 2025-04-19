# Phyloxonium React Component

Phyloxonium is a modern React component for interactive phylogenetic tree visualization, based on a heavily modified fork of [phylocanvas.gl](https://github.com/phylocanvas/phylocanvas.gl). This project updates the rendering engine to a modern version of [deck.gl](https://deck.gl/), enabling performant X and Y zooming and panning, and introduces several improvements for label filtering and overall performance.

**Heavily inspired by [Taxonium](https://github.com/theosanderson/taxonium),** the goal is to make phylocanvas.gl as powerful as Taxonium, while remaining easy to use and customizable as a React component.

## Key Features
- Modern deck.gl backend with efficient X/Y zoom and pan
- Improved label filtering and rendering performance
- Customizable styles and plugins
- React component API for easy integration

## Installation

```bash
npm install phyloxonium
```

## Usage Example

Here is a minimal example of how to use the Phyloxonium React component:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { PhyloxoniumGLComponent } from 'phyloxonium';

const INITIAL_NEWICK = '(A:0.1,B:0.2,(C:0.3,D:0.4):0.5);';

function App() {
  const [source, setSource] = useState(INITIAL_NEWICK);
  const [treeType, setTreeType] = useState('rc');
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [lineWidth, setLineWidth] = useState(2);
  const [stylesData, setStylesData] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    // Optionally, update size based on container or window
    setSize({ width: 800, height: 600 });
  }, []);

  return (
    <div ref={containerRef} style={{ width: size.width, height: size.height }}>
      <PhyloxoniumGLComponent
        size={size}
        source={source}
        type={treeType}
        interactive={true}
        plugins={[]}
        alignLabels={true}
        showLabels={true}
        showLeafLabels={true}
      />
    </div>
  );
}

export default App;
```

## Project Goals
- Modernize the phylocanvas.gl codebase for React and deck.gl 9+
- Achieve feature parity and flexibility inspired by Taxonium
- Provide a customizable, high-performance tree visualization component for the web

## License

This project is a modification of phylocanvas.gl and is distributed under the MIT License. See [phylocanvas.gl](https://github.com/phylocanvas/phylocanvas.gl) for original copyright.

---

For more details, see the source code and documentation.
