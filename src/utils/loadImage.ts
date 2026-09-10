import type { LoadedImageDimensions } from '../types';

export function loadImageDimensions(url: string): Promise<LoadedImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
