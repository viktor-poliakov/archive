import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-config-compiler-options',
  imports: [CodeBlock, RouterLink],
  templateUrl: './compiler-options.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptConfigCompilerOptions {
  protected readonly createCmd = `# Создать tsconfig.json со всеми опциями и подсказками:
npx tsc --init`;

  protected readonly skeleton = `{
  "compilerOptions": {

  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`;

  protected readonly skeletonExplained = `// Три части файла tsconfig.json:
//
//   compilerOptions — КАК компилировать (сотни настроек: строгость, версия JS, ...)
//   include         — КАКИЕ файлы брать в проект  (папки/маски)
//   exclude         — что из include ВЫКИНУТЬ      (обычно node_modules и папка сборки)
//
// include берёт все .ts из папки src, а exclude убирает лишнее.
// Если include не указать — берутся все .ts от места, где лежит tsconfig.json.`;

  protected readonly starter = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`;

  protected readonly inputOutput = `{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "noEmit": false
  }
}`;

  protected readonly inputOutputExplained = `// rootDir — где лежат ИСХОДНИКИ (.ts).            Например: src/
// outDir  — куда положить ГОТОВЫЙ JavaScript.      Например: dist/
// noEmit  — если true, файлы НЕ создаются вообще:
//           компилятор только ПРОВЕРЯЕТ типы, а собирает код кто-то другой
//           (например, сборщик Vite/webpack). Очень частый режим в наши дни.
//
// Структура на диске получается такой:
//   src/index.ts   →  dist/index.js
//   src/utils.ts   →  dist/utils.js`;

  protected readonly emitExtras = `{
  "compilerOptions": {
    "sourceMap": true,
    "declaration": true
  }
}`;

  protected readonly emitExtrasExplained = `// sourceMap  — создать .map-файлы: связывают готовый .js с исходным .ts,
//              чтобы в отладчике браузера видеть СВОЙ код, а не собранный.
//              src/app.ts → dist/app.js + dist/app.js.map
//
// declaration — создать .d.ts-файлы (только описания типов, без кода).
//              Нужны, если вы публикуете БИБЛИОТЕКУ: чтобы её пользователи
//              видели типы. src/app.ts → dist/app.js + dist/app.d.ts`;

  protected readonly qualityJson = `{
  "compilerOptions": {
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}`;

  protected readonly qualityExplained = `// esModuleInterop — подружить современный "import" со старыми библиотеками
//                   в стиле CommonJS. Почти всегда стоит включать.
//                   Позволяет писать: import express from 'express'
//
// resolveJsonModule — разрешить импортировать .json как объект:
//                     import data from './config.json'
//
// forceConsistentCasingInFileNames — следить за регистром в путях.
//                   Спасает от беды «на Windows работает, на сервере Linux — нет»
//                   (import './User' против './user' — для Linux это РАЗНЫЕ файлы).
//                   В новых версиях TypeScript уже включена по умолчанию —
//                   указывать явно не обязательно, но и не вредно.
//
// skipLibCheck — не проверять типы ВНУТРИ чужих .d.ts (в node_modules).
//                Ускоряет сборку и убирает чужие ошибки, до которых вам нет дела.`;

  protected readonly extendsJson = `{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}`;

  protected readonly extendsExplained = `// extends — взять чужой готовый tsconfig за ОСНОВУ и добавить/переопределить
// поверх только своё. Как наследование: не переписывать всё с нуля.
//
// Так удобно:
//   • использовать готовые «рецепты» (@tsconfig/node20, @tsconfig/strictest);
//   • в монорепозитории держать общий базовый конфиг, а в каждом пакете —
//     маленький файл, который его расширяет.`;
}
