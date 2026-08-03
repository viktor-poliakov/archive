import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-assertions-non-null',
  imports: [CodeBlock, RouterLink],
  templateUrl: './non-null.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAssertionsNonNull {
  protected readonly problemNull = `// В строгом режиме включён strictNullChecks — и это очень хорошо:
// TypeScript честно предупреждает, что значения может не быть.
// getElementById не гарантирует, что элемент с таким id есть на странице.
const el = document.getElementById('app');
// Тип el:  HTMLElement | null
//                        ^^^^ — null ВКЛЮЧЁН в тип, элемента может не быть

el.click();
// ❌ 'el' is possibly 'null'.
// Компилятор не даёт вызвать .click(), пока мы не разберёмся с null.
// Он защищает нас от падения "Cannot read properties of null".`;

  protected readonly fixNonNull = `const el = document.getElementById('app'); // HTMLElement | null

el!.click();
// Восклицательный знак ПОСЛЕ выражения (el!) говорит компилятору:
// «Я гарантирую: здесь точно не null и не undefined — вычеркни их из типа».
// Тип выражения el!  становится:  HTMLElement   (уже без | null)
// Ошибка компиляции исчезла.
//
// Но обратите внимание: НИКТО не проверил el на самом деле.
// Мы просто дали компилятору честное слово. Вся ответственность — на нас.`;

  protected readonly forms = `// Оператор ! ставится ПОСЛЕ выражения (постфикс) и убирает из его типа
// null и undefined. Вот три самые частые формы записи.

// 1) Простое значение
function greet(name: string | undefined) {
  const upper = name!.toUpperCase(); // name!  →  string  (без undefined)
  return upper;
}

// 2) Перед доступом к свойству/методу объекта:  obj!.prop
const btn = document.querySelector('.btn'); // Element | null
btn!.classList.add('active');               // btn!  →  Element

// 3) На результате поиска, который может ничего не найти:  find(...)!
const nums = [10, 20, 30];
const found = nums.find((n) => n > 15); // number | undefined — вдруг не нашлось
console.log(found!.toFixed(1));         // found!  →  number  («обещаю, элемент есть»)`;

  protected readonly runtimeCrash = `// САМОЕ ГЛАВНОЕ, что нужно понять про ! :
// он НИЧЕГО не проверяет и НИЧЕГО не меняет в рантайме.
// Это подсказка компилятору на этапе типов, а не реальная проверка.

const el = document.getElementById('missing'); // такого id на странице НЕТ
// Значит в рантайме el === null.

el!.click();
// Компилятор молчит — мы же «пообещали», что не null.
// Но обещание было ложным, и в браузере программа падает:
// ❌ Uncaught TypeError: Cannot read properties of null (reading 'click')
//
// ! не спас — он и не собирался проверять. Проверить должны были МЫ сами.`;

  protected readonly definiteAssignment = `// Второе применение ! — "definite assignment assertion"
// (утверждение определённого присваивания). Ставится на ОБЪЯВЛЕНИИ поля
// или переменной, а не на значении. Читается: «присвою позже, честно».

class UserProfile {
  // Без ! в strict-режиме компилятор ругается:
  // ❌ Property 'name' has no initializer and is not definitely assigned
  //    in the constructor.
  // ! обещает: «значение появится ПОЗЖЕ, до первого использования».
  private name!: string;

  // В Angular поля часто заполняются не в конструкторе, а в хуках жизненного
  // цикла (ngOnInit) или приходят через @Input уже после создания объекта.
  ngOnInit(): void {
    this.name = 'Аня'; // присвоили здесь — как и обещали через !
  }

  hello(): string {
    return \`Привет, \${this.name}\`; // к моменту вызова name уже задан
  }
}

// Тот же приём для локальной переменной:
let count!: number;     // «число появится ниже, доверься мне»
count = 5;
console.log(count + 1); // компилятор верит, что count уже определён`;

  protected readonly justified = `// Когда ! действительно оправдан: если ПРЯМО ВЫШЕ есть проверка или
// инвариант, гарантирующий, что null уже невозможен, а компилятор
// по каким-то причинам этого «не увидел».

function doubleTotal(stats: Map<string, number>) {
  if (!stats.has('total')) return 0; // инвариант: дальше ключ точно есть

  const total = stats.get('total')!; // get() всё равно даёт number | undefined,
                                      // но мы только что проверили has() → ! к месту
  return total * 2;
}

// Ещё пример: значение проверено на предыдущей строке.
const input = document.querySelector('input');
if (input) {
  // внутри if компилятор и так знает, что input не null — ! здесь НЕ нужен
}`;

  protected readonly altNarrowing = `// Альтернатива №1 (самая надёжная) — СУЖЕНИЕ типа через if.
// Это НАСТОЯЩАЯ проверка в рантайме: внутрь заходим, только если не null.
const el = document.getElementById('app'); // HTMLElement | null

if (el) {
  // Внутри этой ветки компилятор САМ убрал null из типа:
  // здесь el имеет тип HTMLElement.
  el.click(); // ✅ безопасно и без всякого !
}
// Если el === null — тело просто не выполнится. Никакого падения.`;

  protected readonly altOptionalChaining = `// Альтернатива №2 — опциональная цепочка ?. ("optional chaining").
// Если слева null или undefined, обращение НЕ происходит,
// а всё выражение спокойно даёт undefined (а не падает).
const el = document.getElementById('app'); // HTMLElement | null

el?.click();
// Есть элемент  → клик произойдёт.
// Нет элемента  → ничего не случится, ошибки НЕТ (в отличие от el!.click()).

// Удобно связывать в цепочку:
const len = el?.textContent?.length; // number | undefined`;

  protected readonly altNullish = `// Альтернатива №3 — оператор ?? ("nullish coalescing") подставляет
// ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ, когда слева null или undefined.
function displayName(user: { name?: string }): string {
  return user.name ?? 'Гость';
  // user.name задан         → вернём его
  // user.name null/undefined → вернём 'Гость'
}

displayName({ name: 'Аня' }); // 'Аня'
displayName({});              // 'Гость'`;

  protected readonly altThrow = `// Альтернатива №4 — если null здесь ДЕЙСТВИТЕЛЬНО «не должно быть»,
// не молчите с !, а явно бросьте понятную ошибку.
const el = document.getElementById('app');
if (!el) {
  throw new Error('Элемент #app не найден в разметке');
}

// После throw компилятор сам сузил тип: ниже el имеет тип HTMLElement.
el.click(); // ✅ и мы получим внятное сообщение вместо загадочного
            //    "Cannot read properties of null", если что-то пойдёт не так.`;
}
