import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-assertions-as',
  imports: [CodeBlock, RouterLink],
  templateUrl: './as.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAssertionsAs {
  protected readonly getByIdMotivation = `// Берём элемент со страницы по его id.
const el = document.getElementById('canvas');
// Тип el — HTMLElement | null.
// TypeScript знает лишь, что это КАКОЙ-ТО элемент (или ничего).
// Что по id="canvas" стоит именно <canvas> — ему неоткуда узнать.

el.getContext('2d');
// ❌ 'el' is possibly 'null'.
// ❌ Property 'getContext' does not exist on type 'HTMLElement'.
//    (getContext есть только у <canvas>, а не у любого элемента)

// Но ТЫ-то знаешь: в разметке по этому id стоит именно <canvas>.
// Ты УТВЕРЖДАЕШЬ это компилятору оператором as — и он верит на слово:
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d'); // ✅ теперь getContext доступен`;

  protected readonly syntaxBoth = `const value: unknown = 'привет';

// 1) ОСНОВНОЙ синтаксис — value as Type. Читается «value КАК Type».
const a = value as string;
a.toUpperCase(); // ✅ теперь TS считает a строкой

// 2) СТАРЫЙ синтаксис — <Type>value. Делает ровно то же самое:
const b = <string>value;
b.toUpperCase(); // ✅ то же самое, что и выше

// НО форма <Type>value конфликтует с JSX и НЕ работает в .tsx-файлах:
// там <string> компилятор примет за открывающий HTML-тег.
// Поэтому в реальных проектах используют ТОЛЬКО форму as. Рекомендуем её.`;

  protected readonly asDisappears = `// ─── Что видит компилятор (TypeScript) ───
const raw: unknown = 'привет';
const text = raw as string;
console.log(text.toUpperCase());

// ─── Что реально выполнится (скомпилированный JavaScript) ───
const raw = 'привет';
const text = raw;                 // ← "as string" ПРОСТО ИСЧЕЗ
console.log(text.toUpperCase());

// as не оставляет в рантайме НИ СЛЕДА: ни проверки, ни преобразования.
// Это лишь пометка для компилятора на этапе проверки типов — и всё.`;

  protected readonly asIsNotConversion = `// СОБЛАЗН: превратить строку в число через as. Так НЕ РАБОТАЕТ.
const price = '42'; // строка, например из поля формы

const n1 = price as number;
// ❌ TS2352: Conversion of type 'string' to type 'number' may be a mistake...
// as даже не пытается что-то вычислять — он не для преобразования.

// Настоящее преобразование — это ФУНКЦИЯ, которая работает в рантайме:
const n2 = Number(price);       // 42 — число, реальная конвертация
const n3 = parseInt(price, 10); // 42 — тоже реальная конвертация

// Запомни: as ничего НЕ вычисляет и НЕ меняет данные.
// Number(x), String(x), parseInt(x) — вот это действительно меняет.`;

  protected readonly safeVsDangerous = `// TS разрешает приведение, только если типы «пересекаются» —
// один является частным случаем другого (вниз или вверх по иерархии).

const el: HTMLElement = document.body;
const btn = el as HTMLButtonElement; // ✅ ОК: кнопка — частный случай HTMLElement

// А приведение между НЕПЕРЕСЕКАЮЩИМИСЯ типами запрещено:
const hello = 'hello';
const num = hello as number;
// ❌ TS2352: Conversion of type 'string' to type 'number' may be a mistake
//    because neither type sufficiently overlaps with the other.
//    If this was intentional, convert the expression to 'unknown' first.

// string и number не пересекаются никак — TS подозревает ошибку и не пускает.
// Это последняя защита: as и так «выключает» проверку формы,
// так пусть хотя бы не даёт приводить заведомо несовместимое.`;

  protected readonly doubleAssertion = `// TS сам подсказал лазейку: «сначала приведи к unknown».
// Так рождается ДВОЙНОЕ приведение as unknown as T — «отмычка»,
// обходящая защиту из прошлого раздела.
const hello = 'hello';

// Шаг за шагом: string → unknown (можно всегда) → number (из unknown можно куда угодно)
const num = hello as unknown as number; // компилятор молчит

console.log(num + 1);    // "hello1" — это ПО-ПРЕЖНЕМУ строка! Склеилось, а не сложилось
console.log(typeof num); // "string"  — в рантайме тип не изменился ни на йоту

// Двойное приведение говорит компилятору «отвернись, я знаю, что делаю».
// Изредка оно оправдано (мосты между сложными типами чужих библиотек),
// но по сути это ГРОМКОЕ предупреждение: всю ответственность ты берёшь на себя.`;

  protected readonly asCanLie = `interface User {
  id: number;
  name: string;
}

// Создаём ПУСТОЙ объект и «обещаем» компилятору, что это User:
const u = {} as User;
// ✅ Ошибки компиляции НЕТ — as поверил на слово, форму не проверил.

console.log(u.name.toUpperCase());
// 💥 Рантайм: Cannot read properties of undefined (reading 'toUpperCase')
// Ведь на самом деле u.name === undefined — мы же ничего не клали в объект!

// as НИЧЕГО не добавил в объект. Он лишь наклеил этикетку «User» на пустую
// коробку. Компилятор верит этикетке, а рантайм смотрит на РЕАЛЬНОЕ содержимое.`;

  protected readonly checkInstead = `// Надёжная альтернатива as — РЕАЛЬНАЯ проверка в рантайме.
function handle(data: unknown) {
  // Проверяем форму — и только ВНУТРИ if компилятор сужает тип безопасно:
  if (typeof data === 'string') {
    data.toUpperCase(); // ✅ здесь data гарантированно строка — это ПРОВЕРЕНО
  }

  // Сравни с as — он бы просто ПООБЕЩАЛ тип, ничего не проверив:
  const risky = data as string;
  risky.toUpperCase(); // компилятор молчит, но если data — число, упадёт в рантайме
}

// typeof / instanceof / функции-проверки РЕАЛЬНО смотрят на данные в рантайме
// и остаются в скомпилированном коде. as — только обещание на этапе компиляции.`;
}
