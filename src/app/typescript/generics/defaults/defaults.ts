import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-generics-defaults',
  imports: [CodeBlock, RouterLink],
  templateUrl: './defaults.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptGenericsDefaults {
  protected readonly containerDefault = `// Значение по умолчанию у параметра ТИПА.
// Синтаксис: после имени параметра пишем  = ТипПоУмолчанию
interface Container<T = string> {
  value: T;
}

// Не передали аргумент типа → T подставляется как string («тип из коробки»)
const box: Container = { value: 'привет' }; // ✅ value имеет тип string
box.value.toUpperCase();                     // ✅ строковый метод доступен

const wrong: Container = { value: 5 };
// ❌ Type 'number' is not assignable to type 'string'.
// Без аргумента Container === { value: string }, а 5 — это не строка

// Захотели другой тип — просто передаём его явно (как перенастройка прибора)
const nums: Container<number> = { value: 42 }; // ✅ value имеет тип number`;

  protected readonly defaultArgAnalogy = `// Аналогия: значение по умолчанию у ОБЫЧНОГО аргумента функции
function greet(name = 'друг') {
  return \`Привет, \${name}!\`;
}
greet();       // 'Привет, друг!'  — аргумент не передали → взяли дефолт 'друг'
greet('Анна'); // 'Привет, Анна!'  — передали свой → дефолт не нужен

// Ровно та же идея, но для ТИПОВ: дефолт у параметра типа  T = string
interface Container<T = string> {
  value: T;
}
type A = Container;         // как greet()      → T взят по умолчанию: { value: string }
type B = Container<number>; // как greet('Анна') → T переопределён:    { value: number }`;

  protected readonly defaultWithConstraint = `// Дефолт МОЖНО совмещать с ограничением:  <T extends Форма = Значение>
// Тогда T и «из коробки», и при переопределении всегда имеет нужную форму.
interface Entity {
  id: number;
}

// extends Entity — ограничение (T обязан иметь поле id: number)
// = Entity       — дефолт (если тип не назвали, берём ровно { id: number })
class Repository<T extends Entity = Entity> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }
  findById(id: number): T | undefined {
    return this.items.find((it) => it.id === id);
  }
}

// Без аргумента типа — работает с любыми { id: number }
const anyRepo = new Repository();
anyRepo.add({ id: 1 }); // ✅ форма подходит под ограничение

// С конкретным типом — тоже проходит проверку ограничения
interface Task extends Entity {
  title: string;
}
const tasks = new Repository<Task>();
tasks.add({ id: 1, title: 'Купить хлеб' }); // ✅`;

  protected readonly constraintDefaultError = `// ГЛАВНОЕ ПРАВИЛО дефолта с ограничением:
// значение по умолчанию само ОБЯЗАНО удовлетворять ограничению.

interface Box<T extends string = number> {
  value: T;
}
// ❌ Type 'number' does not satisfy the constraint 'string'.
// Дефолт (number) должен входить в ограничение (string), а он в него не входит

// ✅ Так правильно: дефолт удовлетворяет ограничению extends string
interface State<T extends string = 'idle'> {
  status: T;
}
type Default = State; // T = 'idle' — литерал 'idle' является строкой, всё ок`;

  protected readonly paramOrder = `// Как у аргументов функции (сначала обязательные, потом со значением
// по умолчанию), у параметров ТИПА порядок такой же:
// обязательные — РАНЬШЕ, с дефолтом — ПОЗЖЕ.

// ✅ обязательный T впереди, E с дефолтом — сзади
interface Result1<T, E = Error> {
  value?: T;
  error?: E;
}

// ❌ параметр с дефолтом стоит ПЕРЕД обязательным
interface Result2<T = string, U> {
  a: T;
  b: U;
}
// ❌ Required type parameters may not follow optional type parameters.
// U обязательный, но идёт после T с дефолтом — так нельзя`;

  protected readonly apiResponseDefault = `// Разумный дефолт для «ответа сервера»: пока форму данных не уточнили —
// пусть будет unknown (безопасно: заставит проверить перед использованием).
interface ApiResponse<T = unknown> {
  ok: boolean;
  data: T;
}

// Без аргумента типа поле data имеет тип unknown
function parseResponse(json: string): ApiResponse {
  return JSON.parse(json);
}

const resp = parseResponse('{"ok":true,"data":3.14}');
resp.data.toFixed(2);
// ❌ 'resp.data' is of type 'unknown'.
// unknown нельзя трогать без проверки — компилятор охраняет нас от ошибок

// Указали конкретный тип — и data сразу «раскрывается»:
const priced: ApiResponse<number> = { ok: true, data: 3.14 };
priced.data.toFixed(2); // ✅ теперь data имеет тип number`;

  protected readonly resultType = `// Тип результата операции: «успех со значением» ИЛИ «ошибка».
// Тип ошибки E по умолчанию Error — это самый частый случай.
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Указали только T → E берётся по умолчанию (Error)
function parseAge(input: string): Result<number> {
  const n = Number(input);
  if (Number.isNaN(n)) {
    return { ok: false, error: new Error('не число') };
  }
  return { ok: true, value: n };
}

const r = parseAge('42');
if (r.ok) {
  r.value.toFixed(0); // ✅ здесь r.value: number
} else {
  r.error.message;    // ✅ здесь r.error: Error (сработал дефолт)
}

// А если ошибки — это коды-строки, переопределяем E явно:
type CodeResult = Result<number, 'EMPTY' | 'NOT_A_NUMBER'>;`;

  protected readonly defaultIgnored = `interface Container<T = string> {
  value: T;
}

// Как только тип указан ЯВНО, дефолт (string) вообще не участвует:
const a: Container = { value: 'x' };           // T не указан → дефолт string
const b: Container<number> = { value: 1 };     // T = number  → дефолт проигнорирован
const c: Container<boolean> = { value: true }; // T = boolean → дефолт проигнорирован

// Дефолт — это ЗАПАСНОЙ вариант «на случай, если тип не назвали»,
// а не жёсткая настройка. Назвали свой тип — берётся ваш.`;

  protected readonly defaultVsInference = `// Важно: дефолт срабатывает ТОЛЬКО когда T некуда вывести из аргументов.
// Если тип можно ВЫВЕСТИ по аргументу — вывод побеждает дефолт.

function wrap<T = string>(value: T): { value: T } {
  return { value };
}

// Есть аргумент → T выводится из него, дефолт string НЕ применяется
const n = wrap(42);   // T = number  → { value: number }
const b = wrap(true); // T = boolean → { value: boolean }

// Выводить не из чего (нет аргумента, задающего T) → включается дефолт
function makeList<T = string>(): T[] {
  return [];
}
const list = makeList(); // T = string → string[]  (сработал дефолт)`;

  protected readonly anyDefaultTeaser = `// ⚠️ ОПАСНЫЙ дефолт:  T = any.  any отключает проверки —
// и дефолт незаметно «протаскивает» дыру в типах.
function loadAny<T = any>(): T {
  return JSON.parse('{}');
}
const x = loadAny();
x.whatever.foo.bar; // ✅ ошибки НЕТ — но это ПЛОХО: any проглотит что угодно

// ✅ Правильный безопасный дефолт — unknown: он заставляет проверить.
function loadUnknown<T = unknown>(): T {
  return JSON.parse('{}');
}
const y = loadUnknown();
y.whatever;
// ❌ 'y' is of type 'unknown'.
// unknown не даст обратиться к свойству без предварительной проверки`;
}
