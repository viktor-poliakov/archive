import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-chrome',
  imports: [CodeBlock, RouterLink],
  templateUrl: './chrome.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppChrome {
  protected readonly prompts = `Сравни три открытые вкладки с ноутбуками: цена, вес, автономность.
Итог — таблица.

Перенеси данные с этой страницы вакансии в мою таблицу откликов
в Google Sheets.

Разбери входящие в Gmail за сегодня: рассылки — в архив,
на письма клиентов подготовь черновики ответов.

Заполни форму авансового отчёта, чек прикладываю.`;

  protected readonly codeStart = `claude --chrome`;

  protected readonly codePrompt = `Открой localhost:4200, отправь форму входа с пустым паролем
и проверь, что ошибка видна и в консоли нет исключений.`;
}
