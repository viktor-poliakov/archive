import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-storage-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StoragePitfalls {
  protected readonly stringsOnlyExample = `localStorage.setItem('count', 42);
localStorage.getItem('count');     // '42' — это СТРОКА, не число!
localStorage.getItem('count') + 1; // '421' — склейка строк, а не 43

// число нужно вернуть вручную
Number(localStorage.getItem('count')); // 42

// объект без JSON превращается в мусор
localStorage.setItem('user', { name: 'Anna' });
localStorage.getItem('user'); // '[object Object]'`;

  protected readonly quotaExample = `// у хранилища есть лимит (~5–10 МБ). При переполнении — исключение
try {
  localStorage.setItem('huge', veryLongString);
} catch (error) {
  // error.name === 'QuotaExceededError' — хранилище переполнено
  console.error('Storage is full');
}`;

  protected readonly securityExample = `// localStorage доступен ЛЮБОМУ скрипту на странице.
// код, внедрённый через XSS, прочитает из него всё:
localStorage.getItem('authToken'); // утечёт вместе с токеном

// поэтому токен сессии безопаснее держать в HttpOnly-cookie,
// которую JavaScript не видит вовсе`;
}
