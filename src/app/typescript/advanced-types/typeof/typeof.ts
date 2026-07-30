import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-typeof',
  imports: [CodeBlock, RouterLink],
  templateUrl: './typeof.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesTypeof {
  protected readonly twoTypeofs = `// ОДНО слово typeof — ДВА совершенно разных инструмента.
// Они живут в разных мирах и никогда не пересекаются.

// 1) Рантайм-оператор typeof — стоит в ВЫРАЖЕНИИ (в обычном коде).
//    Выполняется во время работы программы и ВОЗВРАЩАЕТ СТРОКУ.
let message = 'привет';
if (typeof message === 'string') {   // ← сравниваем со строкой 'string'
  console.log('это строка');         //    это ЗНАЧЕНИЕ, живёт в рантайме
}

// 2) typeof в позиции ТИПА — стоит после type или после двоеточия.
//    Работает на этапе КОМПИЛЯЦИИ и ВОЗВРАЩАЕТ ТИП.
type Message = typeof message;   // ← Message = string (тип значения message)

// Слово одинаковое, но смысл разный: первый typeof — про значения
// в рантайме, второй — про типы при компиляции. Не путайте их.`;

  protected readonly basicTypeQuery = `// «Снять мерку с готовой вещи»: у нас УЖЕ есть значение (объект),
// и мы хотим получить его ТИП, не выписывая его руками.
const user = {
  name: 'Анна',
  age: 30,
};

// typeof в позиции типа берёт тип прямо из значения:
type User = typeof user;
// User = { name: string; age: number }
//
// Обратите внимание: строка 'Анна' стала string, а число 30 — number.
// Для обычного const-объекта typeof даёт ШИРОКИЕ типы полей, не литералы.

// Теперь User — полноценный тип, его можно использовать где угодно:
function greet(u: User): string {
  return \`Привет, \${u.name}! Тебе \${u.age}.\`;
}`;

  protected readonly singleSourcePain = `// Проблема РУЧНОГО дублирования: значение и его тип пишут ДВАЖДЫ.

// Значение конфигурации приложения:
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};

// ...и отдельно, руками, тот же тип — который легко забыть обновить:
interface ConfigManual {
  apiUrl: string;
  timeout: number;
  retries: number;
}
// Добавили в config новое поле — а в ConfigManual забыли дописать.
// Значение и тип разъехались. Компилятор об этом даже не узнает.`;

  protected readonly singleSourceFix = `// Решение: ОДИН источник правды. Тип ВЫВОДИМ из значения через typeof.
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};

type Config = typeof config;
// Config = { apiUrl: string; timeout: number; retries: number }

// Теперь любое изменение config само отражается в типе Config:
// добавили поле в объект — оно тут же появилось в типе, без правок.
function applyConfig(c: Config): void {
  console.log(c.apiUrl, c.timeout, c.retries);
}`;

  protected readonly keyofTypeof = `// Очень частая связка: keyof typeof. Разберём её по шагам.
const user = {
  name: 'Анна',
  age: 30,
};

// Шаг 1 — typeof поднимает нас от ЗНАЧЕНИЯ к его ТИПУ:
type User = typeof user;      // { name: string; age: number }

// Шаг 2 — keyof берёт ИМЕНА ключей этого типа как объединение строк:
type UserKeys = keyof User;   // 'name' | 'age'

// То же самое одной строкой — так и пишут почти всегда:
type UserKeys2 = keyof typeof user;   // 'name' | 'age'

// Читается СПРАВА НАЛЕВО: сначала typeof user (взять тип значения),
// затем keyof (взять имена его ключей).`;

  protected readonly keyofTypeofUse = `// Зачем это на практике: функция должна принимать ТОЛЬКО реальный ключ.
const settings = {
  theme: 'dark',
  fontSize: 14,
  showLineNumbers: true,
};

// keyof typeof settings = 'theme' | 'fontSize' | 'showLineNumbers'.
// Параметр key ограничен этим объединением — чужие строки не пройдут.
function getSetting(key: keyof typeof settings) {
  return settings[key];
}

getSetting('theme');     // ✅ такой ключ есть
getSetting('fontSize');  // ✅ такой ключ есть

getSetting('color');
// ❌ Argument of type '"color"' is not assignable to parameter
//    of type '"fontSize" | "theme" | "showLineNumbers"'.
// Опечатку в имени ключа поймали на этапе компиляции, до запуска.`;

  protected readonly typeofFunction = `// typeof работает и над функциями: берём тип уже написанной функции,
// не выписывая её сигнатуру вручную.
function createUser(name: string, age: number) {
  return { name, age, createdAt: Date.now() };
}

type CreateUserFn = typeof createUser;
// CreateUserFn =
//   (name: string, age: number) => { name: string; age: number; createdAt: number }

// Полезно, чтобы объявить переменную ТОГО ЖЕ типа, что и функция:
let handler: typeof createUser;
handler = createUser;                    // ✅ сигнатуры совпадают

handler = (name: string) => ({ name });
// ❌ возвращаемый объект без полей age и createdAt не подходит под тип.`;

  protected readonly typeofArray = `// typeof над массивом-значением даёт ТИП этого массива.
const roles = ['admin', 'editor', 'viewer'];

type Roles = typeof roles;          // string[]

// А тип ЭЛЕМЕНТА достаём индексным доступом [number]:
type Role = (typeof roles)[number]; // string
// roles объявлен обычным массивом, поэтому элемент — широкий string.
// Чтобы получить ЛИТЕРАЛЫ 'admin' | 'editor' | 'viewer', нужен as const.`;

  protected readonly asConstBridge = `// Мостик к «справочникам» (замена enum). as const «замораживает»
// значение: массив становится readonly, а строки — ЛИТЕРАЛАМИ.
const ROLES = ['admin', 'editor', 'viewer'] as const;

type Role = (typeof ROLES)[number];
// Role = 'admin' | 'editor' | 'viewer'  — объединение конкретных строк!
// (без as const тут был бы просто string)

// Тот же приём для объекта-справочника:
const Status = {
  Active: 'ACTIVE',
  Blocked: 'BLOCKED',
} as const;

type StatusKey = keyof typeof Status;                    // 'Active' | 'Blocked'
type StatusValue = (typeof Status)[keyof typeof Status]; // 'ACTIVE' | 'BLOCKED'
// Матрёшка typeof / keyof / индексного доступа разобрана на странице
// про альтернативы enum.`;

  protected readonly valueNotType = `// ВАЖНО: в позиции типа typeof применяется к ЗНАЧЕНИЮ — к переменной,
// функции, объекту. К ТИПУ его применить НЕЛЬЗЯ: с типа мерку не снять,
// у него нет носителя-значения.
interface User {
  name: string;
}

type Broken = typeof User;
// ❌ 'User' only refers to a type, but is being used as a value here.
//    User — это ТИП, а typeof ждёт справа ЗНАЧЕНИЕ.

const currentUser = { name: 'Анна' };
type Ok = typeof currentUser;   // ✅ currentUser — ЗНАЧЕНИЕ, мерку снять можно`;
}
