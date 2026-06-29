import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-properties',
  imports: [CodeBlock, RouterLink],
  templateUrl: './properties.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsProperties {
  protected readonly attachExample = `function greet() {
  return 'hello';
}

// навешиваем свойство прямо на функцию, как на обычный объект
greet.author = 'Ann';
greet.version = 1;

console.log(greet.author);  // 'Ann'
console.log(greet.version); // 1
console.log(typeof greet);  // 'function' — но внутри это объект`;

  protected readonly builtinExample = `function sum(a, b, c) {
  return a + b + c;
}

console.log(sum.name);   // 'sum' — имя функции
console.log(sum.length); // 3    — сколько параметров объявлено

const anon = function () {};
console.log(anon.name);  // 'anon' — имя берётся из переменной`;

  protected readonly counterExample = `function track() {
  // свойство живёт между вызовами — функция «помнит» счётчик
  track.calls = (track.calls ?? 0) + 1;
  console.log('call #', track.calls);
}

track(); // call # 1
track(); // call # 2
track(); // call # 3`;

  protected readonly configExample = `function format(price) {
  return format.currency + price.toFixed(2);
}

// настройка хранится прямо на функции — её легко поменять снаружи
format.currency = '$';
console.log(format(10)); // '$10.00'

format.currency = '€';
console.log(format(10)); // '€10.00'`;

  protected readonly cacheExample = `function getConfig() {
  // «дорогое» вычисление выполняем только один раз,
  // результат запоминаем на самой функции
  if (!getConfig.cached) {
    console.log('computing...');
    getConfig.cached = { theme: 'dark', lang: 'ru' };
  }
  return getConfig.cached;
}

getConfig(); // 'computing...'
getConfig(); // (тишина — вернулось из кэша)`;
}
