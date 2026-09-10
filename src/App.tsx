import { useState } from 'react';
import { DifficultySelect } from './components/DifficultySelect';
import { Gallery } from './components/Gallery';
import { Game } from './components/Game';
import { Layout } from './components/Layout';
import { useLanguage } from './i18n/LanguageContext';
import type { GridConfig, LoadedImageDimensions, PuzzleImage, Screen } from './types';

export default function App() {
  const { tr } = useLanguage();
  const [screen, setScreen] = useState<Screen>('gallery');
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
  const [dimensions, setDimensions] = useState<LoadedImageDimensions | null>(null);
  const [grid, setGrid] = useState<GridConfig | null>(null);

  const goGallery = () => {
    setScreen('gallery');
    setSelectedImage(null);
    setDimensions(null);
    setGrid(null);
  };

  const handleImageSelect = (image: PuzzleImage) => {
    setSelectedImage(image);
    setScreen('difficulty');
  };

  const handleDifficultySelect = (
    dims: LoadedImageDimensions,
    gridConfig: GridConfig,
  ) => {
    setDimensions(dims);
    setGrid(gridConfig);
    setScreen('game');
  };

  return (
    <Layout title={tr('appTitle')}>
      {screen === 'gallery' && <Gallery onSelect={handleImageSelect} />}

      {screen === 'difficulty' && selectedImage && (
        <DifficultySelect
          image={selectedImage}
          onSelect={handleDifficultySelect}
          onExit={goGallery}
        />
      )}

      {screen === 'game' && selectedImage && dimensions && grid && (
        <Game
          key={`${selectedImage.id}-${grid.cols}x${grid.rows}`}
          image={selectedImage}
          grid={grid}
          onExit={goGallery}
          onNewGame={goGallery}
        />
      )}
    </Layout>
  );
}
