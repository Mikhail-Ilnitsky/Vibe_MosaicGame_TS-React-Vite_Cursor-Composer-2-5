import type { CSSProperties } from 'react';
import type { GridConfig, LoadedImageDimensions } from '../types';

export function computeGrid(
  dimensions: LoadedImageDimensions,
  divisionN: number,
): GridConfig {
  const { width, height } = dimensions;
  const shorter = Math.min(width, height);
  const isLandscape = width >= height;

  const tileSize = Math.floor(shorter / divisionN);
  const rows = isLandscape ? divisionN : Math.floor(height / tileSize);
  const cols = isLandscape ? Math.floor(width / tileSize) : divisionN;

  const cropWidth = cols * tileSize;
  const cropHeight = rows * tileSize;
  const offsetX = Math.floor((width - cropWidth) / 2);
  const offsetY = Math.floor((height - cropHeight) / 2);

  const fullCols = Math.floor(width / tileSize);
  const fullRows = Math.floor(height / tileSize);
  const marginCol = Math.floor((fullCols - cols) / 2);
  const marginRow = Math.floor((fullRows - rows) / 2);

  return {
    cols,
    rows,
    tileSize,
    cropWidth,
    cropHeight,
    offsetX,
    offsetY,
    fullCols,
    fullRows,
    marginCol,
    marginRow,
  };
}

export function createTiles(grid: GridConfig): { id: number; correctIndex: number; col: number; row: number }[] {
  const tiles = [];
  let id = 0;
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      tiles.push({ id, correctIndex: id, col, row });
      id++;
    }
  }
  return tiles;
}

export function getTileBackgroundStyle(
  col: number,
  row: number,
  grid: GridConfig,
  imageUrl: string,
): CSSProperties {
  const actualCol = grid.marginCol + col;
  const actualRow = grid.marginRow + row;

  const posX =
    grid.fullCols > 1 ? (actualCol / (grid.fullCols - 1)) * 100 : 0;
  const posY =
    grid.fullRows > 1 ? (actualRow / (grid.fullRows - 1)) * 100 : 0;

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${grid.fullCols * 100}% ${grid.fullRows * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat',
  };
}

export function getCroppedImageStyle(
  grid: GridConfig,
  imageUrl: string,
): CSSProperties {
  const posX =
    grid.fullCols > 1
      ? (grid.marginCol / (grid.fullCols - 1)) * 100
      : 0;
  const posY =
    grid.fullRows > 1
      ? (grid.marginRow / (grid.fullRows - 1)) * 100
      : 0;

  const zoomX = grid.fullCols / grid.cols;
  const zoomY = grid.fullRows / grid.rows;

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${zoomX * 100}% ${zoomY * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat',
  };
}

export function computeDisplayScale(
  grid: GridConfig,
  availableWidth: number,
  availableHeight: number,
): number {
  const scaleW = availableWidth / grid.cropWidth;
  const scaleH = availableHeight / grid.cropHeight;
  return Math.min(scaleW, scaleH, 1);
}
