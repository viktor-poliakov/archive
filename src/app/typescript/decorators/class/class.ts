import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-decorators-class',
  imports: [CodeBlock, RouterLink],
  templateUrl: './class.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptDecoratorsClass {
  protected readonly anatomy = `// Декоратор класса — функция с двумя параметрами.
function myDecorator(value: Function, context: ClassDecoratorContext) {
  //                 ^^^^^          ^^^^^^^
  //                 сам класс      «паспорт» декоратора
  console.log(value);          // сам класс (то, что можно вызвать через new)
  console.log(context.kind);   // 'class' — вид того, что декорируем
  console.log(context.name);   // 'Cat'   — имя класса (может быть undefined)
}

@myDecorator
class Cat {}

// context — это объект с информацией. Для класса в нём есть:
//   kind          — всегда 'class'
//   name          — имя класса строкой
//   addInitializer — способ выполнить код, когда класс полностью готов
//   metadata      — общий блокнот для заметок (см. страницу «Метаданные»)`;

  protected readonly observeSeal = `// СПОСОБ 1: просто посмотреть и сделать побочное действие.
// @sealed «запечатывает» класс: запрещает потом добавлять ему новые
// методы и свойства. Декоратор ничего не возвращает — только действует.
function sealed(value: Function, context: ClassDecoratorContext) {
  Object.seal(value);            // запечатать сам класс
  Object.seal(value.prototype);  // и его прототип (где живут методы)
}

@sealed
class Config {
  readonly host = 'localhost';
}

// Теперь никто не сможет незаметно дописать Config новый метод «на лету».
// Классический пример декоратора, который НИЧЕГО не возвращает: он лишь
// выполняет действие над классом, а класс остаётся тем же самым.`;

  protected readonly registry = `// СПОСОБ 2 (самый частый на практике): РЕГИСТРАЦИЯ.
// Декоратор кладёт класс в общий список — «реестр». Потом другой код
// проходит по реестру и что-то с классами делает. Так работают плагины,
// команды, обработчики маршрутов.

// Общий реестр команд.
const commands: Function[] = [];

// Декоратор-фабрика: принимает имя команды и регистрирует класс.
function command(name: string) {
  return function (value: Function, context: ClassDecoratorContext) {
    console.log('Регистрирую команду:', name);
    commands.push(value); // складываем класс в общий список
  };
}

@command('save')
class SaveCommand {
  run() { return 'сохранено'; }
}

@command('delete')
class DeleteCommand {
  run() { return 'удалено'; }
}

// Теперь в массиве commands лежат ОБА класса — их зарегистрировали
// сами декораторы, при объявлении. Никакого ручного списка вести не нужно:
console.log(commands.length); // 2`;

  protected readonly replace = `// СПОСОБ 3 (самый мощный): ЗАМЕНИТЬ класс.
// Если декоратор ЧТО-ТО ВЕРНЁТ (новый класс) — язык подставит его ВМЕСТО исходного.
// Частый приём — вернуть подкласс, который добавляет исходному новое свойство.

function withTimestamp<T extends new (...args: any[]) => object>(
  value: T,
  context: ClassDecoratorContext,
) {
  // Возвращаем НОВЫЙ класс, унаследованный от исходного,
  // и добавляем в него поле createdAt.
  return class extends value {
    createdAt = new Date();
  };
}

@withTimestamp
class Document {
  title = 'Черновик';
}

const doc = new Document();
console.log(doc.title);      // 'Черновик' — всё старое на месте
console.log(doc.createdAt);  // текущая дата — это добавил декоратор!

// Класс Document теперь «прокачан»: к нему приклеилось поле createdAt,
// хотя в объявлении класса мы его не писали.`;

  protected readonly replaceDiagram = `// Наглядно: что вошло в декоратор и что вышло.
//
//   class Document { title }              ← исходный класс
//            │
//            ▼   @withTimestamp
//   class extends Document { createdAt }  ← новый класс, его и получит имя Document
//
// Правило: вернул класс — он заменяет исходный; ничего не вернул (undefined) —
// остаётся исходный. Возвращать МОЖНО только класс (или ничего), не число и не строку.`;

  protected readonly factoryEntity = `// Фабрика + сохранение настройки. Похоже на @Entity('users') из ORM.
// Настройку (имя таблицы) сохраняем прямо на класс, чтобы прочитать позже.

function entity(tableName: string) {
  return function (value: Function, context: ClassDecoratorContext) {
    // Кладём имя таблицы статическим свойством на класс.
    (value as any).tableName = tableName;
  };
}

@entity('users')
class User {
  name = '';
}

@entity('products')
class Product {
  price = 0;
}

console.log((User as any).tableName);    // 'users'
console.log((Product as any).tableName); // 'products'

// Каждый класс «знает» свою таблицу — это записал декоратор.
// Аккуратнее такие заметки хранить в metadata — см. страницу «Метаданные».`;

  protected readonly legacyNote = `// Как тот же @sealed выглядел бы в СТАРОМ (экспериментальном) режиме.
// Отличие: старый декоратор класса получает ОДИН аргумент — конструктор,
// и никакого context. Именно так пишут декораторы в Angular и NestJS.

// Стандартный (новый):
function sealedNew(value: Function, context: ClassDecoratorContext) {
  Object.seal(value);
}

// Экспериментальный (старый) — нужен флаг experimentalDecorators:
function sealedOld(constructor: Function) {
  Object.seal(constructor);
}

// Логика одна, но сигнатуры разные. В новом коде используйте первый вариант.`;
}
