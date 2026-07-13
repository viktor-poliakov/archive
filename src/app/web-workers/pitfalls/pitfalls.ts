import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-web-workers-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class WebWorkersPitfalls {
  protected readonly noDomExample = `// внутри worker.js
self.onmessage = () => {
  document.querySelector('h1'); // ReferenceError: document is not defined
  // воркер не видит DOM: он считает и шлёт результат,
  // а страницу меняет уже главный поток
};`;

  protected readonly transferExample = `// большие данные копировать дорого. ArrayBuffer можно ПЕРЕДАТЬ
// без копирования — списком «передаваемых» объектов вторым аргументом
const buffer = new ArrayBuffer(100_000_000); // 100 МБ

worker.postMessage(buffer, [buffer]); // передаём владение, а не копируем
buffer.byteLength; // 0 — буфер «переехал» в воркер, здесь больше недоступен`;

  protected readonly cantSendExample = `const worker = new Worker('worker.js');

// функции клонировать нельзя → ошибка
worker.postMessage(() => {}); // DataCloneError

// Date, Map, Set, ArrayBuffer — клонируются нормально
worker.postMessage(new Date()); // ок

// а экземпляр своего класса «доедет» без методов — останутся только поля`;
}
