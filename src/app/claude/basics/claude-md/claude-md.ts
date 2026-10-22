import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-claude-md',
  imports: [CodeBlock, RouterLink],
  templateUrl: './claude-md.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsClaudeMd {
  protected readonly commands = `/init      # создать CLAUDE.md по проекту (или предложить улучшения)
/memory    # открыть CLAUDE.md и файлы памяти для правки
/context   # посмотреть, какие CLAUDE.md и правила загружены`;

  protected readonly example = `# Магазин чая

Next.js + TypeScript, база PostgreSQL через Prisma.

## Команды
- \`npm run dev\` — дев-сервер на :3000
- \`npm test\` — тесты (Vitest); один файл: \`npx vitest run src/cart\`
- \`npm run db:migrate\` — миграции; сначала поднять базу: \`docker compose up db\`

## Правила
- Цены храним в копейках, целым числом. Никогда не float.
- Новые API-роуты — в \`src/app/api/\`, входные данные проверяем через zod.
- IMPORTANT: не правим \`src/legacy/\` — этот код переписываем, а не чиним.

## Подробнее
@docs/architecture.md`;

  protected readonly rule = `---
paths:
  - "src/api/**/*.ts"
---
# Правила для API
- Ошибки возвращаем в формате { error, code }.
- Каждый новый роут покрываем тестом в tests/api/.`;
}
