import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-utility-types-exclude-extract',
  imports: [CodeBlock, RouterLink],
  templateUrl: './exclude-extract.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptUtilityTypesExcludeExtract {
  protected readonly unionAsBag = `// Объединение (union) — это НАБОР вариантов, «мешок с шариками».
// Читается через вертикальную черту | как «или то, или это, или вон то».
// Здесь Status — мешок из трёх шариков-строк:
type Status = 'idle' | 'loading' | 'done';

// Значение типа Status — это ОДИН из шариков мешка, любой на выбор:
const a: Status = 'idle';    // ✅ такой шарик в мешке есть
const b: Status = 'loading'; // ✅ и такой есть
const c: Status = 'error';
// ❌ Type '"error"' is not assignable to type 'Status'.
//    Шарика 'error' в мешке нет — значит, положить его нельзя.`;

  protected readonly excludeFirst = `// Exclude<T, U> — это ВЫЧИТАНИЕ из мешка.
// «Пройди по всем шарикам мешка T и ВЫКИНЬ те, что есть в U».
// Что осталось в мешке — это и есть результат.
type Status = 'idle' | 'loading' | 'done';

// Уберём из Status один шарик — 'loading':
type Settled = Exclude<Status, 'loading'>;
// Результат: 'idle' | 'done'
// (мешок был {idle, loading, done}, выкинули loading → осталось {idle, done})

const x: Settled = 'done'; // ✅ этот шарик остался в мешке
const y: Settled = 'loading';
// ❌ Type '"loading"' is not assignable to type 'Settled'.
//    Мы же его специально выбросили — теперь его нет.`;

  protected readonly excludeMany = `// Выкидывать можно СРАЗУ НЕСКОЛЬКО шариков — перечислите их через | во втором аргументе.
// Второй аргумент U — это тоже мешок, «список того, что надо убрать».
type Role = 'guest' | 'user' | 'editor' | 'admin' | 'owner';

// Оставим только «обычные» роли — уберём привилегированные:
type BasicRole = Exclude<Role, 'admin' | 'owner'>;
// Результат: 'guest' | 'user' | 'editor'
//   guest  — нет в {admin, owner} → остаётся
//   user   — нет в {admin, owner} → остаётся
//   editor — нет в {admin, owner} → остаётся
//   admin  — есть в {admin, owner} → ВЫКИДЫВАЕМ
//   owner  — есть в {admin, owner} → ВЫКИДЫВАЕМ

const r: BasicRole = 'editor'; // ✅
const p: BasicRole = 'admin';
// ❌ Type '"admin"' is not assignable to type 'BasicRole'.`;

  protected readonly excludeNoMatch = `// Важная деталь: Exclude выкидывает ТОЛЬКО реально существующие шарики.
// Если во втором аргументе указать то, чего в мешке нет, — ничего не изменится.
type Status = 'idle' | 'loading' | 'done';

// Просим убрать 'error', но такого шарика в мешке и не было:
type Same = Exclude<Status, 'error'>;
// Результат: 'idle' | 'loading' | 'done'  — мешок остался прежним, целиком.

// Ошибки при этом НЕ будет — Exclude просто не нашёл, что удалять.
// Это удобно: тип не сломается, если вы перестрахуетесь лишним значением.`;

  protected readonly extractFirst = `// Extract<T, U> — противоположность Exclude. Это ФИЛЬТР, который ОСТАВЛЯЕТ совпадения.
// «Пройди по всем шарикам мешка T и оставь ТОЛЬКО те, что есть и в U».
// Всё, чего в U нет, — выбрасывается.
type Status = 'idle' | 'loading' | 'done' | 'error';

// Оставим только «конечные» статусы — те, на которых всё закончилось:
type Finished = Extract<Status, 'done' | 'error'>;
// Результат: 'done' | 'error'
//   idle    — нет в {done, error} → выбрасываем
//   loading — нет в {done, error} → выбрасываем
//   done    — есть в {done, error} → ОСТАВЛЯЕМ
//   error   — есть в {done, error} → ОСТАВЛЯЕМ

const s: Finished = 'error'; // ✅ прошёл фильтр
const t: Finished = 'idle';
// ❌ Type '"idle"' is not assignable to type 'Finished'.
//    'idle' не совпал ни с одним значением из фильтра — его нет в результате.`;

  protected readonly extractExtra = `// Как и у Exclude, «лишние» значения во втором аргументе просто игнорируются.
// Extract оставит только те, что реально ЕСТЬ И в мешке, И в фильтре (пересечение).
type Status = 'idle' | 'loading' | 'done';

// В фильтре есть 'done' (он в мешке есть) и 'error' (в мешке его нет):
type Result = Extract<Status, 'done' | 'error'>;
// Результат: 'done'
//   'done'  — есть и в мешке, и в фильтре → оставляем
//   'error' — есть в фильтре, но НЕТ в мешке → в результат не попадёт

// Extract берёт только пересечение двух мешков — общие для обоих шарики.`;

  protected readonly excludeExtractPair = `// Exclude и Extract — две половинки одного мешка. Вместе они делят его надвое.
// Что Exclude выбрасывает — то Extract оставляет, и наоборот.
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// «Читающие» методы — только GET (обычно так):
type ReadMethod = Extract<HttpMethod, 'GET'>;
// Результат: 'GET'

// «Изменяющие» методы — всё, что НЕ GET:
type WriteMethod = Exclude<HttpMethod, 'GET'>;
// Результат: 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// ReadMethod и WriteMethod вместе покрывают весь HttpMethod без пересечений —
// мы аккуратно разрезали один мешок на два непересекающихся.`;

  protected readonly nonNullableFirst = `// NonNullable<T> — частный, но очень частый случай вычитания.
// Он выкидывает из мешка РОВНО два особых шарика: null и undefined.
// По смыслу это как Exclude<T, null | undefined>, но с коротким именем.
type MaybeName = string | null | undefined;

// Убираем «пустые» варианты — остаётся только настоящее значение:
type Name = NonNullable<MaybeName>;
// Результат: string
//   string    — не null и не undefined → остаётся
//   null      → выкидываем
//   undefined → выкидываем

const n: Name = 'Анна'; // ✅
const empty: Name = null;
// ❌ Type 'null' is not assignable to type 'Name'.
//    NonNullable гарантирует: здесь точно есть значение, «пустоты» быть не может.`;

  protected readonly nonNullableWhy = `// Зачем это нужно на практике. Часто значение приходит «может быть, а может и нет»:
// поле формы ещё не заполнено, ответ сервера может не содержать данных и т. п.
type Query = string | null | undefined;

// Функция обрабатывает поисковый запрос, но сначала проверяет, что он ЕСТЬ.
// После проверки мы точно знаем: null и undefined уже позади.
function runSearch(query: Query): string {
  if (query === null || query === undefined) {
    return 'пустой запрос';
  }
  // Здесь query сузился до string — можно спокойно звать строковые методы:
  const cleaned: NonNullable<Query> = query.trim(); // тип: string ✅
  return 'ищем: ' + cleaned;
}`;

  protected readonly eventsExclude = `// Практика 1. Есть мешок ВСЕХ событий приложения. Часть из них
// обрабатывает другой модуль, а нам достаются все ОСТАЛЬНЫЕ.
// Вместо того чтобы руками переписывать длинный union, вычтем ненужное.
type AppEvent =
  | 'click'
  | 'dblclick'
  | 'mousemove'
  | 'keydown'
  | 'keyup'
  | 'scroll'
  | 'resize';

// Клавиатурные события уходят в отдельный обработчик — уберём их из нашего мешка:
type PointerAndViewEvent = Exclude<AppEvent, 'keydown' | 'keyup'>;
// Результат: 'click' | 'dblclick' | 'mousemove' | 'scroll' | 'resize'

// Теперь функция принимает только «наши» события. Если завтра в AppEvent
// добавят новое событие — оно автоматически попадёт и сюда (мы ведь вычитаем).
function handle(event: PointerAndViewEvent): void {
  console.log('обрабатываю событие: ' + event);
}

handle('scroll'); // ✅
handle('keyup');
// ❌ Argument of type '"keyup"' is not assignable to parameter of type 'PointerAndViewEvent'.`;

  protected readonly eventsExtract = `// Практика 2. Из того же мешка событий оставим ТОЛЬКО «клик-подобные».
// Отбираем их фильтром Extract — перечисляем во втором аргументе, что нам интересно.
type AppEvent =
  | 'click'
  | 'dblclick'
  | 'mousemove'
  | 'keydown'
  | 'keyup'
  | 'scroll'
  | 'resize';

type ClickLikeEvent = Extract<AppEvent, 'click' | 'dblclick'>;
// Результат: 'click' | 'dblclick'

function onClick(event: ClickLikeEvent): void {
  console.log('клик: ' + event);
}

onClick('dblclick'); // ✅ прошёл фильтр
onClick('scroll');
// ❌ Argument of type '"scroll"' is not assignable to parameter of type 'ClickLikeEvent'.
//    'scroll' не входит в фильтр {click, dblclick} — значит, его в типе нет.`;

  protected readonly nonNullableArray = `// Практика 3. Почистили массив от «пустот» — и хотим описать тип уже ЧИСТЫХ элементов.
// Пусть с сервера пришёл список, где некоторые имена могли не загрузиться:
function cleanNames(raw: Array<string | null>): string[] {
  // filter с проверкой оставляет только настоящие строки.
  // Тип одного отфильтрованного элемента — NonNullable<string | null> = string.
  const result: NonNullable<string | null>[] = raw.filter(
    (name): name is string => name !== null,
  );
  return result;
}

const cleaned = cleanNames(['Анна', null, 'Борис', null]);
// cleaned: string[] — теперь в массиве гарантированно только строки, без null.
cleaned[0].toUpperCase(); // ✅ элемент — точно строка`;

  protected readonly notObjectKeys = `// САМАЯ ЧАСТАЯ ПУТАНИЦА новичков. Запомните раз и навсегда:
// Exclude / Extract работают с ЧЛЕНАМИ union-типа (шариками в мешке),
// а НЕ с ключами объекта. Это разные миры.

type User = {
  id: number;
  name: string;
  email: string;
};

// НЕВЕРНО: передать сюда объектный тип бессмысленно.
// User — это НЕ мешок вариантов, у него нечего «перебирать по членам».
type Wrong = Exclude<User, 'email'>;
// Результат: User  — ничего не удалилось, тип остался целым объектом.
// Exclude не умеет заглядывать внутрь объекта и трогать его ключи!

// ВЕРНО: чтобы убрать КЛЮЧ объекта, есть отдельный инструмент — Omit.
type PublicUser = Omit<User, 'email'>;
// Результат: { id: number; name: string }  — вот теперь ключ email исчез.`;

  protected readonly keysThenExclude = `// А вот СВЯЗКА, где Exclude действительно помогает объекту — но не напрямую.
// Сначала keyof превращает ключи объекта в НАСТОЯЩИЙ union (мешок строк),
// и уже по этому мешку можно вычитать.
type User = {
  id: number;
  name: string;
  email: string;
};

type UserKey = keyof User;
// UserKey — это union: 'id' | 'name' | 'email' (мешок из имён ключей)

// Теперь Exclude уместен — работаем с мешком строк, а не с самим объектом:
type VisibleKey = Exclude<UserKey, 'email'>;
// Результат: 'id' | 'name'

// По сути, Omit<User, 'email'> внутри устроен именно так:
// он берёт keyof, вычитает лишние ключи через Exclude и собирает объект заново.`;
}
