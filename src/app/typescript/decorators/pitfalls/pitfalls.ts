import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-decorators-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptDecoratorsPitfalls {
  protected readonly onceVsEach = `// Путаница: думают, что тело декоратора выполняется на каждый вызов метода.
// На самом деле оно выполняется ОДИН раз — при объявлении класса.
function log(value: Function, context: ClassMethodDecoratorContext) {
  console.log('НАСТРОЙКА декоратора'); // ← напечатается 1 раз, при объявлении
  return function (this: any, ...args: any[]) {
    console.log('вызов метода');        // ← вот ЭТО на каждый вызов
    return value.apply(this, args);
  };
}

class Api {
  @log fetch() {}
}
// В консоли уже сейчас: «НАСТРОЙКА декоратора» — хотя fetch ещё не звали!

const api = new Api();
api.fetch(); // «вызов метода»
api.fetch(); // «вызов метода»`;

  protected readonly sharedState = `// Следствие «один раз»: переменная в теле декоратора — ОБЩАЯ для всех объектов.
// Хотим счётчик вызовов у каждого объекта, а получаем один на всех.

function countCalls(value: Function, context: ClassMethodDecoratorContext) {
  let count = 0; // ❌ создаётся ОДИН раз → общий для всех экземпляров
  return function (this: any, ...args: any[]) {
    count++;
    console.log(\`\${String(context.name)}: вызов №\${count}\`);
    return value.apply(this, args);
  };
}

class Widget {
  @countCalls click() {}
}

const a = new Widget();
const b = new Widget();
a.click(); // «click: вызов №1»
b.click(); // «click: вызов №2»  ← ожидали №1! счётчик общий на a и b

// КАК ПРАВИЛЬНО: хранить счётчик на самом объекте (this), а не в замыкании:
function countPerObject(value: Function, context: ClassMethodDecoratorContext) {
  const key = Symbol('count');
  return function (this: any, ...args: any[]) {
    this[key] = (this[key] ?? 0) + 1;
    console.log(\`\${String(context.name)}: вызов №\${this[key]}\`);
    return value.apply(this, args);
  };
}`;

  protected readonly factoryConfusion = `// Путаница «со скобками или без». @имя и @имя() — РАЗНЫЕ вещи.

// Обычный декоратор — вешаем БЕЗ скобок:
function sealed(value: Function, context: ClassDecoratorContext) {}

// Фабрика — ВЫЗЫВАЕМ со скобками, она вернёт декоратор:
function role(name: string) {
  return function (value: Function, context: ClassDecoratorContext) {};
}

@sealed        // ✅ верно: sealed сам является декоратором
class A {}

@role('admin') // ✅ верно: вызвали фабрику, получили декоратор
class B {}

// @sealed()   // ❌ sealed вернёт undefined — «undefined не является декоратором»
// @role       // ❌ повесили саму фабрику: она ждёт (name), а получит (value, context)

// Правило: скобки после @ есть тогда и только тогда, когда это фабрика.`;

  protected readonly mixGenerations = `// Опасность: скопировать декоратор из Angular-примера (старый стиль)
// в проект со стандартными (новыми) декораторами. Сигнатуры несовместимы.

// Старый стиль метода — ждёт (target, key, descriptor):
function logLegacy(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;      // в НОВОМ режиме descriptor = undefined!
  descriptor.value = function () {};      // → упадёт: чтение .value у undefined
}

// В стандартном режиме тот же декоратор получит (value, context):
//   target       ← на самом деле сам метод (функция)
//   key          ← на самом деле context (объект-паспорт)
//   descriptor   ← undefined  → descriptor.value бросит ошибку

// Признак: код лезет в target.prototype или descriptor.value — это СТАРЫЙ стиль.
// Он заработает ТОЛЬКО с флагом "experimentalDecorators": true в tsconfig.json.`;

  protected readonly fieldNotWrap = `// Ошибка: ждут, что декоратор поля даст «перехватить» чтение/запись.
// Не даст. value поля всегда undefined; вернуть можно лишь преобразователь
// НАЧАЛЬНОГО значения — обернуть доступ к полю нельзя.

function upper(value: undefined, context: ClassFieldDecoratorContext) {
  console.log(value); // всегда undefined — значения поля тут ещё нет

  // Можно ТОЛЬКО поправить начальное значение:
  return function (initial: string) {
    return initial.toUpperCase();
  };
  // Нельзя перехватить будущие записи: obj.name = 'аня' пройдёт мимо декоратора.
}

class User {
  @upper name = 'аня'; // при создании станет 'АНЯ'
}

const u = new User();
console.log(u.name); // 'АНЯ' — сработало на СТАРТЕ
u.name = 'петя';     // а вот это уже НЕ проходит через декоратор
console.log(u.name); // 'петя' (в нижнем регистре — перехвата записи нет)

// Нужен перехват чтения/записи? Используйте accessor (см. «Методы, свойства, аксессоры»).`;

  protected readonly thisLost = `// Ошибка: обёртка метода теряет this.

function log(value: Function, context: ClassMethodDecoratorContext) {
  // ❌ стрелка + прямой вызов value(...) — this внутри метода потеряется
  return (...args: any[]) => value(...args);
}

class Counter {
  count = 0;
  @log inc() {
    this.count++;        // TypeError: Cannot read properties of undefined
    return this.count;
  }
}

// ✅ КАК ПРАВИЛЬНО: обычная function + value.apply(this, args)
function logFixed(value: Function, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    return value.apply(this, args); // this честно доходит до метода
  };
}`;

  protected readonly paramLegacyOnly = `// Ошибка: пытаются декорировать ПАРАМЕТР в стандартном режиме.
// Стандартные декораторы параметры пока НЕ поддерживают — будет ошибка компиляции.

class Service {
  // ❌ Decorators are not valid here (в стандартном режиме)
  greet(@inject name: string) {
    return 'привет, ' + name;
  }
}

// Декораторы параметров есть ТОЛЬКО в старом режиме (experimentalDecorators),
// именно на них построен @Inject(...) в Angular и NestJS. Их сигнатура:
//   (target, ключ_метода, индекс_параметра)
function inject(target: any, propertyKey: string | symbol, parameterIndex: number) {
  console.log('декорирован параметр №', parameterIndex);
}`;

  protected readonly metadataUndefined = `// Ошибка: Класс[Symbol.metadata] внезапно undefined.

class Product {
  // ...декораторы, которые что-то писали в metadata...
}

console.log(Product[Symbol.metadata]); // undefined — почему?!

// Причина 1: не подключён полифилл Symbol.metadata (нужен в старых средах).
//            Добавьте ОДИН раз в начале приложения:
(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');

// Причина 2: в tsconfig.json устаревший lib — TypeScript не знает про Symbol.metadata.
//            Нужен современный набор: "lib": ["ESNext"].

// Причина 3: ни один декоратор класса ничего не записал в metadata —
//            тогда блокнота и нет. Он появляется только когда в него пишут.

// И помните: стандартный Symbol.metadata — это НЕ reflect-metadata из Angular.
// Reflect.getMetadata(...) к Symbol.metadata отношения не имеет.`;
}
