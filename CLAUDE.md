# CLAUDE.md — Dijex Console UI (пустой шаблон)

Это **пустой шаблон фронтенда консоли** компании Dijex. Архитектура, дизайн-токены,
сборка и инфраструктура повторяют корпоративный сайт Dijex; контент и доменная
логика лендинга удалены — добавляйте функциональность консоли по мере необходимости.

---

## 1. Стек

| Категория | Выбор |
|---|---|
| Язык | TypeScript 5.6 (strict, `noUncheckedIndexedAccess: true`, никаких `any`) |
| Framework | React 18 (функциональные компоненты, hooks, только именованные экспорты) |
| Сборщик | Vite 5 |
| Стили | Tailwind CSS 3.4 + CSS variables для дизайн-токенов |
| Анимации | Framer Motion 11 |
| Формы | React Hook Form + Zod (`@hookform/resolvers/zod`) — зависимости установлены |
| HTTP | нативный `fetch`, тонкая обёртка `apiRequest` в `src/lib/api.ts` |
| Иконки | lucide-react |
| Шрифты | self-hosted через `@fontsource/inter`, `@fontsource/sora` |
| Роутинг | React Router v6 |
| Линт | ESLint + Prettier |
| Тесты | Vitest + React Testing Library |

**Запрещено:** CRA, webpack, jQuery, тяжёлые UI-киты (MUI/Ant Design/Bootstrap).

---

## 2. Архитектура — Feature-Sliced Design (FSD)

Слои сверху вниз: **app → pages → widgets → features → entities → shared**.
Импорт разрешён только вниз по слоям (плюс из `shared` куда угодно). Контроль —
плагин `@conarti/eslint-plugin-feature-sliced` (правила `layers-slices`,
`absolute-relative`, `public-api`).

```
src/
├── app/                              # composition root
│   ├── App.tsx                       # роутер
│   ├── layouts/RootLayout.tsx        # глобальный layout + ToastProvider
│   └── styles/globals.css            # Tailwind directives + CSS variables токенов
├── pages/
│   └── home/{ui/HomePage.tsx, index.ts}
├── widgets/
│   ├── header/{ui/Header.tsx, index.ts}
│   └── footer/{ui/Footer.tsx, index.ts}
├── features/                         # пока пусто — UI-фичи с пользовательскими сценариями
├── entities/                         # пока пусто — бизнес-сущности (User, Project, …)
├── shared/
│   ├── api/        # apiRequest<T>, ApiError, ping() + public API через index.ts
│   ├── config/     # API_BASE_URL и прочие env-токены
│   ├── lib/        # cn, useReducedMotion
│   └── ui/         # Button, Input, Field, Container, Toast, motion/{FadeIn,ScrollReveal,variants}
├── test/setup.ts
├── main.tsx                          # entry, импортирует @app/App + globals.css
└── vite-env.d.ts
```

### Алиасы импортов

```
@app/*       → src/app/*
@pages/*     → src/pages/*
@widgets/*   → src/widgets/*
@features/*  → src/features/*
@entities/*  → src/entities/*
@shared/*    → src/shared/*
```

### Правила FSD

1. **Импорт только вниз по слоям.** `pages → widgets/features/entities/shared`,
   `features → entities/shared`, и т.д. Нельзя `shared → features`, `entities → widgets`.
2. **Public API через `index.ts`.** Импортируйте слайс целиком: `import { Header } from '@widgets/header'`,
   а не из его внутренностей (`@widgets/header/ui/Header`).
3. **Внутри одного слоя — относительные пути.** Например, в `shared/ui/Button.tsx`
   импортируйте `cn` как `from '../lib'`, а не `from '@shared/lib'`. Плагин ругается на абсолютные.
4. **Сегменты слайса:** `ui/`, `model/`, `api/`, `lib/`, `config/`. Не все обязательны.
5. **Новые сущности:** заводите слайс в нужном слое — `entities/user/{ui,model,api}` + `index.ts`.

**Файлы.** Компоненты — `PascalCase.tsx`; слайсы и сегменты — `kebab-case/`.
Только именованные экспорты (исключение — `App.tsx` / `main.tsx`).
Пропсы — `type Props`, не `interface`. `React.FC` не использовать.

---

## 3. Дизайн-язык (зафиксирован, не менять без согласования)

Dark-first hi-tech: глубокий фон, индиго/циан акценты, тонкая типографика,
мягкие свечения, аккуратные motion-анимации (ease-out, 0.3–0.6s, никаких bounce).

### Палитра (CSS variables, см. `src/app/styles/globals.css`)

```
--bg-base:#0A0B14  --bg-surface:#11131F  --bg-elevated:#181B2C  --border:#232742
--text-primary:#F5F6FB  --text-secondary:#A7ADC6  --text-muted:#6B7290
--accent-primary:#6366F1  --accent-secondary:#06B6D4  --accent-glow:#8B5CF6
--success:#10B981  --danger:#EF4444  --warning:#F59E0B
```

Все токены проброшены в Tailwind через `theme.extend.colors` —
используйте `bg-bg-base text-text-primary border-border` и т.п.

### Типографика

- **Sans:** Inter (400, 500, 600, 700).
- **Display:** Sora (600, 700).
- Размеры: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small` —
  определены в `tailwind.config.ts`.

### Скругления и тени

- Карточки `rounded-2xl`, кнопки `rounded-xl`, инпуты `rounded-lg`.
- Цветной glow: `shadow-glow`, `shadow-glow-cyan`.

---

## 4. API-клиент

`@shared/api` экспортирует:

- `apiRequest<T>(path, { method, body, signal, headers })` — обобщённая обёртка над `fetch`.
- `ApiError` (status + payload с `code/message/details`).
- `ping()` — пример вызова `GET /api/ping`.

`API_BASE_URL` читается из `import.meta.env.VITE_API_BASE_URL` в `@shared/config`.
В Docker значение приходит через `--build-arg VITE_API_BASE_URL=...` и инлайнится в bundle.

При 422 с `details` мерджите ошибки в форму через `setError` (паттерн RHF + Zod).
Сетевые / 5xx — показывайте toast (`useToast()` из `@shared/ui`).

Для новых API сущности заводите слайс `entities/<name>/api/` с собственными
функциями поверх `apiRequest` и реэкспортируйте их через `entities/<name>/index.ts`.

---

## 5. Motion

- `FadeIn` — fade + slide-up; либо `immediate`, либо при появлении в viewport.
- `ScrollReveal` — контейнер для stagger-появления детей (`revealItemVariants`).
- `useReducedMotion()` — оборачивайте все нетривиальные анимации.

Импортируются из `@shared/ui` (вместе с примитивами Button/Input/Field/Toast/Container).

---

## 6. Сборка в Docker

Двухстадийный билд (`node:20-alpine` → `nginx:alpine`). Контейнер слушает `80`.
Хост-порт для консоли: **`13080`** (бэкенд занимает `18080`, не конфликтуем).

```
docker buildx build \
  --platform linux/amd64 \
  --build-arg VITE_API_BASE_URL=http://37.1.215.81:18080 \
  -t yuriydubinin100/dijex-console-ui:1.0.0 --load .

docker run -d --name dijex-console-ui -p 13080:80 yuriydubinin100/dijex-console-ui:1.0.0
```

nginx-конфиг: gzip, immutable-кэш для хешированной статики, SPA-fallback на `index.html`.

---

## 7. Стандарты качества

- **TypeScript strict** — без `any`, `@ts-ignore`, `as unknown as` без комментария-причины.
- **ESLint** — `--max-warnings 0`.
- **a11y** — семантические теги, focus-visible, контраст ≥ AA, `prefers-reduced-motion`,
  touch targets ≥ 44×44px.
- **Адаптивность** — mobile-first, проверка на 360/768/1280.
- **Lighthouse** — ≥ 90 по всем категориям.
- **Conventional Commits** — `feat: / fix: / chore: / refactor: / docs: / test:`.

---

## 8. Чек чего НЕ делать

- ❌ Не использовать `alert()` / `confirm()` — только Toast / модалки.
- ❌ Не хардкодить адрес бэкенда — только `import.meta.env.VITE_API_BASE_URL`.
- ❌ Не подключать сторонние шрифты с CDN Google — только self-hosted через `@fontsource`.
- ❌ Не использовать inline-стили (`style={{...}}`), кроме динамических значений.
- ❌ Не оставлять `console.log` в коде.
- ❌ Не добавлять тяжёлые UI-киты (MUI / Ant / Bootstrap) — компоненты пишем сами на Tailwind.

---

**Версия документа:** 2.0 (template)
