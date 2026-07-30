import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-generics-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptGenericsPitfalls {
  protected readonly parseReturnOnly = `// Дженерик T стоит ТОЛЬКО в типе результата, а на входе — обычная строка.
// T ни с чем не связан: вызывающий сам «вписывает» желаемый тип.
function parse<T>(s: string): T {
  return JSON.parse(s); // JSON.parse возвращает any → присваивается любому T
}

// Без явного аргумента выводить T не из чего → он становится unknown:
const u = parse('{"title":"x"}'); // тип u: unknown
u.title;
// ❌ 'u' is of type 'unknown'.
// unknown ничего не разрешает трогать, пока не сузишь проверкой

interface Task {
  title: string;
  done: boolean;
}

// С явным аргументом компилятор ВЕРИТ на слово и НИЧЕГО не проверяет:
const t = parse<Task>('{}'); // тип: Task
t.title.toUpperCase();
// ✅ компилируется — хотя в t сейчас пустой объект без поля title!
// Это ровно замаскированный "as": проверки формы в рантайме не было.`;

  protected readonly anyKillsGeneric = `// «any внутри — дырка в скафандре»: одно поле any, и вся защита впустую.
class BadBox {
  constructor(public value: any) {} // any стирает тип содержимого
}
const bad = new BadBox(5);
bad.value.toUpperCase();
// ✅ ошибки НЕТ — но в рантайме (5).toUpperCase() упадёт с исключением!
// any совместим с чем угодно → компилятор молчит, баг доживёт до продакшена

// Дженерик, наоборот, СОХРАНЯЕТ тип содержимого:
class Box<T> {
  constructor(public value: T) {}
}
const good = new Box<number>(5); // тип: Box<number>, значит value: number
good.value.toUpperCase();
// ❌ Property 'toUpperCase' does not exist on type 'number'.
// Компилятор помнит: внутри число — и ловит ошибку сразу, на компиляции`;

  protected readonly uselessGeneric = `// «Лишний дженерик — как объявленная и ни разу не использованная переменная».
// Здесь T встречается РОВНО ОДИН раз (только у параметра). Связывать нечего:
// тип результата от T не зависит, вход не соотносится ни с чем.
function printId<T>(id: T): void {
  console.log(id); // T больше нигде не используется — он бесполезен
}

// Правило: параметр типа нужен, только если он СВЯЗЫВАЕТ хотя бы два места
// (вход ↔ выход, или два входа между собой). Одиночный T заменяют
// конкретным типом — чаще всего unknown:
function printIdFixed(id: unknown): void {
  console.log(id);
}`;

  protected readonly collectEmptyNever = `function collect<T>(arr: T[]): T[] {
  return arr;
}

// Непустой массив — вывод работает как надо:
const nums = collect([1, 2, 3]); // тип: number[] ✅

// ПУСТОЙ массив выводить не из чего → T схлопывается в never:
const empty = collect([]); // тип: never[]  (массив «пустого множества»)
empty.push(1);
// ❌ Argument of type '1' is not assignable to parameter of type 'never'.
// В never[] нельзя положить ничего — там не допускается ни одно значение

interface Task {
  title: string;
  done: boolean;
}

// Лекарство — подсказать T явным аргументом:
const tasks = collect<Task>([]); // тип: Task[] ✅
tasks.push({ title: 'Купить хлеб', done: false }); // ✅`;

  protected readonly literalLostFromArray = `function first<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

// Сохраняем массив в переменную — и она РАСШИРЯЕТСЯ до string[]
// (это происходит на самой переменной, ещё ДО вызова дженерика):
const modes = ['idle', 'loading']; // тип: string[]  ← литералы потеряны здесь
const s1 = first(modes);           // тип: string | undefined

const bad: 'idle' = s1!;
// ❌ Type 'string' is not assignable to type '"idle"'.
// Дженерик ни при чём — литералы «расширились» при создании переменной

// Лекарство — as const: он фиксирует литеральные типы прямо в переменной
const modesConst = ['idle', 'loading'] as const; // readonly ['idle', 'loading']
const s2 = first(modesConst); // тип: 'idle' | 'loading' | undefined ✅

// ВАЖНО: у ОДИНОЧНОГО аргумента литерал НЕ теряется — дело именно в массиве:
function identity<T>(x: T): T {
  return x;
}
const kept = identity('idle'); // тип: 'idle' — литерал остаётся на месте`;

  protected readonly constraintIndexedAccess = `interface Task {
  title: string;
  done: boolean;
  priority: number;
}

// ✅ ПРАВИЛЬНО: K ограничен ключами T (K extends keyof T).
// Тогда результат — ТОЧНЫЙ тип поля (T[K]), а чужой ключ отсекается.
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const task: Task = { title: 'Позвонить', done: false, priority: 1 };
const a = getProp(task, 'title'); // тип: string
const b = getProp(task, 'done');  // тип: boolean
getProp(task, 'foo');
// ❌ Argument of type '"foo"' is not assignable to parameter of type 'keyof Task'.

// ❌ БЕЗ ограничения: K не связан с ключами T — индексный доступ запрещён.
function getPropBad<T, K>(obj: T, key: K) {
  return obj[key];
  // ❌ Type 'K' cannot be used to index type 'T'.
  // TS не может гарантировать, что такой ключ вообще есть у obj
}`;

  protected readonly defaultMasksError = `// ❌ ПЛОХО: дефолт T = any. Без аргумента T подставится как any → защита выключена.
function loadAny<T = any>(): T {
  return JSON.parse('{}');
}
const x = loadAny(); // тип: any
x.whatever.nested.stuff;
// ✅ ошибки НЕТ — any разрешает любые обращения (ровно это и опасно)

// ✅ ЛУЧШЕ: дефолт T = unknown. Без аргумента T станет unknown → защита есть.
function loadUnknown<T = unknown>(): T {
  return JSON.parse('{}');
}
const y = loadUnknown(); // тип: unknown
y.whatever;
// ❌ 'y' is of type 'unknown'.
// unknown заставляет сначала проверить/сузить результат — и это правильно`;

  protected readonly narrowingLostInGeneric = `// Внутри дженерик-функции T НЕПРОЗРАЧЕН. Сузить x проверкой можно,
// но ВЕРНУТЬ новое значение как T — нельзя.
function tryUpper<T>(x: T): T {
  if (typeof x === 'string') {
    // Здесь x сужен до string, метод вызвать можно...
    return x.toUpperCase();
    // ❌ Type 'string' is not assignable to type 'T'.
    //    'T' could be instantiated with an arbitrary type which could be
    //    unrelated to 'string'.
    // toUpperCase даёт string, но вызывающий мог просить T = 'idle',
    // а это НЕ любая строка. Компилятор прав, что не пускает.
  }
  return x; // ✅ вернуть тот же самый x как T — можно
}`;

  protected readonly distributiveTease = `class Box<T> {
  constructor(public value: T) {}
}

// Условный тип «раздаётся» по членам объединения — это дистрибутивность.
type Boxed<T> = T extends unknown ? Box<T> : never;

// Boxed<string | number> НЕ схлопывается в Box<string | number>.
// Он РАСПРЕДЕЛЯЕТСЯ по каждому члену объединения по отдельности:
type Result = Boxed<string | number>; // = Box<string> | Box<number>

// Это отдельная большая тема — условные типы и их дистрибутивность.
// Подробный разбор — на странице «Условные типы».`;
}
