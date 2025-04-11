#!/bin/bash
set -e

# Rename the existing circular edges file to the consolidated EdgesLayer file.
if [ -f src/layers/CircularEdgesLayer.js ]; then
  mv src/layers/CircularEdgesLayer.js src/layers/EdgesLayer.js
  echo "Renamed CircularEdgesLayer.js to EdgesLayer.js"
fi

# Create stub files for the other layers if they do not already exist.
touch src/layers/InternalNodesLayer.js
touch src/layers/LeafNodesLayer.js
touch src/layers/MetadataLayer.js
touch src/layers/LeafTextLayer.js
touch src/layers/BranchTextLayer.js

# Optionally, if main.jsx is not used in the new setup, back it up.
if [ -f src/main.jsx ]; then
  mv src/main.jsx src/main.jsx.bak
  echo "Backed up src/main.jsx to src/main.jsx.bak"
fi

# Move the global index.css into the styles folder if it's not already there.
if [ -f src/index.css ]; then
  mv src/index.css src/styles/index.css
  echo "Moved src/index.css to src/styles/index.css"
fi

echo "Restructuring complete! Please update your import paths as needed."
