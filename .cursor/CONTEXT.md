# Mosaic Puzzle — контекст проекта

## Описание

Адаптивная браузерная игра-мозаика (SPA): пользователь выбирает картинку из галереи, задаёт сложность (деление короткой стороны на 5–11 частей), собирает пазл из квадратных фрагментов. Бэкенд не используется.

## Стек

- **React 19** + **TypeScript 5** + **Vite 8**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- Деплой: GitHub Actions → GitHub Pages

## Ключевые решения

### Сетка и обрезка

- Короткая сторона изображения делится на `N` (5–11) квадратов: `tileSize = floor(shorter / N)`.
- Длинная сторона: `floor(longer / tileSize)` квадратов; лишние пиксели обрезаются по центру.
- Размер отображения: `scale = min(availableW/cropW, availableH/cropH, 1)` — не увеличивать сверх 1:1.

### CSS-фрагменты

- Картинка не режется на файлы. Каждый тайл — `<div>` с `background-image`.
- `background-size`: `(fullCols × 100%) (fullRows × 100%)` по полной сетке исходника.
- `background-position`: проценты от `(marginCol + col, marginRow + row)` в полной сетке.
- При перемешивании меняется только порядок в массиве `order`, стили фрагмента привязаны к `col/row` тайла.

### Управление

- **Клик-клик**: выделение рамкой, обмен двух слотов.
- **Pointer Events** (не HTML5 DnD): порог перетаскивания — половина размера плитки; при drag плитка следует за указателем с `z-index` поверх остальных.

### i18n

- Контекст `LanguageProvider`, локали `ru` / `en`.
- По умолчанию: `navigator.language` содержит `'ru'` → RU, иначе EN.
- Переключатель RU/EN в правом верхнем углу.

### Игровой цикл

- Экраны: `gallery` → `difficulty` → `game`.
- Перемешивание: `N` случайных парных обменов (`N` = выбранная сложность).
- Победа: жёлтая вспышка 500 мс → скрытие сетки → обрезанное изображение + сообщение и кнопка «Новая игра» (в галерею).
- Кнопка «Выход» на difficulty/game сразу в галерею.

### Деплой

- `vite.config.ts`: `base: '/'` в dev, `base: '/Vibe_MosaicGame_TS-React-Vite_Cursor-Composer-2-5/'` в production.
- Workflow `.github/workflows/deploy.yml`, Node.js 22+.

## Структура `src/`

```
src/
  App.tsx              — маршрутизация экранов
  main.tsx             — точка входа
  index.css            — Tailwind + анимации
  data/images.ts       — массив IMAGES
  types/               — общие типы
  i18n/                — переводы и LanguageContext
  utils/               — grid, shuffle, loadImage
  hooks/               — useAvailableSize
  components/          — Gallery, DifficultySelect, Game, PuzzleBoard, PuzzleTile, Layout, LanguageSwitcher
```
