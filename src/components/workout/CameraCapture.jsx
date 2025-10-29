// src/components/workout/CameraCapture.jsx
import { useState, useRef, useEffect } from 'react';

function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [facingMode, setFacingMode] = useState('user'); // Empezar con frontal por compatibilidad

    // Iniciar cámara
    useEffect(() => {
        startCamera();

        // Cleanup: detener cámara al desmontar
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const startCamera = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🎥 Intentando acceder a la cámara...');
            console.log('📱 Modo:', facingMode);

            // Verificar si getUserMedia está disponible
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Tu navegador no soporta acceso a la cámara');
            }

            // Primero intentar con facingMode específico
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: facingMode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });
                console.log('✅ Cámara con facingMode obtenida');
            } catch (err) {
                console.warn('⚠️ Falló facingMode, intentando sin especificar...', err);
                // Fallback: intentar sin facingMode (útil en desktop)
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });
                console.log('✅ Cámara sin facingMode obtenida');
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Esperar a que el video esté listo
                await new Promise((resolve, reject) => {
                    videoRef.current.onloadedmetadata = () => {
                        console.log('✅ Video metadata cargada');
                        console.log('📐 Dimensiones:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                        resolve();
                    };
                    videoRef.current.onerror = (err) => {
                        console.error('❌ Error en video:', err);
                        reject(err);
                    };

                    // Timeout de seguridad
                    setTimeout(() => reject(new Error('Timeout cargando video')), 10000);
                });

                // Reproducir el video explícitamente
                try {
                    await videoRef.current.play();
                    console.log('▶️ Video reproduciendo');
                } catch (playErr) {
                    console.warn('⚠️ Error al reproducir (podría ser normal):', playErr);
                }

                setHasPermission(true);
                setError(null);
                console.log('✅ Cámara lista');
            }
        } catch (err) {
            console.error('❌ Error al acceder a la cámara:', err);
            console.error('Error name:', err.name);
            console.error('Error message:', err.message);

            let errorMessage = 'No se pudo acceder a la cámara.';

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = '🚫 Permiso denegado. Debes permitir el acceso a la cámara en la configuración de tu navegador.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage = '📷 No se encontró ninguna cámara en tu dispositivo.';
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage = '⚠️ La cámara está siendo usada por otra aplicación. Cierra otras apps que usen la cámara.';
            } else if (err.name === 'OverconstrainedError') {
                errorMessage = '⚙️ Tu cámara no cumple con los requisitos técnicos.';
            } else {
                errorMessage = `❌ Error: ${err.message || 'Error desconocido'}`;
            }

            setError(errorMessage);
            setHasPermission(false);
        } finally {
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
            console.error('❌ Video no tiene dimensiones válidas');
            setError('⚠️ El video no está listo. Espera un momento e intenta de nuevo.');
            return;
        }

        console.log('📸 Capturando foto...');
        console.log('📐 Tamaño video:', video.videoWidth, 'x', video.videoHeight);

        // Configurar canvas al tamaño del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dibujar frame actual del video en el canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Comprimir y redimensionar
        const compressedImage = compressImage(canvas);
        console.log('✅ Foto capturada, tamaño:', Math.round(compressedImage.length / 1024), 'KB');

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

        console.log('🔧 Redimensionando de', canvas.width, 'x', canvas.height, 'a', width, 'x', height);

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
        console.log('✅ Usando foto capturada');
        onCapture(capturedImage);
        onClose();
    };

    const handleRetake = () => {
        console.log('🔄 Retomando foto...');
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
                        console.log('❌ Cerrando cámara');
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
                {isLoading && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                            <p className="text-white text-lg font-semibold">Iniciando cámara...</p>
                            <p className="text-gray-300 text-sm mt-2">Permite el acceso si te lo solicita</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
                            <p className="font-bold mb-2 text-lg">⚠️ Error</p>
                            <p className="text-sm mb-4 whitespace-pre-line">{error}</p>
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

                {/* Video preview (cámara activa) */}
                {hasPermission && !capturedImage && !error && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
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

                {/* Debug info (solo en dev) */}
                {hasPermission && !capturedImage && !error && (
                    <div className="absolute top-16 left-4 bg-black/50 text-white text-xs p-2 rounded font-mono">
                        📹 {facingMode === 'user' ? 'Frontal' : 'Trasera'}
                        <br />
                        📐 {videoRef.current?.videoWidth || 0} x {videoRef.current?.videoHeight || 0}
                    </div>
                )}
            </div>

            {/* Controles */}
            <div className="bg-gray-900/80 p-6">
                {!capturedImage ? (
                    // Controles de captura
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {/* Botón cambiar cámara */}
                        <button
                            onClick={switchCamera}
                            disabled={!hasPermission}
                            className="text-white p-4 hover:bg-white/10 rounded-full transition disabled:opacity-30"
                            title="Cambiar cámara"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        {/* Botón capturar (grande) */}
                        <button
                            onClick={capturePhoto}
                            disabled={!hasPermission || isLoading}
                            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400"></div>
                            )}
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