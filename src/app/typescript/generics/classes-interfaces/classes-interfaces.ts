import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-generics-classes-interfaces',
  imports: [CodeBlock, RouterLink],
  templateUrl: './classes-interfaces.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptGenericsClassesInterfaces {
  protected readonly boxClass = `// Дженерик-класс — это ЧЕРТЁЖ коробки, размеченный под тип T.
// Пока T — «пустое место»: конкретный тип подставится, когда мы
// создадим настоящую коробку (new Box<number>() и т.п.).
class Box<T> {
  // Внутри лежит ровно одно значение типа T
  constructor(private content: T) {}

  // Достать содержимое — вернётся именно T
  get value(): T {
    return this.content;
  }

  // Положить новое содержимое — принимается только T
  set value(next: T) {
    this.content = next;
  }
}

const numberBox = new Box<number>(42); // коробка «для чисел»
numberBox.value = 100;                 // ✅ число положить можно
numberBox.value.toFixed(2);            // ✅ внутри точно number → есть toFixed

numberBox.value = 'сто';
// ❌ Type 'string' is not assignable to type 'number'.
//    Коробка размечена под number — строку в неё не положить.`;

  protected readonly newExplicitVsInfer = `// Способ 1 — указать тип ЯВНО в угловых скобках:
const strBox = new Box<string>('привет'); // тип: Box<string>

// Способ 2 — дать компилятору ВЫВЕСТИ тип из аргумента конструктора
// (то же правило вывода, что и у дженерик-функций: тип берётся из значения):
const numBox = new Box(5); // аргумент 5 — число → тип: Box<number>

// Box<number> и Box<string> — РАЗНЫЕ, несовместимые типы:
const wrong: Box<string> = numBox;
// ❌ Type 'Box<number>' is not assignable to type 'Box<string>'.
//    Type 'number' is not assignable to type 'string'.

// Явный аргумент обязан совпасть с тем, что кладём:
const bad = new Box<string>(5);
// ❌ Argument of type 'number' is not assignable to parameter of type 'string'.`;

  protected readonly containerInterface = `// Интерфейс тоже бывает дженериком: он описывает ФОРМУ объекта,
// где тип содержимого — параметр T.
interface Container<T> {
  value: T;
  isEmpty(): boolean;
}

// При использовании подставляем конкретный тип:
const box: Container<number> = {
  value: 42,
  isEmpty: () => false,
};
box.value.toFixed(1); // ✅ value — number

// Тот же интерфейс, но теперь внутри массив строк:
const labels: Container<string[]> = {
  value: ['new', 'done'],
  isEmpty() {
    return this.value.length === 0;
  },
};
labels.value.push('wip'); // ✅ value — string[]`;

  protected readonly pairAlias = `// Псевдоним type тоже принимает параметры типа. Классика — ПАРА:
type Pair<T, U> = {
  first: T;
  second: U;
};

// Пара «имя + возраст»: строка и число
const person: Pair<string, number> = { first: 'Анна', second: 30 };
person.second.toFixed(0); // ✅ second — number

// Та же форма, но координата на карте — два числа:
const point: Pair<number, number> = { first: 55.75, second: 37.61 };

const oops: Pair<string, number> = { first: 'x', second: 'y' };
// ❌ Type 'string' is not assignable to type 'number'.
//    second обязан быть number.`;

  protected readonly stackClass = `// Стек — «стопка тарелок»: кладём и снимаем ТОЛЬКО сверху.
// T — тип элементов, которые лежат в стопке.
class Stack<T> {
  private items: T[] = [];

  // положить наверх
  push(item: T): void {
    this.items.push(item);
  }

  // снять верхний — его может не быть, поэтому T | undefined
  pop(): T | undefined {
    return this.items.pop();
  }

  // подсмотреть верхний, не снимая
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numbers = new Stack<number>();
numbers.push(1);
numbers.push(2);
const top = numbers.pop(); // тип: number | undefined

numbers.push('три');
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.`;

  protected readonly resultType = `// Result — «или УСПЕХ со значением T, или ОШИБКА типа E».
// У параметра E есть значение по умолчанию Error: обычно ошибка — это Error,
// поэтому в большинстве случаев второй аргумент можно не писать.
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// E не указан → берётся дефолт Error
function parseAge(input: string): Result<number> {
  const n = Number(input);
  return Number.isNaN(n)
    ? { ok: false, error: new Error('не число') }
    : { ok: true, value: n };
}

const r = parseAge('42');
if (r.ok) {
  r.value.toFixed(0);           // ✅ здесь r сужен до ветки со value: number
} else {
  console.log(r.error.message); // ✅ error — Error
}

// А тут ошибка — это код ответа (число), поэтому E задаём явно:
type ApiResult = Result<string, number>;`;

  protected readonly repositoryClass = `interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Repository — «картотека»: хранит записи, у которых ТОЧНО есть id: number.
// Ограничение T extends { id: number } гарантирует поле id у любого T.
class Repository<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  // ищем по id — записи может не быть, отсюда T | undefined
  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

const tasks = new Repository<Task>();
tasks.add({ id: 1, title: 'Купить хлеб', done: false }); // ✅
const found = tasks.getById(1);                          // тип: Task | undefined

tasks.add({ title: 'Без id', done: false });
// ❌ Property 'id' is missing in type '{ title: string; done: boolean; }'
//    but required in type 'Task'.`;

  protected readonly kvStoreClass = `// Хранилище пар «ключ → значение» — тонкая обёртка над встроенным Map.
// K — тип ключа (строка или число), V — тип значения.
class KeyValueStore<K extends string | number, V> {
  private map = new Map<K, V>();

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }
}

// Ключи — строки, значения — числа (например, цены товаров):
const prices = new KeyValueStore<string, number>();
prices.set('хлеб', 40);
const p = prices.get('хлеб'); // тип: number | undefined

prices.set('молоко', '90');
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.`;

  protected readonly implementsStack = `// Улучшим прошлый стек: сначала опишем КОНТРАКТ интерфейсом
// (что стек умеет, но не КАК), а класс пусть его выполняет.

// 1) Контракт: дженерик-интерфейс
interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  readonly size: number;
}

// 2) Реализация: класс обещает выполнить контракт через implements.
//    Параметр T класса подставляется в тот же T интерфейса.
class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  get size(): number {
    return this.items.length;
  }
}

const s: Stack<string> = new ArrayStack<string>();
s.push('a');
const x = s.pop(); // тип: string | undefined`;

  protected readonly staticError = `class Box<T> {
  constructor(public value: T) {}

  static empty: T;
  // ❌ Static members cannot reference class type parameters.
  //    static-поле ОДНО на весь класс (как вывеска на весь завод),
  //    а T — свой у каждого экземпляра, поэтому связать их нельзя.

  // ✅ Обход: пусть у самого МЕТОДА будет свой параметр типа U —
  //    он не зависит от T класса и потому разрешён даже у static:
  static of<U>(value: U): Box<U> {
    return new Box(value);
  }
}

const b = Box.of<number>(42); // тип: Box<number>`;

  protected readonly genericMethod = `class Box<T> {
  constructor(private content: T) {}

  get value(): T {
    return this.content;
  }

  // Метод со СВОИМ параметром типа U: превращает Box<T> в Box<U>,
  // применив функцию-преобразователь. U указываем в <> при вызове.
  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.content));
  }
}

const numBox = new Box<number>(5); // Box<number>
const strBox = numBox.map<string>((n) => \`#\${n}\`); // тип: Box<string>
const lenBox = strBox.map<number>((s) => s.length); // тип: Box<number>

strBox.value.toUpperCase(); // ✅ внутри уже точно string`;
}
