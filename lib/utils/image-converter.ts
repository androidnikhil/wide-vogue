/**
 * Converts any image file (PNG, JPG, JPEG, GIF, BMP, AVIF, etc.) into high-quality WebP format in the browser.
 * Maintains original resolution and applies 90-92% quality compression without perceptible loss.
 */
export async function convertToWebP(file: File, quality = 0.92): Promise<File> {
  // If already WebP, return as-is
  if (file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')) {
    return file;
  }

  // If not an image (safety check), return original
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
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
          },
          'image/webp',
          quality
        );
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
export async function convertFilesToWebP(files: File[], quality = 0.92): Promise<File[]> {
  return Promise.all(files.map((file) => convertToWebP(file, quality)));
}
