import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-interfaces',
  imports: [CodeBlock, RouterLink],
  templateUrl: './interfaces.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesInterfaces {
  protected readonly repeatExample = `// Без интерфейса форму объекта приходится расписывать заново КАЖДЫЙ раз.
// Ниже одна и та же форма { name; age } повторена три раза:
function printUser(user: { name: string; age: number }): void {
  console.log(user.name, user.age);
}

let admin: { name: string; age: number } = { name: 'Аня', age: 30 };
let guest: { name: string; age: number } = { name: 'Боб', age: 25 };

// Захотим добавить поле email — придётся править форму в трёх местах.
// Легко ошибиться и получить рассинхрон. Хочется задать форму ОДИН раз.`;

  protected readonly syntaxExample = `// interface даёт форме объекта ИМЯ. Знака = нет — это отличие от type.
interface User {
  name: string; // свойства разделяют точкой с запятой ...
  age: number;  // ... или просто переносом строки
}

// Имя интерфейса принято писать с БОЛЬШОЙ буквы: User, Product, OrderItem.
// Само по себе объявление ничего не создаёт в рантайме — это только тип,
// он полностью исчезает после компиляции в обычный JavaScript.`;

  protected readonly asAnnotationExample = `interface User {
  name: string;
  age: number;
}

// Теперь имя User ставим всюду, где раньше писали форму целиком.
let admin: User = { name: 'Аня', age: 30 };
let guest: User = { name: 'Боб', age: 25 };

// В параметрах и возврате функций — точно так же:
function greet(user: User): string {
  return \`Привет, \${user.name}! Тебе \${user.age}.\`;
}

greet(admin); // 'Привет, Аня! Тебе 30.'
greet(guest); // 'Привет, Боб! Тебе 25.'`;

  protected readonly methodsExample = `interface Logger {
  // Способ 1 — свойство-функция: имя, двоеточие, тип-стрелка.
  log: (message: string) => void;

  // Способ 2 — сокращённая запись метода: имя со скобками, затем тип возврата.
  warn(message: string): void;
}

// Оба способа задают метод; объект обязан реализовать оба.
const logger: Logger = {
  log: (message) => console.log('[log]', message),
  warn(message) {
    console.warn('[warn]', message);
  },
};

logger.log('старт');   // [log] старт
logger.warn('внимание'); // [warn] внимание`;

  protected readonly optionalReadonlyExample = `interface Product {
  readonly id: number;   // readonly — задаётся один раз, менять потом нельзя
  title: string;
  description?: string;  // ? — свойство НЕобязательное, может отсутствовать
}

// description можно опустить — форма всё равно соблюдена:
const book: Product = { id: 1, title: 'TypeScript' };

book.title = 'JavaScript'; // OK — обычное свойство меняем свободно
book.id = 2;               // ❌ Cannot assign to 'id' because it is a read-only property`;

  protected readonly extendsExample = `interface Animal {
  name: string;
}

// Dog расширяет Animal: берёт все его свойства и добавляет свои.
interface Dog extends Animal {
  breed: string;
}

// Объект типа Dog обязан иметь И name (от Animal), И breed (своё):
const rex: Dog = { name: 'Рекс', breed: 'такса' };

const wrong: Dog = { breed: 'овчарка' }; // ❌ Property 'name' is missing`;

  protected readonly practiceExample = `// 1) Описываем форму ОДИН раз под именем Book.
interface Book {
  readonly isbn: string;
  title: string;
  author: string;
  year?: number; // год издания необязателен
}

// 2) Создаём несколько объектов по этому образцу.
const ts: Book = { isbn: '978-1', title: 'TypeScript', author: 'Андерс', year: 2012 };
const js: Book = { isbn: '978-2', title: 'JavaScript', author: 'Брендан' }; // без year — OK

// 3) Передаём в функцию, которая ждёт Book.
function describe(book: Book): string {
  const suffix = book.year ? \` (\${book.year})\` : '';
  return \`\${book.title} — \${book.author}\${suffix}\`;
}

describe(ts); // 'TypeScript — Андерс (2012)'
describe(js); // 'JavaScript — Брендан'`;

  protected readonly mismatchExample = `interface Book {
  isbn: string;
  title: string;
}

// ❌ не хватает обязательного свойства title
const bad1: Book = { isbn: '978-3' };
// Property 'title' is missing in type '{ isbn: string; }'

// ❌ неверный тип свойства: isbn должно быть строкой
const bad2: Book = { isbn: 111, title: 'X' };
// Type 'number' is not assignable to type 'string'

// ❌ лишнее поле в литерале (проверка на лишние свойства)
const bad3: Book = { isbn: '978-4', title: 'X', pages: 300 };
// Object literal may only specify known properties, and 'pages' does not exist in type 'Book'`;
}
