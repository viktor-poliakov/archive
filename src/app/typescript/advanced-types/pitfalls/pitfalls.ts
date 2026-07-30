import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesPitfalls {
  protected readonly distributiveToArray = `// «Голый» параметр T (стоит в условии сам по себе, слева от extends)
// РАСПРЕДЕЛЯЕТ объединение: условие проверяется для КАЖДОГО члена
// по отдельности, а результаты потом собираются обратно в union.
type ToArray<T> = T extends unknown ? T[] : never;

// Ждём одну общую коробку (string | number)[], а получаем...
type A = ToArray<string | number>;
// = string[] | number[]   ← НЕ (string | number)[] !
// Как будто раздали каждому по СВОЕЙ коробке, а ждали одну общую кучу.

// Лекарство — обернуть обе стороны в кортеж [ ]. Тогда T перестаёт
// быть «голым», и распределение ВЫКЛЮЧАЕТСЯ:
type ToArrayAll<T> = [T] extends [unknown] ? T[] : never;

type B = ToArrayAll<string | number>;
// = (string | number)[]   ← теперь одна общая коробка  ✅`;

  protected readonly distributionUseful = `// Распределение — не всегда зло: на нём построены встроенные утилиты.
// Так, стандартный Exclude выкидывает члены из union именно за счёт него:
type MyExclude<T, U> = T extends U ? never : T;

type Roles = 'admin' | 'editor' | 'guest';

type NoGuest = MyExclude<Roles, 'guest'>;
// = 'admin' | 'editor'
// Каждый член проверился отдельно: 'guest' стал never и «испарился»
// из объединения (см. грабли про never ниже).`;

  protected readonly booleanDistribution = `// boolean — это НЕ отдельный атом, а сокращение для union: true | false.
// Значит условный тип над boolean тоже РАСПРЕДЕЛЯЕТСЯ по обеим веткам.
type Flip<T> = T extends true ? 'yes' : 'no';

type One = Flip<true>;   // = 'yes'
type Two = Flip<false>;  // = 'no'

type Both = Flip<boolean>;
// = 'yes' | 'no'   ← сработали ОБЕ ветки, а не одна!
// boolean тайком раздался на true и false, и каждый пошёл своим путём.
// Если ждали одну строку — вот вам сюрприз-объединение.`;

  protected readonly keyofUnion = `interface Circle {
  kind: 'circle';
  radius: number;
}
interface Square {
  kind: 'square';
  side: number;
}

// keyof от ОБЪЕДИНЕНИЯ объектов = только ОБЩИЕ для обоих ключи,
// а не все подряд. «Общий язык двух словарей — только общие слова».
type CommonKeys = keyof (Circle | Square);
// = 'kind'
// radius и side отсутствуют: они есть НЕ у каждого члена union,
// а значит на них нельзя опереться, не зная, какой из вариантов пришёл.

// Сравните: у пересечения (Circle & Square) ключи, наоборот, ВСЕ:
type AllKeys = keyof (Circle & Square);
// = 'kind' | 'radius' | 'side'`;

  protected readonly neverDistribution = `type ToArray<T> = T extends unknown ? T[] : never;

// never — это «пустое объединение» (union из НУЛЯ вариантов).
// Распределять НЕ ПО ЧЕМУ: веток ноль, собирать нечего — итог тоже never.
type Empty = ToArray<never>;
// = never   ← не never[], а именно never! Тип как будто «исчез».

// Это частый сюрприз: передали never в дженерик — и на выходе пусто,
// хотя логика тела условного типа даже не запускалась.

// Если такое поведение мешает — отключите распределение обёрткой [T]:
type ToArraySafe<T> = [T] extends [unknown] ? T[] : never;

type NotEmpty = ToArraySafe<never>;
// = never[]   ← теперь never обрабатывается как обычный цельный тип  ✅`;

  protected readonly remapCapitalize = `interface User {
  name: string;
  age: number;
}

// Ремаппинг ключей через as: хотим превратить name/age в getName/getAge.
// Но наивная запись с Capitalize<K> НЕ КОМПИЛИРУЕТСЯ:
type BadGetters<T> = {
  [K in keyof T as \`get\${Capitalize<K>}\`]: () => T[K];
};
// ❌ Type 'K' does not satisfy the constraint 'string'.
//    Type 'keyof T' is not assignable to type 'string'.
// Причина: ключ K бывает не только string, но и number | symbol,
// а Capitalize умеет работать ТОЛЬКО со строками.

// Лекарство — сузить K до строки пересечением string & K
// (нестроковые ключи при этом схлопнутся в never и отпадут):
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type G = Getters<User>;
// = { getName: () => string; getAge: () => number }   ✅`;

  protected readonly indexedElementVsPosition = `type Line = [string, number];

// T[0], T[1] — доступ по КОНКРЕТНОЙ ПОЗИЦИИ кортежа:
// тип элемента, который стоит именно на этом месте.
type First = Line[0];   // = string
type Second = Line[1];  // = number

// T[number] — «любой числовой индекс»: тип ЛЮБОГО элемента,
// то есть объединение типов со всех позиций сразу.
type Any = Line[number];
// = string | number

// Для обычного массива number-индекс даёт тип его элемента:
type Names = string[];
type Item = Names[number];
// = string

// Легко перепутать: [0] спрашивает про КОНКРЕТНОЕ место,
// а [number] — про «что вообще может лежать по индексу».`;

  protected readonly inferOutside = `// infer «ловит» имя для типа, но ЖИТЬ оно может ТОЛЬКО внутри
// условного типа — в его условии, справа от extends. Снаружи — ошибка.
type BadElement<T> = infer U;
// ❌ 'infer' declarations are only permitted in the 'extends' clause
//    of a conditional type.

// Правильно — infer стоит в условии, между extends и знаком ?:
type Element<T> = T extends (infer U)[] ? U : never;

type E = Element<string[]>;
// = string   ✅

// То же для возврата функции и распаковки Promise:
type MyReturn<T> = T extends (...args: any[]) => infer R ? R : never;
type R = MyReturn<() => number>;      // = number

type Unwrap<T> = T extends Promise<infer U> ? U : T;
type U1 = Unwrap<Promise<string>>;    // = string
type U2 = Unwrap<number>;             // = number  (не Promise → сам T)`;

  protected readonly recursionDepth = `// Условные типы умеют рекурсию — тип может ссылаться сам на себя.
// Пример: развернуть вложенные массивы до самого элемента.
type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T;

type F1 = Flatten<string[]>;      // = string   ✅
type F2 = Flatten<number[][][]>;  // = number   ✅

// Но у рекурсии есть ПОТОЛОК. Если тип раскручивается слишком глубоко
// (сотни уровней вложенности), компилятор сдаётся:
// ❌ Type instantiation is excessively deep and possibly infinite.
// А очень «умные» типы, даже не падая, заметно ЗАМЕДЛЯЮТ проверку
// и сборку — за красоту на уровне типов платят временем компиляции.`;

  protected readonly runtimeErasure = `// ГЛАВНОЕ, что стоит держать в голове: всё это — МИР ТИПОВ.
// Он существует только на этапе компиляции. После сборки типы
// СТИРАЮТСЯ — в готовом JavaScript от них не остаётся и следа.
type Config = { url: string; retries: number };
type ToArray<T> = T extends unknown ? T[] : never;

// Ни Config, ни ToArray, ни keyof нельзя «потрогать» в рантайме:
console.log(typeof Config);
// ❌ 'Config' only refers to a type, but is being used as a value here.

// В рантайме работает ДРУГОЙ typeof — оператор над ЗНАЧЕНИЕМ:
const url = 'https://api.example.com';
console.log(typeof url);
// = 'string'   ← обычная строка в рантайме  ✅

// Условные, отображённые, шаблонные типы — это инструкции ДЛЯ
// компилятора, а не код, который выполняется. В собранном .js их нет.`;
}
