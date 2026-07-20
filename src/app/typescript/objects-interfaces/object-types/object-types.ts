import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-object-types',
  imports: [CodeBlock, RouterLink],
  templateUrl: './object-types.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesObjectTypes {
  protected readonly shapeExample = `// Тип объекта описывает ФОРМУ значения:
// какие поля в нём есть и какого каждое из них типа.
// Пишется прямо в аннотации, в фигурных скобках.
let user: { name: string; age: number } = {
  name: 'Аня',
  age: 30,
};

user.name; // string — TypeScript знает про поле name
user.age;  // number — и про age тоже

user.email; // ❌ Property 'email' does not exist on type
            //    '{ name: string; age: number; }'
            //    поля email в форме нет — обращаться нельзя`;

  protected readonly separatorsExample = `// Свойства можно разделять тремя способами — они равнозначны.

// 1) точка с запятой — привычно для записи в одну строку
let a: { x: number; y: number };

// 2) запятая — тоже допустима
let b: { x: number, y: number };

// 3) перенос строки — разделитель между полями можно вообще опустить
let c: {
  x: number
  y: number
};

// Все три переменные a, b и c имеют один и тот же тип.`;

  protected readonly nestedExample = `// Значением поля может быть снова объект — так получаются вложенные типы.
let order: {
  id: number;
  customer: { name: string; vip: boolean }; // объект внутри объекта
} = {
  id: 1,
  customer: { name: 'Борис', vip: true },
};

order.customer.name; // string — идём вглубь через точку
order.customer.vip;  // boolean

order.customer.age;  // ❌ Property 'age' does not exist —
                     //    во вложенной форме есть только name и vip`;

  protected readonly checksExample = `let point: { x: number; y: number };

// ❌ пропущено обязательное поле y
point = { x: 10 };
// Property 'y' is missing in type '{ x: number; }'
// but required in type '{ x: number; y: number; }'

// ❌ поле есть, но неверного типа
point = { x: 10, y: 'верх' };
// Type 'string' is not assignable to type 'number'

// ✅ все поля на месте и нужных типов
point = { x: 10, y: 20 };`;

  protected readonly excessExample = `let user: { name: string };

// ❌ лишнее поле у ОБЪЕКТНОГО ЛИТЕРАЛА прямо при присваивании
user = { name: 'Аня', age: 30 };
// Object literal may only specify known properties,
// and 'age' does not exist in type '{ name: string; }'

// А через промежуточную переменную то же лишнее поле проходит:
let full = { name: 'Аня', age: 30 };
user = full; // OK — здесь работает обычное структурное правило`;

  protected readonly typeVsValueExample = `// СЛЕВА от знака = стоит ТИП (описание формы, только для проверки),
// СПРАВА — ЗНАЧЕНИЕ (реальные данные, которые будут в памяти).
let box: { size: number } = { size: 10 };
//        \\_____ тип _____/   \\_ значение _/

// Тип и значение пишутся похоже (и там и там фигурные скобки),
// но это РАЗНЫЕ вещи:
//   тип       — исчезает после компиляции, в рантайме его нет;
//   значение  — то, что реально существует во время работы программы.`;

  protected readonly paramExample = `// Тип объекта можно поставить прямо в списке параметров функции.
function greet(user: { name: string; age: number }): string {
  return \`Привет, \${user.name}! Тебе \${user.age}.\`;
}

greet({ name: 'Аня', age: 30 }); // 'Привет, Аня! Тебе 30.'

greet({ name: 'Аня' }); // ❌ Property 'age' is missing
                        //    функция ждёт объект С полем age`;

  protected readonly returnExample = `// Тип объекта как возвращаемое значение — после круглых скобок.
function makePoint(x: number, y: number): { x: number; y: number } {
  return { x, y }; // сокращённая запись: { x: x, y: y }
}

const p = makePoint(3, 4);
p.x; // number — TypeScript знает форму результата
p.y; // number`;

  protected readonly verboseExample = `// Инлайновый тип приходится повторять в каждой сигнатуре — громоздко
// и легко ошибиться, если форма где-то разойдётся:
function distance(p: { x: number; y: number }): number {
  return Math.hypot(p.x, p.y);
}
function move(p: { x: number; y: number }): { x: number; y: number } {
  return { x: p.x + 1, y: p.y + 1 };
}

// Решение — вынести форму в ИМЯ и переиспользовать его:
interface Point { x: number; y: number }

function distance2(p: Point): number {
  return Math.hypot(p.x, p.y);
}
function move2(p: Point): Point {
  return { x: p.x + 1, y: p.y + 1 };
}`;
}
