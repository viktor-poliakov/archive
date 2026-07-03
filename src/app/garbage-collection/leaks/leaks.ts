import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-garbage-collection-leaks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './leaks.html',
  styleUrls: ['../../content/doc.scss'],
})
export class GarbageCollectionLeaks {
  protected readonly timerExample = `const data = loadHugeData();

// таймер держит колбэк, колбэк — data: пока таймер жив, data не удалится
const id = setInterval(() => process(data), 1000);

// когда данные больше не нужны — обязательно остановить таймер:
clearInterval(id);`;

  protected readonly listenerExample = `function onScroll() {
  // ...
}

window.addEventListener('scroll', onScroll);
// обработчик держит функцию и её замыкание (а через него — и DOM-узлы).
// Уходя со страницы или размонтируя компонент, снимайте его:
window.removeEventListener('scroll', onScroll);`;

  protected readonly cacheExample = `const cache = new Map();

function remember(key, value) {
  cache.set(key, value); // кэш только растёт и ничего не отпускает
}

// без лимита или очистки такой кэш держит объекты вечно — классическая утечка`;

  protected readonly weakExample = `const cache = new WeakMap(); // ключи — объекты, ссылки на них СЛАБЫЕ

let user = { name: 'Anna' };
cache.set(user, 'some meta');

user = null;
// объект больше нигде не нужен → сборщик удалит его,
// и запись из WeakMap исчезнет сама. Обычный Map держал бы объект вечно.`;
}
