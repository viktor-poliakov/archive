import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-agents-what-is',
  imports: [CodeBlock, RouterLink],
  templateUrl: './what-is.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAgentsWhatIs {
  protected readonly prompt = `В корзине неверно считается скидка, если в заказе есть товар по акции.
Код — в src/cart/. Найди причину и исправь.
Готово, когда npm test проходит и есть тест на этот случай.`;
}
