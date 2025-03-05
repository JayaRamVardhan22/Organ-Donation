import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Display a message about the contract deployment requirement
console.log(
  "%cImportant: To use this application fully, you need to deploy the OrganDonationRegistry contract and set the VITE_CONTRACT_ADDRESS in your .env file.",
  "color: #059669; font-size: 14px; font-weight: bold;"
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);