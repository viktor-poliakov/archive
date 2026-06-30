import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-closures-lexical-environment',
  imports: [CodeBlock, RouterLink],
  templateUrl: './lexical-environment.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClosuresLexicalEnvironment {
  protected readonly sumExample = `const tax = 0.2; // объявлена здесь, во внешнем коде

function addTax(price) {
  // tax внутри addTax нигде не объявлена,
  // но функция спокойно ею пользуется
  return price + price * tax;
}

addTax(100); // 120`;

  protected readonly envRecordExample = `function greet() {
  // как только greet вызвали, у неё появляется свой
  // Environment Record — внутренний объект с её переменными:
  //   { name: 'Anna', text: 'Hello, Anna' }
  const name = 'Anna';
  const text = 'Hello, ' + name;

  // строка ниже = «прочитать свойство text у этого объекта»
  return text;
}`;

  protected readonly lookupFoundExample = `const app = 'MyApp'; // объявлена наверху, в глобальном окружении

function outer() {
  // здесь app не объявлена

  function inner() {
    // и здесь app не объявлена,
    // но движок всё равно её найдёт:
    //   ищем в окружении inner   — нет
    //   поднимаемся в outer       — нет
    //   поднимаемся в глобальное  — есть -> 'MyApp'
    return app;
  }

  return inner();
}

outer(); // 'MyApp'`;

  protected readonly lookupNotFoundExample = `// почти тот же код — но app нигде не объявлена

function outer() {
  function inner() {
    // движок ищет app и нигде не находит:
    //   в окружении inner   — нет
    //   в окружении outer   — нет
    //   в глобальном        — тоже нет
    //   подниматься некуда -> ошибка
    return app;
  }

  return inner();
}

outer(); // ReferenceError: app is not defined`;

  protected readonly bornExample = `function makeMultiplier(factor) {
  // возвращаемая функция рождается здесь и запоминает
  // окружение makeMultiplier (а в нём — factor)
  return function (n) {
    return n * factor;
  };
}

const triple = makeMultiplier(3);

// triple вызывается тут, где никакого factor нет,
// но помнит factor = 3 из места своего рождения
triple(10); // 30`;

  protected readonly captureExample = `function createBox() {
  let value = 'empty';

  // оба метода замыкаются над одной и той же переменной value
  return {
    get() {
      return value;
    },
    set(next) {
      value = next;
    },
  };
}

const box = createBox();
box.get();      // 'empty'
box.set('full');
box.get();      // 'full' — замыкание видит новое значение, а не старый снимок`;
}
