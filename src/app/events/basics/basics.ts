import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-events-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventsBasics {
  protected readonly basicEventExample = `const button = document.querySelector('#save');

button.addEventListener('click', (event) => {
  console.log(event.type);          // 'click'  — что за событие
  console.log(event.target);        // <button id="save"> — где произошло
  console.log(event.currentTarget); // <button id="save"> — на ком обработчик
});`;

  protected readonly assignExample = `// 1. Атрибут в HTML — устаревший способ, мешает разметку и логику
// <button onclick="alert('hi')">Click</button>

// 2. Свойство DOM-элемента — можно назначить только ОДИН обработчик
button.onclick = () => console.log('clicked');

// 3. addEventListener — можно несколько обработчиков и есть опции
button.addEventListener('click', () => console.log('clicked too'));`;

  protected readonly removeExample = `function onClick() {
  console.log('done');
  // снять обработчик можно только по ТОЙ ЖЕ ссылке на функцию
  button.removeEventListener('click', onClick);
}

button.addEventListener('click', onClick);`;

  protected readonly preventDefaultExample = `const link = document.querySelector('a');

link.addEventListener('click', (event) => {
  event.preventDefault(); // отменяем действие по умолчанию — переход по ссылке
  console.log('handled without navigation');
});`;
}
