import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../code/code-block';

@Component({
  selector: 'app-typescript-overview',
  imports: [CodeBlock, RouterLink],
  templateUrl: './typescript.html',
  styleUrls: ['../content/doc.scss'],
})
export class TypescriptOverview {
  protected readonly errorExample = `// Тип описывает, что мы ожидаем от аргумента.
// Ошибку видно сразу — ещё до запуска программы.
function greet(user: { name: string }): string {
  return 'Привет, ' + user.name;
}

greet({ name: 'Аня' }); // ок → "Привет, Аня"
greet('Аня');
// ❌ Ошибка компиляции: строка не подходит под тип { name: string }`;

  protected readonly sourceExample = `// Исходный код на TypeScript
const age: number = 30;

function double(x: number): number {
  return x * 2;
}`;

  protected readonly compiledExample = `// Результат компиляции — обычный JavaScript.
// Все типы стёрты, в рантайме их уже нет.
const age = 30;

function double(x) {
  return x * 2;
}`;

  protected readonly installExample = `# установить компилятор как зависимость проекта
npm install --save-dev typescript

# создать стартовый tsconfig.json
npx tsc --init

# скомпилировать app.ts → app.js
npx tsc app.ts

# следить за изменениями и пересобирать на лету
npx tsc --watch

# запустить .ts напрямую, без ручной компиляции (удобно в разработке)
npx tsx app.ts`;

  protected readonly tsconfigExample = `{
  "compilerOptions": {
    "target": "ES2022",     // в какую версию JS компилировать
    "module": "ESNext",     // какая модульная система на выходе
    "strict": true,         // включить все строгие проверки
    "outDir": "./dist",     // куда складывать готовый JS
    "sourceMap": true       // генерировать карты для отладки
  },
  "include": ["src/**/*"]   // какие файлы компилировать
}`;

  protected readonly inferenceExample = `// Аннотации нужны не всегда — многое TypeScript выводит сам.
let title = 'Привет';   // тип выведен как string
title = 42;             // ❌ ошибка: number нельзя присвоить string

const numbers = [1, 2, 3];        // number[]
const doubled = numbers.map((n) => n * 2); // n тоже number, без аннотаций`;
}
