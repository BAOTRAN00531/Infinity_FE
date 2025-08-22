import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

// 👉 Thêm đoạn này trước khi render App
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
} else {
    document.documentElement.classList.remove("dark");
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
        <ToastContainer />
    </BrowserRouter>
    // </React.StrictMode>
);

reportWebVitals();
