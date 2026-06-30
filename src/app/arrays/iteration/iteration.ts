import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-arrays-iteration',
  imports: [CodeBlock, RouterLink],
  templateUrl: './iteration.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ArraysIteration {
  protected readonly forClassicExample = `const fruits = ['apple', 'banana', 'cherry'];

// классический for: i — индекс, идём от 0 до длины
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}
// 0 apple
// 1 banana
// 2 cherry`;

  protected readonly forOfExample = `const fruits = ['apple', 'banana', 'cherry'];

// for...of перебирает ЗНАЧЕНИЯ — самый удобный для простого обхода
for (const fruit of fruits) {
  console.log(fruit);
}
// apple
// banana
// cherry

// из for...of можно выйти через break
for (const fruit of fruits) {
  if (fruit === 'banana') break;
  console.log(fruit); // apple
}`;

  protected readonly forInWarningExample = `const fruits = ['apple', 'banana', 'cherry'];

// for...in перебирает КЛЮЧИ (строки!), а не значения — для массивов не использовать
for (const key in fruits) {
  console.log(key); // '0', '1', '2' — это строки-индексы
}

// и он видит лишние свойства, если их добавили массиву
fruits.extra = 'oops';
for (const key in fruits) {
  console.log(key); // '0', '1', '2', 'extra' — попало лишнее
}`;

  protected readonly forEachExample = `const fruits = ['apple', 'banana', 'cherry'];

// колбэк получает (element, index, array)
fruits.forEach((fruit, index) => {
  console.log(index, fruit);
});
// 0 apple
// 1 banana
// 2 cherry

const result = fruits.forEach((fruit) => fruit);
console.log(result); // undefined — forEach ничего не возвращает`;

  protected readonly forEachNoBreakExample = `const numbers = [1, 2, 3, 4, 5];

// return внутри колбэка завершает только текущий вызов, а НЕ весь перебор
numbers.forEach((n) => {
  if (n === 3) return; // пропустит лог для 3, но перебор продолжится
  console.log(n);
});
// 1
// 2
// 4
// 5

// если перебор нужно прервать — берём for...of или some/every
numbers.some((n) => {
  console.log(n);
  return n === 3; // вернёт true — some остановится
});
// 1
// 2
// 3`;

  protected readonly mapExample = `const numbers = [1, 2, 3];

// map возвращает НОВЫЙ массив той же длины с преобразованными элементами
const doubled = numbers.map((n) => n * 2);

console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3] — исходный не изменился

// колбэк тоже получает (element, index, array)
const withIndex = numbers.map((n, index) => \`\${index}: \${n}\`);
console.log(withIndex); // ['0: 1', '1: 2', '2: 3']`;

  protected readonly filterExample = `const numbers = [1, 2, 3, 4, 5, 6];

// filter возвращает НОВЫЙ массив из элементов, для которых колбэк вернул истину
const even = numbers.filter((n) => n % 2 === 0);

console.log(even);    // [2, 4, 6]
console.log(numbers); // [1, 2, 3, 4, 5, 6] — исходный не изменился

// если ничему не подошло — получим пустой массив
const big = numbers.filter((n) => n > 100);
console.log(big); // []`;

  protected readonly reduceSumExample = `const numbers = [10, 20, 30];

// reduce(cb, initialValue): cb получает (accumulator, element, index, array)
// initialValue — стартовое значение аккумулятора
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(sum); // 60

// по шагам: acc=0 -> 0+10=10 -> 10+20=30 -> 30+30=60`;

  protected readonly reduceCountExample = `const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];

// сворачиваем массив в объект-счётчик; начальное значение — пустой объект {}
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] ?? 0) + 1;
  return acc; // важно возвращать аккумулятор на каждом шаге
}, {});

console.log(counts); // { apple: 3, banana: 2, cherry: 1 }`;

  protected readonly reduceNoInitExample = `// без initialValue аккумулятором становится ПЕРВЫЙ элемент,
// а перебор начинается со второго
const sum = [10, 20, 30].reduce((acc, n) => acc + n);
console.log(sum); // 60

// но на ПУСТОМ массиве без initialValue будет ошибка:
// [].reduce((acc, n) => acc + n); // TypeError: Reduce of empty array with no initial value

// с initialValue безопасно — для пустого массива просто вернётся оно само
console.log([].reduce((acc, n) => acc + n, 0)); // 0`;

  protected readonly reduceRightExample = `const parts = ['a', 'b', 'c'];

// reduce — слева направо
console.log(parts.reduce((acc, p) => acc + p, '')); // 'abc'

// reduceRight — то же самое, но справа налево
console.log(parts.reduceRight((acc, p) => acc + p, '')); // 'cba'`;

  protected readonly entriesExample = `const fruits = ['apple', 'banana', 'cherry'];

console.log([...fruits.keys()]);    // [0, 1, 2]        — индексы
console.log([...fruits.values()]);  // ['apple', 'banana', 'cherry'] — значения
console.log([...fruits.entries()]); // [[0,'apple'], [1,'banana'], [2,'cherry']] — пары

// for...of по entries() удобен, когда нужны и индекс, и значение
for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit);
}
// 0 apple
// 1 banana
// 2 cherry`;
}
