// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '@styles/index.css'; // or import your global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
