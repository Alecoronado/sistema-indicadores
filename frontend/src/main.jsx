// Polyfill para flat (compatibilidad)
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    const flatten = (arr, currentDepth) => {
      return currentDepth > 0 ? arr.reduce((acc, val) => 
        acc.concat(Array.isArray(val) ? flatten(val, currentDepth - 1) : val), []) : arr.slice();
    };
    return flatten(this, depth);
  };
}

// Polyfill para flatMap (compatibilidad)
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return this.map(callback, thisArg).flat();
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
