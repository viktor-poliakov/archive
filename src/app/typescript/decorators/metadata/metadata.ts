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
// блокнот на классе. В некоторых средах его пока нет — тогда добавляют
// полифилл ОДИН раз, в самом начале приложения:
(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');

// А в tsconfig.json нужен современный набор библиотек, чтобы TypeScript
// вообще знал про Symbol.metadata и тип context.metadata:
// {
//   "compilerOptions": {
//     "lib": ["ESNext"]   // здесь живёт тип для Symbol.metadata
//   }
// }`;

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
