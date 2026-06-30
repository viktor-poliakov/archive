import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-arrays-transform',
  imports: [CodeBlock, RouterLink],
  templateUrl: './transform.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ArraysTransform {
  protected readonly sliceExample = `const fruits = ['apple', 'banana', 'cherry', 'date'];

// Копия части: с индекса 1 до 3 (3 НЕ включается)
const part = fruits.slice(1, 3);
console.log(part);   // ['banana', 'cherry']

// Без аргументов — поверхностная копия всего массива
const copy = fruits.slice();
console.log(copy);   // ['apple', 'banana', 'cherry', 'date']

// Исходный массив не изменился
console.log(fruits); // ['apple', 'banana', 'cherry', 'date']`;

  protected readonly concatExample = `const a = [1, 2];
const b = [3, 4];

const result = a.concat(b, [5, 6]);
console.log(result); // [1, 2, 3, 4, 5, 6]

// Исходные массивы остались прежними
console.log(a); // [1, 2]
console.log(b); // [3, 4]`;

  protected readonly joinExample = `const parts = ['2026', '06', '30'];

console.log(parts.join('-')); // '2026-06-30'
console.log(parts.join());    // '2026,06,30' (по умолчанию запятая)

// Обратная операция — split у строк
const back = '2026-06-30'.split('-');
console.log(back); // ['2026', '06', '30']`;

  protected readonly flatExample = `const nested = [1, [2, 3], [4, [5, 6]]];

// По умолчанию глубина 1
console.log(nested.flat());  // [1, 2, 3, 4, [5, 6]]

// Глубина 2 — разглаживает и вложенный уровень
console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6]

// flatMap: map + flat(1) за один проход
const words = ['hello world', 'foo bar'];
const tokens = words.flatMap((s) => s.split(' '));
console.log(tokens); // ['hello', 'world', 'foo', 'bar']`;

  protected readonly atExample = `const list = ['a', 'b', 'c', 'd'];

console.log(list.at(0));  // 'a'
console.log(list.at(-1)); // 'd' (последний)
console.log(list.at(-2)); // 'c' (предпоследний)

// Раньше для последнего элемента писали так:
console.log(list[list.length - 1]); // 'd'`;

  protected readonly sortStringExample = `const nums = [1, 2, 10, 21, 3];

// Без компаратора числа сравниваются КАК СТРОКИ!
nums.sort();
console.log(nums); // [1, 10, 2, 21, 3] — не то, что ожидали

// Строки сортируются как строки — это ожидаемо
const words = ['cherry', 'apple', 'banana'];
words.sort();
console.log(words); // ['apple', 'banana', 'cherry']`;

  protected readonly sortNumberExample = `const nums = [1, 2, 10, 21, 3];

// Компаратор: a - b < 0 => a раньше b (по возрастанию)
nums.sort((a, b) => a - b);
console.log(nums); // [1, 2, 3, 10, 21]

// По убыванию — меняем знак
nums.sort((a, b) => b - a);
console.log(nums); // [21, 10, 3, 2, 1]

// sort возвращает ТОТ ЖЕ массив (мутирует на месте)
console.log(nums.sort((a, b) => a - b) === nums); // true`;

  protected readonly reverseExample = `const arr = [1, 2, 3];

const returned = arr.reverse();
console.log(arr);      // [3, 2, 1] — изменён на месте
console.log(returned); // [3, 2, 1] — тот же массив
console.log(returned === arr); // true`;

  protected readonly fillExample = `const arr = [1, 2, 3, 4, 5];

// Заполнить значением 0 с индекса 1 до 3 (3 не включается)
arr.fill(0, 1, 3);
console.log(arr); // [1, 0, 0, 4, 5]

// Без границ — заполнить весь массив
const zeros = new Array(3).fill(0);
console.log(zeros); // [0, 0, 0]`;

  protected readonly copyWithinExample = `const arr = [1, 2, 3, 4, 5];

// Скопировать элементы с индекса 3 в позицию с индекса 0
arr.copyWithin(0, 3);
console.log(arr); // [4, 5, 3, 4, 5] — изменён на месте`;

  protected readonly immutableExample = `const nums = [3, 1, 2];

// toSorted — как sort, но возвращает НОВЫЙ массив
const sorted = nums.toSorted((a, b) => a - b);
console.log(sorted); // [1, 2, 3]
console.log(nums);   // [3, 1, 2] — оригинал не тронут

// toReversed — как reverse, но без мутации
console.log([1, 2, 3].toReversed()); // [3, 2, 1]

// with — копия с заменой одного элемента по индексу
const arr = ['a', 'b', 'c'];
console.log(arr.with(1, 'X')); // ['a', 'X', 'c']
console.log(arr);              // ['a', 'b', 'c'] — без изменений

// toSpliced — как splice, но возвращает НОВЫЙ массив
const letters = ['a', 'b', 'c', 'd'];
const spliced = letters.toSpliced(1, 2, 'X');
console.log(spliced); // ['a', 'X', 'd']
console.log(letters); // ['a', 'b', 'c', 'd'] — оригинал не тронут`;
}
