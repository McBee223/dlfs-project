import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';

const handleWheel = (e) => {
  if (e.ctrlKey) e.preventDefault();
};

const handleKeyDown = (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
    e.preventDefault();
  }
};

window.addEventListener("wheel", handleWheel, { passive: false });
window.addEventListener("keydown", handleKeyDown);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);




