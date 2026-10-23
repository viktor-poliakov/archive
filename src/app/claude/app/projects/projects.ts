import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-projects',
  imports: [CodeBlock, RouterLink],
  templateUrl: './projects.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppProjects {
  protected readonly instructions = `Ты — аналитик, помогаешь мне исследовать рынок доставки продуктов.

- Опирайся на файлы «Отчёты», «Интервью с клиентами» и «План исследования» из знаний проекта.
- Каждый вывод подкрепляй ссылкой на файл, из которого он взят.
- Если данных не хватает или источники противоречат друг другу — так и скажи, не додумывай.
- Отвечай по-русски: сначала вывод, потом обоснование, без канцелярита.`;
}
