import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-decorators-members',
  imports: [CodeBlock, RouterLink],
  templateUrl: './members.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptDecoratorsMembers {
  protected readonly methodWrap = `// Декоратор МЕТОДА получает сам метод (value) и может вернуть ДРУГУЮ функцию —
// «обёртку». Тогда вместо исходного метода класс будет звать обёртку.
// Обёртка — как секретарь: сначала записывает вызов в журнал, потом передаёт
// его настоящему методу и возвращает его ответ.

function log(value: Function, context: ClassMethodDecoratorContext) {
  const name = String(context.name);

  // Возвращаем новую функцию — она заменит исходный метод.
  return function (this: any, ...args: any[]) {
    console.log(\`→ вызван \${name}(\${args.join(', ')})\`); // ДО
    const result = value.apply(this, args);                // сам метод
    console.log(\`← \${name} вернул \${result}\`);            // ПОСЛЕ
    return result;
  };
}

class Calc {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

new Calc().add(2, 3);
// → вызван add(2, 3)
// ← add вернул 5`;

  protected readonly methodMeasure = `// Практический пример: @measure замеряет, сколько миллисекунд работал метод.
// Логика замера написана ОДИН раз и вешается на любой метод одной строчкой.
function measure(value: Function, context: ClassMethodDecoratorContext) {
  const name = String(context.name);
  return function (this: any, ...args: any[]) {
    const start = performance.now();
    const result = value.apply(this, args); // выполняем настоящий метод
    const ms = performance.now() - start;
    console.log(\`\${name} занял \${ms.toFixed(1)} мс\`);
    return result;
  };
}

class Report {
  @measure
  build() {
    let sum = 0;
    for (let i = 0; i < 1_000_000; i++) sum += i;
    return sum;
  }
}

new Report().build(); // напечатает, например: «build занял 3.4 мс»`;

  protected readonly thisWarning = `// ЛОВУШКА: внутри обёртки this нужно ПРОБРОСИТЬ в исходный метод.

// ПРАВИЛЬНО: обычная function + value.apply(this, args) — this сохраняется.
return function (this: any, ...args: any[]) {
  return value.apply(this, args); // this — тот же объект, что вызвал метод
};

// НЕПРАВИЛЬНО: стрелочная функция замкнёт «чужой» this,
// а прямой вызов value(...args) потеряет this совсем:
// return (...args: any[]) => value(...args); // ❌ внутри метода this будет undefined

// Правило: обёртка метода — это function (не стрелка), и вызывайте
// оригинал через value.apply(this, args), чтобы this дошёл по адресу.`;

  protected readonly bound = `// Классическая беда: метод «теряет this», когда его отрывают от объекта
// (передают как колбэк). Декоратор @bound лечит это раз и навсегда.
// Он использует context.addInitializer — код, который выполнится при СОЗДАНИИ
// каждого объекта (this там уже указывает на новый экземпляр).

function bound(value: Function, context: ClassMethodDecoratorContext) {
  const name = context.name;
  context.addInitializer(function (this: any) {
    // Для каждого объекта привязываем метод к нему намертво.
    this[name] = this[name].bind(this);
  });
}

class Button {
  label = 'OK';

  @bound
  onClick() {
    return this.label; // хотим, чтобы this всегда был этой кнопкой
  }
}

const btn = new Button();
const handler = btn.onClick; // ОТОРВАЛИ метод от объекта
console.log(handler());       // 'OK' — this не потерялся, спасибо @bound

// Без @bound строка handler() упала бы: this стал бы undefined.`;

  protected readonly field = `// Декоратор СВОЙСТВА (поля) устроен иначе. Он НЕ получает значение поля
// (value здесь всегда undefined) и НЕ может обернуть чтение/запись.
// Он умеет одно: вернуть функцию, которая ПРЕОБРАЗУЕТ начальное значение.

// (initial) => новое_значение — эта функция выполнится, когда поле создаётся.
function positive(value: undefined, context: ClassFieldDecoratorContext) {
  return function (initial: number) {
    return Math.max(0, initial); // отрицательное превратим в 0
  };
}

class Account {
  @positive balance = -100; // при создании -100 станет 0
}

console.log(new Account().balance); // 0

// Важно: value = undefined (поля ещё нет в момент декорирования).
// Вернули функцию — она поправит начальное значение. Вот и все возможности.`;

  protected readonly fieldFactory = `// Фабрика-версия: @defaultTo подставляет значение по умолчанию,
// если поле создали без явного значения (undefined).
function defaultTo<T>(fallback: T) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    return function (initial: T) {
      return initial ?? fallback; // нет значения → берём запасное
    };
  };
}

class Settings {
  @defaultTo('светлая') theme!: string;
  @defaultTo(10) pageSize!: number;
}

const s = new Settings();
console.log(s.theme);    // 'светлая'
console.log(s.pageSize); // 10`;

  protected readonly accessor = `// Чтобы ПЕРЕХВАТЫВАТЬ чтение и запись свойства, есть ключевое слово accessor.
// «accessor x = 1» автоматически создаёт скрытое поле + пару get/set.
// Декоратор такого аксессора возвращает объект { get, set, init } — можно
// подменить любую из частей.

// @clamp держит значение в диапазоне [min, max] и при записи, и при создании.
function clamp(min: number, max: number) {
  return function (
    target: ClassAccessorDecoratorTarget<any, number>,
    context: ClassAccessorDecoratorContext,
  ) {
    const fix = (n: number) => Math.min(max, Math.max(min, n));
    return {
      get(this: any) {
        return target.get.call(this);
      },
      set(this: any, v: number) {
        target.set.call(this, fix(v)); // обрезаем при записи
      },
      init(initial: number) {
        return fix(initial); // обрезаем начальное значение
      },
    };
  };
}

class Player {
  @clamp(0, 100) accessor health = 150; // 150 обрежется до 100
}

const p = new Player();
console.log(p.health); // 100  (init обрезал 150)
p.health = 999;
console.log(p.health); // 100  (set обрезал 999)
p.health = -50;
console.log(p.health); // 0    (set обрезал -50)`;

  protected readonly legacyMethod = `// Для сравнения: @log на методе в СТАРОМ (экспериментальном) режиме.
// Старый декоратор метода получает (target, ключ, дескриптор) и МЕНЯЕТ
// поле descriptor.value, а не возвращает новую функцию.
function logOld(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;            // достаём исходный метод
  descriptor.value = function (...args: any[]) { // подменяем его обёрткой
    console.log('вызван', key);
    return original.apply(this, args);
  };
  // ничего не возвращаем — правим дескриптор на месте
}

// Стандартный (новый) декоратор проще: получил метод — вернул обёртку.
// А вот СТАРЫЙ стиль (как logOld выше) до сих пор в ходу у Angular и NestJS:
// например, @HostListener и другие их декораторы методов написаны именно так.`;
}
