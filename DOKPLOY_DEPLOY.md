# Деплой Node.js / Next.js проекта в Dokploy

## Проверенная рабочая конфигурация

### next.config.ts
- **НЕ использовать** `output: "standalone"` — вызывает 404 ошибку в Dokploy
- Использовать стандартный `next start`

```typescript
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};
export default nextConfig;
```

### Dockerfile (multi-stage, node:22-alpine)

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "start"]
```

### docker-compose.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: my-app
    restart: unless-stopped
    env_file: .env
    environment:
      PORT: 8080
      HOSTNAME: 0.0.0.0
      NODE_ENV: production
    expose:
      - "8080"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### .env

```
PORT=8080
DOMAIN=your-domain.212.8.226.48.nip.io
```

## Ключевые правила

1. **Traefik labels НЕ нужны нигде** — Dokploy автоматически генерирует маршрутизацию на основе домена из UI и порта контейнера
2. **НЕ использовать** `output: "standalone"` в next.config.ts
3. **НЕ использовать** `ports` mapping — только `expose`
4. **НЕ подключать** `dokploy-network` вручную — Dokploy делает это автоматически
5. Использовать `env_file: .env` для передачи переменных
6. Порт 8080 — стандарт для Dokploy
7. `node:22-alpine` работает корректно
8. В Dokploy UI достаточно указать домен — всё остальное настроится автоматически

## Почему standalone mode не работает

В режиме `output: "standalone"` Next.js генерирует минимальный бандл в `.next/standalone/`.
Dokploy ожидает стандартную структуру `.next/` + `node_modules/` для запуска через `next start`.
Standalone mode требует запуск через `node .next/standalone/server.js`, что не совместимо
со стандартным CMD и структурой, которую ожидает Dokploy.

## Reference: рабочий проект LOKO

Проект LOKO_platform на том же сервере работает без 404 ошибок.
Использует аналогичный подход: env_file, expose, без Traefik labels в docker-compose.yml.
