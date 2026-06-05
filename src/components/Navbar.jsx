import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'gallery', label: 'Gallery' },
];

function Navbar({ currentView, onViewChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (key) => {
    onViewChange(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="hover:opacity-80 transition-opacity"
          >
            <span className="font-display text-xl font-bold text-orange-400">
              DreamCanvas
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`transition-colors duration-200 ${
                  currentView === item.key
                    ? 'text-orange-400 font-semibold'
                    : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-orange-400 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.key
                    ? 'text-orange-400 font-semibold bg-orange-500/10'
                    : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;