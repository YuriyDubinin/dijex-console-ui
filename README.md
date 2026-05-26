# Dijex Console UI

Пустой шаблон фронтенда консоли. Стек, дизайн-токены, архитектура и сборка
полностью копируют корпоративный проект Dijex и готовы к наполнению.

## Стек

React 18 + TypeScript (strict) + Vite 5, Tailwind CSS с дизайн-токенами в CSS variables,
Framer Motion, React Router v6, React Hook Form + Zod (зависимости установлены),
lucide-react, self-hosted шрифты Inter / Sora, Vitest + React Testing Library.

## Архитектура

Feature-Sliced Design (FSD). Слои: **app → pages → widgets → features → entities → shared**.
Алиасы: `@app/* @pages/* @widgets/* @features/* @entities/* @shared/*`.
Импорт через public API слайса (`index.ts`); внутри слоя — относительные пути.
Контроль — `@conarti/eslint-plugin-feature-sliced`. Подробности — в [CLAUDE.md](./CLAUDE.md).

## Сборка
```
docker buildx build \
  --platform linux/amd64 \
  --build-arg VITE_API_BASE_URL=http://37.1.215.81:18080 \
  -t yuriydubinin100/dijex-console-ui:1.0.0 \
  --load \
  .
```

## Запуск контейнера
```
docker run -d \
  --name dijex-console-ui \
  -p 13080:80 \
  yuriydubinin100/dijex-console-ui:1.0.0
```
Базовый URL при локальном запуске: `http://localhost:13080`.

## Деплой

```
docker push yuriydubinin100/dijex-console-ui:1.0.0
docker pull yuriydubinin100/dijex-console-ui:1.0.0
```
