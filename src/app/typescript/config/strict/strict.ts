import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-config-strict',
  imports: [CodeBlock, RouterLink],
  templateUrl: './strict.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptConfigStrict {
  protected readonly enableJson = `{
  "compilerOptions": {
    "strict": true
  }
}`;

  protected readonly buggyLoose = `// БЕЗ строгого режима компилятор закрывает глаза на две опасные вещи.
// Код ниже спокойно соберётся — а потом упадёт у пользователя.

// 1) Параметр без типа. Компилятор молча считает его "any" (любым).
function double(x) {
  return x * 2;
}

// 2) Значение может быть null, но проверок нет.
function greet(name: string | null) {
  return 'Привет, ' + name.toUpperCase(); // а если name === null?
}

double('пять');   // вернёт NaN — ошиблись типом, но никто не предупредил
greet(null);      // 💥 TypeError: Cannot read properties of null (в рантайме!)`;

  protected readonly strictCatches = `// СО строгим режимом обе ошибки видны сразу в редакторе, ещё до запуска.

function double(x) {
  //          ^ ❌ TS7006: Parameter 'x' implicitly has an 'any' type.
  return x * 2;
}

function greet(name: string | null) {
  return 'Привет, ' + name.toUpperCase();
  //                  ^^^^ ❌ TS18047: 'name' is possibly 'null'.
}

// Компилятор заставляет всё исправить ДО того, как код попадёт к пользователю:
function doubleFixed(x: number) {   // указали тип
  return x * 2;
}
function greetFixed(name: string | null) {
  if (name === null) return 'Привет, гость';  // проверили null
  return 'Привет, ' + name.toUpperCase();      // тут name точно строка
}`;

  protected readonly subNoImplicitAny = `// noImplicitAny — «нет молчаливому any».
// Если компилятор не может сам вывести тип, он ТРЕБУЕТ указать его явно,
// а не подставлять тайком any (который отключает все проверки).

function save(data) {          // ❌ Parameter 'data' implicitly has an 'any' type.
  localStorage.setItem('x', data);
}

function saveOk(data: string) { // ✅ тип указан — проверки работают
  localStorage.setItem('x', data);
}`;

  protected readonly subNullChecks = `// strictNullChecks — самая важная проверка. Без неё null и undefined
// «прячутся» в любом типе, и обращение к ним падает в рантайме.
// С ней null/undefined нужно ОБРАБОТАТЬ явно.

interface User {
  name: string;
  nickname: string | null; // ник может отсутствовать
}

function show(user: User) {
  console.log(user.name.length);     // ✅ name всегда строка
  console.log(user.nickname.length); // ❌ 'user.nickname' is possibly 'null'.
}

// Как исправить — проверить перед использованием:
function showOk(user: User) {
  if (user.nickname !== null) {
    console.log(user.nickname.length); // здесь ник точно есть
  }
  console.log(user.nickname?.length);  // или короткий безопасный доступ ?.
}`;

  protected readonly subPropInit = `// strictPropertyInitialization — поле класса должно быть ЗАПОЛНЕНО:
// либо значением при объявлении, либо в конструкторе. Иначе оно undefined,
// хотя по типу обещано string — та же ловушка, что с null.

class Account {
  balance: number;  // ❌ Property 'balance' has no initializer
                    //    and is not definitely assigned in the constructor.
}

class AccountOk {
  balance: number;
  constructor() {
    this.balance = 0; // ✅ задали в конструкторе
  }
}

class AccountOk2 {
  balance = 0; // ✅ или сразу при объявлении
}`;

  protected readonly overrideOne = `{
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": false
  }
}`;

  protected readonly subFlagsList = `// strict — это НЕ одна проверка, а сразу пакет. Включая strict, вы включаете:
//
//   noImplicitAny                 — запрет молчаливого any
//   strictNullChecks              — null/undefined надо обрабатывать
//   strictFunctionTypes           — строгая проверка типов функций
//   strictBindCallApply           — строгие call / apply / bind
//   strictPropertyInitialization  — поля класса должны быть заполнены
//   noImplicitThis                — запрет this неясного типа
//   alwaysStrict                  — 'use strict' в каждом файле
//   useUnknownInCatchVariables    — ошибка в catch имеет тип unknown, не any
//   ...и ещё пара мелких
//
// Каждую можно включать и по отдельности, но "strict": true — это «включить всё разом».`;
}
