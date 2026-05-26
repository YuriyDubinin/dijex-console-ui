# Dijex Console UI

Пустой шаблон фронтенда консоли. Стек, дизайн-токены, архитектура и сборка
полностью копируют корпоративный проект Dijex и готовы к наполнению.

## Стек

React 18 + TypeScript (strict) + Vite 5, Tailwind CSS с дизайн-токенами в CSS variables,
Framer Motion, React Router v6, React Hook Form + Zod (зависимости установлены),
lucide-react, self-hosted шрифты Inter / Sora, Vitest + React Testing Library.

## Локальный запуск

```
npm install
npm run dev
```

`.env` определяет адрес бэкенда:

```
VITE_API_BASE_URL=http://localhost:18080
```

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

Бэкенд занимает порт `18080`. Консоль публикуется на хосте на порту **`13080`**:

```
docker run -d \
  --name dijex-console-ui \
  -p 13080:80 \
  yuriydubinin100/dijex-console-ui:1.0.0
```

Открывается на `http://localhost:13080`. Все запросы идут на тот же бэкенд,
адрес которого зашит в bundle через `VITE_API_BASE_URL` на этапе билда.

## Деплой

```
docker push yuriydubinin100/dijex-console-ui:1.0.0
docker pull yuriydubinin100/dijex-console-ui:1.0.0
```
