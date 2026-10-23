import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-practice-tokens',
  imports: [CodeBlock, RouterLink],
  templateUrl: './tokens.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePracticeTokens {
  protected readonly session = `/usage            # расход, лимиты и что их съедает
/context          # чем занят контекст прямо сейчас
/rename auth-fix  # дать сессии имя, чтобы потом найти через /resume
/clear            # новая задача — пустой контекст`;

  protected readonly model = `/model sonnet     # большинство задач с кодом
/model opus       # архитектура, сложная отладка
/effort low       # простая правка — меньше размышлений`;

  protected readonly subagent = `---
name: test-runner
description: Запускает тесты и возвращает только упавшие
tools: Bash, Read
model: haiku
---
Запусти тесты. В ответе перечисли только упавшие тесты и текст ошибки.`;
}
