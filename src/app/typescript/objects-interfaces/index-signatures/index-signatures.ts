import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-objects-interfaces-index-signatures',
  imports: [CodeBlock, RouterLink],
  templateUrl: './index-signatures.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ObjectsInterfacesIndexSignatures {
  protected readonly problemExample = `// Обычный тип объекта перечисляет ключи ПОИМЁННО.
// Мы заранее знаем: будет name и age, других полей нет.
interface User {
  name: string;
  age: number;
}

const u: User = { name: 'Аня', age: 30 };

// А если ключи заранее НЕизвестны? Например, словарь населения городов:
// 'Москва', 'Казань', 'Сочи'... — их сколько угодно, и все они разные.
// Перечислить каждый ключ в типе невозможно и бессмысленно.
const population = {
  'Москва': 13_100_000,
  'Казань': 1_300_000,
  'Сочи': 500_000,
  // ...ключей может быть сколько угодно
};`;

  protected readonly syntaxExample = `// Индексная сигнатура описывает объект-словарь:
// «ключ — строка, а значение под любым ключом — number».
interface Population {
  [city: string]: number;
}

// То же самое через псевдоним типа type:
type Population2 = {
  [city: string]: number;
};

const pop: Population = {
  'Москва': 13_100_000,
  'Казань': 1_300_000, // любой строковый ключ разрешён
};

pop['Сочи'] = 500_000;   // добавляем новый ключ — OK
pop['Омск'] = 'много';   // ❌ Type 'string' is not assignable to type 'number'
                         //    значение обязано быть number`;

  protected readonly keyTypesExample = `// Тип ключа может быть string, number или symbol.
interface ByName   { [key: string]: number } // ключи-строки — обычный словарь
interface ByIndex  { [key: number]: string } // ключи-числа (как у массива)
interface BySymbol { [key: symbol]: boolean } // ключи-символы

// НЮАНС про числовые ключи: в JavaScript у объекта нет НАСТОЯЩИХ
// числовых ключей — движок всё равно приводит число к строке.
const arr: { [i: number]: string } = { 0: 'a', 1: 'b' };
arr[0];   // 'a'
arr['0']; // 'a' — тот же самый элемент! Число и строка "0" совпадают.

// Поэтому тип значения у number-ключа обязан быть совместим
// с типом значения у string-ключа:
interface Mixed {
  [key: string]: string;
  [key: number]: number; // ❌ 'number' index type is not assignable
                         //    to 'string' index type 'string'
}`;

  protected readonly combineExample = `// Индексную сигнатуру можно сочетать с ИЗВЕСТНЫМИ свойствами.
// Правило: тип явного свойства обязан быть совместим с типом
// значения индексной сигнатуры.
interface Config {
  version: string;        // ❌ Property 'version' of type 'string' is not
                          //    assignable to 'string' index type 'number'
  [option: string]: number;
}

// Явное свойство того же типа — OK:
interface Counters {
  total: number;          // number совместим с number
  [name: string]: number; // остальные ключи — тоже number
}
const c: Counters = { total: 0, clicks: 3, views: 10 };

// Если явные свойства РАЗНОГО типа — расширьте тип значения
// сигнатуры до объединения, чтобы вместить их все:
interface Settings {
  theme: string;
  fontSize: number;
  [key: string]: string | number; // подходит и theme, и fontSize
}
const s: Settings = { theme: 'dark', fontSize: 14, lang: 'ru' };`;

  protected readonly undefinedAccessExample = `// ВАЖНЫЙ НЮАНС. Тип обещает number, но ключа-то может и не быть!
interface Prices { [product: string]: number }

const prices: Prices = { apple: 50, bread: 40 };

const x = prices['banana']; // тип x — number, ЗНАЧЕНИЕ — undefined!
x.toFixed(2);               // упадёт в рантайме: Cannot read ... of undefined

// По умолчанию TS верит сигнатуре и НЕ предупреждает — это дыра.`;

  protected readonly noUncheckedExample = `// Флаг noUncheckedIndexedAccess (в tsconfig) закрывает дыру:
// TS сам добавляет | undefined к результату доступа по ключу.
interface Prices { [product: string]: number }
const prices: Prices = { apple: 50 };

const x = prices['banana']; // теперь тип: number | undefined
x.toFixed(2);               // ❌ 'x' is possibly 'undefined'

// Безопасный доступ — сначала проверить:
if (x !== undefined) {
  x.toFixed(2); // OK — здесь x уже сужен до number
}

// Или значение по умолчанию:
const price = prices['banana'] ?? 0; // number`;

  protected readonly recordExample = `// Тот же словарь короче и нагляднее — через утилиту Record<Ключи, Значение>.
type Population = Record<string, number>;
// эквивалентно { [key: string]: number }

const pop: Population = { 'Москва': 13_100_000 };

// Плюс Record: ключи можно ОГРАНИЧИТЬ конкретным набором строк.
type Theme = 'light' | 'dark';
type Palette = Record<Theme, string>;

const palette: Palette = {
  light: '#ffffff',
  dark: '#000000',
  // sepia: '#f0e0c0', // ❌ лишний ключ — в Theme его нет
};`;

  protected readonly wordCountExample = `// ПРАКТИКА 1: счётчик частоты слов.
function countWords(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of text.toLowerCase().split(/\\s+/)) {
    if (!word) continue;
    // (counts[word] ?? 0) — если слова ещё нет, начинаем с нуля
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
}

countWords('да да нет да');
// { да: 3, нет: 1 }`;

  protected readonly cacheExample = `// ПРАКТИКА 2: простой кэш ответов по URL.
const cache: Record<string, string> = {};

function loadFromCache(url: string): string | undefined {
  return cache[url]; // может не быть — честно возвращаем undefined
}

function save(url: string, body: string): void {
  cache[url] = body;
}

save('/api/user', '{"id":1}');
loadFromCache('/api/user');  // '{"id":1}'
loadFromCache('/api/other'); // undefined — в кэше пусто`;

  protected readonly translationExample = `// ПРАКТИКА 3: словарь переводов ru → en.
type Dictionary = Record<string, string>;

const ruToEn: Dictionary = {
  'привет': 'hello',
  'мир': 'world',
  'кот': 'cat',
};

function translate(word: string): string {
  // если перевода нет — вернём исходное слово вместо undefined
  return ruToEn[word] ?? word;
}

translate('кот');    // 'cat'
translate('дракон'); // 'дракон' — не нашли, отдаём как есть`;
}
