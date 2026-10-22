import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-plan-mode',
  imports: [CodeBlock, RouterLink],
  templateUrl: './plan-mode.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsPlanMode {
  protected readonly enter = `# внутри сессии
/plan                                   # включить plan mode
/plan перевести корзину на Zustand      # включить и сразу дать задачу

# при запуске
claude --permission-mode plan`;

  protected readonly prompt = `/plan Хочу добавить оплату через ЮKassa.
Посмотри, как сейчас устроены заказы (src/app/api/orders) и схема в prisma.
В плане: какие файлы меняем, новая модель в БД, вебхук, тесты.
Что неясно — спроси, а не угадывай.`;

  protected readonly defaultMode = `{
  "permissions": {
    "defaultMode": "plan"
  }
}`;
}
