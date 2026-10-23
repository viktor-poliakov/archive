import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-practice-workflows',
  imports: [CodeBlock, RouterLink],
  templateUrl: './workflows.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePracticeWorkflows {
  protected readonly explore = `дай обзор проекта: структура, главные модули, как запустить
как устроена аутентификация? пройди путь входа от формы до базы
составь глоссарий терминов предметной области по коду`;

  protected readonly bugfix = `npm test падает в cart.spec.ts, ошибка ниже.
[текст ошибки]
Найди причину, напиши тест, который её воспроизводит, и исправь.
Ошибку не глуши. В конце прогони все тесты.`;

  protected readonly feature = `# plan mode (Shift+Tab)
изучи src/auth и то, как мы храним секреты в переменных окружения
хочу вход через Google OAuth: какие файлы менять, как пойдёт сессия? составь план

# после одобрения плана
реализуй план, напиши тесты для callback-обработчика, прогони и почини
сделай коммит с понятным сообщением и открой PR`;

  protected readonly tdd = `напиши тесты для parsePrice: "1 200,50 ₽" → 1200.5, пустая строка → ошибка.
это TDD: реализацию не пиши, запусти тесты и убедись, что они падают

# следующим сообщением
теперь напиши parsePrice так, чтобы тесты прошли. тесты не меняй`;

  protected readonly refactor = `перепиши utils.js на современный JavaScript, поведение не меняй.
иди маленькими шагами и после каждого прогоняй тесты`;

  protected readonly review = `/code-review
/security-review
создай PR для моих изменений и перечисли в описании риски`;

  protected readonly ui = `[скриншот макета]
сверстай этот экран. потом сделай скриншот результата,
сравни с макетом, перечисли различия и исправь их`;

  protected readonly batch = `/batch переведи все тесты с Jest на Vitest`;
}
