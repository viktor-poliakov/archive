import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-intro-pricing',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pricing.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeIntroPricing {
  protected readonly usage = `/usage    # сколько лимита подписки потрачено`;

  protected readonly apiKey = `# если переменная задана, Claude Code платит по API-ключу, а не по подписке
echo $ANTHROPIC_API_KEY

# вернуться на подписку
unset ANTHROPIC_API_KEY`;
}
