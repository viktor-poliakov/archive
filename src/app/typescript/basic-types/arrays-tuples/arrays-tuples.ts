import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-basic-types-arrays-tuples',
  imports: [CodeBlock, RouterLink],
  templateUrl: './arrays-tuples.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class BasicTypesArraysTuples {
  protected readonly arrayDeclare = `// Два способа записать «массив чисел» — они ПОЛНОСТЬЮ эквивалентны
let scores: number[] = [10, 20, 30];
let sameScores: Array<number> = [10, 20, 30];

// Массив строк
let names: string[] = ["Аня", "Петя", "Максим"];

// Пустой массив тоже валиден — тип задаёт, ЧЕМ его можно наполнять
let empty: number[] = [];
empty.push(1); // ок
empty.push(2); // ок`;

  protected readonly arrayUsage = `let scores: number[] = [10, 20, 30];

scores.push(40);       // ок — добавили число
let first = scores[0]; // тип number
scores[1] = 25;        // ок — заменили число на число

scores.push("50");     // ❌ строку нельзя: ждём number
scores[0] = true;      // ❌ Type 'boolean' is not assignable to type 'number'

// Массив бесконечно растяжим: элементов сколько угодно,
// но КАЖДЫЙ обязан быть number
scores.push(50, 60, 70); // ок`;

  protected readonly unionArray = `// Массив, где элементы бывают ДВУХ типов — строки И числа вперемешку
let mixed: (string | number)[] = [1, "два", 3, "четыре"];
mixed.push(5);       // ок
mixed.push("шесть"); // ок
mixed.push(true);    // ❌ boolean не входит в (string | number)

// ⚠️ Скобки решают всё! Без них смысл СОВСЕМ другой:
let wrong: string | number[];
wrong = "привет";   // ок — целиком строка
wrong = [1, 2, 3];  // ок — целиком массив чисел
wrong = ["a", "b"]; // ❌ это не строка и не массив ЧИСЕЛ`;

  protected readonly readonlyArray = `// readonly-массив: читать можно, менять — нельзя
let ro: readonly number[] = [10, 20, 30];
let sameRo: ReadonlyArray<number> = [10, 20, 30]; // эквивалентная запись

console.log(ro[0]);      // ок — чтение разрешено
console.log(ro.length);  // ок

ro.push(40); // ❌ Property 'push' does not exist on type 'readonly number[]'
ro[0] = 99;  // ❌ Index signature ... only permits reading
ro.sort();   // ❌ sort мутирует массив — метода нет в readonly`;

  protected readonly readonlyWhy = `// Зачем: функция физически не сможет испортить чужой массив
function printAll(items: readonly string[]): void {
  // items.push("x"); // ❌ даже случайно не получится
  for (const item of items) {
    console.log(item);
  }
}

// Немутирующие методы возвращают НОВЫЙ массив и работают как обычно
let nums: readonly number[] = [3, 1, 2];
let sorted = nums.toSorted();      // [1, 2, 3] — оригинал цел
let doubled = nums.map((n) => n * 2); // [6, 2, 4] — тоже ок`;

  protected readonly tupleBasic = `// Кортеж: фиксированная длина + тип на КАЖДОЙ позиции
let user: [string, number] = ["Аня", 30];

let name = user[0]; // тип string
let age = user[1];  // тип number

// Позиция определяет тип — порядок имеет значение
let point: [number, number] = [10, 20];`;

  protected readonly tupleErrors = `let user: [string, number] = ["Аня", 30];

let wrongOrder: [string, number] = [30, "Аня"]; // ❌ на позиции 0 ждём string
let tooShort:   [string, number] = ["Аня"];       // ❌ не хватает элемента (нужно ровно 2)
let tooLong:    [string, number] = ["Аня", 30, true]; // ❌ лишний элемент

user[2]; // ❌ Tuple type '[string, number]' has no element at index '2'`;

  protected readonly namedTuple = `// Без имён — непонятно, что есть что
let raw: [string, number] = ["Аня", 30];

// С именами — читается как документация (на РАБОТУ кода имена не влияют)
let user: [name: string, age: number] = ["Аня", 30];

// Особенно полезно для параметров-кортежей: имена всплывают в подсказках
function move(...args: [x: number, y: number]): void {
  console.log(args[0], args[1]); // редактор подпишет их как x и y
}`;

  protected readonly optionalTuple = `// '?' делает ХВОСТОВЫЕ элементы необязательными
let coord: [number, number, number?] = [10, 20];
coord = [10, 20, 30]; // тоже ок — z указали

// Тип опционального элемента включает undefined
let z = coord[2]; // тип number | undefined

// Обязательный элемент нельзя ставить ПОСЛЕ опционального:
// let bad: [number?, number] = [1, 2]; // ❌ required element cannot follow an optional element`;

  protected readonly restTuple = `// rest-элемент '...' — «дальше сколько угодно значений этого типа»
// Первая позиция — метка (string), остальные — числа
let record: [string, ...number[]] = ["температура", 20, 21, 19, 22];
record = ["пусто"];    // ок — чисел может быть ноль
record = ["один", 42]; // ок

// Именно так типизируются аргументы функции с ...rest
function sum(label: string, ...nums: number[]): void {
  console.log(label, nums.reduce((a, b) => a + b, 0));
}`;

  protected readonly keyValuePractice = `// Пара «ключ-значение» — классический случай для кортежа
type Entry = [key: string, value: number];

const ages: Entry[] = [
  ["Аня", 30],
  ["Петя", 25],
];

// Object.entries возвращает именно массив кортежей [string, T]
const user = { name: "Аня", age: 30 };
for (const [key, value] of Object.entries(user)) {
  console.log(key, "=", value); // деструктурируем кортеж по позициям
}

// Map тоже строится из пар «ключ-значение»
const scores = new Map<string, number>([
  ["math", 5],
  ["history", 4],
]);`;

  protected readonly useStatePractice = `// Возврат НЕСКОЛЬКИХ значений разных типов — тоже кортеж.
// Так устроен useState в React: [значение, функция-сеттер]
function useCounter(start: number): [number, () => void] {
  let value = start;
  const increment = () => {
    value += 1;
  };
  return [value, increment];
}

// Деструктурируем по позициям и даём СВОИ имена — как const [count, setCount]
const [count, increment] = useCounter(0);
console.log(count); // тип number
increment();        // тип () => void`;
}
