import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-mapped',
  imports: [CodeBlock, RouterLink],
  templateUrl: './mapped.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesMapped {
  protected readonly pieces = `// Отправная точка — обычный тип пользователя. Вернёмся к нему на всей странице.
interface User {
  name: string;
  age: number;
  admin: boolean;
}

// Две «детали», из которых собран ЛЮБОЙ отображённый (mapped) тип:
type Keys = keyof User;       // = 'name' | 'age' | 'admin'  — объединение имён ключей
type NameType = User['name']; // = string  — тип значения по ключу (индексный доступ)

// Отображённый тип берёт КАЖДЫЙ ключ K из объединения (keyof User)
// и для него достаёт тип значения User[K]. Пройдя по всем ключам —
// собирает из них новый объектный тип. Всё это происходит В МИРЕ ТИПОВ,
// на этапе компиляции: никакого цикла в рантайме здесь нет.`;

  protected readonly copy = `// Самый первый mapped-тип — «копировальный конвейер»: пройтись по всем
// ключам T и оставить каждое поле как есть (K: T[K] — «имя: его же тип»).
type Copy<T> = { [K in keyof T]: T[K] };

// Правило «ничего не меняем» даёт точную копию исходного типа:
type UserCopy = Copy<User>;
// = {
//     name: string;
//     age: number;
//     admin: boolean;
//   }

// Читается так: «для каждого ключа K из keyof User сделай поле K,
// а типом значения возьми User[K]». Пока это тождество — но именно сюда,
// в правило справа от двоеточия, мы дальше и будем вмешиваться.`;

  protected readonly myReadonly = `// Первое настоящее применение — добавить модификатор readonly ПЕРЕД [K ...].
// Теперь каждое поле нового типа станет доступным только для чтения.
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

type ReadonlyUser = MyReadonly<User>;
// = {
//     readonly name: string;
//     readonly age: number;
//     readonly admin: boolean;
//   }

const u: ReadonlyUser = { name: 'Аня', age: 30, admin: false };
u.age = 31;
// ❌ Cannot assign to 'age' because it is a read-only property.
//    Модификатор readonly навесился на КАЖДЫЙ ключ разом.`;

  protected readonly myPartial = `// Модификатор ? делает КАЖДОЕ поле необязательным.
type MyPartial<T> = { [K in keyof T]?: T[K] };

type PartialUser = MyPartial<User>;
// = {
//     name?: string;
//     age?: number;
//     admin?: boolean;
//   }

// Реальный кейс — «патч» настроек: разрешаем передать лишь часть полей,
// а не весь объект целиком.
const patch: PartialUser = { age: 31 }; // ✅ остальные поля можно опустить`;

  protected readonly mutable = `// Модификаторы можно не только ДОБАВЛЯТЬ, но и СНИМАТЬ — знаком «минус».
// -readonly убирает readonly со всех полей (делает тип изменяемым).
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Возьмём тип, где все поля «заморожены» (только для чтения)...
interface Frozen {
  readonly id: number;
  readonly title: string;
}

type Editable = Mutable<Frozen>;
// = {
//     id: number;
//     title: string;
//   }

const post: Editable = { id: 1, title: 'Черновик' };
post.title = 'Опубликовано'; // ✅ readonly снят — присваивание разрешено`;

  protected readonly myRequired = `// -? снимает необязательность: делает КАЖДОЕ поле обязательным.
type MyRequired<T> = { [K in keyof T]-?: T[K] };

interface Options {
  cache?: boolean;
  timeout?: number;
}

type StrictOptions = MyRequired<Options>;
// = {
//     cache: boolean;
//     timeout: number;
//   }

const o: StrictOptions = { cache: true };
// ❌ Property 'timeout' is missing in type '{ cache: true; }'
//    but required in type 'StrictOptions'.
//    Знак ? был снят у обоих полей — пропускать их больше нельзя.`;

  protected readonly flags = `// До сих пор мы копировали тип значения через T[K].
// Но на месте T[K] может стоять ЛЮБОЙ тип — правило-то наше.
// Сделаем из каждого поля булев флаг (тип значения = boolean):
type Flags<T> = { [K in keyof T]: boolean };

type UserFlags = Flags<User>;
// = {
//     name: boolean;
//     age: boolean;
//     admin: boolean;
//   }

// Реальный кейс — карта «какие поля формы пользователь уже трогал»:
const touched: UserFlags = { name: true, age: false, admin: false };`;

  protected readonly nullable = `// Ещё пример смены типа значений: разрешим каждому полю быть null.
// Исходный тип значения берём из T[K] и расширяем объединением с null.
type Nullable<T> = { [K in keyof T]: T[K] | null };

type NullableUser = Nullable<User>;
// = {
//     name: string | null;
//     age: number | null;
//     admin: boolean | null;
//   }

// Удобно для «сырых» данных, где поле ещё не заполнено:
const draft: NullableUser = { name: null, age: null, admin: null };`;

  protected readonly getters = `// Мы меняли ТИП значений. Теперь переименуем сами КЛЮЧИ — через слово as.
// Новый ключ собираем ШАБЛОННЫМ литеральным типом: 'get' + Имя с большой буквы.
// Capitalize<...> делает первую букву заглавной.
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<User>;
// = {
//     getName: () => string;
//     getAge: () => number;
//     getAdmin: () => boolean;
//   }

// Зачем string & K? Ключ K по типу — string | number | symbol,
// а Capitalize умеет работать ТОЛЬКО со строками. Пересечение (string & K)
// отбрасывает number и symbol, оставляя строковую часть ключа. Без него —
// ❌ Type 'K' does not satisfy the constraint 'string'.`;

  protected readonly stdlib = `// Всё это — не «магия справочника». Ровно такие определения лежат
// в стандартной библиотеке TypeScript (файл lib.es5.d.ts):
//
//   type Partial<T>  = { [P in keyof T]?: T[P] };
//   type Required<T> = { [P in keyof T]-?: T[P] };
//   type Readonly<T> = { readonly [P in keyof T]: T[P] };
//
// Это в точности наши MyPartial / MyRequired / MyReadonly — буква в букву.

// Поэтому встроенные утилиты работают именно так, как мы разобрали:
type A = Partial<User>;  // = { name?: string; age?: number; admin?: boolean }
type B = Readonly<User>; // = { readonly name: string; readonly age: number; readonly admin: boolean }

// Разобравшись с mapped-типами, вы одновременно поняли, КАК устроены
// Partial, Readonly, Required, Pick и почти весь набор утилитарных типов.`;
}
