import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';
import './index.css';
import { registerServiceWorker, setupPWAInstallPrompt, isPWA } from './utils/registerServiceWorker';

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// Registrar Service Worker para PWA
registerServiceWorker();

// Configurar prompt de instalación de PWA
setupPWAInstallPrompt();

// Log si la app está corriendo como PWA
if (isPWA()) {
    console.log('✅ Corriendo como PWA instalada');
} else {
    console.log('🌐 Corriendo en navegador web');
}

// Prevenir zoom en iOS (opcional para mejor experiencia PWA)
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

// Prevenir pull-to-refresh en iOS/Chrome (opcional)
document.body.style.overscrollBehavior = 'contain';