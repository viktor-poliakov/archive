import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-decorators-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptDecoratorsBasics {
  protected readonly painManual = `// Хотим, чтобы каждый вызов метода печатал строчку в консоль —
// «меня вызвали». Без декораторов приходится вписывать эту строчку
// ВНУТРЬ каждого метода руками.
class UserService {
  createUser(name: string) {
    console.log('Вызван createUser'); // ← служебная строка
    // ...настоящая работа...
    return { name };
  }

  deleteUser(id: number) {
    console.log('Вызван deleteUser'); // ← и тут то же самое
    // ...настоящая работа...
    return true;
  }
}

// Проблема: служебный код (логирование) перемешан с полезным.
// В каждом методе — одна и та же строчка. Скучно, легко забыть, тяжело менять.`;

  protected readonly painDecorator = `// С декоратором служебный код выносится ОТДЕЛЬНО, один раз.
// Значок @log над методом означает: «оберни этот метод логированием».
class UserService {
  @log
  createUser(name: string) {
    return { name }; // только полезная работа, без мусора
  }

  @log
  deleteUser(id: number) {
    return true; // и здесь чисто
  }
}

// Сам @log мы напишем один раз (ниже на странице научимся).
// Методы стали чистыми: что метод делает — видно сразу,
// а «печатать при вызове» добавляет наклейка @log.`;

  protected readonly firstDecorator = `// Декоратор — это ОБЫЧНАЯ ФУНКЦИЯ. Ничего волшебного.
// Её особенность лишь в том, что её вешают на класс через значок @.

// Простейший декоратор класса: просто печатает, что класс объявили.
function logged(value: Function, context: ClassDecoratorContext) {
  console.log('Объявлен класс:', context.name);
}

@logged            // ← «приклей функцию logged к классу ниже»
class Cat {}

// В консоли сразу появится: «Объявлен класс: Cat»
// Обрати внимание: мы НЕ писали new Cat(). Достаточно было объявить класс.`;

  protected readonly whenItRuns = `// САМОЕ ВАЖНОЕ для новичка: когда декоратор срабатывает.
// Тело декоратора выполняется ОДИН раз — в момент, когда JavaScript
// «читает» объявление класса. НЕ на каждый new, а один раз при загрузке файла.

function announce(value: Function, context: ClassDecoratorContext) {
  console.log('1. Декоратор сработал (класс объявлен)');
}

console.log('0. Перед объявлением класса');

@announce
class Robot {
  constructor() {
    console.log('3. Создан new Robot()');
  }
}

console.log('2. Класс объявлен, но ни одного робота ещё нет');

new Robot();
new Robot();

// Порядок в консоли:
// 0. Перед объявлением класса
// 1. Декоратор сработал (класс объявлен)   ← сработал РАЗ, сам по себе
// 2. Класс объявлен, но ни одного робота ещё нет
// 3. Создан new Robot()                     ← а вот это на КАЖДЫЙ new
// 3. Создан new Robot()`;

  protected readonly factory = `// Часто декоратор хочется НАСТРОИТЬ — передать ему аргумент.
// Но @-значок сам по себе аргументы не принимает. Решение — «фабрика декораторов»:
// функция, которая ПРИНИМАЕТ настройку и ВОЗВРАЩАЕТ декоратор.

// prefix — настройка. Возвращаем настоящий декоратор (внутреннюю функцию).
function logWithPrefix(prefix: string) {
  return function (value: Function, context: ClassDecoratorContext) {
    console.log(prefix, context.name);
  };
}

@logWithPrefix('СОЗДАН КЛАСС:')   // ← со скобками! Сначала вызываем фабрику...
class Order {}                    // ...она возвращает декоратор, и он вешается на Order

// В консоли: «СОЗДАН КЛАСС: Order»
// @logWithPrefix('...') — это ВЫЗОВ, который возвращает декоратор.
// Именно так работают @Component({...}) в Angular и @Module({...}) в NestJS.`;

  protected readonly factoryVsPlain = `// Легко перепутать две записи. Разница принципиальная:

@logged            // БЕЗ скобок: logged — сам по себе декоратор.
class A {}

@logWithPrefix()   // СО скобками: сначала вызываем фабрику, она вернёт декоратор.
class B {}

// Если перепутать — будет ошибка или странное поведение:
// @logged()  — попытка ВЫЗВАТЬ logged как фабрику, но он не возвращает декоратор → ошибка.
// @logWithPrefix — повесить саму ФАБРИКУ как декоратор, а не её результат → тоже сломается.

// Правило: @имя — готовый декоратор; @имя(...) — фабрика, которую надо вызвать.`;

  protected readonly standardVsLegacy = `// В TypeScript уживаются ДВА поколения декораторов. Важно их различать.

// 1) СТАНДАРТНЫЕ (современные) — часть самого JavaScript, работают в TS 5.0+
//    без всяких настроек. Мы учим именно их. Сигнатура: (value, context).
function standard(value: Function, context: ClassDecoratorContext) {
  console.log('kind:', context.kind, 'name:', context.name);
}

// 2) СТАРЫЕ (экспериментальные) — устаревшая версия. Включаются флагом
//    "experimentalDecorators": true в tsconfig.json. Другая сигнатура!
//    Их до сих пор используют Angular, NestJS, TypeORM. Метод выглядит так:
function legacyMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // target — прототип класса, propertyKey — имя метода, descriptor — его дескриптор
}

// Как отличить в чужом коде:
//   (value, context) — всегда так           → стандартный (новый)
//   (target, key, descriptor) и подобные    → экспериментальный (старый)
// У старых сигнатура зависит от МЕСТА: класс → (constructor),
// метод → (target, key, descriptor), свойство → (target, key).`;

  protected readonly whereAllowed = `// Куда можно вешать декораторы. Разберём по частям на следующих страницах.
@sealed                       // ← на КЛАСС
class Widget {
  @readonly title = 'Кнопка'; // ← на СВОЙСТВО (поле)

  @log render() {}            // ← на МЕТОД

  @cached
  get size() {                // ← на ГЕТТЕР
    return 42;
  }

  @clamp accessor volume = 5; // ← на авто-аксессор (accessor)
}

// Важно: параметры функций (@Inject у Angular) можно декорировать
// ТОЛЬКО в старом, экспериментальном режиме. В стандартных декораторах
// параметров пока нет — об этом на странице «Нюансы и подводные камни».`;
}
