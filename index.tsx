
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Gagal menemukan elemen root untuk mounting aplikasi.");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Kesalahan saat merender aplikasi:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>Terjadi Kesalahan</h1>
      <p>Gagal memuat aplikasi. Silakan coba refresh halaman.</p>
    </div>
  `;
}
