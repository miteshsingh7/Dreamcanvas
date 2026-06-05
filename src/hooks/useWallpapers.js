import { useState, useEffect, useCallback } from 'react';
import { generateWallpapers as generateFromAPI } from '../services/api';

// Helper to read/write localStorage safely
const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch { return fallback; }
};

const setStoredItem = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export const useWallpapers = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState(() => getStoredItem('dreamcanvas_likes', []));
  const [searchHistory, setSearchHistory] = useState(() => getStoredItem('dreamcanvas_history', []));
  const [settings, setSettings] = useState(() => {
    const stored = getStoredItem('dreamcanvas_settings', {});
    return {
      aspectRatio: 'square',
    };
  });

  // Sync settings to localStorage
  useEffect(() => {
    setStoredItem('dreamcanvas_settings', settings);
  }, [settings]);

  // Sync likes to localStorage
  useEffect(() => {
    setStoredItem('dreamcanvas_likes', likedIds);
  }, [likedIds]);

  // Sync history to localStorage
  useEffect(() => {
    setStoredItem('dreamcanvas_history', searchHistory);
  }, [searchHistory]);

  const generate = useCallback(async (prompt) => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearchQuery(prompt);

    // Add to history (max 20, no duplicates)
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== prompt);
      return [prompt, ...filtered].slice(0, 20);
    });

    try {
      const result = await generateFromAPI(prompt, 4, settings);
      setImages(result);
    } catch (err) {
      setError(err.message || 'Failed to generate images');
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const toggleLike = useCallback((id) => {
    setLikedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const isLiked = useCallback((id) => likedIds.includes(id), [likedIds]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    images, isLoading, error, searchQuery, searchHistory,
    settings, generate, toggleLike, isLiked, updateSettings, clearError,
  };
};
