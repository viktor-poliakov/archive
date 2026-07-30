import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-conditional',
  imports: [CodeBlock, RouterLink],
  templateUrl: './conditional.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesConditional {
  protected readonly anatomy = `// Условный тип — это ТЕРНАРНИК, но в мире ТИПОВ (не значений!).
// Читается ровно как "условие ? тогда : иначе":
//
//   type Cond<T> = T extends U ? X : Y;
//                  └── условие ──┘  └X┘ └Y┘
//                  "T — подтип U?"  да   нет
//
// Вопрос всегда один: "подходит ли T под форму U (является ли подтипом)?".
// Всё это вычисляется на ЭТАПЕ КОМПИЛЯЦИИ — в рантайме такого кода нет.

// "Число ли это?" — вопрос к типу, и ответ тоже тип:
type IsNumber<T> = T extends number ? 'да, число' : 'нет, не число';

type R1 = IsNumber<42>;   // 42 — подтип number   → = 'да, число'
type R2 = IsNumber<'42'>; // '42' — строка, не число → = 'нет, не число'`;

  protected readonly simpleExamples = `// Самый частый шаблон — вернуть литерал true или false.
// Проверка "строка ли T":
type IsString<T> = T extends string ? true : false;

type A = IsString<'привет'>; // 'привет' — подтип string → = true
type B = IsString<number>;   // number — не строка       → = false

// Проверка "массив ли T" (условие — форма unknown[]):
type IsArray<T> = T extends unknown[] ? true : false;

type C = IsArray<number[]>; // number[] подходит под unknown[] → = true
type D = IsArray<string>;   // одиночная строка — не массив    → = false

// Условие U может быть любой "формой": функцией, объектом, объединением.
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

type E = IsFunction<() => void>; // = true
type F = IsFunction<number>;     // = false`;

  protected readonly distributiveToArray = `// ГЛАВНАЯ и самая коварная особенность условных типов — РАСПРЕДЕЛЕНИЕ.
// Если проверяемый тип — это "голый" параметр T (просто T, без обёрток)
// и в него подставили ОБЪЕДИНЕНИЕ, условие применяется к КАЖДОМУ члену.

type ToArray<T> = T extends unknown ? T[] : never;

// Один тип — всё как ждёшь:
type A = ToArray<string>; // = string[]

// А теперь подставим ОБЪЕДИНЕНИЕ. Интуиция кричит "(string | number)[]".
// И ошибается:
type B = ToArray<string | number>; // = string[] | number[]   (!)

// Получилось "массив строк ИЛИ массив чисел",
// а НЕ "массив из (строк или чисел)". Это разные типы!`;

  protected readonly distributiveExplain = `// Что произошло по шагам. Компилятор разобрал объединение на члены,
// применил условие к КАЖДОМУ по отдельности и собрал результат обратно
// в объединение:
//
//   ToArray<string | number>
//     = ToArray<string> | ToArray<number>   // 1. разбили union на члены
//     = string[]        | number[]          // 2. применили условие к каждому
//     = string[] | number[]                 // 3. собрали обратно в union
//
// Ключевое слово — "голый" параметр. Распределение включается ТОЛЬКО когда
// слева от extends стоит сам T (T extends ...), а не T внутри чего-то.`;

  protected readonly neverDistribute = `// Особый случай: never — это ПУСТОЕ объединение (union без единого члена).
// Распределять не по чему → результат сразу never, ветки даже не смотрят.

type ToArray<T> = T extends unknown ? T[] : never;

type A = ToArray<never>; // = never   (а НЕ never[]!)

// Это регулярно удивляет: подставили never — на выходе тоже never,
// потому что "пройтись по нулю членов" нечем.`;

  protected readonly disableDistribution = `// Как ВЫКЛЮЧИТЬ распределение, если оно мешает?
// Спрятать T от "голой" позиции — обернуть ОБЕ стороны в кортеж [ ].
// Тогда слева уже не "голый T", а [T], и распределение не срабатывает.

type ToArrayNo<T> = [T] extends [unknown] ? T[] : never;

type A = ToArrayNo<string | number>; // = (string | number)[]

// Теперь объединение проверяется ЦЕЛИКОМ, как один неделимый тип.
// Сравните с распределяющей версией:
//   ToArray<string | number>   = string[] | number[]     (по членам)
//   ToArrayNo<string | number> = (string | number)[]     (целиком)`;

  protected readonly booleanDistribute = `// boolean — это на самом деле объединение true | false.
// Значит "голый" boolean в условном типе тоже РАСПРЕДЕЛЯЕТСЯ!

type Flip<T> = T extends true ? 'yes' : 'no';

type A = Flip<true>;  // = 'yes'
type B = Flip<false>; // = 'no'

// А вот и ловушка — подставляем сам boolean:
type C = Flip<boolean>; // = 'yes' | 'no'   (оба сразу, а не одно значение!)

// Потому что boolean = true | false, и условие сработало для КАЖДОГО:
//   Flip<boolean> = Flip<true> | Flip<false> = 'yes' | 'no'`;

  protected readonly nonNullable = `// Практика 1: убрать null и undefined из объединения.
// (В стандартной библиотеке это встроенный тип NonNullable<T>.)
type NoNullish<T> = T extends null | undefined ? never : T;

type Raw = string | null | number | undefined;
type Clean = NoNullish<Raw>; // = string | number

// Как это работает — снова распределение по каждому члену:
//   NoNullish<string>    = string      // не null/undefined → остаётся
//   NoNullish<null>      = never       // проваливается в never → исчезает
//   NoNullish<number>    = number      // остаётся
//   NoNullish<undefined> = never       // исчезает
// Итог: string | never | number | never = string | number
// (never в объединении просто растворяется — "пустое множество".)`;

  protected readonly selectByFlag = `// Практика 2: форма ответа API зависит от флага "подробный ли режим".
// Условие смотрит на литерал true/false и выбирает целую форму объекта.
type ApiUser<Detailed extends boolean> = Detailed extends true
  ? { id: number; name: string; email: string; createdAt: string } // подробно
  : { id: number; name: string };                                  // кратко

type Short = ApiUser<false>; // = { id: number; name: string }
type Full = ApiUser<true>;   // = { id: number; name: string; email: string; createdAt: string }

// А если передать сам boolean — распределение даст ОБА варианта сразу:
type Either = ApiUser<boolean>; // = ApiUser<true> | ApiUser<false>  (обе формы)`;

  protected readonly inferTeaser = `// Мостик к следующей теме. Ветка "да" условного типа умеет не просто
// возвращать готовый тип, а ПОЙМАТЬ тип изнутри проверяемого — через infer.
// Например, достать тип элемента массива:
type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>; // U "поймал" string → = string
type B = ElementType<number[]>; // = number

// Это и делает условные типы по-настоящему мощными — подробности на
// странице про infer.`;
}
