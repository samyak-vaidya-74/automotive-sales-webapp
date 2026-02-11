import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Bootstrap 5 CSS and Bundle (includes Popper)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
