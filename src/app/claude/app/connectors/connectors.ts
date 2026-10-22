import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-connectors',
  imports: [CodeBlock, RouterLink],
  templateUrl: './connectors.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppConnectors {
  protected readonly prompts = `Что у меня завтра в календаре? Где есть окно на час для созвона?

Найди в Google Drive договор с «Альфа-Логистикой» и выпиши сроки оплаты.

Собери непрочитанные письма от клиентов за неделю, сгруппируй по темам
и подготовь черновики ответов в Gmail.

Создай в Linear задачу на баг с оплатой по описанию из этого чата.`;
}
