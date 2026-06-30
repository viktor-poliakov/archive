import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-arrays-add-remove',
  imports: [CodeBlock, RouterLink],
  templateUrl: './add-remove.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ArraysAddRemove {
  protected readonly pushExample = `const fruits = ['apple', 'banana'];

const newLength = fruits.push('cherry'); // добавили в конец

console.log(fruits);    // ['apple', 'banana', 'cherry'] — массив изменился
console.log(newLength); // 3 — push вернул новую длину

// можно добавить сразу несколько элементов
fruits.push('date', 'fig');
console.log(fruits.length); // 5`;

  protected readonly popExample = `const stack = ['a', 'b', 'c'];

const last = stack.pop(); // удалили последний элемент

console.log(last);  // 'c' — pop вернул удалённый элемент
console.log(stack); // ['a', 'b'] — массив изменился

// на пустом массиве pop вернёт undefined и ничего не сломает
const empty = [];
console.log(empty.pop()); // undefined`;

  protected readonly unshiftExample = `const queue = ['banana', 'cherry'];

const newLength = queue.unshift('apple'); // добавили в начало

console.log(queue);     // ['apple', 'banana', 'cherry'] — массив изменился
console.log(newLength); // 3 — unshift вернул новую длину

// несколько элементов вставятся именно в том порядке, в каком переданы
queue.unshift('x', 'y');
console.log(queue); // ['x', 'y', 'apple', 'banana', 'cherry']`;

  protected readonly shiftExample = `const queue = ['apple', 'banana', 'cherry'];

const first = queue.shift(); // удалили первый элемент

console.log(first); // 'apple' — shift вернул удалённый элемент
console.log(queue); // ['banana', 'cherry'] — массив изменился

// на пустом массиве shift вернёт undefined
console.log([].shift()); // undefined`;

  protected readonly stackQueueExample = `// Стек (LIFO): кладём и берём с одного конца — push + pop
const stack = [];
stack.push('task1');
stack.push('task2');
console.log(stack.pop()); // 'task2' — последний пришёл, первым ушёл

// Очередь (FIFO): кладём в конец, берём с начала — push + shift
const queue = [];
queue.push('task1');
queue.push('task2');
console.log(queue.shift()); // 'task1' — первый пришёл, первым ушёл`;

  protected readonly spliceDeleteExample = `const items = ['a', 'b', 'c', 'd'];

// с индекса 1 удалить 2 элемента
const removed = items.splice(1, 2);

console.log(removed); // ['b', 'c'] — splice вернул массив удалённых
console.log(items);   // ['a', 'd'] — массив изменился`;

  protected readonly spliceInsertExample = `const items = ['a', 'd'];

// с индекса 1 удалить 0 элементов и вставить 'b' и 'c'
const removed = items.splice(1, 0, 'b', 'c');

console.log(removed); // [] — ничего не удалили, вернулся пустой массив
console.log(items);   // ['a', 'b', 'c', 'd'] — элементы вставлены`;

  protected readonly spliceReplaceExample = `const items = ['a', 'b', 'c'];

// с индекса 1 удалить 1 элемент и вставить на его место два новых
const removed = items.splice(1, 1, 'x', 'y');

console.log(removed); // ['b'] — что удалили
console.log(items);   // ['a', 'x', 'y', 'c'] — замена выполнена`;

  protected readonly spliceNegativeExample = `const items = ['a', 'b', 'c', 'd'];

// отрицательный start отсчитывается с конца: -1 — последний элемент
const removed = items.splice(-1, 1);

console.log(removed); // ['d']
console.log(items);   // ['a', 'b', 'c']`;
}
