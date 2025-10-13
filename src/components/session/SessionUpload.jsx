import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadSession } from '../../redux/slices/sessionsSlice';

function SessionUpload({ playerId }) {
    const dispatch = useDispatch();
    const [photo, setPhoto] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const response = dispatch(
            uploadSession({
                playerId,
                photo: photo || 'https://via.placeholder.com/300?text=Sesión',
                result,
                date: new Date().toISOString(),
            })
        );

        setLoading(false);

        if (response.success) {
            alert('✅ ¡Sesión registrada con éxito!');
            setPhoto('');
            setResult('');
        } else {
            alert(`❌ Error: ${response.error}`);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">📸 Registrar Nueva Sesión</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la Foto (opcional)
                    </label>
                    <input
                        type="url"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        placeholder="https://ejemplo.com/foto.jpg"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resultado / Tiempo *
                    </label>
                    <input
                        type="text"
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        placeholder="Ej: 12:45, 50 reps, etc."
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
                >
                    {loading ? 'Subiendo...' : '✅ Registrar Sesión'}
                </button>
            </form>
        </div>
    );
}

export default SessionUpload;
