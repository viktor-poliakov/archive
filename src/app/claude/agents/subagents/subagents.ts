import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-agents-subagents',
  imports: [CodeBlock, RouterLink],
  templateUrl: './subagents.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAgentsSubagents {
  protected readonly ask = `Используй субагент Explore: найди, где проверяется JWT-токен и кто это вызывает.

Запусти три субагента параллельно — пусть каждый проверит свой модуль:
cart, orders и payments. Мне нужен общий список проблем.`;

  protected readonly mention = `@agent-code-reviewer посмотри изменения в src/auth`;

  protected readonly cli = `# вся сессия работает как субагент code-reviewer
claude --agent code-reviewer

# внутри сессии: форк текущего разговора, работает в фоне
/subtask проверь, что миграция не ломает старые заказы`;

  protected readonly agentFile = `---
name: code-reviewer
description: Ревью изменённого кода — баги, безопасность, читаемость. Используй сразу после правок кода.
tools: Read, Grep, Glob, Bash
model: sonnet
---

Ты ревьюер кода. Запусти git diff и посмотри изменённые файлы.
Перечисли проблемы по важности: критичные, желательные, мелочи.
Код не правь — только отчёт.`;
}
