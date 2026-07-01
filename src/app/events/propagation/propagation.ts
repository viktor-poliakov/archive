import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-events-propagation',
  imports: [CodeBlock, RouterLink],
  templateUrl: './propagation.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventsPropagation {
  protected readonly bubblingExample = `// <div id="outer"><div id="middle"><button id="inner">Click</button></div></div>

outer.addEventListener('click', () => console.log('outer'));
middle.addEventListener('click', () => console.log('middle'));
inner.addEventListener('click', () => console.log('inner'));

// клик по кнопке inner напечатает:
// inner, middle, outer   — событие всплывает снизу вверх`;

  protected readonly capturingExample = `// третий аргумент true (или { capture: true }) — ловим на фазе погружения
outer.addEventListener('click', () => console.log('outer'), true);
middle.addEventListener('click', () => console.log('middle'), true);
inner.addEventListener('click', () => console.log('inner'), true);

// клик по inner теперь напечатает:
// outer, middle, inner   — сверху вниз, к цели`;

  protected readonly stopExample = `middle.addEventListener('click', (event) => {
  event.stopPropagation(); // дальше вверх событие не пойдёт
  console.log('middle — стоп');
});

// клик по inner: inner, middle
// до outer событие уже не доходит`;

  protected readonly stopImmediateExample = `button.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  console.log('first');
});

button.addEventListener('click', () => {
  console.log('second'); // НЕ выполнится: остановлены и соседние обработчики
});

// вывод: first`;
}
