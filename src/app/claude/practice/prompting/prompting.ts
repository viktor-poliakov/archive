import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-practice-prompting',
  imports: [CodeBlock, RouterLink],
  templateUrl: './prompting.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePracticePrompting {
  protected readonly task = `После таймаута сессии пользователи не могут войти.
Посмотри src/auth/, особенно обновление токена в refreshToken.ts.
Сначала напиши падающий тест, который воспроизводит проблему, потом исправь.
Публичный API модуля не меняй, новых зависимостей не добавляй.
Готово, когда проходят npm test и npm run build — покажи их вывод.`;

  protected readonly mentions = `Объясни логику в @src/utils/auth.ts
Как устроена @src/components?
Сверь @src/api/client.ts с документацией: https://example.com/docs/api`;

  protected readonly pipe = `cat error.log | claude -p "объясни эту ошибку"
git log --oneline -20 | claude -p "кратко перескажи последние коммиты"`;

  protected readonly interview = `Хочу добавить экспорт отчётов в Excel. Расспроси меня подробно:
реализация, интерфейс, крайние случаи, компромиссы. Очевидного не спрашивай,
копай в то, что легко упустить. Когда всё обсудим — запиши спецификацию в SPEC.md.`;
}
