---
name: deploy
description: Deploy edu.ninitux.com to prod server 192.168.0.207 via Docker + wb-nginx reverse proxy. Use when shipping changes to production.
---

## Архитектура деплоя

Прод-сервер `192.168.0.207`, всё в Docker.
- Реверс-прокси: контейнер `wb-nginx` (nginx:alpine), бинды `/etc/nginx/conf.d/default.conf` и LE-сертификаты
- Наш сервис: контейнер `edu` (Next.js + Bun), слушает `127.0.0.1:18900`
- nginx server block для `edu.ninitux.com` → `proxy_pass http://127.0.0.1:18900`

## Один раз — настройка инфры

### 1. Получить SSL для edu.ninitux.com
DNS-запись `edu.ninitux.com → IP сервера 207` должна резолвиться.

```bash
ssh user@192.168.0.207 'docker run --rm \
  -v /home/user/wb-price-scheduler/certbot/conf:/etc/letsencrypt \
  -v /home/user/wb-price-scheduler/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d edu.ninitux.com --email you@example.com --agree-tos --no-eff-email'
```

### 2. Добавить server block в nginx
В `/home/user/wb-price-scheduler/nginx/nginx.conf` дописать:

```nginx
# edu.ninitux.com — HTTP (certbot + redirect)
server {
    listen 80;
    server_name edu.ninitux.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

# edu.ninitux.com — HTTPS Next.js app
server {
    listen 443 ssl;
    server_name edu.ninitux.com;

    ssl_certificate /etc/letsencrypt/live/edu.ninitux.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edu.ninitux.com/privkey.pem;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Кэш для статики next.js
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
ssh user@192.168.0.207 'docker exec wb-nginx nginx -t && docker exec wb-nginx nginx -s reload'
```

## Регулярный деплой (после первой настройки)

### Опция A: docker compose build на сервере (рекомендуется)
```bash
ssh user@192.168.0.207 'cd /home/user/edu && \
  git pull && \
  docker compose build && \
  docker compose up -d'
```

### Опция B: build локально, копировать образ
```bash
docker save edu:latest | ssh user@192.168.0.207 'docker load && \
  docker compose -f /home/user/edu/docker-compose.yml up -d'
```

## Health check
```bash
curl -fsS https://edu.ninitux.com/ -o /dev/null -w '%{http_code} %{time_total}s\n'
# Ожидаем 200 < 1s
```

## Откат
```bash
ssh user@192.168.0.207 'cd /home/user/edu && \
  git log --oneline -10 && \
  git checkout <prev-sha> && \
  docker compose build && \
  docker compose up -d'
```
