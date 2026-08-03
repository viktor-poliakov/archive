import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-utility-types-record',
  imports: [CodeBlock, RouterLink],
  templateUrl: './record.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUtilityTypesRecord {
  protected readonly painManual = `// Задача: описать «права доступа» для каждой роли в приложении.
// Ролей три: администратор, редактор и гость. Для каждой — да/нет.
// Без утилитарных типов приходится выписывать все поля руками:
interface Permissions {
  admin: boolean;
  editor: boolean;
  guest: boolean;
}

// Всё бы ничего, но проблем сразу несколько:
// 1. Роли перечислены ДВАЖДЫ — здесь и, скорее всего, где-то ещё
//    (например, в типе Role). Легко забыть синхронизировать.
// 2. Тип значения (boolean) повторяется в каждой строке — копипаста.
// 3. Добавили роль «moderator»? Нужно вручную дописать строку сюда.
//    Забыли — TypeScript даже не подскажет, что чего-то не хватает.`;

  protected readonly painDrift = `// Роли обычно уже описаны отдельно — как объединение строк-литералов:
type Role = 'admin' | 'editor' | 'guest';

// А права мы, ничего не подозревая, написали руками ещё раз:
interface Permissions {
  admin: boolean;
  editor: boolean;
  // ой, строку про guest забыли дописать!
}

// TypeScript молчит: с его точки зрения Permissions — законченный тип.
// Связи между Role и Permissions НЕТ, поэтому пропажу guest никто не ловит.
// Нужен инструмент, который скажет: «ключи бери ВОТ ОТСЮДА (из Role),
// а значение у всех одинаковое — boolean». Это и есть Record.`;

  protected readonly recordFirst = `// Record<K, V> строит тип объекта, у которого:
//   • КЛЮЧИ — это тип K (обычно объединение строк-литералов),
//   • ЗНАЧЕНИЯ — у ВСЕХ ключей один и тот же тип V.
// Читается как «справочник: каждый ключ K указывает на значение V».
type Role = 'admin' | 'editor' | 'guest';

type Permissions = Record<Role, boolean>;
// Record развернулся ровно в это:
// type Permissions = {
//   admin: boolean;
//   editor: boolean;
//   guest: boolean;
// }

// Одна короткая строка вместо трёх — и ключи взяты прямо из Role.
// Добавите в Role роль 'moderator' — Permissions подхватит её сам.`;

  protected readonly recordExhaustive = `// Когда K — объединение литералов, TypeScript ТРЕБУЕТ указать ВСЕ ключи.
// Это и есть «исчерпывающая карта»: ни один случай не забыт.
type Role = 'admin' | 'editor' | 'guest';
type Permissions = Record<Role, boolean>;

const canDelete: Permissions = {
  admin: true,
  editor: false,
  guest: false,
}; // ✅ все три роли на месте — компилятор доволен

const broken: Permissions = {
  admin: true,
  editor: false,
};
// ❌ Property 'guest' is missing in type '{ admin: boolean; editor: boolean; }'
//    Забыли guest — и TypeScript сразу это заметил. Вот та самая страховка,
//    которой не было у написанного вручную интерфейса.`;

  protected readonly recordDictionary = `// Второй частый случай: K = string. Тогда ключей заранее НЕ знаем —
// их сколько угодно, они добавляются на ходу. Получается свободный
// словарь (dictionary) «строка → значение». Классика — счётчик.
type WordCount = Record<string, number>;

const counts: WordCount = {};        // пустой словарь — это нормально
counts['привет'] = 1;                // добавили ключ на ходу
counts['мир'] = 2;
counts['привет'] = counts['привет'] + 1; // ✅ значение — число

// Никакого требования «перечислить все ключи» здесь нет: у string
// ключей бесконечно много. Record<string, V> — просто «объект, где
// под ЛЮБЫМ строковым ключом лежит значение типа V».`;

  protected readonly recordTranslations = `// Третий пример из жизни — словарь переводов интерфейса.
// Языков ровно два, поэтому ключ — объединение литералов 'ru' | 'en',
// а значение каждого — строка с переводом.
type Lang = 'ru' | 'en';
type Translation = Record<Lang, string>;

const greeting: Translation = {
  ru: 'Привет',
  en: 'Hello',
}; // ✅ оба языка на месте

// Забудете 'en' — тип не соберётся. Значит, ни одна фраза не «потеряет»
// перевод: Record заставляет заполнить ВСЕ языки, какие объявлены в Lang.
function t(dict: Translation, lang: Lang): string {
  return dict[lang]; // ✅ dict[lang] — точно string, ключ гарантированно есть
}`;

  protected readonly recordConfig = `// Четвёртый пример — настройки под каждое окружение.
// Окружений три; у каждого своя структура настроек (значение — объект).
type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiUrl: string;
  debug: boolean;
}

// Значением Record может быть ЛЮБОЙ тип, не только примитив —
// здесь это целый объект EnvConfig.
const configs: Record<Environment, EnvConfig> = {
  development: { apiUrl: 'http://localhost:3000', debug: true },
  staging: { apiUrl: 'https://staging.example.com', debug: true },
  production: { apiUrl: 'https://example.com', debug: false },
};

// Добавите окружение 'test' в Environment — TypeScript тут же напомнит
// дописать его настройки в configs. Забыть окружение просто не выйдет.`;

  protected readonly recordVsIndex = `// Record<string, V> и «индексная сигнатура» — это ОДНО И ТО ЖЕ.
// Индексная сигнатура — старый способ сказать «под любым строковым
// ключом лежит значение типа V»: запись [key: string]: V.

// Способ 1 — индексная сигнатура (длиннее):
interface Scores1 {
  [key: string]: number;
}

// Способ 2 — Record (короче и читается как фраза):
type Scores2 = Record<string, number>;

// Эти два типа полностью взаимозаменяемы:
const a: Scores1 = { math: 5, physics: 4 };
const b: Scores2 = { math: 5, physics: 4 };

// Record — просто более короткая и понятная запись того же самого.
// Плюс у Record есть суперсила, которой у string-сигнатуры нет:
// ключом можно взять ОБЪЕДИНЕНИЕ ЛИТЕРАЛОВ и получить проверку «все ключи».`;

  protected readonly recordLiteralVsString = `// Когда какой ключ выбрать? Смотрите, знаете ли вы ключи заранее.

// (A) Ключи известны и их конечный список — берите ОБЪЕДИНЕНИЕ ЛИТЕРАЛОВ.
//     Тогда Record требует заполнить КАЖДЫЙ ключ — ничего не забудете.
type Role = 'admin' | 'editor' | 'guest';
const seats: Record<Role, number> = {
  admin: 1,
  editor: 3,
  guest: 10,
}; // ❗ пропусти любую роль — будет ошибка компиляции

// (B) Ключи заранее НЕ известны (приходят извне, растут на ходу) —
//     берите Record<string, V>. Требования «заполнить всё» нет,
//     но и защиты «ключ точно существует» тоже нет:
const cache: Record<string, number> = {};
const value = cache['неизвестный-ключ'];
// тип value — number, ХОТЯ по факту там undefined (ключа-то нет).
// С литеральными ключами такой ловушки не бывает — все ключи на месте.`;
}
