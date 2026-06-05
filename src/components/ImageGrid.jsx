import { useState } from 'react';
import { Download, Heart, Maximize2, Copy, Check, ImageIcon } from 'lucide-react';

function WallpaperCard({ image, onDownload, onLike, isLiked }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleViewFull = (e) => {
    e.stopPropagation();
    window.open(image.url, '_blank');
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-orange-500/40 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shimmer / Skeleton overlay */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-10 bg-neutral-900 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 animate-pulse" />
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-10 h-10 text-gray-600" />
          </div>
        </div>
      )}

      {/* Image */}
      <img
        src={image.url}
        alt={image.prompt}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-64 md:h-72 object-cover transition-transform duration-500 ${
          isHovered ? 'scale-110' : 'scale-100'
        } ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2 py-1 bg-black/60 rounded-md text-xs text-orange-400 border border-orange-500/30">
            {image.resolution || 'HD'}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Prompt */}
          <p className="text-white text-sm font-medium mb-3 line-clamp-2">
            {image.prompt}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Download */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(image);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black text-xs font-semibold transition-colors duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              Save
            </button>

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(image.id);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isLiked
                  ? 'bg-orange-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Copy Prompt */}
            <button
              onClick={handleCopyPrompt}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
              title="Copy prompt"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* View Full */}
            <button
              onClick={handleViewFull}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 ml-auto"
              title="View full size"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-neutral-900 border border-white/5 animate-pulse">
      <div className="w-full h-64 md:h-72 bg-neutral-800">
        <div className="h-full w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900" />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function ImageGrid({ images, isLoading, onDownload, onLike, isLiked }) {
  // Loading state - show skeletons
  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <WallpaperCard
              key={image.id}
              image={image}
              onDownload={onDownload}
              onLike={onLike}
              isLiked={isLiked(image.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImageGrid;