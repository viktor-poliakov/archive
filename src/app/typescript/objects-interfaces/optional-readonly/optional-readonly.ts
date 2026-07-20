import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-optional-readonly',
  imports: [CodeBlock, RouterLink],
  templateUrl: './optional-readonly.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesOptionalReadonly {
  protected readonly optionalBasicExample = `// Знак "?" после имени свойства делает его НЕОБЯЗАТЕЛЬНЫМ.
// Такого поля в объекте может не быть вообще.
interface User {
  id: number;
  name?: string; // необязательное: можно указать, а можно опустить
}

const a: User = { id: 1, name: 'Аня' }; // OK — поле name есть
const b: User = { id: 2 };              // OK — поля name просто нет

// Обязательное поле забыть нельзя:
const c: User = { name: 'Боб' }; // ❌ Property 'id' is missing in type ...
                                 //    id объявлен без "?", значит нужен всегда`;

  protected readonly optionalAccessExample = `interface User {
  id: number;
  name?: string;
}

function greet(u: User) {
  // Тип поля u.name фактически: string | undefined —
  // компилятор помнит, что значения может не быть.
  console.log(u.name.toUpperCase());
  // ❌ 'u.name' is possibly 'undefined'.
  //    вызвать метод сразу нельзя: вдруг name отсутствует

  // Правильно — сначала проверить, что значение есть:
  if (u.name) {
    console.log(u.name.toUpperCase()); // здесь u.name уже точно string
  }

  // Или подставить значение по умолчанию через ??:
  const shown = u.name ?? 'аноним';
  console.log(shown.toUpperCase());    // OK — shown всегда string
}`;

  protected readonly optionalVsUndefinedExample = `// Вариант 1: "?" — ключ можно вообще НЕ писать.
interface A {
  name?: string; // тип = string | undefined, и сам ключ необязателен
}
const a1: A = {};                  // OK — ключа name нет совсем
const a2: A = { name: 'Аня' };     // OK
const a3: A = { name: undefined }; // OK — undefined тоже разрешён

// Вариант 2: "| undefined" БЕЗ "?" — ключ ОБЯЗАТЕЛЕН,
// но его значением может быть undefined.
interface B {
  name: string | undefined;
}
const b1: B = { name: 'Аня' };     // OK
const b2: B = { name: undefined }; // OK — значение undefined допустимо
const b3: B = {};                  // ❌ Property 'name' is missing
                                   //    ключ нужен всегда, пусть и с undefined`;

  protected readonly readonlyBasicExample = `interface User {
  readonly id: number; // задаётся ОДИН раз — при создании объекта
  name: string;        // обычное свойство — можно менять
}

const u: User = { id: 1, name: 'Аня' };

u.name = 'Аля'; // OK — обычное свойство меняем свободно
u.id = 2;       // ❌ Cannot assign to 'id' because it is a read-only property.
                //    id помечен readonly — переписать его нельзя`;

  protected readonly readonlyRuntimeExample = `// ВАЖНО: readonly — это проверка ТОЛЬКО на этапе компиляции.
// В собранном JavaScript поле остаётся обычным, никакой защиты нет.
interface Config {
  readonly url: string;
}

const cfg: Config = { url: 'https://api.example.com' };

// Приведение "as any" отключает проверку типов —
// и в рантайме значение спокойно меняется:
(cfg as any).url = 'https://evil.example.com';
console.log(cfg.url); // 'https://evil.example.com' — поле реально изменилось!

// Нужна настоящая неизменяемость во время выполнения — берите Object.freeze():
const frozen = Object.freeze({ url: 'https://api.example.com' });
// frozen.url = '...'; // молча не сработает (или бросит ошибку в strict mode JS)`;

  protected readonly readonlyArrayExample = `// Два одинаковых способа записать «массив только для чтения»:
const scores: readonly number[] = [10, 20, 30];
const ids: ReadonlyArray<number> = [1, 2, 3];

// Читать можно всё:
scores[0];     // 10
scores.length; // 3
scores.map((n) => n * 2); // OK — map ничего не мутирует

// А менять — нельзя: мутирующих методов у readonly-массива просто нет.
scores.push(40); // ❌ Property 'push' does not exist on type 'readonly number[]'
scores[0] = 99;  // ❌ Index signature in type 'readonly number[]' only permits reading
ids.sort();      // ❌ sort меняет массив на месте — недоступен`;

  protected readonly readonlyOptionalExample = `// readonly и "?" можно поставить ВМЕСТЕ на одно свойство.
interface Product {
  readonly id: number;        // только чтение + обязательное
  readonly nickname?: string; // только чтение + необязательное
}

const p: Product = { id: 1 }; // nickname можно не указывать

p.id = 2;            // ❌ read-only property
p.nickname = 'спец'; // ❌ read-only — даже если сейчас поля нет,
                     //    присвоить его после создания нельзя`;

  protected readonly practiceConfigExample = `// Практика 1: конфигурация. Часть полей обязательна,
// часть — с разумными значениями по умолчанию (поэтому "?").
interface ServerConfig {
  host: string;       // обязательно
  port: number;       // обязательно
  timeoutMs?: number; // необязательно
  useTls?: boolean;   // необязательно
}

function createServer(config: ServerConfig) {
  // Необязательные поля подстраховываем значением по умолчанию:
  const timeout = config.timeoutMs ?? 5000;
  const useTls = config.useTls ?? false;
  console.log(config.host, config.port, timeout, useTls);
}

createServer({ host: 'localhost', port: 8080 });              // хватает обязательных
createServer({ host: 'localhost', port: 443, useTls: true }); // + необязательное`;

  protected readonly practiceEntityExample = `// Практика 2: сущность из базы данных.
// id и дата создания выдаются один раз и меняться не должны.
interface Account {
  readonly id: string;    // «гравировка» — задаём при создании
  readonly createdAt: Date;
  email: string;          // а это обновлять можно
}

const acc: Account = {
  id: 'acc_01',
  createdAt: new Date(),
  email: 'a@example.com',
};

acc.email = 'new@example.com'; // OK — почту разрешено обновлять
acc.id = 'acc_02';             // ❌ id защищён от изменения`;
}
