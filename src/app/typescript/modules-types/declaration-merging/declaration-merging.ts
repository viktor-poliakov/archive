import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-declaration-merging',
  imports: [CodeBlock, RouterLink],
  templateUrl: './declaration-merging.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesDeclarationMerging {
  protected readonly boxMerge = `// Объявляем интерфейс Box ДВА раза с одним и тем же именем.
// TypeScript не считает это ошибкой — он СКЛАДЫВАЕТ оба описания в одно.
interface Box {
  width: number;
}

interface Box {
  height: number;
}

// Теперь Box — это как будто мы написали сразу оба поля:
// interface Box { width: number; height: number }

const b: Box = { width: 100, height: 50 }; // ✅ нужны ОБА поля

const bad: Box = { width: 100 };
// ❌ Property 'height' is missing in type '{ width: number; }'
//    but required in type 'Box'.
// Поле height приехало из второго объявления — и теперь обязательно.`;

  protected readonly boxSpread = `// Объявления можно разнести по РАЗНЫМ местам файла (или проекта) —
// TypeScript всё равно соберёт их в одно досье под именем Box.

interface Box {
  width: number;
}

// ...сто строк другого кода...

interface Box {
  color: string;
}

// Итог — один тип с обоими полями:
const b: Box = { width: 100, color: 'red' }; // ✅`;

  protected readonly typeNoMerge = `// А вот type-псевдоним так НЕ умеет. Повторное объявление —
// это не «добавить листов в папку», а «завести вторую папку
// с тем же именем». TypeScript запрещает:

type Point = {
  x: number;
};

type Point = {
  y: number;
};
// ❌ Duplicate identifier 'Point'. (на ОБЕИХ строках с type Point)

// С type имя должно быть уникальным. Хотите объединить поля —
// делайте это вручную через пересечение (&):
type PointA = { x: number };
type PointB = { y: number };
type PointAB = PointA & PointB; // { x: number; y: number }`;

  protected readonly funcNamespace = `// Слияние бывает не только у интерфейсов. Пример: функция + namespace
// с одним именем. К функции «прикрепляют» статическое поле (как у функций
// в JS можно дописать свойство: greet.version = '1.0').

function greet(name: string): string {
  return 'Привет, ' + name;
}

namespace greet {
  export const version = '1.0';
}

// Теперь greet — это И функция, И «папка» со свойством version:
greet('Аня');   // ✅ вызов функции → 'Привет, Аня'
greet.version;  // ✅ '1.0' — статическое поле, прикреплённое к функции

// Так же сливаются namespace + namespace, interface + namespace,
// enum + namespace. Всё это — частные случаи одного механизма:
// «несколько объявлений с одним именем → одно целое».`;

  protected readonly windowGlobal = `// Самая частая ПОЛЬЗА слияния — дополнить ЧУЖОЙ тип, который нельзя
// править напрямую. Классика: глобальный объект window.

// Тип Window описан в стандартной библиотеке TS (lib.dom.d.ts).
// Мы не можем открыть тот файл и дописать туда своё поле —
// но можем ДОБАВИТЬ объявление к уже существующему интерфейсу Window.

interface MyApp {
  version: string;
  start(): void;
}

declare global {
  interface Window {
    myApp: MyApp; // подшиваем новое поле в существующий интерфейс Window
  }
}

// Теперь TypeScript знает про window.myApp и проверяет обращения к нему:
window.myApp.start();     // ✅ start() существует
window.myApp.versionX;
// ❌ Property 'versionX' does not exist on type 'MyApp'.

export {}; // делает файл модулем — это нужно для declare global`;

  protected readonly moduleAugment = `// Дополнение модуля (module augmentation): добавить поле в тип
// из СТОРОННЕЙ библиотеки. Пример: в Express у объекта запроса Request
// нет поля user, а нам нужно класть туда авторизованного пользователя.

import 'express'; // импорт делает файл модулем (обязательное условие)

interface User {
  id: number;
  name: string;
}

// Имя в 'declare module' — ТОЧНО как при импорте библиотеки.
declare module 'express' {
  // Расширяем существующий интерфейс Request из express:
  interface Request {
    user?: User;
  }
}

// После этого поле req.user видно во всём проекте и типизировано:
// app.get('/', (req, res) => {
//   req.user?.name; // ✅ string | undefined — TypeScript знает про поле
// });`;

  protected readonly openInterface = `// Почему библиотеки публикуют именно ИНТЕРФЕЙСЫ, а не type?
// Интерфейс «открыт»: к нему всегда можно добавить объявление и слить поля.
// type «закрыт»: имя занято, второй раз объявить нельзя.

// Библиотека объявляет пустую «точку расширения» — интерфейс:
//   interface Request {}          // внутри самой библиотеки
// А вы в своём коде дополняете её под свои нужды:
declare module 'my-lib' {
  interface Request {
    traceId: string; // ваше поле — слилось с тем, что объявила библиотека
  }
}

// Будь это 'type Request = {...}', дополнить его снаружи было бы нельзя:
// пришлось бы форкать библиотеку. Поэтому «открытость» интерфейса —
// не случайность, а специально оставленная дверца для расширения.`;
}
