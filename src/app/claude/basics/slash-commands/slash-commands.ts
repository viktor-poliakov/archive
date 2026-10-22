import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-slash-commands',
  imports: [CodeBlock, RouterLink],
  templateUrl: './slash-commands.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsSlashCommands {
  protected readonly usage = `/model sonnet
/compact оставь только решения по API и список открытых задач
/plan перевести корзину на Zustand
/btw что делает флаг --frozen-lockfile?`;

  protected readonly custom = `---
description: Разобрать упавшие тесты и предложить исправление
argument-hint: "[папка с тестами]"
---
Запусти тесты в $ARGUMENTS и разбери, почему они падают.

Что менялось с последнего коммита:
!\`git diff HEAD --stat\`

Предложи исправление, но код пока не меняй.`;

  protected readonly customRun = `/fix-tests src/cart`;

  protected readonly external = `/code-formatter:format src/       # команда из плагина code-formatter
/mcp__github__pr_review 456       # промпт MCP-сервера github`;
}
