import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { initializeStore } from './redux/store';
import App from './App';
import './index.css';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

// Componente de loading mientras se carga el store
function LoadingApp() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#4f46e5',
            color: 'white',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</h1>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>NO FAT</h2>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>Cargando...</p>
            </div>
        </div>
    );
}

// Crear root una sola vez
const root = ReactDOM.createRoot(document.getElementById('root'));

// Función principal de inicialización
async function initializeApp() {
    try {
        // 1. Inicializar el store (carga datos de Preferences)
        const store = await initializeStore();

        // 2. Configurar Capacitor plugins
        try {
            // Configurar StatusBar (solo en móvil)
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#4f46e5' });
        } catch (err) {
            // Ignorar si no está en móvil
            console.log('StatusBar no disponible (probablemente en web)');
        }

        // 3. Ocultar Splash Screen
        try {
            await SplashScreen.hide();
        } catch (err) {
            console.log('SplashScreen no disponible');
        }

        // 4. Renderizar la aplicación (usando el mismo root)
        root.render(
            <React.StrictMode>
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            </React.StrictMode>
        );

        // 5. Log de información
        CapacitorApp.getInfo().then(info => {
            console.log('📱 App Info:', info);
            console.log(`✅ ${info.name} v${info.version} (build ${info.build})`);
        }).catch(() => {
            console.log('🌐 Corriendo en navegador web');
        });

        // 6. Listener para el botón back de Android
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
                CapacitorApp.exitApp();
            } else {
                window.history.back();
            }
        });

    } catch (error) {
        console.error('Error inicializando la app:', error);

        // Mostrar error en pantalla (usando el mismo root)
        root.render(
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                <h2>Error al iniciar la aplicación</h2>
                <p>{error.message}</p>
                <button
                    onClick={() => location.reload()}
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
                >
                    Reintentar
                </button>
            </div>
        );
    }
}

// Mostrar loading inicial
root.render(<LoadingApp />);

// Inicializar la app
initializeApp();

// Prevenir zoom en iOS (opcional)
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

// Prevenir pull-to-refresh en iOS/Chrome (opcional)
document.body.style.overscrollBehavior = 'contain';