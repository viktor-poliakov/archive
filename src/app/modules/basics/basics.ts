import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-modules-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ModulesBasics {
  protected readonly whyExample = `// БЕЗ модулей весь код жил в одной глобальной области —
// легко словить конфликт имён между файлами:

// file1.js
var user = 'Ann';

// file2.js — подключён следующим <script>
var user = 'Bob'; // молча перезаписал user из file1!

// С модулями каждый файл — отдельная область.
// Наружу видно только то, что явно экспортировано:

// user.js
export const user = 'Ann';`;

  protected readonly enableExample = `<!-- В браузере модуль подключают с атрибутом type="module" -->
<script type="module" src="app.js"></script>

<!-- модуль по умолчанию работает как defer: грузится параллельно,
     а выполняется после полного разбора HTML -->
<script type="module">
  import { greet } from './greet.js';
  greet();
</script>`;

  protected readonly scopeExample = `// greet.js
const secret = 42;   // видно только внутри этого модуля
function helper() {}  // тоже приватно

export function greet() { // наружу отдаём только это
  console.log('Hi');
}

// В обычном <script> (без type="module") var/function с верхнего
// уровня попали бы в window. В модуле — нет, у него своя область.`;

  protected readonly onceExample = `// config.js — тело модуля выполняется ОДИН раз, при первом импорте
console.log('config loaded');
export const config = { theme: 'dark' };

// Если и app.js, и page.js импортируют config.js:
// 'config loaded' напечатается РОВНО один раз, а config будет
// одним и тем же объектом в обоих файлах (результат кэшируется).`;
}
