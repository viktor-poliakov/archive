import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-primitives',
  imports: [CodeBlock, RouterLink],
  templateUrl: './primitives.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesPrimitives {
  protected readonly annotationExample = `// Аннотация типа — это ": тип" сразу после имени.
// Читается как обещание: «здесь всегда будет число».
let count: number = 0;
let userName: string = 'Аня';
let isActive: boolean = true;

count = 42;      // OK — это число
count = 'сорок'; // ❌ Type 'string' is not assignable to type 'number'
                 //    нарушили обещание: в number кладём строку`;

  protected readonly functionAnnotationExample = `// У функции аннотируют ДВА места:
// 1) каждый параметр — после его имени;
// 2) тип возвращаемого значения — после скобок.
function repeat(text: string, times: number): string {
  return text.repeat(times);
}

repeat('ha', 3);   // 'hahaha'
repeat('ha', '3'); // ❌ Argument of type 'string' is not assignable
                   //    to parameter of type 'number'

// Стрелочная функция — тот же принцип
const square = (x: number): number => x * x;`;

  protected readonly sevenPrimitivesExample = `// Все семь примитивов. Имена типов пишутся с МАЛЕНЬКОЙ буквы.
let age: number = 30;                 // числа: целые и дробные
let big: bigint = 9007199254740993n;  // очень большие целые
let title: string = 'TypeScript';     // текст
let done: boolean = false;            // да / нет
let id: symbol = Symbol('id');        // уникальный «ярлык»
let nothing: null = null;             // намеренно пусто
let notSet: undefined = undefined;    // значение ещё не задано`;

  protected readonly numberExample = `// number — ОДИН тип и для целых, и для дробных. Отдельного int нет.
let integer: number = 42;
let price: number = 3.14;
let temperature: number = -273.15;

// Особые значения тоже относятся к number:
let notANumber: number = NaN;    // «не число» — результат кривой операции
let infinite: number = Infinity; // бесконечность, например 1 / 0

typeof NaN;      // 'number'  (да, NaN — это number!)
typeof Infinity; // 'number'`;

  protected readonly bigintExample = `// bigint — для целых, которые не влезают в number без потери точности.
// Литерал заканчивается на букву n.
let huge: bigint = 9_007_199_254_740_993n;

huge + 1n; // 9007199254740994n — считается точно

// Смешивать bigint и number в арифметике нельзя:
huge + 1;  // ❌ Operator '+' cannot be applied to types 'bigint' and 'number'
           //    сначала приведите один к другому: huge + BigInt(1)`;

  protected readonly stringExample = `// string — любой текст: одинарные, двойные или шаблонные \`...\` кавычки.
let city: string = 'Москва';
let greeting: string = "Привет";
let phrase: string = \`\${greeting}, \${city}!\`; // шаблонная строка

let code: string = 5; // ❌ Type 'number' is not assignable to type 'string'
                      //    число — это не текст, даже если похоже`;

  protected readonly booleanExample = `// boolean — ровно два значения: true или false. Больше ничего.
let isLoggedIn: boolean = true;
let hasAccess: boolean = false;

isLoggedIn = 1; // ❌ Type 'number' is not assignable to type 'boolean'
                //    1 «истинно» в условии if, но это НЕ значение true`;

  protected readonly symbolExample = `// symbol — всегда уникальное значение, даже при одинаковом описании.
let a: symbol = Symbol('id');
let b: symbol = Symbol('id');

a === b; // false — это два разных символа, описание 'id' лишь для отладки

// Применяют как уникальные ключи свойств, которые гарантированно
// не столкнутся с другими ключами объекта.`;

  protected readonly nullUndefinedExample = `// null и undefined — самостоятельные типы. У каждого одно-единственное значение.
let empty: null = null;
let missing: undefined = undefined;

empty = undefined; // ❌ Type 'undefined' is not assignable to type 'null'
missing = 0;       // ❌ Type 'number' is not assignable to type 'undefined'

// Смысловая разница:
// undefined — «значение ещё не присвоили» (так выглядит пустая переменная);
// null      — «намеренно пусто», мы сами сказали «здесь ничего нет».`;

  protected readonly wrapperTypesExample = `// ПРАВИЛЬНО — строчные имена примитивов:
let price: number = 100;
let name: string = 'Book';
let ok: boolean = true;

// НЕПРАВИЛЬНО — заглавные имена. Это типы объектов-обёрток, а не примитивы:
let wrong: Number = 100;    // формально пройдёт, но так делать НЕ надо
let back: number = wrong;   // ❌ 'Number' is not assignable to 'number'
                            //    объект-обёртка ≠ примитив, обратно не влезает`;

  protected readonly strictNullExample = `// При strict (флаг strictNullChecks) null и undefined НЕ прячутся
// внутри других типов — их нельзя присвоить незаметно.
let title: string = 'Заметки';
title = null; // ❌ Type 'null' is not assignable to type 'string'

// Хотите разрешить пустое значение — скажите об этом явно через | (union):
let subtitle: string | null = 'Черновик';
subtitle = null; // OK — мы сами это разрешили в типе`;

  protected readonly inferenceExample = `// Тип часто можно НЕ писать — TypeScript выведет его сам из значения.
let count = 0;       // выведен number
let city = 'Москва'; // выведен string
let done = false;    // выведен boolean

count = 'нет'; // ❌ ошибка остаётся: count уже стал number

// Явная аннотация нужна там, где значения при объявлении ещё нет:
let userId: number;  // тип задаём вручную, значение появится позже`;
}
