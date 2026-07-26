import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-functions-this',
  imports: [CodeBlock, RouterLink],
  templateUrl: './this.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptFunctionsThis {
  protected readonly problemExample = `// В обычной функции this НЕ зафиксирован заранее —
// его значение определяется в момент ВЫЗОВА, а не при описании.
const button = {
  label: 'Сохранить',
  click() {
    console.log(this.label); // чему равен this — зависит от того, как вызвали
  },
};

button.click();          // 'Сохранить' — вызвали как метод, this === button

const handler = button.click; // оторвали метод от объекта
handler();               // ❌ ошибка во время выполнения:
                         //    Cannot read properties of undefined (reading 'label')
                         //    при обычном вызове this уже не button, а undefined`;

  protected readonly thisParamExample = `// Первым «параметром» с именем this можно ОБЪЯВИТЬ,
// каким должен быть this внутри функции. Это не настоящий аргумент.
function render(this: HTMLButtonElement, event: Event): void {
  // теперь TypeScript знает: this — это <button>
  this.disabled = true;                  // ✅ поле есть у HTMLButtonElement
  console.log(this.textContent, event.type);
}

// this в вызове НЕ передают — первым идёт настоящий аргумент event.
// Контекст this подставит тот, кто вызывает (здесь — сам DOM):
const btn = document.querySelector('button')!;
btn.addEventListener('click', render); // event придёт от события, this === btn`;

  protected readonly erasedExample = `// this-параметр существует только для компилятора.
// В скомпилированном JavaScript его нет вовсе — он стирается:

//  БЫЛО (TypeScript)                    СТАЛО (JavaScript)
//  function render(                     function render(event) {
//    this: HTMLButtonElement,             this.disabled = true;
//    event: Event                       }
//  ) { ... }

// Поэтому this всегда пишут ПЕРВЫМ и только один раз —
// иначе TypeScript спутает его с обычным параметром.`;

  protected readonly thisParamMethodExample = `// this-параметр удобен и для «одиночной» функции,
// которую потом присвоят объекту нужной формы.
interface Counter {
  count: number;
  increment(): void;
}

function increment(this: Counter): void {
  this.count++;          // ✅ TypeScript проверяет: у this есть поле count
}

const counter: Counter = { count: 0, increment };
counter.increment();     // count === 1 — вызвано как метод, this === counter`;

  protected readonly losingContextExample = `function increment(this: Counter): void {
  this.count++;
}
const counter: Counter = { count: 0, increment };

counter.increment();     // ✅ вызов как метод — this === counter

// Отрываем метод от объекта — и this «повисает»:
const detached = counter.increment;
detached();
// ❌ The 'this' context of type 'void' is not assignable
//    to method's 'this' of type 'Counter'.
//    TypeScript ловит потерю контекста ещё до запуска.`;

  protected readonly arrowExample = `// Стрелочная функция НЕ имеет собственного this.
// Она берёт его из окружения — лексически, по месту описания.
class Timer {
  seconds = 0;

  start(): void {
    // обычная функция-колбэк потеряла бы this,
    // а стрелка захватывает this метода start → это экземпляр Timer
    setInterval(() => {
      this.seconds++;    // ✅ this === тот же объект Timer
    }, 1000);
  }
}

new Timer().start();     // счётчик исправно растёт: this не теряется`;

  protected readonly arrowNoThisParamExample = `// У стрелки нет своего this, поэтому и объявлять его нечем:
const f = (this: Counter, x: number) => x;
// ❌ An arrow function cannot have a 'this' parameter.

// Раз стрелка и так берёт this из окружения,
// this-параметр ей просто не нужен — TypeScript выведет тип сам.`;

  protected readonly noImplicitThisExample = `// В строгом режиме включён флаг noImplicitThis.
// Если TypeScript не может вывести тип this — это ошибка,
// а не молчаливый any.
function badRender(event: Event) {
  console.log(this.textContent);
  // ❌ 'this' implicitly has type 'any' because it does not
  //    have a type annotation.
}

// Починка 1 — объявить this-параметр:
function goodRender(this: HTMLElement, event: Event) {
  console.log(this.textContent); // ✅ this теперь типизирован
}

// Починка 2 — стрелка, берущая this из окружения:
// у неё тип this известен, и this-параметр не нужен.`;

  protected readonly helperTypesExample = `function toHex(this: number): string {
  return this.toString(16);
}

// ThisParameterType<T> — достаёт тип this-параметра функции:
type Ctx = ThisParameterType<typeof toHex>; // number

// OmitThisParameter<T> — тип той же функции, но БЕЗ this-параметра
// (как будто this уже привязан, например через .bind):
const bound: OmitThisParameter<typeof toHex> = toHex.bind(255);
bound(); // 'ff' — контекст зафиксирован, вызывать можно без this`;
}
