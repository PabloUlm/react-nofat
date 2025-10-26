// src/components/workout/CameraCapture.jsx
import { useState, useRef, useEffect } from 'react';

function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' o 'environment'

    // Iniciar cámara
    useEffect(() => {
        startCamera();

        // Cleanup: detener cámara al desmontar
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const startCamera = async () => {
        try {
            // Solicitar acceso a la cámara
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode, // 'user' = frontal, 'environment' = trasera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setHasPermission(true);
                setError(null);
            }
        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
            setError('No se pudo acceder a la cámara. Verifica los permisos.');
            setHasPermission(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const switchCamera = () => {
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        // Configurar canvas al tamaño del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dibujar frame actual del video en el canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Comprimir y redimensionar
        const compressedImage = compressImage(canvas);
        setCapturedImage(compressedImage);

        // Detener cámara para ahorrar batería
        stopCamera();
    };

    const compressImage = (canvas) => {
        // Crear canvas temporal para redimensionar
        const maxSize = 800; // Max ancho/alto en px
        let width = canvas.width;
        let height = canvas.height;

        // Calcular nuevo tamaño manteniendo aspect ratio
        if (width > height) {
            if (width > maxSize) {
                height = Math.round((height * maxSize) / width);
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
            }
        }

        // Crear nuevo canvas con tamaño reducido
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;

        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, width, height);

        // Convertir a base64 con compresión JPEG 70%
        return tempCanvas.toDataURL('image/jpeg', 0.7);
    };

    const handleUsePhoto = () => {
        onCapture(capturedImage);
        onClose();
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900/80 p-4 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">📸 Capturar Foto</h2>
                <button
                    onClick={onClose}
                    className="text-white text-2xl hover:text-gray-300"
                >
                    ✕
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
                {/* Error */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
                            <p className="font-bold mb-2">❌ Error</p>
                            <p className="text-sm">{error}</p>
                            <button
                                onClick={startCamera}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                )}

                {/* Video preview (cámara activa) */}
                {hasPermission && !capturedImage && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Imagen capturada */}
                {capturedImage && (
                    <img
                        src={capturedImage}
                        alt="Captura"
                        className="w-full h-full object-contain"
                    />
                )}

                {/* Canvas oculto para captura */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controles */}
            <div className="bg-gray-900/80 p-6">
                {!capturedImage ? (
                    // Controles de captura
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {/* Botón cambiar cámara */}
                        <button
                            onClick={switchCamera}
                            className="text-white p-4 hover:bg-white/10 rounded-full transition"
                            title="Cambiar cámara"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        {/* Botón capturar (grande) */}
                        <button
                            onClick={capturePhoto}
                            disabled={!hasPermission}
                            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-full h-full rounded-full bg-white"></div>
                        </button>

                        {/* Espacio vacío para balance visual */}
                        <div className="w-16"></div>
                    </div>
                ) : (
                    // Controles después de captura
                    <div className="flex gap-4 max-w-md mx-auto">
                        <button
                            onClick={handleRetake}
                            className="flex-1 bg-gray-700 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                            🔄 Volver a tomar
                        </button>
                        <button
                            onClick={handleUsePhoto}
                            className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            ✅ Usar esta foto
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CameraCapture;