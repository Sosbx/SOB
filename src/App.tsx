import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Stethoscope, 
  Menu, 
  X, 
  User,
  ClipboardList,
  Waves,
  FileText,
  UserCircle2
} from 'lucide-react';
import ObservationPage from './pages/ObservationPage';
import EchoPage from './pages/EchoPage';
import PrescriptionPage from './pages/PrescriptionPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  const { profile } = useUserStore();

  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.lastName[0]}${profile.firstName[0]}`.toUpperCase();
    }
    return null;
  };

  const getSubtitle = () => {
    switch (location.pathname) {
      case '/echo':
        return 'Compte rendu d\'échographie';
      case '/prescription':
        return 'Ordonnances';
      case '/profile':
        return 'Profil Médecin';
      default:
        return 'Observations médicales';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-lg fixed w-full top-0 z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-indigo-600 hover:text-indigo-700 focus:outline-none transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex items-center justify-center flex-col">
              <h1 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center gap-3 font-black drop-shadow-sm">
                <Stethoscope className="h-8 w-8 text-indigo-600 drop-shadow" />
                <div className="flex items-baseline tracking-tight">
                  <span>S</span>
                  <span>O</span>
                  <span className="font-light">b</span>
                  <span>s</span>
                  <span className="font-light">erv</span>
                </div>
              </h1>
              <h2 className="text-sm text-indigo-600/80 mt-0.5 font-medium">{getSubtitle()}</h2>
            </div>
            
            <Link
              to="/profile"
              className="text-indigo-600 hover:text-indigo-700 focus:outline-none transition-colors duration-200 group flex items-center gap-2"
            >
              {user ? (
                getInitials() ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-700">
                    {getInitials()}
                  </div>
                ) : (
                  <User className="h-6 w-6" />
                )
              ) : (
                <>
                  <User className="h-6 w-6" />
                  <span className="text-sm text-indigo-600/70 group-hover:text-indigo-700/70">
                    (mode invité)
                  </span>
                </>
              )}
            </Link>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 transform transition-transform duration-200">
            <div className="h-full flex flex-col">
              <div className="pt-24 px-6 pb-6 flex-1">
                <nav className="space-y-2">
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    Observations médicales
                  </Link>
                  <Link 
                    to="/echo" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Waves className="h-5 w-5" />
                    Échographie
                  </Link>
                  <Link 
                    to="/prescription" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5" />
                    Ordonnances
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle2 className="h-5 w-5" />
                    Profil
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-24">
        <Routes>
          <Route path="/" element={<ObservationPage />} />
          <Route path="/echo" element={
            <ProtectedRoute>
              <EchoPage />
            </ProtectedRoute>
          } />
          <Route path="/prescription" element={
            <ProtectedRoute>
              <PrescriptionPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;