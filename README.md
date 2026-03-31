# Real-Time Messages Dashboard

WebSocket дашборд на Next.js + React + TypeScript.

## Запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить WebSocket сервер

```bash
node server/ws-server.js
```

### 3. Запустить Next.js (в отдельном терминале)

```bash
npm run dev
```

Открыть: http://localhost:3000

## Архитектура

- `hooks/useWebSocket.ts` — WebSocket соединение, авто-reconnect (1s/2s/5s), ручное управление
- `hooks/useMessages.ts` — стейт сообщений через `useReducer`, фильтрация, дедупликация
- `components/` — чистые UI компоненты без бизнес-логики
- `types/message.ts` — все TypeScript типы
- `utils/` — чистые функции (сортировка, форматирование)

## Реализованные бонусы

-  `useReducer` для управления состоянием сообщений
-  Счётчик попыток reconnect
-  Кнопка Disconnect
