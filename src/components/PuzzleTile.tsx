import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { GridConfig } from '../types';
import { getTileBackgroundStyle } from '../utils/grid';

interface PuzzleTileProps {
  tileId: number;
  col: number;
  row: number;
  grid: GridConfig;
  imageUrl: string;
  selected: boolean;
  hidden: boolean;
  dragging: boolean;
  dragStyle?: CSSProperties;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>, tileId: number) => void;
}

export function PuzzleTile({
  tileId,
  col,
  row,
  grid,
  imageUrl,
  selected,
  hidden,
  dragging,
  dragStyle,
  onPointerDown,
}: PuzzleTileProps) {
  const bgStyle = getTileBackgroundStyle(col, row, grid, imageUrl);

  return (
    <div
      role="button"
      tabIndex={0}
      data-tile-id={tileId}
      onPointerDown={(e) => onPointerDown(e, tileId)}
      className={`relative box-border touch-none border border-white/60 ${
        hidden ? 'invisible' : ''
      } ${dragging ? 'z-50 opacity-90 shadow-lg' : 'z-0'} ${
        selected && !dragging ? 'ring-2 ring-neutral-900 ring-offset-1' : ''
      }`}
      style={{
        ...bgStyle,
        ...dragStyle,
        cursor: dragging ? 'grabbing' : 'pointer',
      }}
    />
  );
}
