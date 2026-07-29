import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-generics-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptGenericsBasics {
  protected readonly painNumberBox = `// Коробка (контейнер), которая умеет хранить ТОЛЬКО число.
// Тип number «зашит» в код намертво — как этикетка «ЧИСЛА»,
// напечатанная на коробке ещё на заводе.
interface NumberBox {
  value: number;
}

function makeNumberBox(value: number): NumberBox {
  return { value };
}

const scoreBox = makeNumberBox(42);
scoreBox.value.toFixed(1); // ✅ value — число, метод toFixed доступен`;

  protected readonly painStringBox = `// Понадобилась ТАКАЯ ЖЕ коробка, но для строки.
// В NumberBox строку не положить — тип запрещает:
// makeNumberBox('привет')
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'

// Приходится СКОПИРОВАТЬ весь код и заменить number на string:
interface StringBox {
  value: string;
}

function makeStringBox(value: string): StringBox {
  return { value };
}

// А завтра нужна коробка для Task, послезавтра — для boolean...
// Один и тот же код, отличается лишь одно слово — тип. Это копипаста.`;

  protected readonly painAnyBox = `// «Хитрый» способ обойтись без копипасты — сделать ОДНУ коробку на всё,
// объявив тип содержимого как any (см. страницу про any и unknown).
interface AnyBox {
  value: any;
}

function makeAnyBox(value: any): AnyBox {
  return { value };
}

const box = makeAnyBox(42); // положили число 42

// Но any ВЫКЛЮЧАЕТ проверки: компилятор больше ничего не знает про value.
box.value.toUpperCase();
// ✅ ошибки компиляции НЕТ — хотя это опечатка: у числа нет toUpperCase!
// Программа спокойно соберётся и упадёт уже в браузере, в рантайме.
// any вернул нас в мир без типов — плохой обмен.`;

  protected readonly identityDef = `// Дженерик решает обе беды сразу: без копипасты И без потери проверок.
// <T> в угловых скобках — это ПАРАМЕТР ТИПА (переменная, но для типа).
// Он как пропуск «______» в бланке, который заполнят при подписании.
function identity<T>(value: T): T {
  return value;
}

// Читается так: «функция берёт значение какого-то типа T
// и возвращает значение ТОГО ЖЕ типа T».
// Вход и выход связаны одной буквой T — в этом вся суть дженерика.`;

  protected readonly identityInference = `// Обычно T НЕ пишут руками — компилятор сам ВЫВОДИТ его из аргумента.
const name: string = 'Анна';
const age: number = 30;

const n = identity(name); // T подставился как string → тип n: string  ✅
const a = identity(age);  // T подставился как number → тип a: number  ✅

n.toUpperCase(); // ✅ n точно строка — строковые методы доступны
a.toFixed(1);    // ✅ a точно число  — числовые методы доступны`;

  protected readonly identityExplicit = `// Иногда T задают ЯВНО — в угловых скобках прямо при вызове.
// Это как самому вписать слово в пропуск бланка, не доверяя выводу:
const s = identity<string>('привет'); // T = string → тип s: string
const x = identity<number>(42);        // T = number → тип x: number

// Явное указание нужно нечасто — когда вывод невозможен или даёт не то.
// В большинстве случаев <...> опускают и полагаются на вывод.`;

  protected readonly firstElement = `// Классический дженерик — «взять первый элемент списка».
// Список может быть из чего угодно, поэтому тип элемента — параметр T.
// Список пуст? Тогда элемента нет — честно возвращаем T | undefined.
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const nums = [10, 20, 30];
const firstNum = first(nums); // T = number → тип: number | undefined

const words = ['a', 'b', 'c'];
const firstWord = first(words); // T = string → тип: string | undefined

// Тип элемента «протаскивается» из массива прямо в результат —
// без any и без отдельной копии функции под каждый вид списка.`;

  protected readonly genericBox = `// Тот же приём применим к коробке из начала страницы.
// ОДИН тип Box<T> заменяет NumberBox, StringBox и все будущие копии.
// T — это «этикетка-переменная»: её заполняет то, что кладём в коробку.
interface Box<T> {
  value: T;
}

function makeBox<T>(value: T): Box<T> {
  return { value };
}

const numberBox = makeBox(42);       // Box<number> — этикетку заполнило число
const stringBox = makeBox('привет'); // Box<string> — этикетку заполнила строка

numberBox.value.toFixed(1);    // ✅ value — число
stringBox.value.toUpperCase(); // ✅ value — строка

numberBox.value.toUpperCase();
// ❌ Property 'toUpperCase' does not exist on type 'number'.
// Проверки на месте: в числовой коробке строковых методов нет.`;

  protected readonly anyVsGeneric = `// Прямое сравнение: any против дженерика. Кладём число, вынимаем — и...
function wrapAny(x: any): any {
  return x;
}
function wrap<T>(x: T): T {
  return x;
}

const value: number = 5;

wrapAny(value).toUpperCase();
// ✅ ошибки НЕТ — any «согласен» на что угодно. Но это ЛОЖНОЕ спокойствие:
//    в рантайме упадёт, ведь у числа нет метода toUpperCase.

wrap(value).toUpperCase();
// ❌ Property 'toUpperCase' does not exist on type 'number'.
//    Дженерик ЗАПОМНИЛ: положили число — значит и на выходе число.
//    Опечатку поймали на этапе компиляции, до запуска. В этом вся разница.`;

  protected readonly naming = `// Имя параметра типа — любое. По традиции берут одиночные заглавные буквы:
// T — Type (тип), U — второй тип, K — Key (ключ), V — Value (значение).

// Пара «ключ — значение»: два независимых параметра типа, K и V
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const entry = pair('age', 30); // K = string, V = number → тип: [string, number]

// Но имена можно делать ОСМЫСЛЕННЫМИ — так код читается лучше.
// Частая конвенция — префикс T: TItem, TValue, TTask.
function firstOrNull<TItem>(list: TItem[]): TItem | null {
  return list.length > 0 ? list[0] : null;
}

const found = firstOrNull([1, 2, 3]); // TItem = number → тип: number | null`;
}
