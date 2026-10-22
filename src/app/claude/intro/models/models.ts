import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-intro-models',
  imports: [CodeBlock, RouterLink],
  templateUrl: './models.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeIntroModels {
  protected readonly switchModel = `# внутри сессии
/model              # открыть список и выбрать
/model sonnet       # переключиться на Sonnet

# при запуске
claude --model opus
ANTHROPIC_MODEL=haiku claude`;

  protected readonly settings = `{
  "model": "sonnet"
}`;

  protected readonly effort = `/effort high    # думать дольше — для сложных задач
/effort low     # отвечать быстрее — для простых правок
/effort auto    # вернуть уровень по умолчанию
/fast           # быстрый режим Opus 5.5 (дороже)`;
}
