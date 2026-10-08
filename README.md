# Treename 2.0

**Family history, told by your family.** Treename берёт голосовые интервью у родителей, бабушек и дедушек на их родном языке и превращает ответы в историю семьи, живое дерево, путь семьи на карте и семейную книгу.

Этот репозиторий — MVP по плану «первые 90 дней» из документа *Treename 2.0 — Blueprint*.

## Что внутри

| Часть | Где в коде | Статус |
| --- | --- | --- |
| Сайт на 6 языках (EN, DE, FR, IT, ES, RU), SEO, hreflang, sitemap, OG-картинки | `src/app/[lang]`, `src/i18n` | готово |
| Страница «Вопросы бабушке и дедушке» (SEO + отправка в WhatsApp) | `src/app/[lang]/questions` | готово |
| Онбординг из 8 шагов, регистрация только в конце | `src/components/Onboarding.tsx`, `src/app/api/onboarding` | готово |
| Вход без пароля (ссылка на e-mail) | `src/lib/login.ts`, `src/app/api/auth` | готово |
| **Ask Grandma**: страница ответа без аккаунта, запись голоса или текст | `src/app/a/[token]`, `src/components/Recorder.tsx` | готово |
| Расшифровка голоса (любой OpenAI-совместимый endpoint) | `src/lib/transcribe.ts` | нужен ключ |
| AI-история и факты с уровнем уверенности, без выдумок | `src/lib/ai.ts`, `src/lib/stories.ts` | нужен ключ Anthropic |
| Подтверждение фактов → дерево и таймлайн | `src/app/app/actions.ts` (`confirmFact`) | готово |
| Дерево семьи, карточки людей, скрытые ветки | `src/app/app/family`, `src/lib/tree.ts` | готово |
| Journey: таймлайн и путь семьи | `src/app/app/journey` | готово |
| Истории, фото, редактирование, приватность историй | `src/app/app/stories` | готово |
| Приглашения родных (ссылка, WhatsApp, роли) | `src/app/app/invite`, `src/app/join` | готово |
| Семейная книга (печать / PDF, QR-код к голосу) | `src/app/app/book` | готово (печатная книга — через партнёра, позже) |
| Семейная страница по закрытой ссылке (вирусная петля) | `src/app/f/[slug]` | готово |
| Эмблема (простая, из данных семьи) | `src/components/Emblem.tsx` | базовая; AI-версия — фаза 2 |
| Оплата: Family $59/год, Legacy Gift $99, Founding Family $249, подарочные коды | `src/app/api/stripe`, `src/app/app/billing` | нужен Stripe |
| Экспорт всего (JSON) и дерева (GEDCOM), удаление семьи | `src/app/api/export`, Settings | готово |
| Аналитика событий и North Star (Contributing Families, 28 дней) | `src/lib/analytics.ts`, `/app/admin` | готово |

Не входит в MVP (по стратегии — позже): чат «Ask Your Family» (фаза 3), AI-эмблема, заказ печатной книги, нативные приложения, перевод интерфейса приложения (сейчас приложение на английском; сайт, онбординг и страница ответа для рассказчика — на 6 языках).

## Запуск локально

Нужен Node.js 20+.

```bash
npm install
cp .env.example .env      # для начала можно ничего не менять
npm run setup             # создаёт базу SQLite и демо-семью Rossi
npm run dev
```

Откройте http://localhost:3000.

- Вход в демо: `/login` → `demo@treename.ai`. Без настроенной почты ссылка для входа показывается прямо на экране (только в режиме разработки).
- Ответить как бабушка Мария: ссылка `/a/...` печатается в консоли после `npm run setup`.
- Без ключей AI история сохраняется дословно, без фактов; без ключа расшифровки голос сохраняется, а текст можно напечатать.

## Ключи и сервисы (`.env`)

| Переменная | Зачем |
| --- | --- |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | истории и факты (по умолчанию `claude-sonnet-5-5`) |
| `TRANSCRIBE_API_KEY`, `TRANSCRIBE_URL`, `TRANSCRIBE_MODEL` | расшифровка голоса |
| `RESEND_API_KEY`, `EMAIL_FROM` | письма со ссылкой для входа и подарками |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | оплата; webhook: `https://<домен>/api/stripe/webhook`, события `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted` |
| `ADMIN_EMAILS` | доступ к странице метрик `/app/admin` |
| `STORAGE_DIR` | папка для записей и фото (постоянный диск в CH/EU) |

## Продакшн

1. База: в `prisma/schema.prisma` поменять `provider = "sqlite"` на `"postgresql"`, указать `DATABASE_URL`, выполнить `npx prisma db push`.
2. Хостинг: любой Node-хостинг с постоянным диском (для записей голоса) в Швейцарии или ЕС. На Vercel диска нет — замените `src/lib/storage.ts` на S3-совместимое хранилище.
3. **Перед тем как обещать на сайте «Data hosted in Switzerland», убедитесь, что база, файлы и AI-провайдеры действительно соответствуют этому.**
4. Политику приватности (`src/app/[lang]/privacy`) должен проверить юрист (nDSG + GDPR).
5. Добавить ограничение частоты запросов (rate limiting) на `/api/onboarding`, `/api/auth/request`, `/api/answers` — например, на уровне хостинга или Cloudflare.

## Как проверено

`tsc` без ошибок, `next build` проходит. Сквозной тест в браузере: главная на DE, онбординг → вход по ссылке → вопрос → ответ рассказчика с телефона → история → подтверждение факта → дерево → Journey → приглашение → семейная страница → книга → экспорт GEDCOM/JSON → оплата (страница) → метрики. Голос, AI, почта и Stripe проверены только в режиме «без ключей»: с реальными ключами их нужно прогнать один раз на стейджинге.

## Структура

```
prisma/            схема базы и демо-данные
src/app/[lang]/    сайт: главная, вопросы, приватность, онбординг
src/app/a/         страница ответа для рассказчика
src/app/app/       приложение семьи (истории, дерево, journey, книга, настройки, оплата, метрики)
src/app/api/       API: онбординг, вход, ответы, файлы, экспорт, Stripe, аналитика
src/components/    UI-компоненты
src/i18n/          тексты на 6 языках
src/lib/           AI, расшифровка, почта, хранилище, аналитика, дерево
```
