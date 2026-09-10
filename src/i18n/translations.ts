import type { Locale } from '../types';

const translations = {
  ru: {
    appTitle: 'Игра-мозаика',
    galleryTitle: 'Выберите картинку',
    difficultyTitle: 'Выберите сложность',
    difficultyHint: 'Количество частей по короткой стороне',
    difficultyOption: '{rows} × {cols}',
    exit: 'Выход',
    moves: 'Ходы: {count}',
    showOriginal: 'Показать оригинал',
    hideOriginal: 'Скрыть оригинал',
    winMessage: 'У вас получилось!',
    winMoves: 'Количество ходов: {count}',
    newGame: 'Начать новую игру',
    loading: 'Загрузка…',
  },
  en: {
    appTitle: 'Mosaic Puzzle',
    galleryTitle: 'Choose a picture',
    difficultyTitle: 'Choose difficulty',
    difficultyHint: 'Parts along the shorter side',
    difficultyOption: '{rows} × {cols}',
    exit: 'Exit',
    moves: 'Moves: {count}',
    showOriginal: 'Show original',
    hideOriginal: 'Hide original',
    winMessage: 'You did it!',
    winMoves: 'Moves: {count}',
    newGame: 'New game',
    loading: 'Loading…',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['ru'];

export function t(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  let text: string = translations[locale][key];
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(`{${param}}`, String(value));
    }
  }
  return text;
}
