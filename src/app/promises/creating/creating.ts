import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-creating',
  imports: [CodeBlock, RouterLink],
  templateUrl: './creating.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesCreating {
  protected readonly newPromiseExample = `// Конструктор получает функцию-исполнитель (executor).
// Движок вызывает её сразу и передаёт два колбэка:
// resolve — перевести промис в "успех",
// reject  — перевести промис в "ошибку".
const promise = new Promise((resolve, reject) => {
  const ok = true;

  if (ok) {
    resolve('done'); // промис выполнен со значением "done"
  } else {
    reject(new Error('Something went wrong')); // промис отклонён
  }
});

promise.then((value) => console.log(value)); // "done"`;

  protected readonly delayExample = `// Оборачиваем колбэчный setTimeout в промис.
// delay(ms) возвращает промис, который выполнится через ms миллисекунд.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms); // по таймеру дёргаем resolve — без значения
  });
}

// Теперь паузу можно "подождать" через await:
async function run() {
  console.log('start');
  await delay(1000); // ждём 1 секунду
  console.log('one second later');
}

run();`;

  protected readonly delayValueExample = `// resolve можно вызвать со значением — оно и придёт в .then / await.
function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

const result = await delay(500, 'ready'); // "ready" через полсекунды`;

  protected readonly promisifyExample = `// Универсальная обёртка для колбэков в стиле Node: callback(err, result).
function promisify(fn) {
  // Возвращаем новую функцию, принимающую те же аргументы (кроме колбэка).
  return function (...args) {
    return new Promise((resolve, reject) => {
      // Добавляем свой колбэк последним аргументом.
      fn(...args, (err, result) => {
        if (err) {
          reject(err); // ошибка -> промис отклонён
        } else {
          resolve(result); // успех -> промис выполнен
        }
      });
    });
  };
}

// Было (колбэк):
// readFile('config.json', (err, data) => { ... });

// Стало (промис):
const readFileAsync = promisify(readFile);
const data = await readFileAsync('config.json');`;

  protected readonly thenableExample = `// thenable — любой объект с методом then(resolve, reject).
// Он не настоящий промис, но ведёт себя похоже.
const thenable = {
  then(resolve, reject) {
    setTimeout(() => resolve('from thenable'), 1000);
  },
};

// Promise.resolve адаптирует thenable к настоящему промису:
Promise.resolve(thenable).then((value) => console.log(value)); // "from thenable"

// await тоже понимает любой thenable — оборачивать вручную не нужно:
const value = await thenable; // "from thenable"`;

  protected readonly antipatternBadExample = `// ПЛОХО: лишний new Promise вокруг уже существующего промиса.
function loadUser(id) {
  return new Promise((resolve, reject) => {
    fetch('/users/' + id)
      .then((response) => resolve(response)) // руками перекладываем результат
      .catch((error) => reject(error));      // и ошибку тоже — зачем?
  });
}`;

  protected readonly antipatternGoodExample = `// ХОРОШО: fetch и так возвращает промис — просто верните его.
function loadUser(id) {
  return fetch('/users/' + id);
}

// Нужна доработка результата? Зачейните — промис останется промисом:
function loadUserName(id) {
  return fetch('/users/' + id)
    .then((response) => response.json())
    .then((user) => user.name);
}`;

  protected readonly resolveVsFulfillExample = `// resolve НЕ значит "выполнить этим значением".
// Если resolve получает промис (или thenable), внешний промис
// начинает "следовать" за ним: ждёт его и перенимает его судьбу.

const inner = Promise.resolve('inner value');

const outer = new Promise((resolve) => {
  resolve(inner); // outer не выполнится промисом как значением —
  //                 он дождётся inner и выполнится "inner value"
});

outer.then((value) => console.log(value)); // "inner value", а не сам объект-промис`;
}
