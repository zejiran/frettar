import { Navigation } from '@/components/Navigation';
import { About } from '@/pages/About';
import { Fretboard } from '@/pages/Fretboard';
import { Home } from '@/pages/Home';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <ScrollToTop />
        <Navigation />

        <Routes>
          <Route path="/" element={<Fretboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img
                  src="https://user-images.githubusercontent.com/30379522/193643568-4aac8ba2-4b08-4943-a043-963baa30df93.png"
                  alt="Frettar Logo"
                  className="w-16 h-16"
                />
              </div>

              <p className="text-lg font-medium text-gray-800 mb-4">
                © {new Date().getFullYear()} Frettar - Built for Guitar Education
              </p>

              <p className="text-gray-600 mb-4">
                Made with ❤️ for musicians and educators
              </p>

              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <span>Developed by Juan Alegría</span>
                <span>•</span>
                <a
                  href="https://github.com/zejiran/frettar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};
