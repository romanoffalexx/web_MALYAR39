# Маляр — Интернет-магазин лакокрасочных материалов

Полноценный интернет-магазин для ООО «СОКРАТ СТРОЙ» на Next.js 15 + PostgreSQL + S3.

## Стек технологий

- **Next.js 15** (App Router, TypeScript, SSR)
- **Drizzle ORM** + PostgreSQL
- **S3 (Alarik)** для хранения медиа
- **Tailwind CSS** для стилей
- **GSAP** для анимаций
- **Telegram Bot API** + SMTP для уведомлений
- **Docker** для деплоя в Dokploy

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env.local` и заполните:

```bash
cp .env.example .env.local
```

Обязательные переменные:
- `DATABASE_URL` — строка подключения к PostgreSQL
- `S3_*` — доступы к S3/Alarik
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — для уведомлений
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` — вход в админку
- `JWT_SECRET` — секрет для JWT (мин. 32 символа)

### 3. Миграции БД

```bash
npm run db:generate  # Генерация миграций
npm run db:migrate   # Применение миграций
# или
npm run db:push      # Прямой push схемы в БД (для разработки)
```

### 4. Запуск dev-сервера

```bash
npm run dev
```

Откройте http://localhost:3000

## Структура проекта

```
src/
├── app/
│   ├── (public)/          # Публичные страницы
│   │   ├── page.tsx       # Главная
│   │   ├── catalog/       # Каталог
│   │   ├── product/[slug] # Карточка товара
│   │   ├── cart/          # Корзина
│   │   ├── about/         # О компании
│   │   ├── cases/         # Кейсы
│   │   ├── reviews/       # Обзоры
│   │   ├── solutions/     # Типовые решения
│   │   └── consultation/  # Консультация
│   ├── admin/             # Админ-панель
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # SEO robots.txt
├── db/
│   ├── schema.ts          # Drizzle схема (все таблицы)
│   └── index.ts           # DB connection
├── lib/
│   ├── s3.ts              # S3 клиент
│   ├── telegram.ts        # Telegram уведомления
│   ├── email.ts           # SMTP уведомления
│   ├── auth.ts            # JWT авторизация
│   └── calculator.ts      # Калькулятор расхода
├── components/            # UI компоненты
└── middleware.ts          # Защита /admin
```

## Основные страницы

| Страница | URL | Описание |
|----------|-----|----------|
| Главная | `/` | Hero, категории, популярные товары, CTA |
| Каталог | `/catalog` | Фильтры, подкатегории, карточки товаров |
| Товар | `/product/[slug]` | Галерея, характеристики, калькулятор расхода |
| Корзина | `/cart` | Таблица товаров, форма заявки |
| О компании | `/about` | Ценности, статистика, миссия |
| Кейсы | `/cases` | Примеры работ с фильтрацией |
| Обзоры | `/reviews` | Видео и фотообзоры |
| Решения | `/solutions` | Типовые решения по сегментам |
| Консультация | `/consultation` | 3-шаговая форма заявки |
| Админка | `/admin` | Управление контентом, заказами, лидами |

## Калькулятор расхода

Формула расчёта:
```
required_volume = area × layers / coverage_rate
packages = ceil(required_volume / package_volume)
cost = packages × price
```

## Уведомления

При создании заявки/лида:
1. **Telegram** — отправка в чат менеджера (MarkdownV2)
2. **Email** — отправка на SMTP_TO

## Деплой в Dokploy

### Dockerfile

Проект использует multi-stage build с `output: "standalone"`:

```bash
docker build -t malyar .
docker run -p 3000:3000 --env-file .env malyar
```

### Переменные окружения для Dokploy

Все переменные из `.env.example` нужно настроить в Dokploy.

## Админ-панель

Вход: `/admin/login`

По умолчанию:
- Логин: `admin` (из `ADMIN_USERNAME`)
- Пароль: из `ADMIN_PASSWORD`

Разделы:
- Дашборд — статистика
- Товары — CRUD с вариантами фасовки
- Категории — управление каталогом
- Заявки — просмотр и обработка заказов
- Лиды — заявки на консультацию
- Кейсы, Обзоры, Решения — контент
- Настройки — параметры сайта

## SEO

- Динамический `sitemap.xml`
- `robots.txt` с запретом `/admin/` и `/api/`
- Metadata для каждой страницы
- ЧПУ (человекопонятные URL)
- OG tags

## Лицензия

© ООО «СОКРАТ СТРОЙ»
