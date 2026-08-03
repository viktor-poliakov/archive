import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-assertions-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAssertionsPitfalls {
  protected readonly castDoesNotConvert = `// Заблуждение №1, с которого падают почти все новички:
// «as превращает строку в число». НЕТ. as — это ПОДСКАЗКА компилятору,
// а не преобразование данных. Он ничего не вычисляет и не меняет.

const raw = '42'; // это строка, набор символов

const wrong = raw as number;
// ❌ Conversion of type 'string' to type 'number' may be a mistake
//    because neither type sufficiently overlaps with the other. (TS2352)
// TypeScript даже не даёт так написать: 'string' и 'number' — чужие типы.

// Настоящее преобразование — это ВЫЗОВ функции, работающей в рантайме:
const right = Number(raw); // 42 — реальное число, тип number  ✅
right.toFixed(1);          // ✅ '42.0'

// Запомните: as и ! только УСПОКАИВАЮТ компилятор.
// Данные меняют функции: Number(), String(), parseInt(), JSON.parse()...`;

  protected readonly castCanLie = `interface User {
  id: number;
  name: string;
}

// Обещаем компилятору, что пустой объект — это User. Он ВЕРИТ на слово,
// потому что as отключает проверку: «раз ты сказал — значит так и есть».
const u = {} as User;
// ✅ Ошибки компиляции НЕТ.

console.log(u.name.toUpperCase());
// ❌ В РАНТАЙМЕ: Cannot read properties of undefined (reading 'toUpperCase')
// Поля name в объекте нет. as НИЧЕГО не добавил в объект —
// он лишь соврал про тип, а данные остались пустыми. Падение придёт позже,
// и найти его будет тяжело: место ошибки далеко от места лжи.`;

  protected readonly doubleAsUnknown = `const el = document.querySelector('.save-btn');
// el: Element | null

// Родственные типы приводятся напрямую (Element — родня HTMLButtonElement):
const btn = el as HTMLButtonElement; // допустимо, типы пересекаются

// А несовместимые — НЕТ, компилятор ставит стену:
const n = el as number;
// ❌ Conversion of type 'Element | null' to type 'number' may be a mistake (TS2352)

// «Отмычка»: двойное приведение через unknown ломает и эту стену.
// unknown совместим с чем угодно, поэтому цепочка проходит:
const forced = el as unknown as number;
// ✅ ошибки НЕТ — так можно привести ЧТО УГОДНО к ЧЕМУ УГОДНО.
// Но forced в рантайме вовсе не число, а элемент или null. Защита выключена
// ПОЛНОСТЬЮ. Применять — крайне редко и всегда с комментарием, ПОЧЕМУ это безопасно.`;

  protected readonly nonNullHides = `const input = document.querySelector('input');
// input: HTMLInputElement | null — элемента может и не быть на странице.

// Знак ! говорит «зуб даю, тут не null». Но НИЧЕГО не проверяет:
const value = input!.value;
// ✅ компилируется. Но если селектор ничего не нашёл и input === null:
// ❌ В РАНТАЙМЕ: Cannot read properties of null (reading 'value')

// Как правильно №1 — РЕАЛЬНО проверить условием if (это сужение типа):
if (input) {
  const safe = input.value; // ✅ внутри if input сужен до HTMLInputElement
}

// Как правильно №2 — optional chaining ?. вернёт undefined вместо падения:
const maybe = input?.value; // тип: string | undefined  ✅
// ! прячет null и оставляет баг на потом; if и ?. учитывают null честно.`;

  protected readonly guardThatLies = `interface Cat { meow(): void }
interface Dog { bark(): void }

// ПЛОХОЙ guard: в предикате обещает «value is Cat»,
// а в теле проверяет НЕ ТО — перепутал логику.
function isCatBad(value: Cat | Dog): value is Cat {
  return 'bark' in value; // ❌ это же признак Dog, а не Cat!
}

const pet: Cat | Dog = { bark() {} }; // на деле это Dog
if (isCatBad(pet)) {
  pet.meow();
  // ✅ компилятор ПОВЕРИЛ предикату и разрешил вызвать meow()
  // ❌ В РАНТАЙМЕ: pet.meow is not a function — у Dog нет meow
}

// ХОРОШИЙ guard: тело РЕАЛЬНО подтверждает тип из предиката.
function isCat(value: Cat | Dog): value is Cat {
  return 'meow' in value; // ✅ проверяем ровно то, что обещаем
}
// Компилятор доверяет предикату is на слово — за правдивость тела ОТВЕЧАЕТЕ вы.`;

  protected readonly forgotIsAsserts = `// Хотели guard, но ЗАБЫЛИ предикат «is» и вернули просто boolean.
function isString(value: unknown): boolean {
  return typeof value === 'string';
}

function shout(value: unknown) {
  if (isString(value)) {
    value.toUpperCase();
    // ❌ 'value' is of type 'unknown'.
    // isString вернул boolean, а НЕ «value is string» — значит компилятору
    // нечем сузить тип. Внутри if value так и остался unknown. Guard бесполезен.
  }
}

// Как правильно — вернуть type predicate «value is string»:
function isStringOk(value: unknown): value is string {
  return typeof value === 'string';
}
// То же и для assertion-функций: без слова asserts сужения не будет.`;

  protected readonly asConstReadonly = `const config = { retries: 3, url: '/api' } as const;
// Тип: { readonly retries: 3; readonly url: '/api' }
// as const сделал ВСЕ поля readonly и сузил значения до литералов.

config.retries = 5;
// ❌ Cannot assign to 'retries' because it is a read-only property.

const nums = [1, 2, 3] as const;
// Тип: readonly [1, 2, 3] — это readonly-кортеж (tuple).
nums.push(4);
// ❌ Property 'push' does not exist on type 'readonly [1, 2, 3]'.
// Методы, которые меняют массив (push, pop, sort), у readonly просто отсутствуют.`;

  protected readonly asConstNotCopy = `// Частая путаница: «as const замораживает объект в рантайме». НЕТ.
// as const — это ТОЛЬКО метка типа. Копию он не делает и Object.freeze не зовёт.
const point = { x: 1, y: 2 } as const;

// Докажем: обойдём readonly ещё одним приведением и изменим тот же объект.
(point as { x: number }).x = 99; // компилятор молчит — привели к mutable-типу
console.log(point.x);            // 99 — значение РЕАЛЬНО изменилось в рантайме!

// Вывод: readonly от as const живёт только на этапе компиляции.
// Нужна настоящая неизменяемость в рантайме — это Object.freeze(point).`;

  protected readonly angleVsAs = `const someValue: unknown = 'привет';

// Две ЗАПИСИ одного и того же приведения — результат одинаков:
const a = <string>someValue;   // «угловая» форма <Type>value
const b = someValue as string; // форма value as Type

// НО: в .tsx-файлах (React) угловая форма ЗАПРЕЩЕНА — компилятор примет
// <string> за открывающий JSX-тег и запутается:
//   const a = <string>someValue;  // ❌ в .tsx ломается разбор JSX

// Поэтому единый безопасный стиль на все случаи — форма as.
// Она работает и в .ts, и в .tsx. Угловую форму сегодня почти не используют.`;

  protected readonly promiseVsCheck = `// Пришёл ответ от сервера. Что мы про него ЗНАЕМ на самом деле? Ничего.

interface User { name: string }

// ХОРОШО: настоящий guard — РЕАЛЬНО проверяет форму данных.
function isUser(v: unknown): v is User {
  return (
    typeof v === 'object' && v !== null &&
    'name' in v && typeof (v as { name: unknown }).name === 'string'
  );
}

async function loadUser(res: Response) {
  const data: unknown = await res.json();

  // ПЛОХО: «обещаем» тип приведением. Проверки ноль, надежда на удачу.
  const bad = data as User;
  bad.name.toUpperCase();
  // ✅ компилятор молчит; ❌ если сервер прислал не то — падение в рантайме.

  // ХОРОШО: пропускаем данные через проверку перед использованием.
  if (isUser(data)) {
    data.name.toUpperCase(); // ✅ здесь тип действительно подтверждён
  }
}
// Правило: as / ! / двойное as — «беру ответственность БЕЗ проверки».
// guard / assertion-функция / сужение — «проверяю ПО-НАСТОЯЩЕМУ».
// Внешние данные (JSON, ответ API, ввод пользователя) — всегда проверяйте.`;
}
