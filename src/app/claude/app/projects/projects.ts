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
  protected readonly instructions = `Ты — редактор моего романа «Северный ветер».

- Опирайся на файлы «Персонажи», «Мир» и «План глав» из знаний проекта.
- Пиши от третьего лица в прошедшем времени, без канцелярита.
- Если сцена противоречит плану или характеру героя — сначала скажи об этом.
- Отвечай по-русски; черновики сцен — не длиннее 1500 слов.`;
}
