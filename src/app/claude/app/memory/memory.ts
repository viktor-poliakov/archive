import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-memory',
  imports: [CodeBlock, RouterLink],
  templateUrl: './memory.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppMemory {
  protected readonly phrases = `Запомни: я фронтенд-разработчик, пишу на Angular и TypeScript.
Отвечай коротко, код — без лишних комментариев.

Что ты обо мне помнишь?

Забудь про проект «Склад» — он закрыт.

Найди, как мы в прошлом месяце настраивали деплой на Vercel.

Вернёмся к плану переезда, который мы составляли на прошлой неделе.`;
}
