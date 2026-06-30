import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-arrays-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ArraysPitfalls {
  protected readonly referenceExample = `const a = [1, 2, 3];
const b = a; // не копия — то же самое имя для того же массива

b.push(4);

console.log(a); // [1, 2, 3, 4] — изменение через b видно через a
console.log(a === b); // true — это один и тот же массив`;

  protected readonly compareExample = `// === сравнивает ссылки, а не содержимое
console.log([1] === [1]); // false — это два разных массива
console.log([] === []); // false

const a = [1, 2];
const b = a;
console.log(a === b); // true — одна и та же ссылка`;

  protected readonly shallowCopyExample = `const arr = [1, 2, 3];

// три равноценных способа сделать поверхностную копию:
const copy1 = [...arr];        // spread
const copy2 = arr.slice();     // slice без аргументов
const copy3 = Array.from(arr); // Array.from

copy1.push(4);
console.log(arr);   // [1, 2, 3] — оригинал не тронут
console.log(copy1); // [1, 2, 3, 4]
console.log(arr === copy1); // false — это разные массивы`;

  protected readonly shallowProblemExample = `const users = [{ name: 'Ann' }, { name: 'Bob' }];
const copy = [...users]; // поверхностная копия

// сам массив скопирован, но объекты внутри — общие
copy[0].name = 'Kate';

console.log(users[0].name); // 'Kate' — изменили и оригинал!
console.log(users[0] === copy[0]); // true — это один объект`;

  protected readonly deepCopyExample = `const users = [{ name: 'Ann' }, { name: 'Bob' }];
const clone = structuredClone(users); // глубокая копия

clone[0].name = 'Kate';

console.log(users[0].name); // 'Ann' — оригинал не задет
console.log(users[0] === clone[0]); // false — независимые объекты`;

  protected readonly sortNumbersExample = `const nums = [10, 1, 2, 20, 3];

// без компаратора sort сравнивает элементы КАК СТРОКИ
nums.sort();
console.log(nums); // [1, 10, 2, 20, 3] — не то, что ждали

// для чисел нужен компаратор
nums.sort((a, b) => a - b);
console.log(nums); // [1, 2, 3, 10, 20]`;

  protected readonly sortMutatesExample = `const original = [3, 1, 2];

// sort МУТИРУЕТ массив и возвращает его же
const sorted = original.sort((a, b) => a - b);

console.log(original); // [1, 2, 3] — исходный тоже изменился!
console.log(sorted === original); // true — это один массив

// чтобы сохранить оригинал — копируем перед сортировкой
const safe = [...original].sort((a, b) => b - a);
console.log(safe);     // [3, 2, 1]
console.log(original); // [1, 2, 3] — не тронут`;

  protected readonly sparseIndexExample = `const arr = [1, 2];
arr[5] = 'x'; // присваивание за пределами длины

console.log(arr);        // [1, 2, empty × 3, 'x']
console.log(arr.length); // 6 — длина выросла до индекса 5 + 1
console.log(arr[3]);     // undefined — на месте дыры`;

  protected readonly deleteHoleExample = `const arr = ['a', 'b', 'c'];

delete arr[1]; // оставляет дыру, длину НЕ меняет
console.log(arr);        // ['a', empty, 'c']
console.log(arr.length); // 3

// правильно удалять элемент через splice — он сдвигает остальные
const arr2 = ['a', 'b', 'c'];
arr2.splice(1, 1); // удалить 1 элемент с индекса 1
console.log(arr2);        // ['a', 'c']
console.log(arr2.length); // 2`;

  protected readonly lengthExample = `const arr = [1, 2, 3, 4, 5];

arr.length = 2; // усечение
console.log(arr); // [1, 2]

arr.length = 0; // полная очистка
console.log(arr); // []`;

  protected readonly newArrayExample = `// new Array с одним числом задаёт ДЛИНУ, а не элемент
const a = new Array(3);
console.log(a);        // [empty × 3] — три дыры, не [3]
console.log(a.length); // 3

// чтобы создать [3], используйте литерал
const b = [3];
console.log(b);        // [3]
console.log(b.length); // 1

// заполнить пустой массив длины n можно через fill
const zeros = new Array(3).fill(0);
console.log(zeros); // [0, 0, 0]`;

  protected readonly breakExample = `const nums = [1, 2, 3, 4, 5];

// forEach НЕЛЬЗЯ прервать — break/return здесь не помогут
nums.forEach((n) => {
  if (n === 3) return; // выходит только из текущего колбэка, не из цикла
  console.log(n); // в сумме печатает 1, 2, 4, 5 — пропустит 3, но не остановится
});

// чтобы прервать перебор — for...of с break
for (const n of nums) {
  if (n === 3) break;
  console.log(n); // 1, 2
}

// либо some: вернёт true и остановится на первом подходящем
nums.some((n) => n === 3); // перебор прекращается на 3`;

  protected readonly checksExample = `const arr = [1, 2, 3];

// пустой ли массив
console.log(arr.length === 0); // false
console.log([].length === 0);  // true

// массив ли это — typeof здесь бесполезен
console.log(typeof arr);          // 'object' — не отличает массив от объекта
console.log(Array.isArray(arr));  // true
console.log(Array.isArray('hi')); // false
console.log(Array.isArray({}));   // false`;
}
