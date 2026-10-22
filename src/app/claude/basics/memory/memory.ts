import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-memory',
  imports: [CodeBlock, RouterLink],
  templateUrl: './memory.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsMemory {
  protected readonly layout = `~/.claude/projects/<project>/memory/
├── MEMORY.md                  # оглавление: по строке на заметку
├── feedback_testing.md        # «тесты гоняем без моков базы»
└── user_role.md               # «пользователь — бэкенд-разработчик»`;

  protected readonly note = `---
type: feedback
---
Тесты интеграции гоняем на настоящей базе, без моков.

Why: в прошлом квартале моки скрыли сломанную миграцию.
How to apply: в новых тестах поднимать базу через docker compose.`;

  protected readonly disable = `{
  "autoMemoryEnabled": false
}`;
}
