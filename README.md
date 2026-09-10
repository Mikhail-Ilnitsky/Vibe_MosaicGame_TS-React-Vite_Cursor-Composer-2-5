# Игра-мозаика

Адаптивная браузерная игра-пазл из квадратных фрагментов изображения. Чистый фронтенд (SPA), без бэкенда и базы данных.

**Демо (GitHub Pages):** `https://<username>.github.io/Vibe_MosaicGame_TS-React-Vite_Cursor-Composer-2-5/`

> После первого деплоя замените `<username>` на ваш GitHub-логин. В **Settings → Pages** источник сборки — **GitHub Actions**.

## Возможности

- Галерея картинок с локализацией названий (RU / EN)
- Автоматический расчёт сеток сложности (5–11 частей по короткой стороне, квадратные фрагменты, центрированная обрезка)
- Два способа управления одновременно: клик-клик и перетаскивание через Pointer Events
- Адаптивное игровое поле без прокрутки, без апскейла сверх 1:1
- Счётчик ходов и просмотр оригинала (с тем же обрезанием, что у пазла)
- Анимация победы: жёлтая вспышка, затем цельное обрезанное изображение

## Стек

| Технология    | Версия |
|---------------|--------|
| React         | 19.3.0 |
| TypeScript    | 5.9.3  |
| Vite          | 8.3.0  |
| Tailwind CSS  | 4.3.3  |

## Происхождение проекта

Исходная версия сгенерирована в Cursor по техническому заданию из [`prompts/INITIAL.md`](prompts/INITIAL.md).

Подробный контекст для следующих сессий: [`.cursor/CONTEXT.md`](.cursor/CONTEXT.md).

## Запуск

```bash
npm install
npm run dev      # dev-сервер (http://localhost:5173)
npm run build    # production-сборка в dist/
npm run preview  # предпросмотр сборки
npm run lint     # ESLint
```

## Структура `src/`

```
src/
├── App.tsx                 # экраны: gallery → difficulty → game
├── main.tsx                # точка входа React
├── index.css               # Tailwind и анимации
├── vite-env.d.ts           # типы Vite
├── data/
│   └── images.ts           # массив IMAGES со стабильными URL
├── types/
│   └── index.ts            # PuzzleImage, GridConfig, Locale…
├── i18n/
│   ├── translations.ts     # строки RU/EN
│   └── LanguageContext.tsx # контекст языка и хук useLanguage
├── utils/
│   ├── grid.ts             # расчёт сетки, CSS background для тайлов
│   ├── shuffle.ts          # перемешивание и проверка победы
│   └── loadImage.ts        # загрузка naturalWidth/Height
├── hooks/
│   └── useAvailableSize.ts # ResizeObserver для игровой области
└── components/
    ├── Layout.tsx          # шапка, переключатель языка
    ├── LanguageSwitcher.tsx
    ├── Gallery.tsx         # галерея миниатюр
    ├── DifficultySelect.tsx
    ├── Game.tsx            # состояние игры, победа
    ├── PuzzleBoard.tsx     # сетка, pointer drag, оригинал
    └── PuzzleTile.tsx      # один фрагмент (background-image)
```
