import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-web-workers-practical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './practical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class WebWorkersPractical {
  protected readonly promiseExample = `// обёртка: запустить задачу и получить результат как промис
function runInWorker(worker, message) {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => resolve(event.data);
    worker.onerror = (event) => reject(new Error(event.message));
    worker.postMessage(message);
  });
}

const worker = new Worker('primes.js');
const primes = await runInWorker(worker, { max: 1_000_000 });
console.log(primes.length); // интерфейс не подвисал, пока шёл расчёт`;

  protected readonly inlineExample = `// воркер прямо из строки, без отдельного файла:
const code = \`
  self.onmessage = (e) => {
    let sum = 0;
    for (let i = 0; i <= e.data; i++) sum += i;
    self.postMessage(sum);
  };
\`;
const blob = new Blob([code], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));

worker.postMessage(1_000_000);
worker.onmessage = (e) => console.log(e.data); // 500000500000`;
}
