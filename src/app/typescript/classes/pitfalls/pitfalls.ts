import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesPitfalls {
  protected readonly lostThis = `// Метод опирается на this — «этот самый объект».
class Timer {
  seconds = 0;

  tick(): void {
    this.seconds++;            // всё держится на this
    console.log(this.seconds);
  }
}

const timer = new Timer();

timer.tick(); // ✅ вызвали «через точку» — this === timer, всё работает

// А теперь ОТОРВЁМ метод от объекта — положим его в переменную:
const fn = timer.tick;
fn();
// 💥 в рантайме: Cannot read properties of undefined (reading 'seconds')
//    this больше не timer — метод вызвали «сам по себе», без объекта слева.

// То же самое случается, когда метод передают как КОЛБЭК —
// его тоже позовут «отдельно», без точки:
setInterval(timer.tick, 1000);
// 💥 та же беда: внутри setInterval this уже не timer.`;

  protected readonly lostThisFix = `// Лекарство 1 — стрелочное поле-метод: this «приклеен» к объекту навсегда.
class Timer {
  seconds = 0;

  tick = (): void => {
    this.seconds++; // у стрелки нет своего this — она берёт его из объекта
  };
}

const timer = new Timer();
const fn = timer.tick;
fn();                          // ✅ this всё ещё timer — стрелка его запомнила
setInterval(timer.tick, 1000); // ✅ работает и как колбэк

// Лекарство 2 — .bind(this): делает копию метода с зафиксированным this.
class Clock {
  seconds = 0;
  tick(): void {
    this.seconds++;
  }
}

const clock = new Clock();
const bound = clock.tick.bind(clock); // навсегда привязали this к clock
setInterval(bound, 1000);             // ✅ this внутри — точно clock`;

  protected readonly missingOverride = `class Animal {
  speak(): string {
    return 'какой-то звук';
  }
}

// Переопределяем speak в наследнике, но ЗАБЫЛИ ключевое слово override:
class Dog extends Animal {
  speak(): string {
    return 'Гав';
  }
  // ❌ This member must have an override modifier because it overrides
  //    a member in the base class 'Animal'.
  //    (в проекте включён noImplicitOverride — слово override обязательно)
}

// ✅ Правильно — явно помечаем перекрытие словом override:
class Cat extends Animal {
  override speak(): string {
    return 'Мяу';
  }
}

// Обратная ошибка: override на методе, которого в базе НЕТ:
class Fish extends Animal {
  override swim(): string {
    return 'плыву';
  }
  // ❌ This member cannot have an override modifier because it is not
  //    declared in the base class 'Animal'.
}`;

  protected readonly privateLeak = `// Модификатор private в TypeScript — это «табличка НЕ ТРОГАТЬ», а не замок.
class Account {
  private secret = 'pin-1234';
}

const acc = new Account();

acc.secret;
// ❌ Property 'secret' is private and only accessible within class 'Account'.

// Лазейка №1 — обращение через КВАДРАТНЫЕ СКОБКИ. Компилятор её ПРОПУСКАЕТ:
const leaked = acc['secret']; // ✅ ошибки НЕТ, leaked === 'pin-1234'

// Лазейка №2 — рантайм. Модификатор private стирается при компиляции,
// поэтому в готовом JavaScript поле открыто нараспашку:
console.log((acc as any).secret); // 'pin-1234' — в рантайме приватности НЕТ`;

  protected readonly hardPrivate = `// #private (приватные поля ECMAScript) — НАСТОЯЩИЙ замок.
class SafeAccount {
  #secret = 'pin-1234';

  // Изнутри класса поле доступно сколько угодно:
  check(input: string): boolean {
    return this.#secret === input;
  }
}

const acc = new SafeAccount();

acc.#secret;
// ❌ Property '#secret' is not accessible outside class 'SafeAccount'
//    because it has a private identifier.

// Лазейки из прошлого примера здесь НЕ работают: поля #secret нет среди
// обычных свойств объекта — до него не добраться ни скобками, ни (acc as any).
// Приватность настоящая — и на компиляции, и в рантайме.
acc.check('pin-1234'); // ✅ работать с полем можно только изнутри класса`;

  protected readonly missingSuper = `class Animal {
  constructor(public name: string) {}
}

// 1) Забыли вызвать super() в конструкторе наследника:
class Dog extends Animal {
  constructor() {
    // здесь должен был быть super('Рекс') — а его нет!
  }
  // ❌ Constructors for derived classes must contain a super call.
}

// 2) Обратиться к this ДО вызова super() тоже нельзя — объект ещё не достроен:
class Cat extends Animal {
  legs = 4;
  constructor() {
    this.legs = 3;
    // ❌ 'super' must be called before accessing 'this' in the
    //    constructor of a derived class.
    super('Мурка');
  }
}

// ✅ Правильно: сначала super(...), и только потом трогаем this:
class Fox extends Animal {
  color = 'рыжий';
  constructor() {
    super('Лиса');           // сперва «заводим» базовый конструктор
    this.color = 'огненный'; // теперь this доступен
  }
}`;

  protected readonly thisInStatic = `// this внутри СТАТИЧЕСКОГО метода — это сам класс, а не экземпляр.
class Counter {
  static total = 0;

  static increment(): void {
    this.total++; // this === Counter, то же самое, что Counter.total++
  }
}

Counter.increment();
Counter.increment();
console.log(Counter.total); // 2

// А вот опереться в static-методе на поле ЭКЗЕМПЛЯРА не выйдет:
class Wrong {
  value = 10; // это поле экземпляра

  static show(): void {
    console.log(this.value);
    // ❌ Property 'value' does not exist on type 'typeof Wrong'.
    //    this здесь — класс Wrong, а не объект; поля value у класса нет.
  }
}`;

  protected readonly staticViaInstance = `class Counter {
  static total = 0; // принадлежит КЛАССУ
  step = 1;         // принадлежит ЭКЗЕМПЛЯРУ
}

const c = new Counter();

c.total;
// ❌ Property 'total' does not exist on type 'Counter'.
//    total — статическое поле, оно на классе, а не на экземпляре.

Counter.total; // ✅ так правильно — обращаемся через класс
c.step;        // ✅ step — поле экземпляра, оно на объекте`;

  protected readonly readonlyShallow = `class Config {
  readonly id = 1;
  readonly db = { host: 'localhost', port: 5432 };
}

const cfg = new Config();

cfg.id = 2;
// ❌ Cannot assign to 'id' because it is a read-only property.

cfg.db = { host: 'other', port: 1 };
// ❌ Cannot assign to 'db' because it is a read-only property.

// НО readonly защищает только САМО поле (ссылку), а не содержимое объекта:
cfg.db.host = 'remote'; // ✅ ошибки НЕТ — внутренности db изменяемы!
cfg.db.port = 9999;     // ✅ тоже проходит
// readonly «неглубокий»: заморожена ссылка, а не то, что лежит внутри.`;

  protected readonly arrowVsPrototype = `class Button {
  label = 'OK';

  // Обычный метод: живёт в ПРОТОТИПЕ класса — один на все экземпляры.
  onClick(): void {
    console.log(this.label);
  }

  // Стрелочное поле-метод: СВОЯ копия в КАЖДОМ экземпляре,
  // зато this приклеен намертво (см. пункт 1 — не теряется в колбэках).
  onClickArrow = (): void => {
    console.log(this.label);
  };
}

const a = new Button();
const b = new Button();

// onClick общий: у a и b это буквально одна и та же функция из прототипа
console.log(a.onClick === b.onClick); // true  — память экономится

// onClickArrow — у каждого экземпляра своя отдельная функция
console.log(a.onClickArrow === b.onClickArrow); // false — по копии на объект
// 1000 кнопок → 1000 копий стрелки. Это и есть плата за «неотрываемый» this.`;

  protected readonly strictInit = `// ⚠ Этот пример — про СТРОГИЙ режим (strict: true). В ЭТОМ проекте strict
// ВЫКЛЮЧЕН, поэтому здесь ошибки не будет — но знать о ней важно.
class User {
  name: string; // ни значения при объявлении, ни присваивания в конструкторе
  // ❌ (при strict) Property 'name' has no initializer and is not
  //    definitely assigned in the constructor.
  // Иначе поле окажется undefined, хотя тип обещает string.
}

// Чинится одним из двух способов:
class UserA {
  name = ''; // 1) задать значение сразу при объявлении
}

class UserB {
  name: string;
  constructor(name: string) {
    this.name = name; // 2) присвоить в конструкторе
  }
}`;
}
