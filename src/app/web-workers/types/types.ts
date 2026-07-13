import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-web-workers-types',
  imports: [CodeBlock, RouterLink],
  templateUrl: './types.html',
  styleUrls: ['../../content/doc.scss'],
})
export class WebWorkersTypes {
  protected readonly dedicatedExample = `// Dedicated Worker — «личный» воркер одной страницы (то, что мы изучали)
const worker = new Worker('worker.js');
worker.postMessage('task');`;

  protected readonly sharedExample = `// Shared Worker — ОДИН воркер на несколько вкладок/окон одного сайта.
// связь идёт через порт (port)
const shared = new SharedWorker('shared.js');

shared.port.start();
shared.port.postMessage('hello');
shared.port.onmessage = (event) => console.log(event.data);`;

  protected readonly serviceExample = `// Service Worker — посредник между страницей и сетью.
// регистрируется один раз:
navigator.serviceWorker.register('sw.js');

// а внутри sw.js — перехват сетевых запросов (кэш, офлайн):
// self.addEventListener('fetch', (event) => {
//   event.respondWith(caches.match(event.request));
// });`;
}
