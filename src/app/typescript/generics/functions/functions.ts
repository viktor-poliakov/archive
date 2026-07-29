import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-generics-functions',
  imports: [CodeBlock, RouterLink],
  templateUrl: './functions.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptGenericsFunctions {
  protected readonly identityReminder = `// Один параметр типа T — это «переменная для типа».
// T подставится в момент вызова и СВЯЖЕТ вход с выходом:
// какой тип пришёл — такой же и вернётся.
function identity<T>(x: T): T {
  return x;
}

const s: string = identity('привет'); // ✅ T = string, вернулась строка
const n: number = identity(42);        // ✅ T = number, вернулось число

// Тип можно указать и явно — в угловых скобках перед аргументами:
const explicit = identity<string>('привет'); // тип: string

// Но обычно этого не нужно: компилятор сам «считывает» тип аргумента.`;

  protected readonly pairExample = `// Параметров типа может быть НЕСКОЛЬКО. Здесь их два:
// K — для ключа, V — для значения. Они независимы и не обязаны совпадать.
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const p1 = pair('id', 42);       // тип: [string, number]
const p2 = pair('active', true); // тип: [string, boolean]
const p3 = pair(1, ['a', 'b']);  // тип: [number, string[]]

// K вывелся из первого аргумента, V — из второго, каждый сам по себе.
// Это готовая типобезопасная «пара ключ-значение».`;

  protected readonly inferByPosition = `// Компилятор смотрит на АРГУМЕНТЫ по позициям и подставляет типы —
// как умный кассир: считывает штрихкод того, что реально положили,
// и не спрашивает у вас «а какого это типа?».
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

pair('id', 42);
//   ^^^^  ^^   первый аргумент → K = string, второй → V = number
// Результат склеивается из выведенных типов: [string, number].

// Для функций-обработчиков тип «течёт» из массива прямо в колбэк:
interface Task {
  title: string;
  done: boolean;
}
declare function map<T, U>(arr: T[], fn: (x: T) => U): U[];

const tasks: Task[] = [{ title: 'Купить хлеб', done: false }];
const titles = map(tasks, (t) => t.title);
// T вывелся как Task (из массива) → значит t внутри колбэка — Task,
// у него есть .title (string) → U = string → результат string[].`;

  protected readonly mapExample = `interface Task {
  title: string;
  done: boolean;
  priority: number;
}

// map — «конвейер-переработчик»: принимает ящик элементов типа T
// и ПРАВИЛО переработки (x: T) => U, отдаёт ящик результатов типа U.
// Ящик яблок (T) по правилу «нарезать» превращается в ящик долек (U).
function map<T, U>(arr: T[], fn: (x: T) => U): U[] {
  const result: U[] = [];
  for (const item of arr) {
    result.push(fn(item));
  }
  return result;
}

const tasks: Task[] = [
  { title: 'Купить хлеб', done: false, priority: 1 },
  { title: 'Позвонить маме', done: true, priority: 2 },
];

const titles = map(tasks, (t) => t.title);        // тип: string[]
const flags = map(tasks, (t) => t.done);          // тип: boolean[]
const nums = map(tasks, (t) => t.priority * 10);  // тип: number[]

// Один и тот же map выдаёт РАЗНЫЙ тип результата — по правилу переработки.
// U не задаётся заранее: он вычисляется из того, что вернул колбэк.`;

  protected readonly filterExample = `// filter — «сито»: часть элементов оставляем, часть выбрасываем.
// Тип при этом НЕ меняется: на входе T[], на выходе тоже T[].
// Поэтому здесь хватает одного параметра типа — T.
function filter<T>(arr: T[], keep: (x: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of arr) {
    if (keep(item)) result.push(item);
  }
  return result;
}

interface Task {
  title: string;
  done: boolean;
}

const tasks: Task[] = [
  { title: 'A', done: false },
  { title: 'B', done: true },
];

const active = filter(tasks, (t) => !t.done);  // тип: Task[] — сорт не поменялся
const strs = filter(['a', 'bb', 'ccc'], (s) => s.length > 1); // тип: string[]

// Сравните с map: map МЕНЯЕТ тип (T → U), filter СОХРАНЯЕТ (T → T).`;

  protected readonly pluckExample = `// pluck — вытащить одно поле из каждого объекта в отдельный массив.
// Пока пишем «наивную» версию: ключ — просто string.
function pluck<T>(items: T[], key: string): unknown[] {
  return items.map((item) => (item as Record<string, unknown>)[key]);
}

interface Task {
  title: string;
  done: boolean;
}

const tasks: Task[] = [{ title: 'A', done: false }];

const titles = pluck(tasks, 'title'); // тип: unknown[] — точный тип поля потерян
const oops = pluck(tasks, 'titl');    // опечатку в ключе компилятор НЕ поймал

// Проблема: string как ключ слишком широк — TS не связал ключ с полем.
// Типобезопасная версия (ключ только из полей объекта, а результат —
// точный тип этого поля) делается через keyof и разобрана на странице
// «Ограничения (extends)».`;

  protected readonly genericAsVarType = `// Дженерик можно записать не только у объявления функции,
// но и как ТИП переменной — то есть как сигнатуру.
// Здесь <T> стоит ПЕРЕД списком аргументов, прямо внутри типа:
const identity: <T>(x: T) => T = (x) => x;

const s = identity('привет'); // тип: string
const n = identity(42);        // тип: number

// Функция осталась ОДНА, но по-прежнему работает для любого типа:
// T подставляется в каждом вызове отдельно.`;

  protected readonly mapperType = `// Дженерик-сигнатуре можно дать ИМЯ через type — получится
// переиспользуемый «шаблон функции». Назовём его «преобразователь T → U»:
type Mapper<T, U> = (value: T) => U;

// Теперь этим типом удобно размечать переменные-функции:
const toLength: Mapper<string, number> = (s) => s.length;
const toUpper: Mapper<string, string> = (s) => s.toUpperCase();

const len = toLength('hello'); // тип: number → 5

// И это ровно тип второго аргумента нашего map: (x: T) => U.
// Можно даже переписать сигнатуру map через Mapper:
declare function map<T, U>(arr: T[], fn: Mapper<T, U>): U[];`;

  protected readonly collectNever = `interface Task {
  title: string;
  done: boolean;
}

function collect<T>(arr: T[]): T[] {
  return [...arr];
}

// Если передать НЕПУСТОЙ массив — T выведется нормально:
const nums = collect([1, 2, 3]); // тип: number[]  (T = number)

// А вот ПУСТОЙ массив выводить не из чего — и T «схлопывается» в never:
const empty = collect([]); // тип: never[]  (T = never)

empty.push(1);
// ❌ Argument of type '1' is not assignable to parameter of type 'never'.
// never — «пустое множество значений»: в never[] нельзя положить НИЧЕГО,
// ведь компилятору неизвестно, какого типа тут должны быть элементы.

// Лечение — подсказать тип ЯВНО, в угловых скобках:
const tasks = collect<Task>([]); // тип: Task[] — теперь всё ок
tasks.push({ title: 'A', done: false }); // ✅`;

  protected readonly explicitWhenAmbiguous = `// Иногда из аргументов тип вывести НЕ ИЗ ЧЕГО — тогда указываем явно.

function wrap<T>(value: T): { value: T } {
  return { value };
}

const box = wrap({}); // тип: { value: {} } — вряд ли то, что нужно

interface Task {
  title: string;
  done: boolean;
}
// Явно говорим, какой тип поедет внутрь:
const taskBox = wrap<Task>({ title: 'A', done: false }); // тип: { value: Task }

// Второй случай — «свёртка», где тип аккумулятора виден из seed,
// но при желании его тоже можно закрепить явно:
function reduceTo<T>(items: number[], seed: T, step: (acc: T, x: number) => T): T {
  let acc = seed;
  for (const x of items) acc = step(acc, x);
  return acc;
}

const joined = reduceTo<string>([1, 2, 3], '', (acc, x) => acc + x);
// тип: string → '123'. Явный <string> убирает любую неоднозначность.`;

  protected readonly arrowVsFunction = `// ГДЕ ставить <T> — зависит от формы записи функции.

// 1) Обычное объявление function: параметр типа идёт СРАЗУ после имени.
function identity<T>(x: T): T {
  return x;
}

// 2) Стрелочная функция: <T> идёт ПЕРЕД списком аргументов.
const identityArrow = <T>(x: T): T => x;

// В обычных .ts-файлах оба варианта работают одинаково.
// Тонкость только в .tsx (React): там голое <T> компилятор
// принимает за JSX-тег. Лечится запятой-подсказкой:
const safeArrow = <T,>(x: T): T => x; // <T,> — «это параметр типа, не тег»
// либо просто пишем обычное function-объявление, где проблемы нет.`;

  protected readonly genericInsteadOverload = `// Если тип результата ПОВТОРЯЕТ тип аргумента (проход «насквозь»,
// без ветвления по типу) — дженерик короче и точнее перегрузок.

// С перегрузками пришлось бы дописывать строку под каждый новый тип:
function firstOverload(arr: string[]): string;
function firstOverload(arr: number[]): number;
function firstOverload(arr: unknown[]): unknown {
  return arr[0];
}

// Один дженерик покрывает все типы сразу:
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const a = first(['a', 'b']); // тип: string | undefined
const b = first([1, 2, 3]);  // тип: number | undefined

// Важно: дженерик — замена перегрузкам ТОЛЬКО когда нет разного
// поведения по типу. Если результат по-настоящему зависит от того,
// строка пришла или число, нужны именно перегрузки — см. отдельную страницу.`;
}
