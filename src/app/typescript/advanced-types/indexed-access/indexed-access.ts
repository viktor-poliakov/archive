import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-indexed-access',
  imports: [CodeBlock, RouterLink],
  templateUrl: './indexed-access.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesIndexedAccess {
  protected readonly basicAccess = `// Тот же приём, что и с объектом, только в МИРЕ ТИПОВ.
// obj['name'] достаёт ЗНАЧЕНИЕ по ключу — в рантайме.
// User['name'] достаёт ТИП поля по ключу — на этапе компиляции.
interface User {
  name: string;
  age: number;
}

// В квадратных скобках — не значение, а ИМЯ КЛЮЧА как тип-литерал.
type Name = User['name']; // = string
type Age = User['age'];   // = number

// Важно: справа от [] стоит ТИП. Ключ 'name' здесь —
// это литеральный тип-строка, а не переменная из рантайма.`;

  protected readonly wrongDot = `// Через точку тип поля НЕ достать — точка работает со значениями.
interface User {
  name: string;
  age: number;
}

type Name = User.name;
// ❌ Cannot access 'User.name' because 'User' is a type, but not a namespace.
//    Точечная запись — из мира значений; в мире типов нужны [].

type NameOk = User['name']; // ✅ = string — вот так правильно`;

  protected readonly unionKeys = `// В скобки можно передать не один ключ, а ОБЪЕДИНЕНИЕ ключей.
// Тогда на выходе — объединение типов всех этих полей.
interface User {
  name: string;
  age: number;
}

type NameOrAge = User['name' | 'age']; // = string | number

// Читается так: «дай тип поля name ИЛИ поля age».
// string (из name) объединяется с number (из age) → string | number.`;

  protected readonly allValues = `// Самая частая связка: индексный доступ + keyof.
// keyof User собирает ВСЕ ключи в объединение, а T[...] по ним
// достаёт ВСЕ типы значений сразу.
interface User {
  name: string;
  age: number;
}

type Keys = keyof User;         // = 'name' | 'age'  (объединение ключей)
type Values = User[keyof User]; // = string | number (объединение значений)

// User[keyof User] читается как «тип любого значения объекта User».
// Это как перебрать все поля и собрать их типы в один union.`;

  protected readonly arrayElement = `// У массива есть особый «ключ» — number. T[number] = тип ЭЛЕМЕНТА.
// Логика та же: obj[0], obj[1]... — все элементы имеют один тип,
// поэтому «доступ по числовому ключу» и даёт тип элемента.
type Names = string[];
type Item = Names[number]; // = string  (тип одного элемента)

// Работает и для массива объектов:
interface User {
  name: string;
  age: number;
}
type Users = User[];
type OneUser = Users[number]; // = User

// Так тип элемента вытаскивают, не заводя отдельного имени для него.`;

  protected readonly tupleByPosition = `// Кортеж (tuple) — массив с ФИКСИРОВАННЫМИ позициями и типами.
// К нему можно обращаться по КОНКРЕТНОМУ индексу-литералу.
type Pair = [string, number];

type First = Pair[0];  // = string  (тип на позиции 0)
type Second = Pair[1]; // = number  (тип на позиции 1)

// Индекс здесь — литеральный тип-число 0 или 1, а не «любое число».`;

  protected readonly tupleByNumber = `// А если обратиться к кортежу по number — получим ОБЪЕДИНЕНИЕ
// типов всех его позиций (ведь number — это «любой индекс»).
type Pair = [string, number];

type ByPos = Pair[0];       // = string        (точная позиция)
type Any = Pair[number];    // = string | number (любая позиция → union)

// Сравните: Pair[0] — про одну ячейку, Pair[number] — про все сразу.`;

  protected readonly nested = `// Индексный доступ можно ЦЕПЛЯТЬ — как obj['db']['port'] у значений.
// Так добираются до типа глубоко вложенного поля.
interface Config {
  db: {
    host: string;
    port: number;
  };
  retries: number;
}

type Db = Config['db'];           // = { host: string; port: number }
type Port = Config['db']['port']; // = number

// Каждая пара [] спускается на уровень глубже, оставаясь в мире типов.`;

  protected readonly reuseField = `// Практика: не ДУБЛИРОВАТЬ тип поля, а брать его прямо из источника.
interface User {
  id: number;
  name: string;
  roles: string[];
}

// ❌ Хрупко: тип id продублирован вручную. Поменяется User — забудем тут.
function findByIdBad(id: number) { /* ... */ }

// ✅ Надёжно: тип берётся ИЗ поля. User['id'] изменится — обновится и здесь.
function findById(id: User['id']) { /* ... */ } // id: number

// Тип элемента массива ролей — тоже через индексный доступ:
type Role = User['roles'][number]; // = string

// Один источник правды: форма User задаёт типы всюду, где на неё ссылаются.`;

  protected readonly valueOf = `// Обобщим связку T[keyof T] в переиспользуемый помощник.
// ValueOf<T> — «тип любого значения объекта T» (аналог keyof для значений).
type ValueOf<T> = T[keyof T];

interface User {
  name: string;
  age: number;
}

type UserValue = ValueOf<User>; // = string | number

// Например, чтобы описать «одно из значений словаря настроек»:
interface Flags {
  darkMode: boolean;
  fontSize: number;
}
type FlagValue = ValueOf<Flags>; // = boolean | number`;

  protected readonly genericGet = `// Индексный доступ + дженерики: безопасно «достать поле по ключу».
// K extends keyof T гарантирует, что key — реальный ключ объекта,
// а возвращаемый T[K] — ровно тип этого поля (не шире и не уже).
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Анна', age: 30 };

const n = getProp(user, 'name'); // T[K] = string → тип n: string
const a = getProp(user, 'age');  // T[K] = number → тип a: number

getProp(user, 'email');
// ❌ Argument of type '"email"' is not assignable to parameter
//    of type '"name" | "age"'. — такого ключа у user нет.`;
}
