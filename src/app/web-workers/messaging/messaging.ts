import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-web-workers-messaging',
  imports: [CodeBlock, RouterLink],
  templateUrl: './messaging.html',
  styleUrls: ['../../content/doc.scss'],
})
export class WebWorkersMessaging {
  protected readonly mainExample = `// main.js — главный поток
const worker = new Worker('worker.js');

// слать можно не только строки, но и объекты, массивы и т.п.
worker.postMessage({ type: 'sum', numbers: [1, 2, 3, 4] });

worker.onmessage = (event) => {
  console.log(event.data); // { type: 'result', value: 10 }
};`;

  protected readonly workerExample = `// worker.js — отдельный поток
self.onmessage = (event) => {
  const { type, numbers } = event.data; // разбираем полученное сообщение
  if (type === 'sum') {
    const value = numbers.reduce((a, b) => a + b, 0);
    self.postMessage({ type: 'result', value });
  }
};`;

  protected readonly cloneExample = `const worker = new Worker('worker.js');

const data = { count: 1 };
worker.postMessage(data); // отправляется КОПИЯ (структурное клонирование)

data.count = 999; // меняем оригинал уже ПОСЛЕ отправки
// воркер всё равно получит { count: 1 } — снимок на момент отправки`;

  protected readonly terminateExample = `const worker = new Worker('worker.js');

// остановить воркер извне (немедленно прекращает работу)
worker.terminate();

// либо воркер может завершить себя сам, изнутри:
// self.close();`;

  protected readonly errorExample = `const worker = new Worker('worker.js');

// ошибку, возникшую ВНУТРИ воркера, ловим в главном потоке
worker.onerror = (event) => {
  console.error('worker error:', event.message);
};`;
}
