import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-errors-try-catch',
  imports: [CodeBlock, RouterLink],
  templateUrl: './try-catch.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ErrorsTryCatch {
  protected readonly uncaughtExample = `function loadUser() {
  const user = null;
  console.log(user.name);  // TypeError: Cannot read properties of null
  console.log('не выполнится'); // сюда уже не дойдём
}

loadUser();
console.log('и сюда тоже — ошибка «уронила» выполнение');`;

  protected readonly tryCatchExample = `try {
  const user = null;
  console.log(user.name);   // здесь бросается TypeError
  console.log('пропущено'); // остаток try НЕ выполнится
} catch (err) {
  // управление прыгает сюда; err — объект ошибки
  console.log('Поймали:', err.message);
}

console.log('а программа продолжает работать'); // выполнится`;

  protected readonly finallyExample = `function loadData() {
  showSpinner();
  try {
    return fetchData(); // даже при return finally сработает ПЕРЕД выходом
  } catch (err) {
    console.log('ошибка:', err.message);
    return null;
  } finally {
    hideSpinner(); // выполнится ВСЕГДА — и при успехе, и при ошибке
  }
}`;
}
