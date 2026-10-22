import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-research',
  imports: [CodeBlock, RouterLink],
  templateUrl: './research.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppResearch {
  protected readonly searchPrompts = `Какая последняя стабильная версия Angular и что в ней нового?

Прочитай эту статью и перескажи главное в пяти пунктах: https://…`;

  protected readonly researchPrompts = `Сравни сервисы email-рассылок для интернет-магазина на 10 тысяч
подписчиков: цены, лимиты, интеграции с Shopify, отзывы. Итог — таблица
и рекомендация.

Подготовь бриф к встрече с компанией «Альфа-Логистика»: новости за полгода,
наша переписка с ними в Gmail и заметки из Google Docs.`;
}
