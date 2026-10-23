import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-mcp-what-is',
  imports: [CodeBlock, RouterLink],
  templateUrl: './what-is.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeMcpWhatIs {
  protected readonly usage = `# инструменты: Claude вызывает их сам
> Какая ошибка чаще всего падала в Sentry за сутки? Найди причину

# ресурс: подставляется в запрос, как файл
> Сравни @postgres:schema://users с моделью в src/models/user.ts

# промпт: готовый сценарий от автора сервера
> /mcp__github__pr_review 456`;
}
