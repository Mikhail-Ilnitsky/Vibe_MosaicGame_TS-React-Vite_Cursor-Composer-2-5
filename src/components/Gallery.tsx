import { IMAGES } from '../data/images';
import { useLanguage } from '../i18n/LanguageContext';
import type { PuzzleImage } from '../types';

interface GalleryProps {
  onSelect: (image: PuzzleImage) => void;
}

export function Gallery({ onSelect }: GalleryProps) {
  const { locale, tr } = useLanguage();

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-6 text-neutral-500">{tr('galleryTitle')}</p>
      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6">
        {IMAGES.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onSelect(image)}
            className="group flex max-w-full flex-col items-center gap-2 rounded-xl p-2 transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
          >
            <div className="flex h-36 items-center justify-center sm:h-44">
              <img
                src={image.url}
                alt={image.title[locale]}
                className="max-h-full max-w-[min(100%,12rem)] w-auto object-contain sm:max-w-[14rem]"
                loading="lazy"
              />
            </div>
            <span className="text-sm text-neutral-600 sm:hidden">
              {image.title[locale]}
            </span>
            <span className="hidden rounded-md bg-neutral-900 px-3 py-1 text-sm text-white opacity-0 transition group-hover:opacity-100 sm:block">
              {image.title[locale]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
