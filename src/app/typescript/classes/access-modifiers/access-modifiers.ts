import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-access-modifiers',
  imports: [CodeBlock, RouterLink],
  templateUrl: './access-modifiers.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesAccessModifiers {
  protected readonly whyEncapsulation = `// Счёт БЕЗ инкапсуляции: поле balance открыто всем.
// Модификатор не написан — значит поле public (доступно отовсюду).
class OpenAccount {
  balance: number;

  constructor(initial: number) {
    this.balance = initial;
  }
}

const acc = new OpenAccount(1000);

// Беда: любой код снаружи может напрямую испортить баланс.
// Никакой защиты, никаких проверок:
acc.balance = -999999; // ✅ компилятор молчит, но данные разрушены
acc.balance = NaN;     // ✅ и это «пройдёт» — а счёт стал бессмысленным

// Правилу «баланс не бывает отрицательным» просто негде жить:
// поле нараспашку, и его меняют в обход любых проверок.
// Решение — спрятать поле и пускать к нему только через методы.`;

  protected readonly publicUser = `// public — «кнопки на панели прибора»: их для того и сделали,
// чтобы нажимать снаружи. Это уровень доступа ПО УМОЛЧАНИЮ:
// если модификатор не написан, поле/метод считаются public.
class User {
  name: string;          // public неявно (модификатор опущен)
  public email: string;  // то же самое, но написано явно

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  greet(): string {      // метод тоже public по умолчанию
    return \`Привет, \${this.name}!\`;
  }
}

const user = new User('Анна', 'anna@mail.ru');
user.name;             // ✅ читаем снаружи
user.email = 'a@b.ru'; // ✅ меняем снаружи
user.greet();          // ✅ вызываем снаружи
// public ничего не прячет — доступ открыт всем и везде.`;

  protected readonly privateBank = `// private balance — «проводка под крышкой»: снаружи не достать.
// Поле прячем, а наружу оставляем только безопасные «кнопки»-методы.
class BankAccount {
  private balance: number;

  constructor(initial: number) {
    this.balance = initial;
  }

  // Пополнить — только через метод, с проверкой:
  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Сумма должна быть положительной');
    this.balance += amount;
  }

  // Снять — с проверкой, что средств хватает:
  withdraw(amount: number): void {
    if (amount > this.balance) throw new Error('Недостаточно средств');
    this.balance -= amount;
  }

  // Узнать баланс — только чтение, менять напрямую нельзя:
  getBalance(): number {
    return this.balance; // ✅ внутри класса private доступен
  }
}

const acc = new BankAccount(1000);
acc.deposit(500);  // ✅ через «кнопку» можно
acc.getBalance();  // ✅ 1500

acc.balance = -100;
// ❌ Property 'balance' is private and only accessible within class 'BankAccount'.
acc.balance;
// ❌ Property 'balance' is private and only accessible within class 'BankAccount'.
//    Снаружи к private не подобраться — данные под защитой.`;

  protected readonly privateBetweenInstances = `// Тонкость: private закрыт для ВНЕШНЕГО кода, но открыт ВНУТРИ класса —
// в том числе для ДРУГОГО экземпляра того же класса.
class BankAccount {
  private balance: number;

  constructor(initial: number) {
    this.balance = initial;
  }

  // Сравнить свой счёт с чужим:
  richerThan(other: BankAccount): boolean {
    // other.balance — чужой экземпляр, но класс тот же → доступ есть
    return this.balance > other.balance; // ✅ ошибки нет
  }
}

const a = new BankAccount(1000);
const b = new BankAccount(500);
a.richerThan(b); // ✅ true

a.balance;
// ❌ Property 'balance' is private and only accessible within class 'BankAccount'.
//    Снаружи — по-прежнему нельзя. private = «только код этого класса».`;

  protected readonly protectedInheritance = `// protected — как private, НО открыт ещё и наследникам.
// «Ремонтник из сервиса» (подкласс) снимает крышку и видит часть
// внутренностей, скрытых от обычного пользователя снаружи.
class BankAccount {
  protected balance: number;

  constructor(initial: number) {
    this.balance = initial;
  }

  getBalance(): number {
    return this.balance;
  }
}

// Наследник — вклад с процентами:
class SavingsAccount extends BankAccount {
  // Начислить проценты: наследнику balance ДОСТУПЕН (protected):
  addInterest(rate: number): void {
    this.balance += this.balance * rate; // ✅ доступ из наследника есть
  }
}

const savings = new SavingsAccount(1000);
savings.addInterest(0.05); // ✅ баланс стал 1050
savings.getBalance();      // ✅ 1050

savings.balance;
// ❌ Property 'balance' is protected and only accessible within class
//    'BankAccount' and its subclasses.
//    Снаружи protected закрыт так же, как private.`;

  protected readonly hashPin = `// #private (приватные поля ECMAScript) — имя начинается с решётки #.
// Это НАСТОЯЩАЯ приватность: закрыто и на компиляции, и в рантайме.
class BankCard {
  #pin: string; // приватное поле, живёт только внутри класса

  constructor(pin: string) {
    this.#pin = pin;
  }

  // Проверить пин — сравнение происходит ВНУТРИ класса:
  check(input: string): boolean {
    return input === this.#pin; // ✅ внутри #pin доступен
  }
}

const card = new BankCard('1234');
card.check('1234'); // ✅ true

card.#pin;
// ❌ Property '#pin' is not accessible outside class 'BankCard'
//    because it has a private identifier.`;

  protected readonly tsPrivateVsHashRuntime = `// В чём разница private и #private? В РАНТАЙМЕ.
// TS-модификатор private существует только на этапе компиляции —
// при сборке в JavaScript он СТИРАЕТСЯ. Поэтому в готовом коде
// поле остаётся обычным и до него можно дотянуться в обход типов.
class WithTsPrivate {
  private secret = 'ключ TS';
}

class WithHashPrivate {
  #secret = 'ключ ES';
  reveal(): string {
    return this.#secret;
  }
}

const a = new WithTsPrivate();
// Приведение к any отключает проверку типов — и поле ВИДНО в рантайме:
console.log((a as any).secret); // ✅ выведет 'ключ TS' — приватность мнимая

const b = new WithHashPrivate();
console.log((b as any).secret); // undefined — снаружи такого поля просто НЕТ
// К #secret не подобраться ничем: настоящий барьер и в рантайме тоже.`;

  protected readonly privateBracketLeak = `// Ещё одна «дырка» TS-private: доступ через КВАДРАТНЫЕ СКОБКИ
// компилятор НЕ блокирует (в отличие от точки).
class BankAccount {
  private balance = 1000;
}

const acc = new BankAccount();

acc.balance;
// ❌ Property 'balance' is private and only accessible within class 'BankAccount'.

acc['balance'];
// ✅ ошибки НЕТ — TS пропускает доступ по строковому ключу.
//    Это известная лазейка. Хотите настоящую защиту — берите #private.`;

  protected readonly getterReadonly = `// Геттер get — «умное свойство только для чтения».
// Поле прячем в private, а наружу отдаём безопасный вид через get.
class BankAccount {
  private _balance: number;

  constructor(initial: number) {
    this._balance = initial;
  }

  deposit(amount: number): void {
    this._balance += amount;
  }

  // get balance() снаружи читается как обычное СВОЙСТВО: acc.balance
  // (без скобок!), но изменить его нельзя — сеттера нет.
  get balance(): number {
    return this._balance;
  }
}

const acc = new BankAccount(1000);
acc.deposit(500);
acc.balance; // ✅ 1500 — читаем как свойство, без ()

acc.balance = 0;
// ❌ Cannot assign to 'balance' because it is a read-only property.
//    Есть только get и нет set → свойство доступно лишь для чтения.`;

  protected readonly getterSetterUser = `// Пара get/set — контролируемый доступ и на чтение, и на запись.
// Сеттер set — идеальное место для ПРОВЕРКИ входных данных:
// снаружи это выглядит как обычное присваивание, а внутри стоит охрана.
class User {
  #email: string;

  constructor(email: string) {
    this.#email = email;
  }

  // Чтение значения:
  get email(): string {
    return this.#email;
  }

  // Запись с проверкой — мусор внутрь не попадёт:
  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('Некорректный email');
    }
    this.#email = value;
  }
}

const user = new User('anna@mail.ru');
user.email;            // ✅ 'anna@mail.ru' — читаем как свойство
user.email = 'a@b.ru'; // ✅ прошло проверку и записалось
user.email = 'битый';  // ✅ для компилятора ок (string), но в рантайме
//                        сеттер бросит Error — значения без '@' не проходят.`;

  protected readonly computedGetter = `// Геттер не обязан хранить своё поле — он может ВЫЧИСЛЯТЬ значение
// на лету из других данных. Снаружи это тоже выглядит как свойство.
class BankAccount {
  private _balance: number;
  private overdraftLimit: number;

  constructor(initial: number, overdraftLimit: number) {
    this._balance = initial;
    this.overdraftLimit = overdraftLimit;
  }

  get balance(): number {
    return this._balance;
  }

  // Вычисляемые свойства: своего поля нет — считаются из остальных.
  get isOverdrawn(): boolean {
    return this._balance < 0;
  }

  get available(): number {
    return this._balance + this.overdraftLimit;
  }
}

const acc = new BankAccount(-50, 200);
acc.isOverdrawn; // ✅ true — вычислено из balance
acc.available;   // ✅ 150  — balance + лимит овердрафта
// За «свойствами» acc.isOverdrawn и acc.available стоит логика,
// но снаружи разницы с обычным полем не видно.`;
}
