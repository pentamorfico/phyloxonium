import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@src/App';

test('renders React-based implementation', () => {
  render(<App />);

  // Check if the React-based implementation is rendered
  const reactHeader = screen.getByText(/React-based Implementation/i);
  expect(reactHeader).toBeInTheDocument();

  // Check if the tree type selector is present
  const treeTypeSelect = screen.getByLabelText(/Choose Tree Type/i);
  expect(treeTypeSelect).toBeInTheDocument();

  // Simulate changing the tree type
  fireEvent.change(treeTypeSelect, { target: { value: 'circular' } });
  expect(treeTypeSelect.value).toBe('circular');
});

test('renders Non-React implementation', () => {
  render(<App />);

  // Check if the Non-React implementation is rendered
  const nonReactHeader = screen.getByText(/Non-React Implementation/i);
  expect(nonReactHeader).toBeInTheDocument();

  // Check if the non-react tree container is present
  const nonReactTree = document.getElementById('non-react-tree');
  expect(nonReactTree).toBeInTheDocument();

  // Check if the reroot button is present
  const rerootButton = screen.getByText(/Random Reroot Tree/i);
  expect(rerootButton).toBeInTheDocument();

  // Simulate clicking the reroot button
  fireEvent.click(rerootButton);
});