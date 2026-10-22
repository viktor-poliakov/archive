import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-agents-custom',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAgentsCustom {
  protected readonly ask = `Создай субагента test-runner в .claude/agents/.
Он запускает npm test, разбирается, почему тесты упали, и чинит код.
Тесты пусть меняет, только если они проверяют устаревшее поведение.
Модель — Sonnet, без доступа к вебу.`;

  protected readonly testRunner = `---
name: test-runner
description: Запускает тесты и чинит упавшие. Используй после правок кода или когда просят прогнать тесты.
tools: Read, Edit, Bash, Grep, Glob
model: sonnet
---

Ты отвечаешь за тесты проекта.
1. Запусти npm test.
2. Для каждого упавшего теста найди причину: ошибка в коде или в самом тесте.
3. Чини код. Тест меняй, только если он проверяет устаревшее поведение.
4. Прогони тесты ещё раз и верни короткий отчёт: что упало, что исправлено, что осталось.`;

  protected readonly cliAgents = `# субагент только на эту сессию, без файла
claude --agents '{
  "reviewer": {
    "description": "Ревью изменённого кода. Используй после правок.",
    "prompt": "Ты ревьюер кода. Верни список проблем, код не правь.",
    "tools": ["Read", "Grep", "Glob"],
    "model": "haiku"
  }
}'`;
}
