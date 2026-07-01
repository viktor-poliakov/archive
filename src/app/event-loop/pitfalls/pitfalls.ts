import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-event-loop-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventLoopPitfalls {
  protected readonly blockingBad = `// плохо: тяжёлый цикл держит поток за одну задачу
function processAll(items) {
  for (const item of items) {
    heavyWork(item);
  }
}

// пока processAll работает, клики, ввод и анимации не реагируют`;

  protected readonly blockingFixed = `// хорошо: режем работу на порции, между ними поток свободен
function processInChunks(items) {
  const chunk = items.splice(0, 100);
  chunk.forEach(heavyWork);

  if (items.length > 0) {
    // отдаём управление: браузер успеет нарисовать кадр и принять клики
    setTimeout(() => processInChunks(items), 0);
  }
}`;

  protected readonly timeoutExample = `console.log('sync');

setTimeout(() => console.log('timeout'), 0); // это НЕ "прямо сейчас"

Promise.resolve().then(() => console.log('promise'));

// вывод: sync, promise, timeout
// колбэк setTimeout ждёт: текущий код + все микрозадачи + очередь перед ним`;

  protected readonly microtaskBad = `// плохо: очередь микрозадач никогда не пустеет,
// поэтому браузер не доходит до отрисовки — страница зависает
function loop() {
  Promise.resolve().then(loop); // каждая микрозадача рождает следующую
}
loop();`;

  protected readonly microtaskFixed = `// хорошо: setTimeout — макрозадача,
// между витками браузер успевает отрисовать кадр
function loop() {
  // ...работа...
  setTimeout(loop, 0);
}
loop();`;

  protected readonly animBad = `// плохо: шаг на setInterval не привязан к кадрам → рывки
setInterval(() => {
  box.style.left = box.offsetLeft + 1 + 'px';
}, 16);

// хорошо: анимировать через requestAnimationFrame (см. «Отрисовка и rAF»)`;
}
