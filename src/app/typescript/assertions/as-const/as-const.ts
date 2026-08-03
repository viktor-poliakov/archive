import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-assertions-as-const',
  imports: [CodeBlock, RouterLink],
  templateUrl: './as-const.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAssertionsAsConst {
  protected readonly widenPrimitives = `// Литерал — это конкретное значение, вписанное прямо в код:
// строка 'idle', число 42, true. У литерала есть свой «узкий» тип —
// например, у 'idle' тип может быть буквально 'idle'. Но не всегда.

let s = 'idle';   // тип: string  (НЕ 'idle'!)
// let — переменная «мягкая»: ей можно переприсвоить другое значение,
// поэтому TypeScript заранее РАСШИРЯЕТ тип до string — вдруг положат 'loading'.
s = 'loading';    // ✅ разрешено — подходит любая строка

const c = 'idle'; // тип: 'idle'  (ровно этот литерал!)
// const переприсвоить нельзя. Раз значение застыло, TypeScript может
// сузить тип до самого литерала — это и называют «сохранением литерала».`;

  protected readonly widenObject = `// А вот с ОБЪЕКТАМИ даже const не спасает — тип всё равно расширяется вглубь.
const o = {
  status: 'idle',
  count: 42,
};
// Тип выводится как { status: string; count: number },
// а НЕ как { status: 'idle'; count: 42 }. Почему?

// Потому что const держит только саму ССЫЛКУ o (её нельзя переприсвоить),
// но ПОЛЯ объекта остаются мутабельными — их менять никто не запрещал:
o.status = 'loading'; // ✅ разрешено! Полю status можно присвоить любую строку.

// Раз status в будущем может стать любой строкой — TypeScript честно
// и выводит его тип как string, а не как узкий литерал 'idle'.`;

  protected readonly asConstBasics = `// as const — это утверждение (assertion), которое говорит компилятору:
// «заморозь значение как есть: самый УЗКИЙ (литеральный) тип
//  и всё только для чтения (readonly)».

const a = 'idle' as const; // тип: 'idle'  (а не string)
const b = 42 as const;     // тип: 42      (а не number)

const o = {
  status: 'idle',
  count: 42,
} as const;
// тип: { readonly status: 'idle'; readonly count: 42 }
//      ↑ каждое поле стало readonly И получило литеральный тип

const arr = [1, 2, 3] as const;
// тип: readonly [1, 2, 3]
//      ↑ не number[], а readonly-КОРТЕЖ (tuple) фиксированной длины`;

  protected readonly configExample = `// Практика A: неизменяемый конфиг. Заморозили один раз —
// и его больше нельзя случайно испортить где-то в глубине кода.
const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
} as const;
// тип: {
//   readonly apiUrl: 'https://api.example.com';
//   readonly timeout: 5000;
//   readonly retries: 3;
// }

CONFIG.timeout = 10000;
// ❌ Cannot assign to 'timeout' because it is a read-only property.
// Компилятор не даст переписать поле — конфиг защищён от случайных правок.

// Читать по-прежнему можно как обычно:
fetch(CONFIG.apiUrl); // ✅`;

  protected readonly rolesUnion = `// Практика B (очень частый приём): вывести union-тип ИЗ массива значений.
// Держим список ролей в одном месте — и получаем из него тип автоматически.
const ROLES = ['admin', 'editor', 'guest'] as const;
// тип ROLES: readonly ['admin', 'editor', 'guest']
// (без as const было бы string[] — и приём бы не сработал)

// Разберём запись type Role = typeof ROLES[number] по частям:
//   typeof ROLES  — берём ТИП переменной ROLES (тот самый readonly-кортеж).
//                   typeof здесь про ТИПЫ, это не typeof из рантайма!
//   [number]      — «индексируем» кортеж числовым индексом, то есть берём тип
//                   ЛЮБОГО его элемента → объединение (union) всех элементов.
type Role = typeof ROLES[number];
// тип Role: 'admin' | 'editor' | 'guest'

function setRole(role: Role) {
  /* ... */
}
setRole('editor'); // ✅ 'editor' входит в union
setRole('owner');
// ❌ Argument of type '"owner"' is not assignable to parameter of type 'Role'.

// Добавите роль в массив ROLES — тип Role обновится сам. Один источник правды.`;

  protected readonly tupleExample = `// Практика C: точный КОРТЕЖ вместо «размытого» массива.

// Без as const массив-литерал расширяется до number[]:
const point1 = [10, 20];
// тип: number[] — «массив чисел неизвестной длины».
// TypeScript забыл, что элементов ровно два и что это x и y.

// С as const — точный кортеж (tuple) фиксированной длины и порядка:
const point2 = [10, 20] as const;
// тип: readonly [10, 20]

// Приём особенно полезен для пар «разных типов» — как возвращает
// useState в React: [значение, функция-сеттер].
function useToggle() {
  const value: boolean = false; // тип boolean (без аннотации был бы литерал false)
  const toggle = () => {};
  return [value, toggle] as const;
  // тип: readonly [boolean, () => void] — кортеж из ДВУХ разных типов.
  // Без as const тип был бы (boolean | (() => void))[] — бесполезная мешанина,
  // из которой при разборе не понять, где значение, а где функция.
}

const [isOpen, toggle] = useToggle();
// isOpen: boolean,  toggle: () => void — типы точно на своих местах ✅`;

  protected readonly actionExample = `// Практика D: объекты-действия (actions) для reducer —
// классический случай размеченных объединений (discriminated unions).
// Поле-ТЕГ 'type' обязано быть ЛИТЕРАЛОМ, иначе сужение по нему не сработает.

type Action =
  | { type: 'increment'; by: number }
  | { type: 'reset' };

function reduce(count: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return count + action.by; // ✅ здесь action сужен до ветки increment
    case 'reset':
      return 0;
  }
}

// Проблема БЕЗ as const: тег расширяется до string —
const bad = { type: 'increment', by: 1 };
// тип bad: { type: string; by: number }
reduce(0, bad);
// ❌ Type 'string' is not assignable to type '"increment" | "reset"'.

// as const фиксирует тег как литерал 'increment' — и всё сходится:
const good = { type: 'increment', by: 1 } as const;
// тип good: { readonly type: 'increment'; readonly by: 1 }
reduce(0, good); // ✅`;

  protected readonly deepReadonly = `// Нюанс 1: readonly от as const — ГЛУБОКИЙ (deep).
// Замораживаются не только верхние поля, но и все вложенные объекты и массивы.
const settings = {
  theme: 'dark',
  layout: {
    sidebar: true,
    columns: [1, 2, 3],
  },
} as const;

settings.theme = 'light';        // ❌ read-only property
settings.layout.sidebar = false; // ❌ read-only — вложенный объект тоже заморожен
settings.layout.columns.push(4); // ❌ у readonly-массива метода push просто нет

// Одно as const в конце заморозило всю структуру на любую глубину.`;

  protected readonly runtimeOnlyType = `// Нюанс 2: as const меняет только ТИП. В рантайме оно НИЧЕГО не делает:
// не копирует значение и не замораживает его по-настоящему.
const nums = [3, 1, 2] as const;

// Тип запрещает мутации — nums.push(4) не скомпилируется. Но само значение —
// обычный массив. Если «обойти» типы приведением as, рантайм его изменит:
(nums as number[]).push(4); // as снимает readonly — компилятор молчит...
console.log(nums);          // [3, 1, 2, 4] — массив РЕАЛЬНО изменился!

// Вывод: as const — это подсказка компилятору на этапе типов, а не защита
// в рантайме. Настоящую заморозку значения даёт Object.freeze(), а не as const.`;
}
