import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Assurez-vous que ce fichier existe
// Supprimer cette ligne si vous ne l'utilisez pas
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Supprimer ce code si "reportWebVitals" n'est pas utilisé
// reportWebVitals(console.log);
