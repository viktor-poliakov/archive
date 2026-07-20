import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-extending',
  imports: [CodeBlock, RouterLink],
  templateUrl: './extending.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesExtending {
  protected readonly repetitionExample = `// Есть тип пользователя:
interface User {
  id: number;
  name: string;
  email: string;
}

// Админ — тот же пользователь, но с ролью.
// Приходится ПОВТОРЯТЬ все поля вручную:
interface Admin {
  id: number;      // ← дубль
  name: string;    // ← дубль
  email: string;   // ← дубль
  role: string;    // только это поле реально новое
}

// Стоит добавить в User поле phone — и нужно НЕ ЗАБЫТЬ
// добавить его ещё и в Admin. Копии рано или поздно разъедутся.
// Нужен способ переиспользовать поля, а не копировать их.`;

  protected readonly extendsBasicExample = `interface User {
  id: number;
  name: string;
  email: string;
}

// extends читается так: «Admin — это User плюс кое-что своё».
interface Admin extends User {
  role: string;
}

// Admin теперь содержит ВСЕ поля User + собственное поле role:
const boss: Admin = {
  id: 1,
  name: 'Аня',
  email: 'anya@site.ru',
  role: 'superadmin',
};

boss.email; // OK — поле досталось «в наследство» от User
boss.role;  // OK — собственное поле Admin`;

  protected readonly extendsUsageExample = `// Функция умеет работать с любым User:
function greet(user: User): string {
  return \`Привет, \${user.name}!\`;
}

const boss: Admin = { id: 1, name: 'Аня', email: 'a@b.ru', role: 'admin' };

greet(boss); // OK — в Admin есть всё, что нужно User

// Наследник всегда подходит туда, где ждут родителя:
// Admin — это расширенный User, значит он и есть User (+ доп. поля).`;

  protected readonly multipleExtendsExample = `interface HasId {
  id: number;
}

interface HasTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

// Через запятую расширяем сразу НЕСКОЛЬКО интерфейсов:
interface Article extends HasId, HasTimestamps {
  title: string;
}

// Article собран из трёх кусочков: HasId + HasTimestamps + своё title.
const post: Article = {
  id: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Первый пост',
};`;

  protected readonly intersectionExample = `interface User {
  id: number;
  name: string;
}

// Тот же результат другим инструментом: псевдоним type и оператор & (амперсанд).
type Admin = User & { role: string };

const boss: Admin = { id: 1, name: 'Аня', role: 'admin' };

// & «склеивает» типы. Читается как «И то, И другое»:
// значение Admin должно удовлетворять И User, И { role }.
// Поэтому в нём есть все поля сразу.`;

  protected readonly intersectionMultiExample = `type WithId = { id: number };
type WithTimestamps = { createdAt: Date; updatedAt: Date };

// & можно связывать в цепочку — как extends A, B:
type Article = WithId & WithTimestamps & { title: string };

const post: Article = {
  id: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Первый пост',
};

// Результат идентичен interface Article extends HasId, HasTimestamps.`;

  protected readonly mixingExample = `// type-псевдоним обычного объекта:
type Point = { x: number; y: number };

// interface спокойно РАСШИРЯЕТ type-объект:
interface Point3D extends Point {
  z: number;
}

// И наоборот: type ПЕРЕСЕКАЕТ interface:
interface Named {
  name: string;
}
type NamedPoint = Point & Named;

// interface и type — не враги: их свободно смешивают.
const p: NamedPoint = { x: 1, y: 2, name: 'Точка A' };`;

  protected readonly overrideExample = `interface Shape {
  kind: string;   // широкий тип
  size: number;
}

// В наследнике поле можно СУЗИТЬ до совместимого подтипа:
interface Circle extends Shape {
  kind: 'circle'; // литеральный тип — подтип string, это разрешено
}

const c: Circle = { kind: 'circle', size: 10 }; // OK

// А несовместимое переопределение запрещено:
interface Broken extends Shape {
  size: string;   // ❌ Interface 'Broken' incorrectly extends 'Shape'.
                  //    Type 'string' is not assignable to type 'number'.
                  //    string — это НЕ подтип number, нельзя.
}`;

  protected readonly practiceExample = `// Базовый «кирпичик»: у любой сущности в базе есть id.
interface Entity {
  id: number;
}

// User — это Entity плюс поля пользователя:
interface User extends Entity {
  name: string;
  email: string;
}

// Admin — это User плюс роль.
// Цепочка наследования: Admin → User → Entity.
interface Admin extends User {
  role: 'admin' | 'superadmin';
}

const boss: Admin = {
  id: 1,           // досталось от Entity
  name: 'Аня',     // от User
  email: 'a@b.ru', // от User
  role: 'admin',   // собственное поле Admin
};`;

  protected readonly compositionExample = `// «Примеси» (mixins) — маленькие независимые кусочки:
type WithId = { id: number };
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type WithAuthor = { author: string };

// Собираем нужный тип как из кубиков LEGO — берём только то, что надо:
type Comment = WithId & WithTimestamps & WithAuthor & {
  text: string;
};

const c: Comment = {
  id: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: 'Аня',
  text: 'Отличная статья!',
};`;
}
