/**
 * Converts any image file (PNG, JPG, JPEG, GIF, BMP, AVIF, WebP, etc.) into an optimized, high-quality WebP format.
 * - Caps maximum dimension proportionally to 1600px (retina-sharp for e-commerce with 2.4x zoom).
 * - Applies 82% quality compression with high-quality bicubic smoothing for ~80KB - 160KB file sizes without visible loss.
 * - Adaptively optimizes large images (>250KB) so page load times remain fast.
 */
export async function convertToWebP(
  file: File,
  quality = 0.82,
  maxDimension = 1600
): Promise<File> {
  // If not an image (safety check), return original
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If already WebP and already lightweight (<= 180KB), keep as-is
  if ((file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')) && file.size <= 180 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Proportionally scale down if larger than maxDimension (e.g. raw 4000x3000 camera photos)
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Enable high-quality bicubic image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const exportBlob = (q: number): Promise<Blob | null> =>
          new Promise((cb) => canvas.toBlob(cb, 'image/webp', q));

        // Primary pass with 82% quality
        let blob = await exportBlob(quality);

        // Adaptive second pass: if still > 250KB, step down to 78% for clean ~120-160KB payload
        if (blob && blob.size > 250 * 1024) {
          const adaptiveBlob = await exportBlob(0.78);
          if (adaptiveBlob && adaptiveBlob.size < blob.size) {
            blob = adaptiveBlob;
          }
        }

        if (!blob) {
          resolve(file);
          return;
        }

        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        const webpFile = new File([blob], `${cleanName}.webp`, {
          type: 'image/webp',
          lastModified: Date.now(),
        });

        resolve(webpFile);
      } catch (err) {
        console.warn('Canvas conversion to WebP failed, falling back to original file:', err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Converts an array of File objects to WebP files in parallel.
 */
export async function convertFilesToWebP(
  files: File[],
  quality = 0.82,
  maxDimension = 1600
): Promise<File[]> {
  return Promise.all(files.map((file) => convertToWebP(file, quality, maxDimension)));
}
