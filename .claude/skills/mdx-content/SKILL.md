---
name: mdx-content
description: Strict template and rules for writing wiki topic MDX files. Use when creating or editing content in content/*/*.mdx.
---

## Шаблон MDX-файла

```mdx
---
title: "Kubernetes"
slug: "kubernetes"
category: "devops"
icon: "Boxes"
order: 3
tags: ["orchestration", "containers", "ops"]
description: "От подов до Ingress: оркестрация контейнеров на проде"
---

## Аналогия

<AnalogyBox>
Представь дирижёра большого оркестра. Музыкантов сотни, у каждого свой инструмент,
кто-то опаздывает, кто-то фальшивит. Дирижёр не играет сам — он следит чтобы
правильные люди вступали в правильное время и заменяет тех, кто выпал. Когда
музыкантов 5 — справишься без дирижёра. Когда 500 — без него хаос.
</AnalogyBox>

## Ключевые концепции

<ConceptGrid>
  <ConceptCard title="Pod" icon="Boxes">
    Минимальная единица. Это не контейнер, а коробка с одним или несколькими
    контейнерами, которые делят сеть и диск. На прод обычно — один контейнер на под.
  </ConceptCard>

  <ConceptCard title="Deployment" icon="Layers">
    Декларация желаемого состояния: «хочу 3 реплики такого пода». Сам следит чтобы
    их было ровно 3 — если упал, поднимет. Rolling update без даунтайма.
  </ConceptCard>

  <ConceptCard title="Service" icon="Network">
    Стабильный сетевой эндпоинт перед группой подов. Поды умирают и рождаются с новыми
    IP — Service даёт DNS-имя которое не меняется. ClusterIP, NodePort, LoadBalancer.
  </ConceptCard>

  <ConceptCard title="Ingress" icon="Route">
    HTTP-роутер на входе кластера. Один внешний IP, разные домены/пути → разные Service.
    Без Ingress пришлось бы поднимать LoadBalancer на каждый сервис.
  </ConceptCard>

  <ConceptCard title="HPA" icon="TrendingUp">
    Horizontal Pod Autoscaler. Смотрит на CPU/память подов и масштабирует Deployment.
    Не путать с VPA (он меняет размер пода, не количество).
  </ConceptCard>
</ConceptGrid>

## Примеры

**deployment.yaml — три реплики nginx**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.27-alpine
        ports:
        - containerPort: 80
        resources:
          requests: { cpu: 100m, memory: 64Mi }
          limits:   { cpu: 500m, memory: 256Mi }
```

**Полезные kubectl команды**

```bash
kubectl get pods -A                    # все поды во всех namespace
kubectl logs -f deploy/web             # хвост логов deployment
kubectl describe pod web-abc123        # почему под не стартует
kubectl rollout status deploy/web      # статус деплоя
kubectl rollout undo deploy/web        # откат на предыдущий ReplicaSet
```

## Проверь себя

<QuizCard
  question="У тебя Deployment с 5 репликами. Ты удалил один Pod руками через kubectl delete. Что произойдёт?"
  options={[
    "Реплик станет 4, нужно вручную поднять новую",
    "Deployment пересоздаст под и реплик снова будет 5",
    "Deployment упадёт в ошибку и весь сервис уйдёт"
  ]}
  correct={1}
  explanation="Deployment поддерживает желаемое состояние через ReplicaSet — он постоянно сравнивает желаемое количество реплик с фактическим. Удалённый под немедленно пересоздаётся."
/>
```

## Компоненты — API

Импорты делать НЕ нужно — компоненты регистрируются автоматически через `lib/mdx-components.tsx`.

### `<AnalogyBox>`
```mdx
<AnalogyBox>
Текст аналогии. Можно <b>выделять важное</b>.
</AnalogyBox>
```

### `<ConceptGrid>` + `<ConceptCard>`
```mdx
<ConceptGrid>
  <ConceptCard title="Заголовок" icon="LucideIconName">
  Одно-два предложения. Можно использовать `inline code`.
  </ConceptCard>
  …
</ConceptGrid>
```
- `icon` — имя из `lucide-react` (см. список ниже)
- `<ConceptCard>` обязательно внутри `<ConceptGrid>` — иначе сетка не сработает

Иконки, доступные в проекте (см. `components/icon.tsx`):
`AlertTriangle Archive ArrowRight Boxes BookOpen Cable Check Cloud Container Copy Cpu Database FileCode FileText Filter GitBranch Globe HardDrive Hash Key KeyRound Layers Lightbulb Link ListTree Lock Moon Network Package Pickaxe Pipette Play Plug RefreshCw Repeat RotateCcw Route Search Server Settings Shield ShieldCheck Shuffle Sun Table Tag Terminal TrendingUp Workflow Zap`

### Код — **markdown-fenced блок**, не `<CodeBlock>`

Используй обычный markdown-fence — MDX не парсит его как JSX, поэтому работают любые `{`, `}`, `${}`, JSON, Jinja `{{ }}` без экранирования:

````mdx
**filename.yaml**

```yaml
content with {{ jinja }} and ${env} works fine
```
````

- Языки: `yaml`, `bash`, `sh`, `json`, `dockerfile`, `hcl` (terraform), `javascript`, `typescript`, `python`, `sql`, `nginx`, `ini`, `toml`, `diff`, `html`, `css`, `text`
- «Лейбл» (имя файла) — отдельной жирной строкой перед блоком: `**deployment.yaml**`
- Под капотом fence маппится в наш стилизованный `CodeBlock` через `mdx-components.tsx` (см. `lib/mdx-components.tsx`, `pre` override).

JSX-форму `<CodeBlock lang="..." label="...">...</CodeBlock>` использовать **не нужно**: она ломается на коде с `{}` (Jinja, Logstash, JSON, HCL).

### `<QuizCard>`
```mdx
<QuizCard
  question="Вопрос — одно предложение, заканчивается '?'"
  options={[
    "Неверный вариант (правдоподобная ошибка)",
    "Верный",
    "Ещё один неверный"
  ]}
  correct={1}
  explanation="1–3 предложения, почему верный — верный."
/>
```
- `correct` — индекс правильного (0-based)
- Дистракторы — реальные ошибки реального инженера, не очевидно бредовые
- `explanation` — можно строкой, можно JSX `<>...</>` если нужно `<code>` внутри

## Жёсткие правила

1. **Frontmatter обязателен** — все 7 полей. `order` определяет порядок темы в категории.
2. **Аналогия обязательна.** Бытовая, без терминов. 2–4 предложения.
3. **4–6 `ConceptCard`** внутри одного `<ConceptGrid>` — не больше, не меньше.
4. **Минимум один `CodeBlock`** с реальным рабочим примером. Команды должны копироваться и выполняться.
5. **Ровно один `QuizCard`** с 2–4 вариантами и `correct` индексом.
6. **Никаких "Давайте...", "Важно отметить...", "Стоит подчеркнуть..."**. Сухо, по-делу, для инженера.
7. **Эмодзи запрещены в теле контента.** Иконки — через `lucide` в компонентах.
8. **На «ты», не «вы».**
9. **Технические термины не транслитерируем**: Pod, Deployment, Inventory — а не «Под», «Деплоймент».
10. **Версии фиксируй**: `nginx:1.27-alpine`, `postgres:16`, не `:latest`.
