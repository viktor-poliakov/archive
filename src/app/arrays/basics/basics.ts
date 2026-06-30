import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-arrays-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ArraysBasics {
  protected readonly startExample = `// Массив — упорядоченный список значений
const fruits = ['apple', 'banana', 'cherry'];

console.log(fruits[0]); // 'apple'  — первый элемент (индекс 0)
console.log(fruits[1]); // 'banana' — второй (индекс 1)
console.log(fruits.length); // 3 — сколько элементов в массиве`;

  protected readonly mixedTypesExample = `// В одном массиве можно хранить значения разных типов
const mixed = [1, 'hello', true, null, { id: 42 }, [9, 8]];

console.log(mixed[1]); // 'hello'
console.log(mixed[4]); // { id: 42 }
console.log(mixed.length); // 6`;

  protected readonly typeofExample = `// Массив — это особый вид объекта
const arr = [1, 2, 3];

console.log(typeof arr); // 'object' — typeof не отличает массив от объекта!
console.log(typeof {}); // 'object'

// Поэтому для надёжной проверки есть отдельный метод:
console.log(Array.isArray(arr)); // true
console.log(Array.isArray({})); // false
console.log(Array.isArray('abc')); // false`;

  protected readonly literalExample = `// Литерал массива — основной и самый удобный способ
const empty = []; // пустой массив, length === 0
const numbers = [1, 2, 3]; // массив из трёх чисел

console.log(empty.length); // 0
console.log(numbers.length); // 3`;

  protected readonly newArrayExample = `// new Array с ОДНИМ числом — ловушка!
const a = new Array(3);
console.log(a.length); // 3 — это пустой массив длины 3, а НЕ [3]
console.log(a); // [ <3 empty items> ]

// new Array с несколькими аргументами работает как литерал
const b = new Array(1, 2, 3);
console.log(b); // [1, 2, 3]

// Array.of всегда кладёт аргументы как элементы — без ловушки
const c = Array.of(3);
console.log(c); // [3]`;

  protected readonly arrayFromExample = `// Array.from делает массив из перебираемого или похожего на массив
const fromString = Array.from('abc');
console.log(fromString); // ['a', 'b', 'c']

// Из Set (удобно убрать дубликаты, а потом получить массив)
const unique = Array.from(new Set([1, 1, 2, 3]));
console.log(unique); // [1, 2, 3]

// Второй аргумент — функция преобразования каждого элемента
const squares = Array.from([1, 2, 3], (x) => x * x);
console.log(squares); // [1, 4, 9]

// Частый приём: { length: n } — «похожий на массив» объект,
// а функция (v, i) задаёт значения по индексу. Так делают диапазон:
const range = Array.from({ length: 5 }, (v, i) => i);
console.log(range); // [0, 1, 2, 3, 4]`;

  protected readonly accessExample = `const colors = ['red', 'green', 'blue'];

// Доступ по индексу (нумерация с нуля)
console.log(colors[0]); // 'red'

// Последний элемент классическим способом
console.log(colors[colors.length - 1]); // 'blue'

// Современный способ: at() понимает отрицательные индексы (с конца)
console.log(colors.at(-1)); // 'blue'
console.log(colors.at(-2)); // 'green'

// Обращение к несуществующему индексу даёт undefined (а не ошибку)
console.log(colors[10]); // undefined`;

  protected readonly lengthExample = `const arr = [1, 2, 3, 4, 5];

// Чтение длины
console.log(arr.length); // 5

// Запись меньшего значения — массив усекается
arr.length = 2;
console.log(arr); // [1, 2]

// Запись большего значения — массив расширяется пустыми ячейками
arr.length = 4;
console.log(arr); // [1, 2, <2 empty items>]
console.log(arr[3]); // undefined`;

  protected readonly indexAssignExample = `const arr = ['a', 'b', 'c'];

// Изменение элемента по индексу
arr[1] = 'B';
console.log(arr); // ['a', 'B', 'c']

// Присваивание по индексу за пределами длины создаёт «дыры»
arr[5] = 'f';
console.log(arr); // ['a', 'B', 'c', <2 empty items>, 'f']
console.log(arr.length); // 6 — length подрос до максимального индекса + 1`;

  protected readonly matrixExample = `// Многомерный массив — это массив массивов
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Доступ: сначала строка, потом столбец
console.log(matrix[0]); // [1, 2, 3]
console.log(matrix[1][2]); // 6 — вторая строка, третий элемент
console.log(matrix[2][0]); // 7`;
}
