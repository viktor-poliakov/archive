import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-numbers-math',
  imports: [CodeBlock, RouterLink],
  templateUrl: './math.html',
  styleUrls: ['../../content/doc.scss'],
})
export class NumbersMath {
  protected readonly roundingExample = `// Четыре способа убрать дробную часть — с разным поведением
Math.round(2.5); // 3 — к ближайшему (ровно .5 идёт ВВЕРХ)
Math.round(2.4); // 2
Math.floor(2.9); // 2 — всегда вниз
Math.ceil(2.1);  // 3 — всегда вверх
Math.trunc(2.9); // 2 — просто отбросить дробную часть

// Разница ярче всего видна на отрицательных числах:
Math.round(-2.5); // -2 — .5 округляется в сторону +бесконечности!
Math.floor(-2.1); // -3 — вниз (в сторону -бесконечности)
Math.trunc(-2.9); // -2 — отбросить дробную (в сторону нуля)`;

  protected readonly powExample = `Math.abs(-5);  // 5  — модуль (абсолютное значение)
Math.sign(-5); // -1 — знак числа: -1, 0 или 1

// Возведение в степень: оператор ** и Math.pow — одно и то же
2 ** 10;         // 1024
Math.pow(2, 10); // 1024

// Корни
Math.sqrt(9);  // 3 — квадратный
Math.cbrt(27); // 3 — кубический`;

  protected readonly minMaxExample = `// min/max принимают числа ЧЕРЕЗ ЗАПЯТУЮ, а не массив
Math.max(3, 1, 2); // 3
Math.min(3, 1, 2); // 1

// чтобы передать массив — разворачиваем его через spread (...)
const nums = [3, 1, 2];
Math.max(...nums); // 3

// вызов без аргументов даёт «крайние» значения
Math.max(); // -Infinity
Math.min(); // Infinity`;

  protected readonly randomExample = `// Math.random() — псевдослучайное число в диапазоне [0, 1)
Math.random(); // например 0.7324... (0 возможен, ровно 1 — нет)

// Целое число в диапазоне [min, max] включительно
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

randomInt(1, 6); // «бросок кубика»: от 1 до 6`;

  protected readonly constantsExample = `Math.PI; // 3.141592653589793
Math.E;  // 2.718281828459045

// пример: площадь круга радиуса r
const r = 5;
Math.PI * r ** 2; // 78.53981633974483`;
}
