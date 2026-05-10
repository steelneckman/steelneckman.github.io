/**
 * Samples a text string on an offscreen canvas and returns an array of coordinates
 * that make up the text. These coordinates are used to spawn particles.
 * 
 * @param {string} text - The text to render (e.g. "Steelneck")
 * @param {number} particleCount - Desired number of particles
 * @param {number} canvasWidth - Window innerWidth
 * @param {number} canvasHeight - Window innerHeight
 * @returns {Array<{x: number, y: number}>} Array of target positions
 */
export function getTextParticlePositions(text, particleCount, canvasWidth, canvasHeight) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Responsive font size
  const fontSize = Math.min(canvasWidth * 0.15, 180);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imageData.data;
  
  // Collect all pixel coordinates that are filled (alpha > 128)
  const validPixels = [];
  
  // We can skip pixels to speed up the loop (e.g., sample every 4th pixel)
  const gap = 4;
  for (let y = 0; y < canvasHeight; y += gap) {
    for (let x = 0; x < canvasWidth; x += gap) {
      const index = (y * canvasWidth + x) * 4;
      const alpha = data[index + 3];
      
      if (alpha > 128) {
        validPixels.push({ x, y });
      }
    }
  }

  // If the text is somehow not rendering, fallback to center
  if (validPixels.length === 0) {
    const fallback = [];
    for (let i = 0; i < particleCount; i++) {
      fallback.push({ x: canvasWidth / 2, y: canvasHeight / 2 });
    }
    return fallback;
  }

  // Randomly select `particleCount` pixels from the valid pixels
  const selectedPositions = [];
  for (let i = 0; i < particleCount; i++) {
    const randomIndex = Math.floor(Math.random() * validPixels.length);
    selectedPositions.push(validPixels[randomIndex]);
  }

  return selectedPositions;
}
