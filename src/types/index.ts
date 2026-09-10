export type Locale = 'ru' | 'en';

export type ImageOrientation = 'landscape' | 'portrait' | 'square';

export interface PuzzleImage {
  id: string;
  url: string;
  orientation: ImageOrientation;
  title: { ru: string; en: string };
}

export interface GridConfig {
  cols: number;
  rows: number;
  tileSize: number;
  cropWidth: number;
  cropHeight: number;
  offsetX: number;
  offsetY: number;
  fullCols: number;
  fullRows: number;
  marginCol: number;
  marginRow: number;
}

export interface PuzzleTile {
  id: number;
  correctIndex: number;
  col: number;
  row: number;
}

export type Screen = 'gallery' | 'difficulty' | 'game';

export interface LoadedImageDimensions {
  width: number;
  height: number;
}
