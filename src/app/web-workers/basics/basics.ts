import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-web-workers-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class WebWorkersBasics {
  protected readonly blockingExample = `// тяжёлая задача в ГЛАВНОМ потоке замораживает страницу:
// пока идёт цикл, кнопки не нажимаются, анимации стоят
button.addEventListener('click', () => {
  let sum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    sum += i; // считается несколько секунд — UI «завис»
  }
  console.log(sum);
});`;

  protected readonly createExample = `// main.js — главный поток
const worker = new Worker('worker.js'); // запускаем воркер из отдельного файла

worker.postMessage('start'); // отправляем воркеру задание

worker.onmessage = (event) => {
  console.log('result:', event.data); // получаем результат, UI не блокировался
};`;

  protected readonly workerFileExample = `// worker.js — отдельный поток, СВОЙ файл
self.onmessage = (event) => {
  // тут можно долго считать, не трогая главный поток
  let sum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    sum += i;
  }
  self.postMessage(sum); // отправляем результат обратно в главный поток
};`;
}
