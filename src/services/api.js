export const generateWallpapers = async (prompt, count = 4) => {
  const enhancedPrompt = `${prompt}, highly detailed, masterpiece, 8k resolution, photorealistic`;
  const successfulImages = [];

  // We fetch from our local backend proxy sequentially to avoid overwhelming Cloudflare's concurrent limits
  for (let i = 0; i < count; i++) {
    // We append a random style tag to the prompt to force variations
    const uniquePrompt = `${enhancedPrompt} [variation ${Math.floor(Math.random() * 10000)}]`;
    
    try {
      const response = await fetch('/api/generate', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: uniquePrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Request ${i + 1} failed:`, errorData.error || response.status);
        continue; // Skip this one and try the next
      }

      // The backend returns the raw image binary
      const blob = await response.blob();
      
      successfulImages.push({
        id: `img-${Date.now()}-${i}`,
        url: URL.createObjectURL(blob),
        prompt: prompt,
        resolution: '1024×1024',
      });
    } catch (err) {
      console.error(`Failed to generate image ${i + 1}:`, err.message);
    }
  }

  if (successfulImages.length === 0) {
    throw new Error('Cloudflare failed to generate any images. Please try again.');
  }

  return successfulImages;
};