// src/App.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser, logout } from './redux/slices/authSlice';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RankingsPage from './pages/RankingsPage';
import Profile from './pages/Profile';
import WorkoutSession from './pages/WorkoutSession';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);

    const handleLogout = () => {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            dispatch(logout());
            navigate('/');
        }
    };

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <Routes>
            {/* Ruta de Workout Session (sin navbar) */}
            <Route path="/workout-session" element={<WorkoutSession />} />

            {/* Rutas con Navbar */}
            <Route path="/*" element={<MainLayout onLogout={handleLogout} currentUser={currentUser} />} />
        </Routes>
    );
}

// Layout principal con Navbar
function MainLayout({ onLogout, currentUser }) {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const navigate = useNavigate();

    const handleNavigation = (page, path) => {
        setCurrentPage(page);
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold text-indigo-600">💪 FitTracker</h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <button
                                    onClick={() => handleNavigation('dashboard', '/dashboard')}
                                    className={`${
                                        currentPage === 'dashboard'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => handleNavigation('rankings', '/rankings')}
                                    className={`${
                                        currentPage === 'rankings'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Rankings
                                </button>
                                <button
                                    onClick={() => handleNavigation('profile', '/profile')}
                                    className={`${
                                        currentPage === 'profile'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Mi Perfil
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-4">
                                {currentUser?.name}
                            </span>
                            <img
                                className="h-8 w-8 rounded-full"
                                src={currentUser?.photo}
                                alt={currentUser?.name}
                            />
                            <button
                                onClick={onLogout}
                                className="ml-4 text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
                                title="Cerrar sesión"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/rankings" element={<RankingsPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;