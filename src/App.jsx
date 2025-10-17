// src/App.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from './redux/slices/authSlice';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RankingsPage from './pages/RankingsPage';
import Profile from './pages/Profile';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);

    if (!isAuthenticated) {
        return <Login />;
    }

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
                                    onClick={() => setCurrentPage('dashboard')}
                                    className={`${
                                        currentPage === 'dashboard'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setCurrentPage('rankings')}
                                    className={`${
                                        currentPage === 'rankings'
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Rankings
                                </button>
                                <button
                                    onClick={() => setCurrentPage('profile')}
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
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'rankings' && <RankingsPage />}
                {currentPage === 'profile' && <Profile />}
            </main>
        </div>
    );
}

export default App;