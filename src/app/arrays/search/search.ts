import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-arrays-search',
  imports: [CodeBlock, RouterLink],
  templateUrl: './search.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ArraysSearch {
  protected readonly indexOfExample = `const fruits = ['apple', 'banana', 'cherry', 'banana'];

// возвращает индекс первого совпадения
console.log(fruits.indexOf('banana')); // 1
console.log(fruits.indexOf('mango'));  // -1 (не найдено)

// второй аргумент — с какого индекса начать искать
console.log(fruits.indexOf('banana', 2)); // 3

// lastIndexOf ищет с конца
console.log(fruits.lastIndexOf('banana')); // 3

// массив не изменился
console.log(fruits); // ['apple', 'banana', 'cherry', 'banana']`;

  protected readonly strictExample = `const values = [1, 2, '2', true];

// сравнение строгое (===), без приведения типов
console.log(values.indexOf(2));    // 1 — число
console.log(values.indexOf('2'));  // 2 — строка
console.log(values.indexOf(true)); // 3
console.log(values.indexOf(1));    // 0

// объекты сравниваются по ссылке, а не по содержимому
const user = { id: 1 };
const people = [{ id: 1 }, user];
console.log(people.indexOf({ id: 1 })); // -1 — другой объект
console.log(people.indexOf(user));      // 1 — та же ссылка`;

  protected readonly includesExample = `const colors = ['red', 'green', 'blue'];

// includes возвращает boolean — есть ли значение
console.log(colors.includes('green')); // true
console.log(colors.includes('pink'));  // false

// для простой проверки «есть ли» это читается лучше, чем indexOf
if (colors.includes('red')) {
  console.log('красный есть'); // выполнится
}`;

  protected readonly nanExample = `const numbers = [1, NaN, 3];

// indexOf использует === , а NaN === NaN всегда false
console.log(numbers.indexOf(NaN)); // -1 — НЕ находит

// includes умеет находить NaN
console.log(numbers.includes(NaN)); // true — находит`;

  protected readonly findExample = `const users = [
  { id: 1, name: 'Ann', age: 17 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Cara', age: 30 },
];

// find возвращает первый ЭЛЕМЕНТ, для которого колбэк истинный
const adult = users.find((u) => u.age >= 18);
console.log(adult); // { id: 2, name: 'Bob', age: 25 }

// если ничего не подошло — undefined
const senior = users.find((u) => u.age > 100);
console.log(senior); // undefined

// findIndex возвращает ИНДЕКС такого элемента или -1
console.log(users.findIndex((u) => u.name === 'Cara')); // 2
console.log(users.findIndex((u) => u.name === 'Zed'));  // -1`;

  protected readonly findLastExample = `const numbers = [4, 9, 12, 7, 20];

// findLast ищет с конца — первый подходящий справа
console.log(numbers.findLast((n) => n < 10)); // 7

// findLastIndex — его индекс
console.log(numbers.findLastIndex((n) => n < 10)); // 3

// для сравнения, find/findIndex идут слева
console.log(numbers.find((n) => n < 10));      // 4
console.log(numbers.findIndex((n) => n < 10)); // 0`;

  protected readonly someEveryExample = `const scores = [70, 85, 90, 60];

// some — есть ли ХОТЯ БЫ ОДИН подходящий (стоп на первом подходящем)
console.log(scores.some((s) => s >= 90)); // true
console.log(scores.some((s) => s > 100)); // false

// every — подходят ли ВСЕ (стоп на первом неподходящем)
console.log(scores.every((s) => s >= 60)); // true
console.log(scores.every((s) => s >= 80)); // false

// на пустом массиве: some -> false, every -> true
console.log([].some((s) => s > 0));  // false
console.log([].every((s) => s > 0)); // true`;
}
