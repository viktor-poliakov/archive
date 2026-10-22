import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-artifacts',
  imports: [CodeBlock, RouterLink],
  templateUrl: './artifacts.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppArtifacts {
  protected readonly prompts = `Сделай тренажёр английских неправильных глаголов: показывает форму,
я ввожу две другие, в конце — счёт и список ошибок.

Вот выгрузка расходов за квартал (CSV во вложении). Сделай дашборд:
траты по категориям, динамика по месяцам, топ-5 покупок.

Нарисуй схему процесса оформления заказа: корзина → оплата → доставка,
с ветками для отказа в оплате и возврата.`;

  protected readonly codePrompt = `Сделай артефакт с разбором этого PR: дифф с пояснениями
у строк, находки раскрась по важности.`;
}
