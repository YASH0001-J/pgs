import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('error', function(e) {
  document.body.innerHTML = '<div style="color:red;font-size:20px;padding:20px;z-index:9999;position:fixed;background:white;top:0;left:0;right:0;bottom:0;overflow:auto;"><pre>' + (e.error?.stack || e.message) + '</pre></div>';
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
