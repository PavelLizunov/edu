# Деплой `edu.ninitux.com`

## Архитектура

```
[ Internet ]
     ↓ 443
[ wb-nginx (Docker, 192.168.0.207) ]    ← TLS терминация, Let's Encrypt
     ↓ proxy_pass http://127.0.0.1:18900
[ edu (Docker, 192.168.0.207) ]          ← Next.js 16 + Bun
     ├─ /var/www/landing  ← не для нас (ninitux.com)
     └─ внутри контейнера: bun start, .next/standalone
```

Тот же паттерн что у `tasks.ninitux.com`, `git.ninitux.com`, и прочих сабдоменов.

## Один раз — настройка

### 1. DNS
В DNS-зоне `ninitux.com` добавить:
```
edu  IN  A  <public-IP-сервера-207>
```
(или CNAME на основной домен)

### 2. Завести репу в Forgejo
```bash
# на 192.168.0.207, через Forgejo UI или API
curl -X POST -u slovn:<token> \
  http://192.168.0.207:18300/api/v1/user/repos \
  -H 'content-type: application/json' \
  -d '{"name":"edu","private":false,"default_branch":"main"}'
```

### 3. Клонировать на проде
```bash
ssh user@192.168.0.207 'cd /home/user && \
  git clone ssh://git@192.168.0.207:18222/slovn/edu.git'
```

### 4. SSL сертификат
```bash
ssh user@192.168.0.207 '
  docker run --rm \
    -v /home/user/wb-price-scheduler/certbot/conf:/etc/letsencrypt \
    -v /home/user/wb-price-scheduler/certbot/www:/var/www/certbot \
    certbot/certbot certonly --webroot -w /var/www/certbot \
    -d edu.ninitux.com \
    --email pavel@ninitux.com --agree-tos --no-eff-email
'
```

### 5. Nginx server block

Дописать в `/home/user/wb-price-scheduler/nginx/nginx.conf`:

```nginx
# edu.ninitux.com — HTTP (certbot + redirect)
server {
    listen 80;
    server_name edu.ninitux.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

# edu.ninitux.com — HTTPS Next.js
server {
    listen 443 ssl;
    server_name edu.ninitux.com;

    ssl_certificate /etc/letsencrypt/live/edu.ninitux.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edu.ninitux.com/privkey.pem;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:18900;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:18900;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Применить:
```bash
ssh user@192.168.0.207 '
  docker exec wb-nginx nginx -t && \
  docker exec wb-nginx nginx -s reload
'
```

### 6. Первый запуск

```bash
ssh user@192.168.0.207 'cd /home/user/edu && docker compose up -d --build'
```

## Регулярный деплой

```bash
ssh user@192.168.0.207 'cd /home/user/edu && \
  git pull && \
  docker compose up -d --build'
```

Можно автоматизировать через Forgejo webhook → скрипт на 207.

## Health check

```bash
curl -fsS https://edu.ninitux.com/ -o /dev/null -w '%{http_code} %{time_total}s\n'
# ожидание: 200, < 1s
```

## Откат

```bash
ssh user@192.168.0.207 'cd /home/user/edu && \
  git log --oneline -10 && \
  git checkout <prev-sha> && \
  docker compose up -d --build'
```

## Мониторинг

- Логи: `docker logs -f edu --tail 100`
- Метрики: Umami на `analytics.ninitux.com` (вставить tracking script в `<head>`)
- Аптайм: добавить в существующий мониторинг (если есть) или поднять uptime-kuma

## Безопасность

- Read-only сайт, без форм — поверхность атаки минимальна
- Все security-headers уже выставлены `wb-nginx`
- CSP можно добавить в Next.js через middleware или meta tag (Phase 9)
- Никаких пользовательских данных не собираем (Umami — анонимная статистика)
