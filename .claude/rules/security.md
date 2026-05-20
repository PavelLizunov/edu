## Security правила

### Секреты
- НИКОГДА не хардкодить токены, пароли, ключи API в коде
- Все секреты — через переменные окружения (`process.env.X`)
- `.env*` и `secrets/` уже в `.gitignore` и заблокированы в Read permissions
- Никогда не отправлять `.env.production` в репозиторий

### Внешние ресурсы
- НЕТ внешних CDN (шрифты, иконки, скрипты) без острой необходимости
- Если CDN — то с SRI (Subresource Integrity)
- Контентная политика (CSP) — `default-src 'self'`, без `unsafe-inline`

### Заголовки
Все настроены на уровне nginx (см. `nginx.conf` на проде):
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Пользовательский ввод
- Edu — read-only сайт, форм нет
- Если появится поиск — клиентский, по предсобранному индексу (не SQL)
- Quiz — никакого сохранения ответов, всё локально

### Зависимости
- Перед добавлением пакета — проверить:
  - возраст последнего релиза (< 1 года)
  - количество звёзд (> 500 для нон-microsoft)
  - наличие в `@types/...` если нет TS
- `bun pm ls` периодически
- `bun update` раз в месяц, аккуратно

### Анализ
- Umami (https://analytics.ninitux.com) для метрик трафика
- Никаких Google Analytics / Yandex.Metrika
- Учёт DNT (Do Not Track) на стороне Umami

### Запреты
- НЕ выполнять `eval()` или `new Function()`
- НЕ парсить пользовательский JSON без обёртки в try/catch
- НЕ доверять `process.env.NODE_ENV` для бизнес-логики (только для dev-only кода)
