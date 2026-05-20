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

<ConceptCard title="Pod" icon="Box">
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

<ConceptCard title="Ingress" icon="DoorOpen">
HTTP-роутер на входе кластера. Один внешний IP, разные домены/пути → разные Service.
Без Ingress пришлось бы поднимать LoadBalancer на каждый сервис.
</ConceptCard>

<ConceptCard title="HPA" icon="TrendingUp">
Horizontal Pod Autoscaler. Смотрит на CPU/память подов и масштабирует Deployment.
Не путать с VPA (он меняет размер пода, не количество).
</ConceptCard>

## Примеры

<CodeBlock lang="yaml" label="deployment.yaml — три реплики nginx">
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
</CodeBlock>

<CodeBlock lang="bash" label="Полезные kubectl команды">
kubectl get pods -A                    # все поды во всех namespace
kubectl logs -f deploy/web             # хвост логов deployment
kubectl describe pod web-abc123        # почему под не стартует
kubectl rollout status deploy/web      # статус деплоя
kubectl rollout undo deploy/web        # откат на предыдущий ReplicaSet
</CodeBlock>

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

## Жёсткие правила
1. **Frontmatter обязателен** — все 7 полей. `order` определяет порядок темы в категории.
2. **Аналогия обязательна.** Без неё — это не наш формат.
3. **4–6 ConceptCard** — не больше, не меньше.
4. **Минимум один CodeBlock** с реальным рабочим примером.
5. **Ровно один QuizCard** с 3 вариантами и `correct: 0..2`.
6. **Никакого "Давайте..." и "Важно отметить".** Сухо, по-делу, для инженера.
7. **Эмодзи запрещены в теле контента.** Иконки — через lucide-react в компонентах.
8. **Все import уже импортированы автоматически** через `lib/mdx-components.tsx`. В MDX-файле НЕ нужно писать `import { AnalogyBox } from ...`
