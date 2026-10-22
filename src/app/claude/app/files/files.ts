import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-files',
  imports: [CodeBlock, RouterLink],
  templateUrl: './files.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppFiles {
  protected readonly prompts = `Сделай в Excel трекер семейного бюджета: доходы, расходы по категориям,
автоматический подсчёт накоплений за месяц.

Вот выгрузка продаж за квартал (CSV во вложении). Сделай отчёт в Word:
динамика, графики, выводы и рекомендации.

Преврати этот документ в презентацию на 10 слайдов.

Вытащи все таблицы из этого PDF в Excel и построй сводный график.`;
}
