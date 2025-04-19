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

import canvasContext from "./canvas-context";

// Cache to store already computed colors
const cache = new Map();

// Special handling for the transparent color
const transparentColour = [0, 0, 0, 0];
transparentColour.isTransparent = true;

// Main function to convert CSS color strings to RGBA arrays
export default function colourToRGBA(colour) {
  if (Array.isArray(colour)) {
    // Return early if the input is already an RGBA array
    return colour;
  }

  if (colour === "transparent") {
    // Handle the special case for transparent
    return transparentColour;
  }

  // Use cached result if available
  if (cache.has(colour)) {
    return cache.get(colour);
  }

  // Obtain a canvas context optimized for frequent reads
  const ctx = canvasContext();

  // Set a default transparent color
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  // Apply the provided color
  ctx.fillStyle = colour;
  // Draw a pixel with the specified color
  ctx.fillRect(0, 0, 1, 1);

  // Read the pixel data
  const imageData = ctx.getImageData(0, 0, 1, 1).data;

  // Copy the data to avoid canvas context retention
  const rgbaArray = new Uint8ClampedArray(imageData);

  // Cache the computed RGBA array
  cache.set(colour, rgbaArray);

  return rgbaArray;
}
