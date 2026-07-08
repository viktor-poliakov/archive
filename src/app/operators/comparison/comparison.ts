import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-operators-comparison',
  imports: [CodeBlock, RouterLink],
  templateUrl: './comparison.html',
  styleUrls: ['../../content/doc.scss'],
})
export class OperatorsComparison {
  protected readonly strictExample = `// === сравнивает БЕЗ приведения: должны совпасть и тип, и значение
5 === 5;       // true
5 === '5';     // false — число и строка, разные типы
true === 1;    // false
null === null; // true

// !== — строгое «не равно»
5 !== '5';     // true`;

  protected readonly looseExample = `// == приводит типы перед сравнением — отсюда неочевидные результаты
5 == '5';          // true — '5' привели к числу 5
true == 1;         // true — true привели к 1
0 == '';           // true — оба привелись к 0
null == undefined; // true

// Единственное оправданное применение == : проверка на null И undefined сразу
let x = null;
x == null; // true и для null, и для undefined — краткая проверка «пусто ли»`;

  protected readonly relationalExample = `// Числа сравниваются по величине
5 > 3;   // true
5 <= 5;  // true

// Строки — лексикографически, посимвольно по кодам (НЕ по длине!)
'apple' < 'banana'; // true
'2' > '10';         // true! сравнивается символ '2' с '1', а '2' > '1'

// Разные типы приводятся к числу
'5' > 3; // true — '5' стало числом 5`;

  protected readonly specialCmpExample = `// null и undefined: нестрого равны друг другу, строго — нет
null == undefined;  // true
null === undefined; // false

// NaN не равен НИЧЕМУ, даже самому себе
NaN === NaN;       // false
NaN == NaN;        // false
Number.isNaN(NaN); // true — единственный надёжный способ проверить на NaN`;
}
