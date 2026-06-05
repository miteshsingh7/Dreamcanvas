import { useState } from 'react';

const quickSuggestions = [
  'Cyberpunk City',
  'Anime Sunset',
  'Neon Waves',
  'Fantasy Forest',
  'Galaxy Nebula',
  'Underwater',
];

const aspectRatios = [
  { key: 'portrait', label: 'Portrait' },
  { key: 'landscape', label: 'Landscape' },
  { key: 'square', label: 'Square' },
];

function Hero({ onSearch, settings, onSettingsChange }) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onSearch(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearch(suggestion);
  };

  const currentAspectRatio = settings?.aspectRatio || 'landscape';

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Create wallpapers
          <br />
          with a single prompt.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
          Describe what you want — our AI generates it in seconds.
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <div
            className={`flex items-center gap-2 p-2 border rounded-xl transition-all duration-200 ${
              isFocused
                ? 'border-orange-500/50 bg-white/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your dream wallpaper..."
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none px-4 py-3 text-lg"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="px-6 py-3 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Hint text */}
        <p className="text-gray-600 text-sm mb-6">
          Try: neon cityscape, anime landscape, abstract waves
        </p>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-1 mb-8">
          {quickSuggestions.map((suggestion, index) => (
            <span key={suggestion} className="flex items-center">
              <button
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-gray-500 hover:text-orange-400 text-sm cursor-pointer transition-colors"
              >
                {suggestion}
              </button>
              {index < quickSuggestions.length - 1 && (
                <span className="text-gray-700 mx-2">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {aspectRatios.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onSettingsChange({ aspectRatio: key })}
              className={`border px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                currentAspectRatio === key
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                  : 'border-white/10 text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Generation note */}
        <p className="text-gray-600 text-xs mt-4">
          Generation takes just a few seconds
        </p>
      </div>
    </section>
  );
}

export default Hero;