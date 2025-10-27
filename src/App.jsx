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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (page, path) => {
        setCurrentPage(page);
        setMobileMenuOpen(false); // Cerrar menú móvil al navegar
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
                                <h1 className="text-2xl font-bold text-indigo-600">NO FAT</h1>
                            </div>
                            {/* Desktop Navigation - Visible desde 768px (md:) */}
                            <div className="hidden md:ml-6 md:flex md:space-x-8">
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

                        {/* Right side - User info, logout, and burger */}
                        <div className="flex items-center space-x-4">
                            {/* User info y logout - Visible desde 768px (md:) */}
                            <div className="hidden md:flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    {currentUser?.name}
                                </span>
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src={currentUser?.photo}
                                    alt={currentUser?.name}
                                />
                                <button
                                    onClick={onLogout}
                                    className="text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
                                    title="Cerrar sesión"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>

                            {/* Mobile menu button - Visible hasta 768px (md:hidden) */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                aria-expanded={mobileMenuOpen}
                            >
                                <span className="sr-only">Abrir menú</span>
                                {/* Hamburger icon / Close icon */}
                                {!mobileMenuOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu - Visible hasta 768px (md:hidden) */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                        {/* Mobile user info */}
                        <div className="flex items-center px-3 py-3 border-b border-gray-200 mb-2">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={currentUser?.photo}
                                alt={currentUser?.name}
                            />
                            <span className="ml-3 text-base font-medium text-gray-900">
                                {currentUser?.name}
                            </span>
                        </div>

                        {/* Mobile navigation items */}
                        <button
                            onClick={() => handleNavigation('dashboard', '/dashboard')}
                            className={`${
                                currentPage === 'dashboard'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } w-full text-left block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-150`}
                        >
                            📊 Dashboard
                        </button>
                        <button
                            onClick={() => handleNavigation('rankings', '/rankings')}
                            className={`${
                                currentPage === 'rankings'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } w-full text-left block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-150`}
                        >
                            🏆 Rankings
                        </button>
                        <button
                            onClick={() => handleNavigation('profile', '/profile')}
                            className={`${
                                currentPage === 'profile'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } w-full text-left block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-150`}
                        >
                            👤 Mi Perfil
                        </button>

                        {/* Mobile logout button */}
                        <button
                            onClick={onLogout}
                            className="w-full text-left block pl-3 pr-4 py-3 border-l-4 border-transparent text-red-600 hover:bg-red-50 hover:text-red-800 text-base font-medium transition-colors duration-150"
                        >
                            🚪 Cerrar Sesión
                        </button>
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