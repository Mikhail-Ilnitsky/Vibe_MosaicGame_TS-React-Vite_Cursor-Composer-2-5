# Mosaic Puzzle — контекст проекта

## Описание

Адаптивная браузерная игра-мозаика (SPA): пользователь выбирает картинку из галереи, задаёт сложность (деление короткой стороны на 5–11 частей), собирает пазл из квадратных фрагментов. Бэкенд не используется.

## Стек

- **React 19** + **TypeScript 5** + **Vite 8**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- Деплой: GitHub Actions → GitHub Pages (Node.js 22+)

## Ключевые решения

### Сетка и обрезка

- Короткая сторона изображения делится на `N` (5–11) квадратов: `tileSize = floor(shorter / N)`.
- Длинная сторона: `floor(longer / tileSize)` квадратов; лишние пиксели обрезаются по центру.
- Размер отображения: `scale = min(availableW/cropW, availableH/cropH, 1)` — не увеличивать сверх 1:1.
- Доступная область измеряется через `useAvailableSize` (ResizeObserver).

### CSS-фрагменты

- Картинка не режется на файлы. Каждый тайл — `<div>` с `background-image`.
- `background-size`: `(fullCols × 100%) (fullRows × 100%)` по полной сетке исходника.
- `background-position`: проценты от `(marginCol + col, marginRow + row)` в полной сетке.
- При перемешивании меняется только порядок в массиве `order`, стили фрагмента привязаны к `col/row` тайла (не к слоту).

### Управление (Pointer Events, не HTML5 DnD)

**Клик-клик:**
- Первый клик — выделение рамкой (`selectedSlot` в state + `selectedSlotRef`).
- Второй клик — обмен двух слотов.
- `pointerdown` **не сбрасывает** выделение (раньше это ломало второй клик).
- Выделение сбрасывается при успешном обмене, при начале drag или при повторном клике по той же плитке.
- Обработчики читают `selectedSlotRef.current`, чтобы избежать stale closure в `finishDrag`.

**Drag-and-drop:**
- Порог: движение < `tileSize / 2` → клик; ≥ порога → drag.
- Паттерн **placeholder + floating tile**:
  - ячейка в CSS Grid остаётся в потоке с классом `invisible` (placeholder);
  - видимая копия рендерится отдельно как `PuzzleTile variant="floating"` с `position: absolute`, `z-50`, следует за указателем.
- Так сетка не схлопывается при перетаскивании (раньше `absolute` на grid-элементе ломал layout).

### Перемешивание

- `shuffleBySwaps(order)` в [`src/utils/shuffle.ts`](src/utils/shuffle.ts): для **каждой** плитки (`len` итераций) — один обмен со случайной другой (`j !== i`).
- Повторять, пока `isSolved(result)` (макс. 20 попыток).
- Не путать с параметром сложности `N` (5–11): он задаёт размер сетки, а не число обменов.

### Победа

- `isSolved(order)`: `order[i] === i` для всех слотов.
- При победе: `flashWin=true` на 500 ms (жёлтый фон сетки + оверлей), затем `showCompletedImage=true` (только обрезанное изображение без линий сетки).
- Сообщение «У вас получилось!» и кнопка «Начать новую игру» показываются сразу при `won` (не ждут конца flash), в блоке `shrink-0` под мозаикой.
- `PuzzleBoard` получает `compact={won}` — снимает `flex-1`, чтобы UI победы не уходил за нижний край экрана.
- Новая партия: `Game` перемонтируется через `key={`${image.id}-${grid.cols}x${grid.rows}`}` в `App.tsx`.

### i18n

- Контекст `LanguageProvider`, локали `ru` / `en`.
- По умолчанию: `navigator.language` содержит `'ru'` → RU, иначе EN.
- Переключатель RU/EN в правом верхнем углу.

### Игровой цикл

- Экраны: `gallery` → `difficulty` → `game`.
- Кнопка «Выход» на difficulty/game сразу в галерею.
- «Начать новую игру» после победы — тоже в галерею.

### Деплой

- `vite.config.ts`: `base: '/'` в dev, `base: '/Vibe_MosaicGame_TS-React-Vite_Cursor-Composer-2-5/'` в production.
- Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- В Settings → Pages источник сборки — GitHub Actions.

## Структура `src/`

```
src/
  App.tsx              — маршрутизация экранов, key для перемонтирования Game
  main.tsx             — точка входа
  index.css            — Tailwind + анимация fadeIn
  data/images.ts       — массив IMAGES (стабильные URL)
  types/index.ts       — PuzzleImage, GridConfig, Locale…
  i18n/
    translations.ts    — строки RU/EN
    LanguageContext.tsx
  utils/
    grid.ts            — computeGrid, getTileBackgroundStyle, getCroppedImageStyle
    shuffle.ts         — shuffleBySwaps (len обменов), isSolved
    loadImage.ts       — naturalWidth/Height
  hooks/
    useAvailableSize.ts — ResizeObserver для игровой области
  components/
    Layout.tsx
    LanguageSwitcher.tsx
    Gallery.tsx
    DifficultySelect.tsx
    Game.tsx           — order, moves, won/flashWin/showCompletedImage
    PuzzleBoard.tsx    — grid, pointer events, placeholder+float drag, compact
    PuzzleTile.tsx     — variant: grid | floating, placeholder, selected ring
```

## Известные нюансы

- `Game.tsx` определяет победу синхронно в render (`if (isSolved && !won) setWon(true)`) — работает, но при рефакторинге можно перенести в обработчик последнего обмена.
- ESLint `react-hooks/set-state-in-effect` может ругаться на другие effect-паттерны; текущая победа через render + отдельный effect только для таймера flash.
