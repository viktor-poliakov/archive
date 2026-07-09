import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-errors-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ErrorsPitfalls {
  protected readonly swallowExample = `// ПЛОХО: пустой catch «проглатывает» ошибку — баг спрятан
try {
  saveData();
} catch (err) {
  // тишина... данные не сохранились, а мы делаем вид, что всё ок
}

// ЛУЧШЕ: как минимум залогировать, а ещё лучше — обработать или пробросить
try {
  saveData();
} catch (err) {
  console.error('Save failed:', err);
  throw err; // пусть решает тот, кто выше
}`;

  protected readonly finallyReturnExample = `function tricky() {
  try {
    return 1; // хотели вернуть 1
  } finally {
    return 2; // но return в finally ПЕРЕКРЫВАЕТ его
  }
}

tricky(); // 2, а не 1 (!) — так же finally затирает и throw
// вывод: не делайте return / throw внутри finally`;

  protected readonly asyncNotCaughtExample = `// try/catch ловит только СИНХРОННЫЕ ошибки внутри try.
// Колбэк setTimeout выполнится ПОЗЖЕ, когда try уже завершился:
try {
  setTimeout(() => {
    throw new Error('Из таймера'); // НЕ попадёт в этот catch!
  }, 0);
} catch (err) {
  console.log('сюда не дойдём'); // не выполнится
}

// Для асинхронного кода — свои инструменты.
// С await снова работает обычный try/catch:
try {
  await fetchData();
} catch (err) {
  console.log('а вот ошибку из await поймаем');
}`;
}
