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

/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-spread */
/* eslint prefer-rest-params: 0 */

function createMemo(...dependencies) {
  const resultFunc = dependencies.pop();

  let previousProps = null;
  let previousArguments = null;
  let previousResults = null;

  const selector = function (context) {
    if (previousProps === null || context.props === null || previousProps !== context.props) {
      const currentArguments = [];

      for (let i = 0; i < dependencies.length; i++) {
        currentArguments.push(dependencies[i].call(null, context));
      }

      currentArguments.push(context);

      let shouldUpdate = false;
      if (
        previousArguments === null
        ||
        currentArguments === null
      ) {
        shouldUpdate = true;
      }
      else {
        for (let i = 0; i < currentArguments.length; i++) {
          if ((previousArguments[i] !== currentArguments[i])) {
            shouldUpdate = true;
            break;
          }
        }
      }
      if (shouldUpdate) {
        if (context.log && selector.displayName) {
          const t0 = performance.now();
          previousResults = resultFunc.apply(null, currentArguments);
          const t1 = performance.now();
          context.log("selector %s took:", selector.displayName, t1 - t0);
        }
        else {
          previousResults = resultFunc.apply(null, currentArguments);
        }
      }

      previousArguments = currentArguments;
    }

    previousProps = context.props;
    return previousResults;
  };

  return selector;
}

export default function memoise() {
  const dependencies = arguments;
  const key = Symbol("selector");

  const selector = function (tree) {
    let cachedSelector = tree.cache.get(key);

    if (cachedSelector === undefined) {
      cachedSelector = createMemo.apply(null, dependencies);
      cachedSelector.displayName = selector.displayName;
      tree.cache.set(key, cachedSelector);
    }

    return cachedSelector.apply(null, arguments);
  };

  return selector;
}
