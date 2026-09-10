import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { GridConfig, PuzzleTile as PuzzleTileType } from '../types';
import { computeDisplayScale, getCroppedImageStyle } from '../utils/grid';
import { useAvailableSize } from '../hooks/useAvailableSize';
import { PuzzleTile } from './PuzzleTile';

interface PuzzleBoardProps {
  tiles: PuzzleTileType[];
  order: number[];
  grid: GridConfig;
  imageUrl: string;
  showOriginal: boolean;
  flashWin: boolean;
  showCompletedImage: boolean;
  disabled: boolean;
  onSwap: (indexA: number, indexB: number) => void;
}

interface DragState {
  tileId: number;
  slotIndex: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  tileSize: number;
  moved: boolean;
}

export function PuzzleBoard({
  tiles,
  order,
  grid,
  imageUrl,
  showOriginal,
  flashWin,
  showCompletedImage,
  disabled,
  onSwap,
}: PuzzleBoardProps) {
  const { ref: areaRef, width: areaWidth, height: areaHeight } = useAvailableSize<HTMLDivElement>();
  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const scale = useMemo(
    () => (areaWidth && areaHeight ? computeDisplayScale(grid, areaWidth, areaHeight) : 1),
    [areaWidth, areaHeight, grid],
  );

  const boardWidth = grid.cropWidth * scale;
  const boardHeight = grid.cropHeight * scale;
  const tileDisplaySize = grid.tileSize * scale;

  const tileById = useMemo(() => {
    const map = new Map<number, PuzzleTileType>();
    tiles.forEach((tile) => map.set(tile.id, tile));
    return map;
  }, [tiles]);

  const getSlotFromPoint = useCallback(
    (clientX: number, clientY: number): number | null => {
      const board = boardRef.current;
      if (!board) return null;
      const rect = board.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }
      const col = Math.min(
        grid.cols - 1,
        Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * grid.cols)),
      );
      const row = Math.min(
        grid.rows - 1,
        Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * grid.rows)),
      );
      return row * grid.cols + col;
    },
    [grid.cols, grid.rows],
  );

  const swapSlots = useCallback(
    (slotA: number, slotB: number) => {
      if (slotA === slotB || disabled) return;
      onSwap(slotA, slotB);
      setSelectedSlot(null);
    },
    [disabled, onSwap],
  );

  const handleClickSlot = useCallback(
    (slotIndex: number) => {
      if (disabled) return;
      if (selectedSlot === null) {
        setSelectedSlot(slotIndex);
        return;
      }
      swapSlots(selectedSlot, slotIndex);
    },
    [disabled, selectedSlot, swapSlots],
  );

  const finishDrag = useCallback(
    (state: DragState, clientX: number, clientY: number) => {
      const threshold = state.tileSize / 2;
      const dx = state.currentX - state.startX;
      const dy = state.currentY - state.startY;
      const distance = Math.hypot(dx, dy);

      if (!state.moved || distance < threshold) {
        handleClickSlot(state.slotIndex);
      } else {
        const targetSlot = getSlotFromPoint(clientX, clientY);
        if (targetSlot !== null) {
          swapSlots(state.slotIndex, targetSlot);
        }
      }

      dragRef.current = null;
      setDrag(null);
    },
    [getSlotFromPoint, handleClickSlot, swapSlots],
  );

  useEffect(() => {
    if (!drag) return;

    const onMove = (e: PointerEvent) => {
      const state = dragRef.current;
      if (!state) return;
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      const moved = state.moved || Math.hypot(dx, dy) > 4;
      const next = {
        ...state,
        currentX: e.clientX,
        currentY: e.clientY,
        moved,
      };
      dragRef.current = next;
      setDrag(next);
    };

    const onUp = (e: PointerEvent) => {
      const state = dragRef.current;
      if (!state) return;
      finishDrag(state, e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, finishDrag]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, tileId: number) => {
    if (disabled || showOriginal || showCompletedImage) return;
    e.preventDefault();
    const slotIndex = order.indexOf(tileId);
    if (slotIndex < 0) return;

    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

    const next: DragState = {
      tileId,
      slotIndex,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      tileSize: tileDisplaySize,
      moved: false,
    };
    dragRef.current = next;
    setDrag(next);
    setSelectedSlot(null);
  };

  const croppedStyle = getCroppedImageStyle(grid, imageUrl);

  if (showCompletedImage) {
    return (
      <div ref={areaRef} className="flex min-h-0 flex-1 items-center justify-center">
        <div
          className="shrink-0 bg-neutral-100"
          style={{
            width: boardWidth,
            height: boardHeight,
            ...croppedStyle,
          }}
        />
      </div>
    );
  }

  return (
    <div ref={areaRef} className="flex min-h-0 flex-1 items-center justify-center">
      <div
        ref={boardRef}
        className={`relative shrink-0 grid transition-colors duration-500 ${
          flashWin ? 'bg-yellow-300' : 'bg-neutral-100'
        }`}
        style={{
          width: boardWidth,
          height: boardHeight,
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {showOriginal && (
          <div
            className="absolute inset-0 z-10"
            style={croppedStyle}
            aria-hidden
          />
        )}

        {!showOriginal &&
          order.map((tileId, slotIndex) => {
            const tile = tileById.get(tileId);
            if (!tile) return null;

            const isDragging = drag?.tileId === tileId && drag.moved;
            let dragStyle: CSSProperties | undefined;

            if (isDragging && drag) {
              dragStyle = {
                position: 'absolute',
                width: tileDisplaySize,
                height: tileDisplaySize,
                left: slotIndex % grid.cols * tileDisplaySize + (drag.currentX - drag.startX),
                top: Math.floor(slotIndex / grid.cols) * tileDisplaySize + (drag.currentY - drag.startY),
                pointerEvents: 'none',
              };
            }

            return (
              <PuzzleTile
                key={tile.id}
                tileId={tile.id}
                col={tile.col}
                row={tile.row}
                grid={grid}
                imageUrl={imageUrl}
                selected={selectedSlot === slotIndex}
                hidden={isDragging}
                dragging={isDragging}
                dragStyle={dragStyle}
                onPointerDown={handlePointerDown}
              />
            );
          })}
      </div>
    </div>
  );
}
