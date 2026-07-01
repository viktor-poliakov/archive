import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-event-loop-rendering',
  imports: [CodeBlock, RouterLink],
  templateUrl: './rendering.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventLoopRendering {
  protected readonly rafOrderExample = `console.log('script start');

setTimeout(() => console.log('setTimeout'), 0);         // макрозадача

requestAnimationFrame(() => console.log('raf'));        // перед отрисовкой

Promise.resolve().then(() => console.log('microtask')); // микрозадача

console.log('script end');

// script start, script end, microtask, raf, setTimeout`;

  protected readonly animExample = `const box = document.querySelector('.box');
let start;

function step(timestamp) {
  if (start === undefined) start = timestamp;
  const elapsed = timestamp - start;

  // двигаем на 0.1px за миллисекунду, но не дальше 200px
  const shift = Math.min(0.1 * elapsed, 200);
  box.style.transform = 'translateX(' + shift + 'px)';

  // rAF одноразовый: для следующего кадра просим снова
  if (shift < 200) {
    requestAnimationFrame(step);
  }
}

requestAnimationFrame(step);`;
}
