import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-modules-types-third-party',
  imports: [CodeBlock, RouterLink],
  templateUrl: './third-party.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptModulesTypesThirdParty {
  protected readonly builtInImport = `// Ставим библиотеку как обычно:
//   npm i zod
import { z } from 'zod';

const User = z.object({
  name: z.string(),
  age: z.number(),
});

// И сразу же работает автодополнение, проверки типов, подсказки об ошибках.
// Мы НИЧЕГО не доустанавливали для типов — они приехали вместе с пакетом.
// Так бывает, когда библиотека написана на TypeScript
// или упаковала рядом с кодом свои .d.ts файлы.`;

  protected readonly typesField = `// Как понять, что типы «в комплекте»? Загляните в package.json пакета:
//   node_modules/zod/package.json
{
  "name": "zod",
  "version": "3.23.8",
  "main": "./lib/index.js",     // ← где лежит JS-код (это запускается)
  "types": "./lib/index.d.ts"   // ← где лежат ТИПЫ (это читает TypeScript)
}

// Ключевое поле — "types" (иногда его пишут как "typings", это синоним).
// Если оно есть — библиотека сама привела свою «инструкцию по эксплуатации»,
// и делать больше ничего не нужно. Типы работают из коробки.`;

  protected readonly plainJsProblem = `// А теперь противоположный случай: старая библиотека на чистом JavaScript.
// Классика — lodash (набор утилит для массивов, объектов и т.п.).
import { chunk } from 'lodash';

const groups = chunk([1, 2, 3, 4, 5], 2); // хотим [[1, 2], [3, 4], [5]]

// ❌ Could not find a declaration file for module 'lodash'.
//    '.../node_modules/lodash/lodash.js' implicitly has an 'any' type.
//    Try \`npm i --save-dev @types/lodash\` if it exists ...  (TS7016)

// Код-то есть, а ВОТ ИНСТРУКЦИИ (типов) к нему нет.
// В package.json у lodash нет поля "types" — библиотека приехала «без мануала».`;

  protected readonly installTypes = `# Типы для lodash написало сообщество — они лежат в отдельном пакете
# @types/lodash. Ставим его как DEV-зависимость (флаг -D):
npm i -D @types/lodash

# То же самое, но полным словом:
npm install --save-dev @types/lodash

# Почему именно -D (--save-dev)?
# Типы нужны ТОЛЬКО во время разработки и сборки — компилятору и редактору.
# В собранном приложении, которое крутится у пользователя, их нет и быть не должно.
# Поэтому @types/* всегда идут в devDependencies, а не в обычные dependencies.`;

  protected readonly devDepJson = `{
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash": "^4.17.7",
    "typescript": "^5.5.0"
  }
}`;

  protected readonly afterInstall = `// После установки @types/lodash тот же самый импорт оживает.
// Мы НЕ меняли ни строчки в своём коде — просто добавили «инструкцию».
import { chunk } from 'lodash';

const groups = chunk([1, 2, 3, 4, 5], 2);
// ✅ Ошибки больше нет. Тип groups выведен как number[][]
// ✅ Появилось автодополнение по chunk, debounce, cloneDeep и остальным
// ✅ Опечатку в аргументах компилятор теперь поймает

chunk(123, 2);
// ❌ Argument of type 'number' is not assignable to parameter of type 'List<unknown>'.
//    Проверки на месте — как будто lodash с самого начала был на TypeScript.`;

  protected readonly bundledTypesSearch = `// СЦЕНАРИЙ А. У пакета есть поле "types" — TS читает его напрямую.
import { z } from 'zod';
// node_modules/zod/package.json → "types": "./lib/index.d.ts"
// TypeScript берёт этот файл. Пакет @types/zod не нужен и не существует.`;

  protected readonly atTypesSearch = `// СЦЕНАРИЙ Б. Поля "types" нет — TS идёт в отдельную папку node_modules/@types/.
import { chunk } from 'lodash';
// node_modules/lodash/package.json → поля "types" НЕТ
// TypeScript ищет node_modules/@types/lodash/index.d.ts
// Нашёл (мы поставили @types/lodash) → типы подхватились автоматически.
// Ничего импортировать из '@types/lodash' руками НЕ нужно —
// достаточно, что пакет просто установлен: TS находит его сам.`;

  protected readonly stubDeclare = `// Файл: types/legacy.d.ts  (имя и папка — любые, лишь бы .d.ts попадал в сборку)

// Одна строка «успокаивает» компилятор: да, такой модуль существует.
declare module 'legacy-lib';

// Всё. Теперь import из 'legacy-lib' перестаёт быть ошибкой.`;

  protected readonly stubUsage = `// Теперь этот импорт компилируется — но за удобство мы платим проверками.
import { doMagic } from 'legacy-lib';

doMagic();               // ✅ ошибки нет
doMagic(1, 2, 3);        // ✅ и здесь нет — аргументы никто не проверяет
const r = doMagic();     // тип r — any

r.чтоУгодно.глубже.ещё;  // ✅ тоже молчит: any отключил ВСЕ проверки

// Заглушка declare module даёт модулю тип any (см. страницу про any и unknown).
// Код собирается и работает, но TypeScript вам здесь больше не помощник:
// ни автодополнения, ни защиты от опечаток. Это временный костыль, не решение.`;

  protected readonly ownTypes = `// Лучше заглушки — написать хотя бы минимальные СВОИ типы для того,
// чем реально пользуетесь. В том же файле types/legacy.d.ts:
declare module 'legacy-lib' {
  // описываем только нужные функции — по факту их поведения
  export function doMagic(times: number): string;
  export const version: string;
}

// Теперь модуль типизирован по-настоящему:
import { doMagic, version } from 'legacy-lib';

doMagic(3);        // ✅ ok, тип результата — string
doMagic();         // ❌ Expected 1 arguments, but got 0.
doMagic('нет');    // ❌ Argument of type 'string' is not assignable to 'number'.

// Проверки вернулись. Если позже эти типы кому-то ещё пригодятся —
// их можно оформить в полноценный .d.ts или даже отправить в @types.`;
}
