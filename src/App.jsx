import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageGrid from './components/ImageGrid';
import Footer from './components/Footer';
import { useWallpapers } from './hooks/useWallpapers';

function App() {
  const {
    images, isLoading, error, searchQuery,
    settings, generate, toggleLike, isLiked, updateSettings, clearError,
  } = useWallpapers();
  
  const [currentView, setCurrentView] = useState('home');
  const [toast, setToast] = useState(null);
  const searchInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = async (image) => {
    try {
      showToast('Starting download...');
      const response = await fetch(image.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `dreamcanvas-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showToast('Download complete!');
    } catch (err) {
      showToast('Download failed. Try opening the image instead.', 'error');
    }
  };

  const handleSearch = (prompt) => {
    setCurrentView('home');
    generate(prompt);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'home' && images.length === 0 && !isLoading && (
        <Hero onSearch={handleSearch} settings={settings} onSettingsChange={updateSettings} />
      )}

      {currentView === 'home' && (images.length > 0 || isLoading) && (
        <div className="pt-24 pb-8 px-4 bg-black border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 p-2 border border-white/10 bg-white/5 rounded-xl transition-all duration-200 focus-within:border-orange-500/50">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Try another prompt..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleSearch(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none px-4 py-3"
                />
                <button
                  onClick={() => {
                    const input = searchInputRef.current;
                    if (input && input.value.trim()) {
                      handleSearch(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-6 py-3 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-black transition-colors duration-200"
                >
                  Generate
                </button>
              </div>
              {searchQuery && (
                <p className="text-gray-500 text-sm mt-3 text-center">
                  Results for: <span className="text-orange-400 font-medium">"{searchQuery}"</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-4">✕</button>
          </div>
        </div>
      )}

      {currentView === 'gallery' && (
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Your Gallery</h2>
            <p className="text-gray-500 mb-8">Wallpapers you've liked</p>
            {images.filter(img => isLiked(img.id)).length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No liked wallpapers yet. Generate some and hit the ♥ button!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'home' && (
        <ImageGrid
          images={images}
          isLoading={isLoading}
          onDownload={handleDownload}
          onLike={toggleLike}
          isLiked={isLiked}
        />
      )}

      {currentView === 'gallery' && images.filter(img => isLiked(img.id)).length > 0 && (
        <ImageGrid
          images={images.filter(img => isLiked(img.id))}
          isLoading={false}
          onDownload={handleDownload}
          onLike={toggleLike}
          isLiked={isLiked}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-medium animate-fade-in ${
          toast.type === 'error'
            ? 'bg-red-500/90 text-white'
            : 'bg-orange-500 text-black'
        }`}>
          {toast.message}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;