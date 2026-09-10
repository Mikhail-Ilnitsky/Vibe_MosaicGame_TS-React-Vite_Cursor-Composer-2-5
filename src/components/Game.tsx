import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { GridConfig, PuzzleImage, PuzzleTile } from '../types';
import { createTiles } from '../utils/grid';
import { isSolved, shuffleBySwaps } from '../utils/shuffle';
import { PuzzleBoard } from './PuzzleBoard';

interface GameProps {
  image: PuzzleImage;
  grid: GridConfig;
  onExit: () => void;
  onNewGame: () => void;
}

export function Game({
  image,
  grid,
  onExit,
  onNewGame,
}: GameProps) {
  const { tr } = useLanguage();
  const tiles = useMemo(() => createTiles(grid), [grid]);

  const [order, setOrder] = useState<number[]>(() =>
    shuffleBySwaps(tiles.map((t) => t.id)),
  );
  const [moves, setMoves] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [won, setWon] = useState(false);
  const [flashWin, setFlashWin] = useState(false);
  const [showCompletedImage, setShowCompletedImage] = useState(false);

  if (isSolved(order) && !won) {
    setWon(true);
    setFlashWin(true);
  }

  useEffect(() => {
    if (!flashWin) return;
    const flashTimer = window.setTimeout(() => {
      setFlashWin(false);
      setShowCompletedImage(true);
    }, 500);
    return () => window.clearTimeout(flashTimer);
  }, [flashWin]);

  const handleSwap = useCallback(
    (slotA: number, slotB: number) => {
      if (won) return;
      setOrder((prev) => {
        const next = [...prev];
        [next[slotA], next[slotB]] = [next[slotB], next[slotA]];
        return next;
      });
      setMoves((m) => m + 1);
    },
    [won],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="text-base text-neutral-700">{tr('moves', { count: moves })}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowOriginal((v) => !v)}
            disabled={won}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {tr(showOriginal ? 'hideOriginal' : 'showOriginal')}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl bg-neutral-100 px-5 py-3 text-base font-medium text-neutral-800 transition hover:bg-neutral-200"
          >
            {tr('exit')}
          </button>
        </div>
      </div>

      <PuzzleBoard
        tiles={tiles as PuzzleTile[]}
        order={order}
        grid={grid}
        imageUrl={image.url}
        showOriginal={showOriginal && !won}
        flashWin={flashWin}
        showCompletedImage={showCompletedImage}
        disabled={won}
        compact={won}
        onSwap={handleSwap}
      />

      {won && (
        <div className="flex shrink-0 animate-[fadeIn_0.5s_ease-out] flex-col items-center gap-4 pb-2 pt-2">
          <p className="text-xl font-medium text-neutral-900">{tr('winMessage')}</p>
          <p className="text-neutral-600">{tr('winMoves', { count: moves })}</p>
          <button
            type="button"
            onClick={onNewGame}
            className="rounded-xl bg-neutral-900 px-8 py-4 text-lg font-medium text-white transition hover:bg-neutral-800"
          >
            {tr('newGame')}
          </button>
        </div>
      )}
    </div>
  );
}
