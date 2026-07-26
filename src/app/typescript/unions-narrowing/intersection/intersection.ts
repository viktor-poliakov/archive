import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-unions-narrowing-intersection',
  imports: [CodeBlock, RouterLink],
  templateUrl: './intersection.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUnionsNarrowingIntersection {
  protected readonly intersectBasic = `// Person & Employee — значение, у которого есть ВСЁ и от Person, и от Employee
interface Person {
  name: string;
  age: number;
}
interface Employee {
  company: string;
  salary: number;
}

// Тип «сотрудник-человек»: сразу все поля обоих типов
type StaffMember = Person & Employee;

const dev: StaffMember = {
  name: 'Аня',
  age: 30,
  company: 'Acme',
  salary: 4200,
}; // ✅ есть все четыре поля — контракт обоих типов выполнен

// Забыли хотя бы одно поле — ошибка:
const broken: StaffMember = {
  name: 'Игорь',
  age: 41,
};
// ❌ Type '{ name: string; age: number; }' is missing the following
//    properties from type 'Employee': company, salary`;

  protected readonly membersAccess = `interface Cat {
  meow(): void;
  legs: number;
}
interface Bird {
  fly(): void;
  legs: number;
}

// Пересечение (&): у значения есть ВСЕ члены обоих типов
declare const chimera: Cat & Bird;
chimera.meow(); // ✅
chimera.fly();  // ✅
chimera.legs;   // ✅

// Объединение (|): доступно только ОБЩЕЕ — то, что есть в каждом члене
declare const catOrBird: Cat | Bird;
catOrBird.legs; // ✅ legs есть и у Cat, и у Bird
catOrBird.meow();
// ❌ Property 'meow' does not exist on type 'Cat | Bird'.
//    Property 'meow' does not exist on type 'Bird'.`;

  protected readonly intersectSubtype = `interface HasId {
  id: string;
}
interface HasTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

type DbRow = HasId & HasTimestamps;

const row: DbRow = {
  id: 'u_1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// A & B — ПОДТИП и A, и B: его можно подставить туда, где ждут любой из них
const onlyId: HasId = row;             // ✅ у row есть id
const onlyStamps: HasTimestamps = row; // ✅ у row есть обе даты

// Обратно — нельзя: у «голого» HasId дат нет
const partial: HasId = { id: 'u_2' };
const full: DbRow = partial;
// ❌ Type 'HasId' is missing the following properties
//    from type 'HasTimestamps': createdAt, updatedAt`;

  protected readonly serviceFields = `// Частый паттерн: к «доменной» модели добавляем служебные поля хранилища
interface Product {
  title: string;
  price: number;
}

// Entity<T> = сама модель + технические поля БД
type Entity<T> = T & {
  id: string;
  createdAt: Date;
};

const stored: Entity<Product> = {
  title: 'Кофемолка',
  price: 2990,
  id: 'p_100',
  createdAt: new Date(),
}; // ✅ поля Product + служебные id и createdAt

// Одна и та же «обёртка» подходит любой модели:
interface User {
  email: string;
}
const savedUser: Entity<User> = {
  email: 'a@acme.io',
  id: 'u_1',
  createdAt: new Date(),
}; // ✅`;

  protected readonly mixins = `// Миксины: собираем «способности» из независимых кусочков
interface Serializable {
  toJSON(): string;
}
interface Timestamped {
  createdAt: Date;
}
interface Identifiable {
  id: string;
}

// Модель заказа = данные + три способности сразу
type Order = {
  total: number;
} & Serializable & Timestamped & Identifiable;

const order: Order = {
  total: 1500,
  id: 'o_7',
  createdAt: new Date(),
  toJSON() {
    return JSON.stringify({ id: this.id, total: this.total });
  },
}; // ✅ все поля и методы из четырёх кусочков на месте`;

  protected readonly extendProps = `// Расширение пропсов: базовые атрибуты + свои
interface BaseButtonProps {
  disabled?: boolean;
  className?: string;
}

// К общей базе добавляем поля, специфичные для кнопки отправки
type SubmitButtonProps = BaseButtonProps & {
  onClick: () => void;
  label: string;
};

function renderButton(props: SubmitButtonProps): void {
  console.log(props.label, props.disabled ?? false);
}

renderButton({ label: 'Сохранить', onClick: () => {} });            // ✅
renderButton({ label: 'OK', onClick: () => {}, disabled: true });   // ✅

renderButton({ label: 'Пусто' });
// ❌ Property 'onClick' is missing in type '{ label: string; }'
//    but required in type '{ onClick: () => void; label: string; }'`;

  protected readonly widgetContract = `// Функция требует объект, удовлетворяющий сразу двум контрактам
type Draggable = { onDrag: (dx: number) => void };
type Resizable = { onResize: (w: number) => void };

function makeWidget(opts: Draggable & Resizable): void {
  opts.onDrag(10);
  opts.onResize(200);
}

makeWidget({
  onDrag: (dx) => console.log('drag', dx),
  onResize: (w) => console.log('resize', w),
}); // ✅ переданы обе способности сразу

makeWidget({ onDrag: () => {} });
// ❌ Property 'onResize' is missing in type '{ onDrag: () => void; }'
//    but required in type 'Resizable'`;

  protected readonly primitivesNever = `// Значения, которое ОДНОВРЕМЕННО строка и число, не существует
type Impossible = string & number; // → never

const x: Impossible = 'hi';
// ❌ Type 'string' is not assignable to type 'never'
const y: Impossible = 42;
// ❌ Type 'number' is not assignable to type 'never'

// Пустое пересечение множеств и есть never (пустое множество):
type A = string & 'ok';    // → 'ok' (литерал лежит ВНУТРИ string — остаётся он)
type B = number & boolean; // → never (общих значений у чисел и булевых нет)`;

  protected readonly conflictNever = `// Если ОБЩЕЕ поле в A и B имеет несовместимые типы,
// это поле схлопывается в never — положить туда нечего
interface ApiOk {
  status: 'ok';
  data: string;
}
interface ApiFail {
  status: 'error';
  message: string;
}

// поле status: 'ok' & 'error' → never (нет значения сразу 'ok' и 'error')
type BadMerge = ApiOk & ApiFail;

const r: BadMerge = {
  status: 'ok',
  data: 'payload',
  message: 'oops',
};
// ❌ Type '"ok"' is not assignable to type 'never'
// Здесь нужен не &, а | — размеченное объединение (discriminated union)`;
}
