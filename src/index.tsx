// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Tailwind CSS를 여기에 임포트
import App from './App';


ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
