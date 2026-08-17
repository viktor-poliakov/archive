import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-decorators-metadata',
  imports: [CodeBlock, RouterLink],
  templateUrl: './metadata.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptDecoratorsMetadata {
  protected readonly intro = `// context.metadata — это общий БЛОКНОТ, привязанный к классу.
// Все декораторы одного класса пишут в один и тот же блокнот, а потом
// другой код читает его через Class[Symbol.metadata].

// Две служебные строчки, без которых пример не заработает. Они не про идею
// метаданных, а про новизну Symbol.metadata — подробный разбор в разделе ниже.

// 1. Подключаем типы: без этого TypeScript не знает про Symbol.metadata.
//    В настоящем проекте то же самое делают строкой "lib" в tsconfig.json.
/// <reference lib="esnext.decorators" />

// 2. Полифилл: самого Symbol.metadata пока нет ни в браузерах, ни в Node.
(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');

function note(value: any, context: ClassMethodDecoratorContext) {
  // Оставляем заметку в блокноте класса.
  context.metadata['подпись'] = 'здесь был декоратор';
}

class Demo {
  @note run() {}
}

// Читаем блокнот класса снаружи:
console.log(Demo[Symbol.metadata]); // { 'подпись': 'здесь был декоратор' }

// Блокнот один на класс: сколько бы декораторов ни сработало,
// они дописывают в один и тот же объект metadata.`;

  protected readonly requiredExample = `// ПРАКТИКА: проверка обязательных полей формы.
// Декоратор @required не проверяет ничего сам — он лишь ЗАПИСЫВАЕТ в блокнот
// имя поля. А отдельная функция validate потом читает блокнот и проверяет.

function required(value: undefined, context: ClassFieldDecoratorContext) {
  // ??= означает «положить [], только если списка ещё нет».
  // Первый декоратор заведёт пустой список, остальные допишут в него.
  context.metadata['required'] ??= [];
  const list = context.metadata['required'] as string[];
  list.push(String(context.name)); // дописываем имя текущего поля
}

class SignupForm {
  @required name = '';
  @required email = '';
  age = 0; // без @required — поле необязательное
}

// Валидатор читает заметки класса и ищет незаполненные обязательные поля.
function validate(obj: object): string[] {
  const meta = (obj.constructor as any)[Symbol.metadata];
  const required = (meta?.['required'] ?? []) as string[];
  return required.filter((field) => !(obj as any)[field]);
}

const form = new SignupForm();
form.name = 'Аня'; // email оставили пустым

console.log(validate(form)); // ['email'] — обязателен, но не заполнен

// Красота в том, что validate НИЧЕГО не знает про SignupForm заранее.
// Она просто читает блокнот, который наполнили декораторы @required.`;

  protected readonly columnExample = `// ПРАКТИКА: собрать «схему таблицы» из декораторов (как в ORM).
// Каждый @column записывает в блокнот пару «поле → тип столбца».

function column(type: 'text' | 'int') {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    context.metadata['schema'] ??= {}; // завести карту, если её ещё нет
    const schema = context.metadata['schema'] as Record<string, string>;
    schema[String(context.name)] = type; // запомнить: поле → тип столбца
  };
}

class Product {
  @column('text') title = '';
  @column('int') price = 0;
  @column('text') sku = '';
}

const schema = (Product[Symbol.metadata]?.['schema'] ?? {}) as Record<string, string>;
console.log(schema);
// { title: 'text', price: 'int', sku: 'text' }

// Имея такую карту, легко сгенерировать, например, SQL:
// CREATE TABLE product (title text, price int, sku text)`;

  protected readonly symbolPolyfill = `// Symbol.metadata — новый системный символ, ключ, под которым язык хранит
// блокнот на классе. Ни браузеры, ни Node его пока не реализовали, поэтому
// нужны ДВЕ независимые вещи: настройка компилятора и полифилл.
// Забыли первую — не скомпилируется. Забыли вторую — упадёт при запуске.

// ═══ 1. ТИПЫ: чтобы TypeScript знал про Symbol.metadata ═══
// В проекте это одна строка в tsconfig.json:
// {
//   "compilerOptions": {
//     "lib": ["ESNext"]   // здесь живут типы для Symbol.metadata
//   }
// }
//
// Точечный вариант, если не хочется тянуть весь ESNext:
//   "lib": ["ES2022", "ESNext.Decorators"]
//
// А в TS Playground, где конфиг править неудобно, тот же эффект даёт
// строчка в самом верху файла, до любого кода:
//   /// <reference lib="esnext.decorators" />
//
// Без этого будут ровно три ошибки, и все три про одно и то же:
//   'context.metadata' is possibly 'undefined'
//   Element implicitly has an 'any' type because expression of type 'any'
//     can't be used to index type 'typeof Demo'
//   Property 'metadata' does not exist on type 'SymbolConstructor'

// ВНИМАНИЕ, ЛОВУШКА. Последняя ошибка советует сменить lib на esnext,
// и очень хочется вместо этого поставить "target": "ESNext" — ошибки
// действительно пропадут. Но появится другая беда: при таком target
// TypeScript оставляет декораторы в выводе как есть, а их пока не понимает
// ни один движок, и файл падает ещё при разборе:
//   SyntaxError: Invalid or unexpected token
// Поэтому меняют именно lib, а target оставляют прежним (ES2022 и подобные) —
// тогда TypeScript сам превращает декораторы в обычные вызовы функций.

// ═══ 2. ПОЛИФИЛЛ: чтобы блокнот появился во время работы ═══
// Одна строка в самом начале приложения, до первого декоратора:
(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');
//
// Без неё код скомпилируется, но упадёт на первом же декораторе:
//   TypeError: Cannot set properties of undefined (setting 'подпись')
//
// Причина простая: не видя Symbol.metadata, среда вообще не создаёт объект
// метаданных, и context.metadata оказывается undefined.`;

  protected readonly legacyReflect = `// В СТАРОМ мире (Angular, NestJS) метаданные устроены совершенно иначе:
// через библиотеку reflect-metadata и флаг "emitDecoratorMetadata": true.
// Тогда компилятор САМ записывает ТИПЫ параметров, а контейнер их читает.
import 'reflect-metadata';

class Database {}

// @Injectable помечает класс — и компилятор сохраняет типы параметров
// конструктора как метаданные ('design:paramtypes').
@Injectable()
class UserService {
  // Контейнер внедрения зависимостей (DI) увидит, что нужен Database,
  // сам его создаст и подставит сюда — благодаря сохранённому типу.
  constructor(private db: Database) {}
}

// Прочитать эти типы можно так:
// Reflect.getMetadata('design:paramtypes', UserService); // [ Database ]

// ⚠️ Это ДРУГОЙ механизм, не Symbol.metadata. Легко перепутать:
//   стандартные декораторы → context.metadata + Symbol.metadata
//   старые (Angular/Nest)  → reflect-metadata + Reflect.getMetadata`;
}
