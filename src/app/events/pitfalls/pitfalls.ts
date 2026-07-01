import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-events-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventsPitfalls {
  protected readonly noBubbleExample = `// focus НЕ всплывает — делегирование на форме не поймает фокус в поле
form.addEventListener('focus', onFocus); // не сработает при фокусе в input

// решение 1: focusin — то же событие, но всплывает
form.addEventListener('focusin', onFocus);

// решение 2: слушать на фазе погружения
form.addEventListener('focus', onFocus, true);`;

  protected readonly optionsExample = `// once — обработчик сработает один раз и сам снимется
button.addEventListener('click', onClick, { once: true });

// passive — обещаем не звать preventDefault; браузер быстрее прокручивает
window.addEventListener('scroll', onScroll, { passive: true });

// capture — ловить на фазе погружения
overlay.addEventListener('click', onClick, { capture: true });`;

  protected readonly arrowThisExample = `button.addEventListener('click', function () {
  this; // <button> — в обычной функции this === currentTarget
});

button.addEventListener('click', () => {
  this; // НЕ элемент! у стрелочной функции своего this нет
});`;

  protected readonly eventPropsExample =`// у каждого типа события свои полезные свойства
element.addEventListener('mousedown', (e) => {
  console.log(e.clientX, e.clientY); // координаты курсора
  console.log(e.button);             // какая кнопка мыши нажата
});

element.addEventListener('keydown', (e) => {
  console.log(e.key);  // 'Enter', 'a', 'ArrowUp' — символ/имя клавиши
  console.log(e.code); // 'KeyA' — физическая клавиша
});`;
}
