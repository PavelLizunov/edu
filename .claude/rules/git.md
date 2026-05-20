## Git правила

### Ветки
- `main` — прод-стабильная
- `feature/<short-name>` — новая фича
- `fix/<short-name>` — багфикс
- `content/<topic-slug>` — контент темы

### Коммиты — Conventional Commits
- `feat:` — новая фича
- `fix:` — исправление бага
- `content:` — добавлена/изменена тема
- `chore:` — конфиги, зависимости, без логики
- `docs:` — документация
- `refactor:` — рефактор без изменения поведения
- `style:` — форматирование, отступы
- `test:` — тесты
- `perf:` — оптимизация

### Запреты
- НИКОГДА `git push --force` в `main`
- НИКОГДА `git push --no-verify`
- НИКОГДА `git commit --amend` если коммит уже запушен
- НИКОГДА `rm -rf .git`

### Перед коммитом
1. `bun run lint` — должно быть чисто
2. `bun run type-check` — должно быть чисто
3. Просмотри `git diff --staged` глазами

### Перед push в main
1. `bun run build` — должно собраться

### Co-Author
Автономные коммиты делаются с подписью:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```
