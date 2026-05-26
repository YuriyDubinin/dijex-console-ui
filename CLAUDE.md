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

## 2. Структура

```
src/
├── components/
│   ├── ui/           # Button, Input, Field, Toast — переиспользуемые примитивы
│   ├── layout/       # Header, Footer, Container, RootLayout
│   └── motion/       # FadeIn, ScrollReveal, variants — обёртки над Framer Motion
├── hooks/            # useReducedMotion
├── lib/
│   ├── api.ts        # apiRequest<T>, ApiError, ping()
│   └── cn.ts         # clsx + tailwind-merge
├── pages/            # HomePage — заглушка, добавляйте свои страницы здесь
├── styles/globals.css  # Tailwind directives + CSS variables токенов
├── test/setup.ts
├── App.tsx
└── main.tsx
```

**Принципы.** Один компонент = один файл, `PascalCase.tsx`. Только именованные
экспорты, кроме `App.tsx`/`main.tsx`. Компоненты типизируются через `type Props`,
не `interface`. Не использовать `React.FC`.

---

## 3. Дизайн-язык (зафиксирован, не менять без согласования)

Dark-first hi-tech: глубокий фон, индиго/циан акценты, тонкая типографика,
мягкие свечения, аккуратные motion-анимации (ease-out, 0.3–0.6s, никаких bounce).

### Палитра (CSS variables, см. `src/styles/globals.css`)

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

`src/lib/api.ts` экспортирует:

- `apiRequest<T>(path, { method, body, signal, headers })` — обобщённая обёртка над `fetch`.
- `ApiError` (status + payload с `code/message/details`).
- `ping()` — пример вызова `GET /api/ping`.

`API_BASE` читается из `import.meta.env.VITE_API_BASE_URL`. В Docker значение
приходит через `--build-arg VITE_API_BASE_URL=...` и инлайнится в bundle.

При 422 с `details` мерджите ошибки в форму через `setError` (паттерн RHF + Zod).
Сетевые / 5xx — показывайте toast (`useToast()` из `@/components/ui/Toast`).

---

## 5. Motion

- `FadeIn` — fade + slide-up; либо `immediate`, либо при появлении в viewport.
- `ScrollReveal` — контейнер для stagger-появления детей (`revealItemVariants`).
- `useReducedMotion()` — оборачивайте все нетривиальные анимации.

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
