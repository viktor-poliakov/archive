import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-generics-constraints',
  imports: [CodeBlock, RouterLink],
  templateUrl: './constraints.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptGenericsConstraints {
  protected readonly problemNoConstraint = `// Задача: вернуть тот из двух аргументов, что ДЛИННЕЕ.
// Хотим работать с ЛЮБЫМ типом T — и упираемся в стену.
function longest<T>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
  // ❌ Property 'length' does not exist on type 'T'.
  // T — это «какой угодно тип». Компилятор не знает, есть ли у него
  // поле length (у number его нет!), поэтому запрещает обращение.
}

// Голый T максимально «закрыт»: внутри функции про него ничего
// не известно, поэтому у него нельзя вызвать НИЧЕГО специфичного.`;

  protected readonly withConstraint = `// Ставим ТРЕБОВАНИЕ к типу через ключевое слово extends:
// «T может быть любым, НО обязан иметь поле length: number».
function longest<T extends { length: number }>(a: T, b: T): T {
  // Теперь компилятор ЗНАЕТ: раз T прошёл требование, .length точно есть.
  return a.length >= b.length ? a : b; // ✅ ошибки больше нет
}

// Аналогия: вакансия «возьму любого кандидата (T), НО он ОБЯЗАН
// уметь X». Требование сужает круг подходящих типов — но не до одного,
// а до всех, кто «умеет length».`;

  protected readonly constraintCalls = `longest('корова', 'кот');
// ✅ у строки есть length → T = string, тип результата: string

longest([1, 2, 3], [9, 8]);
// ✅ у массива есть length → T = number[], тип результата: number[]

longest(10, 20);
// ❌ Argument of type 'number' is not assignable to parameter
//    of type '{ length: number; }'.
// У числа нет поля length — оно не проходит требование.`;

  protected readonly shapeNotClass = `// extends в ограничении — это НЕ «наследник класса».
// Это «удовлетворяет ФОРМЕ»: подойдёт что угодно, где ЕСТЬ
// нужное поле — даже обычный объект, который никого не наследует.

const spichka = { length: 3, note: 'спичка' };
const palka = { length: 10, note: 'палка' };

longest(spichka, palka);
// ✅ форма совпала: у обоих объектов есть length: number.
// Наследование ни при чём — важна лишь СТРУКТУРА, а не родословная.`;

  protected readonly preserveExtra = `// Ограничение задаёт МИНИМУМ («хотя бы length»). Лишние поля
// не теряются: T запоминает точную форму аргумента ЦЕЛИКОМ.
function tag<T extends { length: number }>(x: T): T {
  return x;
}

const r = tag({ length: 5, label: 'ящик', heavy: true });
// T выведен как { length: number; label: string; heavy: boolean }

r.length; // ✅ пришло из требования
r.label;  // ✅ лишнее поле сохранилось — оно есть в T
r.heavy;  // ✅ тоже на месте

// Если бы параметр был просто объектом { length: number }, поля
// label и heavy «отрезались» бы. Дженерик же держит весь тип.`;

  protected readonly getPropDef = `interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Типобезопасный геттер поля по имени. Два параметра типа:
//   T — тип объекта;
//   K — ключ, но НЕ «любая строка», а один из ключей ИМЕННО этого T.
// keyof Task = 'id' | 'title' | 'done'. K extends keyof T требует,
// чтобы key был из этой «связки ключей».
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // ✅ тело компилируется: key заведомо валидный ключ T
}`;

  protected readonly getPropCalls = `const task: Task = { id: 1, title: 'Купить хлеб', done: false };

const t = getProp(task, 'title'); // ✅ тип: string  (Task['title'])
const d = getProp(task, 'done');  // ✅ тип: boolean (Task['done'])
const i = getProp(task, 'id');    // ✅ тип: number  (Task['id'])

// Результат — РОВНО тип нужного поля, а не общий union:
t.toUpperCase(); // ✅ t точно string
d === true;      // ✅ d точно boolean
i.toFixed(0);    // ✅ i точно number`;

  protected readonly getPropWrongKey = `getProp(task, 'foo');
// ❌ Argument of type '"foo"' is not assignable to parameter
//    of type 'keyof Task'.
// 'foo' нет в наборе 'id' | 'title' | 'done'.
// Аналогия: чужой ключ не подойдёт к замку — связка ключей keyof
// пускает внутрь только «свои» имена полей.`;

  protected readonly indexedAccess = `interface Task {
  id: number;
  title: string;
  done: boolean;
}

// T[K] — это «тип значения, лежащего под ключом K».
// Читается как обычное обращение по ключу, но на уровне ТИПОВ:
type TitleType = Task['title'];   // string
type IdType = Task['id'];         // number
type AnyValue = Task[keyof Task]; // string | number | boolean

// Именно поэтому getProp(obj, 'title') возвращает string:
// его тип результата объявлен как T[K], то есть Task['title'].`;

  protected readonly merge = `// Требуем, чтобы ОБА аргумента были объектами, и склеиваем их.
// Результат — пересечение T & U: в нём есть поля и из a, и из b.
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

const merged = merge({ id: 1 }, { title: 'Задача' });
merged.id;    // ✅ есть — пришло из первого объекта (тип number)
merged.title; // ✅ есть — пришло из второго объекта (тип string)

merge({ id: 1 }, 42);
// ❌ Argument of type 'number' is not assignable to parameter
//    of type 'object'. Число — не объект, требование не пройдено.`;

  protected readonly updateById = `interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Ограничение { id: number } — «работаю с чем угодно, лишь бы
// у него был числовой id». Обновляем элемент списка по совпадению id.
function updateById<T extends { id: number }>(items: T[], patch: T): T[] {
  return items.map((item) => (item.id === patch.id ? patch : item));
}

const tasks: Task[] = [
  { id: 1, title: 'A', done: false },
  { id: 2, title: 'B', done: false },
];

updateById(tasks, { id: 2, title: 'B', done: true });
// ✅ у Task есть id → требование пройдено

// А объект БЕЗ поля id требование не проходит:
const brokenPatch = { title: 'нет id', done: true };
updateById(tasks, brokenPatch);
// ❌ Argument of type '{ title: string; done: boolean; }' is not
//    assignable to parameter of type '{ id: number; }'.
//    Property 'id' is missing in type '{ title: string; done: boolean; }'
//    but required in type '{ id: number; }'.`;
}
