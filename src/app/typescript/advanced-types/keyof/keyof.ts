import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-advanced-types-keyof',
  imports: [CodeBlock, RouterLink],
  templateUrl: './keyof.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptAdvancedTypesKeyof {
  protected readonly painNoKeyof = `interface Product {
  id: number;
  title: string;
  price: number;
}

// БЕЗ keyof список ключей приходится дублировать «руками»:
type ProductField = 'id' | 'title' | 'price';

// Проблема: завтра в Product добавят поле inStock — а этот union
// забудут обновить. Два списка «разъезжаются», но компилятор молчит:
// он никак не связывает ProductField с самим типом Product.

// С keyof набор ключей ВСЕГДА берётся прямо из типа-источника:
type ProductField2 = keyof Product; // = 'id' | 'title' | 'price'
// Добавите поле в Product — ProductField2 обновится сам, автоматически.`;

  protected readonly keyofUser = `interface User {
  name: string;
  age: number;
  email: string;
}

// keyof берёт ТИП-объект и возвращает ОБЪЕДИНЕНИЕ имён его ключей
// в виде строковых литералов — это и есть «оглавление типа».
type UserKey = keyof User; // = 'name' | 'age' | 'email'

// Важно: UserKey — это ТИП, а не значение. Он существует только
// на этапе компиляции и описывает МНОЖЕСТВО из трёх допустимых
// строк-ключей. В собранном JavaScript от него не останется ни следа.`;

  protected readonly keyofUnion = `interface User {
  name: string;
  age: number;
  email: string;
}

type UserKey = keyof User; // = 'name' | 'age' | 'email'

// Раз keyof — это ОБЪЕДИНЕНИЕ литералов, к нему применимы
// все обычные приёмы работы с объединениями. Например, выкинуть член:
type PublicKey = Exclude<UserKey, 'email'>; // = 'name' | 'age'

// ...или оставить только пересечение с другим набором имён:
type Editable = Extract<UserKey, 'name' | 'phone'>; // = 'name'`;

  protected readonly keyofAssign = `interface User {
  name: string;
  age: number;
  email: string;
}

// Переменная типа keyof User принимает ТОЛЬКО реальные ключи User:
const k1: keyof User = 'name';  // ✅ 'name' входит в объединение
const k2: keyof User = 'email'; // ✅ ок

const k3: keyof User = 'phone';
// ❌ Type '"phone"' is not assignable to type 'keyof User'.
//    Ключа 'phone' у User нет — компилятор ловит опечатку сразу же.`;

  protected readonly keyofIndexSig = `// Если у типа не фиксированный набор полей, а ИНДЕКСНАЯ СИГНАТУРА
// («любой строковый ключ → число»), то конкретных имён-ключей нет.
interface Scores {
  [player: string]: number;
}

type ScoreKey = keyof Scores; // = string | number

// Почему не просто string, а ещё и number?
// В JavaScript числовой ключ obj[1] всё равно превращается в строку '1',
// поэтому строковая сигнатура допускает обращение и по числу тоже.`;

  protected readonly keyofUnionObjects = `interface Article {
  id: number;
  title: string;
  body: string;
}

interface Video {
  id: number;
  title: string;
  durationSec: number;
}

// keyof от ОБЪЕДИНЕНИЯ типов даёт только ОБЩИЕ для всех ключи.
// Логика: если значение — это Article ИЛИ Video, безопасно обращаться
// лишь к тем ключам, что есть у ОБОИХ (иначе на Video не найдётся body).
type ContentKey = keyof (Article | Video); // = 'id' | 'title'

// body есть только у Article, durationSec — только у Video: оба выпадают.`;

  protected readonly getProp = `// Классический кейс: безопасно достать поле объекта по имени ключа.
// K ограничен через \`extends keyof T\` — значит key может быть
// ТОЛЬКО настоящим ключом T. А тип результата — T[K] (индексный доступ):
// какой ключ передали, такой тип поля и вернётся.
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Аня', age: 30, isAdmin: false };

const a = getProp(user, 'name'); // K = 'name' → тип a: string
const b = getProp(user, 'age');  // K = 'age'  → тип b: number

getProp(user, 'phone');
// ❌ Argument of type '"phone"' is not assignable to
//    parameter of type '"name" | "age" | "isAdmin"'.`;

  protected readonly iterateKeys = `const settings = { theme: 'dark', fontSize: 14, wrap: true };

// keyof живёт в МИРЕ ТИПОВ (только этап компиляции):
type SettingKey = keyof typeof settings; // = 'theme' | 'fontSize' | 'wrap'

// А Object.keys работает в РАНТАЙМЕ и намеренно возвращает string[],
// а не ('theme' | 'fontSize' | 'wrap')[]: в объект во время работы
// могло попасть «лишнее» поле, и TS не гарантирует точный набор ключей.
const keys = Object.keys(settings); // тип: string[]

// Если вы уверены в форме объекта, набор ключей можно сузить
// приведением (as) — но ответственность за это берёте на себя:
for (const key of Object.keys(settings) as (keyof typeof settings)[]) {
  const value = settings[key]; // тип value: string | number | boolean
}`;

  protected readonly keyofTypeof = `// typeof берёт ТИП из существующего ЗНАЧЕНИЯ, а keyof — его ключи.
// Связка keyof typeof очень частая: описать «имена» готового объекта.
const routes = {
  home: '/',
  profile: '/profile',
  settings: '/settings',
} as const;

type RouteName = keyof typeof routes; // = 'home' | 'profile' | 'settings'

function navigate(to: RouteName) {
  // to может быть только 'home' | 'profile' | 'settings'
}

navigate('profile'); // ✅
navigate('about');
// ❌ Argument of type '"about"' is not assignable to
//    parameter of type '"home" | "profile" | "settings"'.`;
}
