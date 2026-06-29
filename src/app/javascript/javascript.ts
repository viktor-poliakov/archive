import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../code/code-block';

@Component({
  selector: 'app-javascript-overview',
  imports: [CodeBlock, RouterLink],
  templateUrl: './javascript.html',
  styleUrls: ['../content/doc.scss'],
})
export class JavascriptOverview {
  protected readonly everywhereExample = `// один и тот же язык — в разных средах

// в браузере: реагируем на клик и меняем страницу
button.addEventListener('click', () => {
  document.title = 'Clicked!';
});

// на сервере (Node.js): отвечаем на HTTP-запрос
http.createServer((req, res) => {
  res.end('Hello from the server');
});`;

  protected readonly jitExample = `function sum(a, b) {
  return a + b;
}

// первый вызов — движок интерпретирует байт-код
sum(1, 2);

// если функцию зовут часто и всегда с числами,
// движок считает её «горячей» и компилирует в машинный код
for (let i = 0; i < 1_000_000; i++) {
  sum(i, i); // здесь уже работает оптимизированная версия
}`;
}
