import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { selectAllPlayers } from '../redux/slices/playersSlice';

function Login() {
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const dispatch = useDispatch();
    const players = useSelector(selectAllPlayers);

    const handleLogin = (e) => {
        e.preventDefault();
        const player = players.find((p) => p.id === selectedPlayerId);
        if (player) {
            dispatch(login(player));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    NO FAT
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Inicia sesión para continuar
                </p>
                <form onSubmit={handleLogin}>
                    <select
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Selecciona tu usuario</option>
                        {players.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;