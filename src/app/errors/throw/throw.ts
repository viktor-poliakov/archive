import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-errors-throw',
  imports: [CodeBlock, RouterLink],
  templateUrl: './throw.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ErrorsThrow {
  protected readonly throwBasicExample = `function setAge(age) {
  if (typeof age !== 'number' || age < 0) {
    // «дальше так нельзя» — прерываем и сигналим об ошибке
    throw new Error('Age must be a non-negative number');
  }
  return age;
}

try {
  setAge(-5);
} catch (err) {
  console.log(err.message); // 'Age must be a non-negative number'
}`;

  protected readonly throwWhatExample = `// Технически бросить можно ЛЮБОЕ значение:
throw 'что-то сломалось'; // строка — так делать НЕ надо
throw 42;                 // число — тоже плохо

// Правильно — бросать Error (или его потомка):
throw new Error('что-то сломалось');
// у Error есть name, message и stack — их ждёт код-обработчик`;

  protected readonly throwStopsExample = `function check(value) {
  if (!value) {
    throw new Error('Empty value');
  }
  console.log('сюда не дойдём, если value пустой');
}

// throw прерывает функцию — как return, но «пробивает» её наружу:
// летит вверх по цепочке вызовов, пока не встретит catch`;
}
