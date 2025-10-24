// src/components/workout/PreCountdown.jsx
import { useState, useEffect } from 'react';

function PreCountdown({ onFinish, onCancel }) {
    const [count, setCount] = useState(8);

    useEffect(() => {
        // Si llega a 0, terminar
        if (count === 0) {
            onFinish();
            return;
        }

        // Countdown cada segundo
        const timer = setTimeout(() => {
            setCount(count - 1);
        }, 1000);

        // Cleanup: limpiar timer si el componente se desmonta
        return () => clearTimeout(timer);
    }, [count, onFinish]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center">
            {/* Botón de cancelar (esquina superior derecha) */}
            <button
                onClick={onCancel}
                className="absolute top-8 right-8 text-white text-2xl hover:text-gray-200"
                title="Cancelar"
            >
                ✕
            </button>

            {/* Contador grande */}
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-white text-4xl font-bold mb-4">
                        ⏳ Prepárate
                    </h1>
                    <p className="text-indigo-200 text-xl">
                        El workout comenzará en...
                    </p>
                </div>

                {/* Número animado */}
                <div className="relative">
                    <div
                        className="text-white font-bold transition-all duration-300"
                        style={{
                            fontSize: '12rem',
                            lineHeight: '1',
                            animation: 'pulse 1s ease-in-out'
                        }}
                    >
                        {count}
                    </div>

                    {/* Círculo decorativo */}
                    <div
                        className="absolute inset-0 border-8 border-white rounded-full opacity-20"
                        style={{
                            animation: 'ping 1s ease-in-out'
                        }}
                    />
                </div>

                <p className="text-indigo-200 text-lg mt-8">
                    Deja el móvil y ponte en posición
                </p>
            </div>

            {/* CSS Animations inline (Tailwind no tiene estas) */}
            <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}

export default PreCountdown;