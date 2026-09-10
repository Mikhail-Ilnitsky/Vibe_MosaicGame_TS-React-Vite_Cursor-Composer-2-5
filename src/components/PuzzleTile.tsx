import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { GridConfig } from '../types';
import { getTileBackgroundStyle } from '../utils/grid';

interface PuzzleTileProps {
  tileId: number;
  col: number;
  row: number;
  grid: GridConfig;
  imageUrl: string;
  selected?: boolean;
  placeholder?: boolean;
  variant?: 'grid' | 'floating';
  style?: CSSProperties;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>, tileId: number) => void;
}

export function PuzzleTile({
  tileId,
  col,
  row,
  grid,
  imageUrl,
  selected = false,
  placeholder = false,
  variant = 'grid',
  style,
  onPointerDown,
}: PuzzleTileProps) {
  const bgStyle = getTileBackgroundStyle(col, row, grid, imageUrl);
  const floating = variant === 'floating';

  return (
    <div
      role={floating ? undefined : 'button'}
      tabIndex={floating ? undefined : 0}
      data-tile-id={tileId}
      onPointerDown={
        onPointerDown ? (e) => onPointerDown(e, tileId) : undefined
      }
      className={`box-border border border-white/60 ${
        placeholder ? 'invisible' : ''
      } ${
        floating
          ? 'pointer-events-none z-50 opacity-90 shadow-lg'
          : 'relative z-0 touch-none'
      } ${selected && !floating && !placeholder ? 'ring-2 ring-neutral-900 ring-offset-1' : ''}`}
      style={{
        ...bgStyle,
        ...style,
        cursor: floating ? 'grabbing' : 'pointer',
      }}
    />
  );
}
