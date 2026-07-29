import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-readonly-static',
  imports: [CodeBlock, RouterLink],
  templateUrl: './readonly-static.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesReadonlyStatic {
  protected readonly userReadonly = `// readonly-поле задают ОДИН раз — и больше никогда не меняют.
// Заполнить его разрешено только в двух местах:
class User {
  // Способ 1: значение прямо в объявлении (одинаковое для всех)
  readonly role: string = 'user';

  // Способ 2 (самый частый): значение приходит в конструкторе —
  // у каждого объекта своё
  readonly id: number;

  constructor(id: number) {
    this.id = id; // ✅ присвоить в конструкторе МОЖНО: идёт «сборка» объекта
  }
}

const u = new User(7);

console.log(u.id);   // ✅ читать readonly можно сколько угодно → 7
console.log(u.role); // ✅ → 'user'`;

  protected readonly readonlyReassign = `const u = new User(7);

u.id = 2;
// ❌ Cannot assign to 'id' because it is a read-only property.
//    Поле «залито в бетон»: после сборки объект уже собран — не переставить.

// Даже ИЗНУТРИ методов класса переприсвоить нельзя.
// readonly разрешает запись ТОЛЬКО в конструкторе:
class User2 {
  readonly id: number;

  constructor(id: number) {
    this.id = id;        // ✅ ок — это конструктор
  }

  rename(newId: number) {
    this.id = newId;
    // ❌ Cannot assign to 'id' because it is a read-only property.
    //    Метод — это уже «после сборки», менять поздно.
  }
}`;

  protected readonly readonlyShallow = `// ВАЖНАЯ тонкость: readonly запрещает менять САМО поле (ссылку),
// но НЕ запрещает менять то, на что поле указывает.
// Замок висит на самой ссылке, а не на её содержимом.
class Account {
  readonly owner: { name: string };
  readonly tags: string[];

  constructor(name: string) {
    this.owner = { name };
    this.tags = [];
  }
}

const acc = new Account('Анна');

acc.owner = { name: 'Пётр' };
// ❌ Cannot assign to 'owner' because it is a read-only property.
//    Переставить саму ссылку на другой объект нельзя.

acc.owner.name = 'Пётр'; // ✅ (!) ошибки НЕТ — меняем ВНУТРЕННОСТИ объекта
acc.tags.push('vip');    // ✅ (!) массив тот же самый — просто пополнили его
// Вывод: readonly «поверхностный». Нужна и защита содержимого —
// смотрите ReadonlyArray и readonly-типы отдельно.`;

  protected readonly readonlyVsConst = `// const и readonly решают ПОХОЖУЮ задачу («не переприсваивать»),
// но живут в разных местах и не заменяют друг друга.

// const — про ПЕРЕМЕННУЮ: нельзя переприсвоить саму переменную.
const pi = 3.14;
// pi = 3.15;
// ❌ Cannot assign to 'pi' because it is a constant.

// readonly — про СВОЙСТВО объекта/класса: нельзя переприсвоить поле.
class Circle {
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius; // ✅ первое присвоение — в конструкторе
  }
}

// Внутри класса своего «const-поля» не бывает: у переменных — const,
// у полей — readonly. Это две стороны одной идеи «поставил раз — не трогай».`;

  protected readonly staticBasics = `// static-член принадлежит САМОМУ КЛАССУ, а не отдельному объекту.
// Аналогия: общая доска объявлений — одна на весь класс, а не у каждого своя.
class User {
  static total = 0; // счётчик всех созданных пользователей — ОДИН на класс
  readonly id: number;

  constructor() {
    User.total += 1;   // на каждом new пополняем ОБЩИЙ счётчик
    this.id = User.total;
  }
}

new User(); // total стал 1
new User(); // total стал 2
new User(); // total стал 3

console.log(User.total); // ✅ 3 — обращаемся ЧЕРЕЗ ИМЯ КЛАССА: User.total`;

  protected readonly staticViaInstance = `const u = new User();

u.total;
// ❌ Property 'total' does not exist on type 'User'.
//    total лежит на КЛАССЕ (User.total), а не на объекте u.
//    У экземпляра его нет — искать надо на «доске объявлений» класса.

console.log(User.total); // ✅ вот так правильно — через имя класса`;

  protected readonly staticFactory = `// static-метод — общий инструмент класса, доступный БЕЗ new.
// Частый приём — ФАБРИКА: метод сам собирает и возвращает готовый объект.
class User {
  readonly id: number;
  readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  // Фабрика гостя: не надо помнить, какими должны быть id и имя гостя
  static createGuest(): User {
    return new User(0, 'Гость');
  }
}

const guest = User.createGuest(); // ✅ зовём ЧЕРЕЗ КЛАСС, без new
console.log(guest.name);          // → 'Гость'`;

  protected readonly staticUtil = `// Утилита — static-метод, которому не нужен конкретный объект.
// Ему не с чем работать «изнутри», он просто считает по входным данным.
class MathUtils {
  // приватный конструктор + только static-члены = «ящик с инструментами»,
  // экземпляры которого создавать незачем
  private constructor() {}

  // прижать число к диапазону [min, max]
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

MathUtils.clamp(120, 0, 100); // ✅ → 100, зовём прямо у класса

new MathUtils();
// ❌ Constructor of class 'MathUtils' is private and only accessible
//    within the class declaration.  Объект тут и не нужен.`;

  protected readonly staticReadonlyConst = `// static + readonly вместе = КОНСТАНТА КЛАССА:
// одна на весь класс (static) и неизменяемая (readonly).
class Circle {
  static readonly PI = 3.14159; // общая константа — менять никому нельзя
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  area(): number {
    return Circle.PI * this.radius ** 2; // берём константу ЧЕРЕЗ КЛАСС
  }
}

console.log(Circle.PI); // ✅ читать можно → 3.14159

Circle.PI = 3;
// ❌ Cannot assign to 'PI' because it is a read-only property.
//    Константу класса не переставить — как и любое readonly-поле.`;

  protected readonly instanceVsStatic = `// Наглядно на банковском счёте: что своё у каждого, а что — общее.
class BankAccount {
  static bankName = 'МойБанк';  // общее имя банка — static (одно на класс)
  static totalAccounts = 0;     // сколько всего счетов открыто — static

  readonly owner: string;       // у каждого счёта СВОЙ владелец — instance
  balance: number;              // у каждого счёта СВОЙ баланс — instance

  constructor(owner: string) {
    this.owner = owner;
    this.balance = 0;
    BankAccount.totalAccounts += 1; // пополнили ОБЩИЙ счётчик счетов
  }
}

const a = new BankAccount('Анна');
const b = new BankAccount('Борис');

a.balance = 100;        // меняет ТОЛЬКО баланс Анны
console.log(b.balance); // → 0, у Бориса баланс свой и независимый

console.log(BankAccount.totalAccounts); // → 2, счётчик ОБЩИЙ на весь класс
console.log(a.owner, b.owner);          // → 'Анна' 'Борис', у каждого своё`;
}
