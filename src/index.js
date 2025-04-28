import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';

const App = lazy(() => import('./App')); 

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>جاري تحميل التطبيق...</p>
    </div>
  );
}
