import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-context',
  imports: [CodeBlock, RouterLink],
  templateUrl: './context.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsContext {
  protected readonly commands = `/context                 # что сейчас занимает контекст
/compact                 # сжать переписку в краткое изложение
/compact сохрани решения по API и список открытых задач
/autocompact 400k        # сжимать раньше — при 400 тыс. токенов
/autocompact auto        # вернуть порог по умолчанию
/clear                   # начать новый разговор с пустым контекстом`;

  protected readonly compactInstructions = `## Compact Instructions
При сжатии сохраняй: какие файлы изменены и зачем, принятые решения
по архитектуре, команды для тестов и список того, что ещё не сделано.`;

  protected readonly settings = `{
  "autoCompactWindow": 400000
}`;
}
