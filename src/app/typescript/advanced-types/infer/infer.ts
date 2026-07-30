import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-infer',
  imports: [CodeBlock, RouterLink],
  templateUrl: './infer.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesInfer {
  protected readonly inferIdea = `// infer ставит ЛОВУШКУ прямо внутри шаблона условного типа.
// Читаем так: «ЕСЛИ T имеет форму "массив из чего-то" —
// поймай это "что-то" в переменную U и верни его; ИНАЧЕ верни never».
type ElementType<T> = T extends (infer U)[] ? U : never;
//                                 ^^^^^^^ ловушка: сюда «упадёт» тип элемента

type A = ElementType<string[]>; // = string
// Как это вышло: тип string[] приложили к образцу (infer U)[].
// На месте U оказался string — его и вернули.
// Обрати внимание: мы НИГДЕ не писали string руками — тип ВЫЧИСЛИЛ компилятор.`;

  protected readonly inferOnlyConditional = `// infer живёт ТОЛЬКО внутри условия — в части «extends ШАБЛОН».
// Просто так, вне условного типа, ловушку поставить нельзя:
type Broken<T> = infer U;
// ❌ 'infer' declarations are only permitted in the 'extends' clause
//    of a conditional type.
//    (перевод: infer разрешён лишь в ветке extends условного типа)

// Правильно — ловушка всегда внутри «T extends ... ? ... : ...»:
type Ok<T> = T extends (infer U)[] ? U : never; // ✅`;

  protected readonly elementType = `// Достаём тип элемента массива. Образец — «массив из чего-то»: (infer U)[].
type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>;   // = string   — элемент массива строк
type B = ElementType<string[][]>; // = string[] — элемент «массива массивов» это массив
type C = ElementType<number>;     // = never    — number не массив, сработала ветка «иначе»

// Приём одинаковый: приложили конкретный тип к образцу с ловушкой —
// компилятор сопоставил их и вернул то, что попало в U.`;

  protected readonly returnTypeInfer = `// Тип ВОЗВРАТА функции. Ловушку ставим на месте типа результата (после «=>»).
// (...args: any[]) — «функция с какими угодно аргументами», сейчас они не важны.
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type N = MyReturnType<() => number>;           // = number
type S = MyReturnType<(x: number) => string>;  // = string

type Nope = MyReturnType<number>; // = never — number не функция, ветка «иначе»`;

  protected readonly unwrapPromise = `// Распаковка Promise: «если T — это Promise<чего-то>, дай это "что-то"».
// ВАЖНО: в ветке «иначе» возвращаем сам T, а НЕ never —
// не-Promise распаковывать не нужно, отдаём его как есть.
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // = string — сняли обёртку Promise
type B = UnwrapPromise<number>;          // = number — не Promise, вернулся как есть`;

  protected readonly multiInfer = `// В одном шаблоне можно поставить СРАЗУ несколько ловушек.
// Разберём кортеж на «голову» (первый элемент) и «хвост» (все остальные):
type HeadTail<T> =
  T extends [infer Head, ...infer Tail] ? { head: Head; tail: Tail } : never;
//          ^^^^^^^^^^^^   ^^^^^^^^^^^ две ловушки срабатывают одновременно

type R = HeadTail<[string, number, boolean]>;
// = { head: string; tail: [number, boolean] }
// Head поймал первый тип (string), Tail — кортеж из оставшихся ([number, boolean]).`;

  protected readonly firstArg = `// Достаём тип ПЕРВОГО аргумента функции — та же идея, ловушка на месте параметра.
type FirstArg<T> =
  T extends (first: infer F, ...rest: any[]) => any ? F : never;

type Handler = (event: MouseEvent, id: number) => void;
type E = FirstArg<Handler>; // = MouseEvent — поймали тип первого параметра

type X = FirstArg<string>;  // = never — string не функция, ветка «иначе»`;

  protected readonly nestedInfer = `// Ловушку можно спрятать ГЛУБОКО внутри шаблона — на любом уровне вложенности.
// Реальный кейс: ответ API имеет форму { data: ... }, нужен тип элемента списка.
interface User {
  id: number;
  name: string;
}

type ApiResponse = { data: User[]; status: number };

// Ловушка Item стоит внутри массива, который внутри поля data:
type ItemOf<T> = T extends { data: (infer Item)[] } ? Item : never;

type One = ItemOf<ApiResponse>; // = User
// Компилятор прошёл вглубь: { data: (infer Item)[] } → массив → элемент → Item.`;

  protected readonly builtinBridge = `// Почти всё это УЖЕ встроено в TypeScript — велосипед изобретать не нужно.
// ReturnType<F> — тип возврата функции (внутри устроен через infer, как выше):
type R = ReturnType<() => number>; // = number

// Awaited<P> — тип, до которого «дораскрутится» Promise (тоже через infer):
type A = Awaited<Promise<string>>; // = string

// Понимая infer, вы понимаете, КАК они сделаны, — и сможете написать свои,
// когда готового не хватит.`;
}
