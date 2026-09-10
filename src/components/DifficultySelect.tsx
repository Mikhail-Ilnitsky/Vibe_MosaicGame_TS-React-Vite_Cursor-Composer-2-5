import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { GridConfig, LoadedImageDimensions, PuzzleImage } from '../types';
import { computeGrid } from '../utils/grid';
import { loadImageDimensions } from '../utils/loadImage';

interface DifficultySelectProps {
  image: PuzzleImage;
  onSelect: (dimensions: LoadedImageDimensions, grid: GridConfig) => void;
  onExit: () => void;
}

const DIVISION_OPTIONS = [5, 6, 7, 8, 9, 10, 11];

export function DifficultySelect({ image, onSelect, onExit }: DifficultySelectProps) {
  const { locale, tr } = useLanguage();
  const [dimensions, setDimensions] = useState<LoadedImageDimensions | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDimensions(null);
    setError(false);

    loadImageDimensions(image.url)
      .then((dims) => {
        if (!cancelled) setDimensions(dims);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [image.url]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg text-neutral-800">{image.title[locale]}</p>
          <p className="mt-1 text-neutral-500">{tr('difficultyTitle')}</p>
          <p className="mt-1 text-sm text-neutral-400">{tr('difficultyHint')}</p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl bg-neutral-100 px-6 py-3 text-base font-medium text-neutral-800 transition hover:bg-neutral-200"
        >
          {tr('exit')}
        </button>
      </div>

      {!dimensions && !error && (
        <p className="text-neutral-500">{tr('loading')}</p>
      )}

      {error && (
        <p className="text-red-500">{tr('loading')}</p>
      )}

      {dimensions && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {DIVISION_OPTIONS.map((n) => {
            const grid = computeGrid(dimensions, n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => onSelect(dimensions, grid)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-5 text-lg font-medium text-neutral-900 shadow-sm transition hover:border-neutral-400 hover:shadow-md"
              >
                {tr('difficultyOption', { rows: grid.rows, cols: grid.cols })}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
