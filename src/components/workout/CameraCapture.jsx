// src/components/workout/CameraCapture.jsx
// Versión híbrida: Simple pero con todas las características
import { useState, useRef, useEffect } from 'react';

function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [capturedImage, setCapturedImage] = useState(null);
    const [facingMode, setFacingMode] = useState('user');

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🎥 Iniciando cámara...');
            console.log('📱 Modo:', facingMode);

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Tu navegador no soporta acceso a la cámara');
            }

            // Intentar con facingMode primero, si falla, sin facingMode
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: facingMode } },
                    audio: false
                });
                console.log('✅ Stream con facingMode obtenido');
            } catch (err) {
                console.warn('⚠️ Fallback sin facingMode');
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
                console.log('✅ Stream sin facingMode obtenido');
            }

            console.log('📹 Tracks:', stream.getTracks());
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                console.log('📹 Stream asignado a video');

                // Dar un momento y forzar play
                setTimeout(async () => {
                    try {
                        if (videoRef.current) {
                            await videoRef.current.play();
                            console.log('▶️ Play ejecutado');
                        }
                    } catch (playErr) {
                        console.warn('⚠️ Play error (puede ser normal):', playErr.message);
                    }
                    setIsLoading(false);
                }, 200);
            }
        } catch (err) {
            console.error('❌ Error:', err);

            let errorMessage = 'No se pudo acceder a la cámara.';

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = '🚫 Permiso denegado. Por favor permite el acceso a la cámara.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage = '📷 No se encontró ninguna cámara en tu dispositivo.';
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage = '⚠️ La cámara está siendo usada por otra aplicación.';
            } else {
                errorMessage = `❌ Error: ${err.message}`;
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log('🛑 Track detenido:', track.kind);
            });
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const switchCamera = () => {
        console.log('🔄 Cambiando cámara...');
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            console.error('❌ Video o canvas no disponible');
            return;
        }

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('❌ Video sin dimensiones');
            setError('⚠️ El video no está listo. Espera un momento.');
            return;
        }

        console.log('📸 Capturando foto...');
        console.log('📐 Dimensiones:', video.videoWidth, 'x', video.videoHeight);

        // Configurar canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Capturar frame
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Comprimir
        const compressedImage = compressImage(canvas);
        console.log('✅ Foto capturada:', Math.round(compressedImage.length / 1024), 'KB');

        setCapturedImage(compressedImage);
        stopCamera();
    };

    const compressImage = (canvas) => {
        const maxSize = 800;
        let width = canvas.width;
        let height = canvas.height;

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

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;

        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, width, height);

        return tempCanvas.toDataURL('image/jpeg', 0.7);
    };

    const handleUsePhoto = () => {
        console.log('✅ Usando foto');
        onCapture(capturedImage);
        onClose();
    };

    const handleRetake = () => {
        console.log('🔄 Retomando...');
        setCapturedImage(null);
        startCamera();
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900/80 p-4 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">📸 Capturar Foto</h2>
                <button
                    onClick={() => {
                        stopCamera();
                        onClose();
                    }}
                    className="text-white text-2xl hover:text-gray-300"
                >
                    ✕
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
                {/* Loading */}
                {isLoading && !error && !capturedImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                            <p className="text-white text-lg font-semibold">Iniciando cámara...</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
                            <p className="font-bold mb-2 text-lg">⚠️ Error</p>
                            <p className="text-sm mb-4">{error}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={startCamera}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
                                >
                                    🔄 Reintentar
                                </button>
                                <button
                                    onClick={() => {
                                        stopCamera();
                                        onClose();
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video preview */}
                {!capturedImage && !error && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{
                            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                            backgroundColor: '#000'
                        }}
                        onLoadedMetadata={(e) => {
                            console.log('📋 Metadata loaded:', e.target.videoWidth, 'x', e.target.videoHeight);
                        }}
                        onCanPlay={() => console.log('🎬 Can play')}
                        onPlaying={() => console.log('▶️ Playing')}
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

                {/* Canvas oculto */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controles */}
            <div className="bg-gray-900/80 p-6">
                {!capturedImage ? (
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {/* Cambiar cámara */}
                        <button
                            onClick={switchCamera}
                            disabled={isLoading || error}
                            className="text-white p-4 hover:bg-white/10 rounded-full transition disabled:opacity-30"
                            title="Cambiar cámara"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        {/* Capturar */}
                        <button
                            onClick={capturePhoto}
                            disabled={isLoading || error}
                            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400"></div>
                        </button>

                        {/* Espacio */}
                        <div className="w-16"></div>
                    </div>
                ) : (
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