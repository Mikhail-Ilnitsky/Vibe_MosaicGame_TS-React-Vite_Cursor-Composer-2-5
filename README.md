# Игра-мозаика

Адаптивная браузерная игра-пазл: выберите картинку, сложность и соберите мозаику из квадратных фрагментов. Чистый фронтенд (SPA), без бэкенда.

**Демо:** [mikhail-ilnitsky.github.io/Vibe_MosaicGame_TS-React-Vite_Cursor-Composer-2-5](https://mikhail-ilnitsky.github.io/Vibe_MosaicGame_TS-React-Vite_Cursor-Composer-2-5/)

## Особенности

Собрано по подробному промпту с помощью **Composer-2.5-Fast**
Начальный промпт: 8 запусков Composer-2.5-Fast = 889 Ktokens
Исправление ошибок:
- 1 запуск Composer-2.5-Fast для планирования = 171 Ktokens
- 1 запуск Cursor-grok-4.6-Fast для исправления (сам подставился вместо Composer) = 972 Ktokens
Всего в сумме: 2 Mtokens

## Возможности

- Галерея изображений с локализованными названиями (RU / EN)
- Автоматический расчёт сеток сложности (5–11 фрагментов по меньшей стороне, квадратные фрагменты, центрированная обрезка)
- Управление: клик-клик и перетаскивание через Pointer Events (мышь + touch)
- Адаптивное игровое поле без прокрутки, без апскейла сверх 1:1
- Перемешивание: каждая плитка один раз меняется местами со случайной другой
- Счётчик ходов и просмотр оригинала (с тем же обрезанием, что у пазла)
- Анимация победы: мигание сетки → показ собранной картинки → сообщение о победе

## Стек

| Технология    | Версия |
|---------------|--------|
| React         | 19.3.0 |
| TypeScript    | 5.9.3  |
| Vite          | 8.3.0  |
| Tailwind CSS  | 4.3.3  |

## Происхождение проекта

Исходная версия приложения была сгенерирована в **Cursor** (**Composer-2.5-Fast**) по техническому заданию (см. [`prompts/INITIAL.md`](prompts/INITIAL.md)).

Доработки и исправления выполнены в **Cursor**:

- исправлен клик-клик: `pointerdown` больше не сбрасывает выделение первой плитки
- drag-and-drop: placeholder в сетке + плавающая копия плитки (сетка не схлопывается при перетаскивании)
- перемешивание: для каждой плитки один обмен со случайной другой
- анимация победы с миганием, видимым сообщением и кнопкой «Начать новую игру»
- превью и финальная картинка совпадают по размеру и обрезанию с игровым полем

Подробный контекст для разработки: [`.cursor/CONTEXT.md`](.cursor/CONTEXT.md)

## Запуск

```bash
npm install
npm run dev
```

Другие команды:

```bash
npm run build      # production-сборка
npm run preview    # превью сборки
npm run lint       # ESLint
```

## Структура `src/`

```
src/
├── App.tsx                 # экраны gallery → difficulty → game; key для сброса Game
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
│   ├── grid.ts             # расчёт сетки, CSS background для тайлов и обрезки
│   ├── shuffle.ts          # перемешивание (len обменов) и isSolved
│   └── loadImage.ts        # загрузка naturalWidth/Height
├── hooks/
│   └── useAvailableSize.ts # ResizeObserver для игровой области
└── components/
    ├── Layout.tsx          # шапка, переключатель языка
    ├── LanguageSwitcher.tsx
    ├── Gallery.tsx         # галерея миниатюр
    ├── DifficultySelect.tsx
    ├── Game.tsx            # состояние игры, победа, compact-layout
    ├── PuzzleBoard.tsx     # сетка, pointer drag (placeholder + float), flash
    └── PuzzleTile.tsx      # фрагмент: variant grid | floating
```
