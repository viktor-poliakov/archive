import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-unions-narrowing-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUnionsNarrowingPitfalls {
  protected readonly typeofNull = `// Ловушка: typeof null === 'object' — историческая ошибка самого JavaScript.
function firstTag(value: string[] | null): string {
  if (typeof value === 'object') {
    // Ожидали сузить до string[], но сюда попадёт И null:
    // и массив, и null дают typeof === 'object'.
    return value[0];
    // ❌ 'value' is possibly 'null'.
  }
  return '';
}

// Правильно — отсекать null прямой проверкой, а не через typeof:
function firstTagSafe(value: string[] | null): string {
  if (value !== null) {
    return value[0] ?? ''; // ✅ value: string[]
  }
  return '';
}`;

  protected readonly truthinessFalsy = `// Ловушка: if (x) отсекает не только null/undefined, но и все falsy — 0, '', NaN.
function priceLabel(price: number | undefined): string {
  if (!price) {
    return 'цена не указана';
  }
  return price + ' руб.';
}

priceLabel(0); // 'цена не указана' — но 0 руб. это валидная (бесплатная) цена! ❗

// Правильно — сравнивать с undefined явно, если 0 / '' осмысленны:
function priceLabelSafe(price: number | undefined): string {
  if (price === undefined) {
    return 'цена не указана';
  }
  return price + ' руб.'; // ✅ сюда дойдёт и 0 → '0 руб.'
}`;

  protected readonly narrowingCallback = `// Ловушка: сужение свойства не «протекает» внутрь колбэка.
type Box = { value: string | null };

function process(box: Box): void {
  if (box.value !== null) {
    box.value.toUpperCase(); // ✅ здесь box.value сужен до string

    [1, 2, 3].forEach(() => {
      // Колбэк вызовут когда-то потом; TS не гарантирует, что к тому
      // моменту box.value всё ещё строка (объект могли изменить):
      box.value.toUpperCase();
      // ❌ 'box.value' is possibly 'null'.
    });
  }
}`;

  protected readonly narrowingClosure = `// То же — с переменной, которую переприсваивают ПОЗЖЕ создания замыкания.
function makeLogger(): () => string {
  let value: string | number = 'hello';
  const printLater = () => value.toUpperCase();
  // ❌ Property 'toUpperCase' does not exist on type 'string | number'.
  // value переприсваивают ниже → к моменту вызова стрелки там может быть
  // число, поэтому внутри замыкания TS берёт широкий тип, а не суженный.
  value = 42;
  return printLater;
}

// Лекарство — сужать ВНУТРИ замыкания, где проверка всегда актуальна:
function makeLoggerSafe(value: string | number): () => string {
  return () => (typeof value === 'string' ? value.toUpperCase() : String(value)); // ✅
}`;

  protected readonly filterBoolean = `// Ловушка: .filter(Boolean) убирает falsy в рантайме, но НЕ меняет тип.
const items: (string | undefined)[] = ['a', undefined, 'b'];

const cleaned = items.filter(Boolean);
// тип cleaned по-прежнему (string | undefined)[] — undefined из типа не ушёл!
cleaned.forEach((s) => s.toUpperCase());
// ❌ 's' is possibly 'undefined'.

// Правильно — предикат-guard: он сообщает filter тип результата.
const cleanedOk = items.filter((s): s is string => s !== undefined);
// тип cleanedOk: string[] ✅
cleanedOk.forEach((s) => s.toUpperCase()); // ✅ ошибок нет`;

  protected readonly discriminantWidened = `// Ловушка: дискриминант должен быть ЛИТЕРАЛОМ, иначе сужение ломается.
type Circle = { kind: 'circle'; r: number };
type Square = { kind: 'square'; size: number };
type Shape = Circle | Square;

// kind у обычного объекта выводится как широкий string, а не литерал 'circle':
const raw = { kind: 'circle', r: 10 }; // тип: { kind: string; r: number }
const shape1: Shape = raw;
// ❌ Type 'string' is not assignable to type '"circle"'.

// Лечится as const (фиксирует литеральные типы) или явной аннотацией:
const good = { kind: 'circle', r: 10 } as const;
const shape2: Shape = good; // ✅ kind выведен как 'circle'

const shape3: Shape = { kind: 'circle', r: 10 }; // ✅ тоже ок — цель уже Shape`;

  protected readonly inOptional = `// Ловушка: оператор in проверяет наличие КЛЮЧА, а не то, что значение задано.
type Config = { cache?: boolean; timeout: number };

function readCache(config: Config): boolean {
  if ('cache' in config) {
    // Кажется, раз ключ есть — значение точно boolean. Но свойство
    // опциональное: его тип boolean | undefined, и in этого не меняет.
    return config.cache;
    // ❌ Type 'boolean | undefined' is not assignable to type 'boolean'.
  }
  return false;
}

// Правильно — проверять значение, а не ключ:
function readCacheSafe(config: Config): boolean {
  return config.cache ?? false; // ✅
}`;

  protected readonly unionOfFunctions = `// Ловушка: у union функций параметры «пересекаются» — вызвать почти нельзя.
type StringFn = (x: string) => void;
type NumberFn = (x: number) => void;

function callEither(fn: StringFn | NumberFn): void {
  // Каким аргументом позвать fn, чтобы подошло ОБОИМ вариантам сразу?
  fn('hello');
  // ❌ Argument of type 'string' is not assignable to parameter of type 'never'.
  fn(42);
  // ❌ то же самое
}

// Параметр стал (string & number) = never: значения, годного одновременно
// и для StringFn, и для NumberFn, не существует. Сначала сузьте union
// до одной конкретной функции — и только потом вызывайте.`;

  protected readonly switchFallthrough = `// Ловушка: switch без break — «проваливание» (fallthrough) в следующий case.
// С return проблемы нет — он сам прерывает выполнение:
function iconOk(level: 'info' | 'warn' | 'error'): string {
  switch (level) {
    case 'error': return '[X]';
    case 'warn':  return '[!]';
    default:      return '[i]';
  }
}

// А вот с присваиванием и без break код «протечёт» в соседний case.
// К счастью, strict-опция noFallthroughCasesInSwitch (включена в проекте)
// ловит это на этапе компиляции:
function iconBad(level: 'info' | 'warn' | 'error'): string {
  let result = '';
  switch (level) {
    case 'error':
      result = '[X]';
    // ❌ Fallthrough case in switch. (noFallthroughCasesInSwitch)
    case 'warn':
      result = '[!]';
      break;
    default:
      result = '[i]';
  }
  return result;
}`;

  protected readonly asSilencing = `// Ловушка: as — это «затычка», а не проверка. Он не смотрит на данные,
// а лишь ЗАПРЕЩАЕТ компилятору возражать.
type ApiUser = { id: number; name: string };

async function loadUser(): Promise<void> {
  const data: unknown = await fetchJson();

  const user = data as ApiUser; // «я обещаю, что там ApiUser»
  console.log(user.name.toUpperCase());
  // Компилятор молчит. Но если сервер прислал не то — 💥 в рантайме.

  // Правильно — проверить форму guard'ом (см. «Проверки типов»):
  if (isApiUser(data)) {
    console.log(data.name.toUpperCase()); // ✅ проверено и в рантайме тоже
  }
}

async function fetchJson(): Promise<unknown> {
  return JSON.parse('{"id":1,"name":"Анна"}');
}
function isApiUser(v: unknown): v is ApiUser {
  return typeof v === 'object' && v !== null && 'id' in v && 'name' in v;
}`;
}
