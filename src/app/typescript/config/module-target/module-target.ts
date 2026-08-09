import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-config-module-target',
  imports: [CodeBlock, RouterLink],
  templateUrl: './module-target.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptConfigModuleTarget {
  protected readonly targetJson = `{
  "compilerOptions": {
    "target": "ES2020"
  }
}`;

  protected readonly targetSource = `// Один и тот же исходный код на TypeScript:
const greet = (name: string) => \`Hello, \${name}!\`;

class Box {
  value = 0;
}`;

  protected readonly targetES5 = `// target: "ES5" — старый JavaScript. Современного синтаксиса там нет,
// поэтому компилятор ПЕРЕПИСЫВАЕТ его на старый лад ("понижает"):
"use strict";
var greet = function (name) { return "Hello, ".concat(name, "!"); };
// стрелка → обычная function, шаблон \`...\` → .concat()
var Box = /** @class */ (function () {
    function Box() {
        this.value = 0;
    }
    return Box;
}());
// class → старая конструкция на функции`;

  protected readonly targetES2020 = `// target: "ES2020" — современный JavaScript. Синтаксис почти не трогают,
// потому что браузеры и Node его и так понимают:
"use strict";
const greet = (name) => \`Hello, \${name}!\`; // стрелка и шаблон остались как есть
class Box {
    constructor() {
        this.value = 0;
    }
}`;

  protected readonly moduleJson = `{
  "compilerOptions": {
    "module": "ESNext"
  }
}`;

  protected readonly moduleSource = `// Исходный код с современными import / export:
import { add } from "./math";
export const total = add(2, 3);`;

  protected readonly moduleCjs = `// module: "CommonJS" — старая модульная система Node (require / module.exports).
// import/export ПЕРЕПИСЫВАЮТСЯ на require:
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.total = void 0;
const math_1 = require("./math");         // import → require
exports.total = (0, math_1.add)(2, 3);    // export → exports.total`;

  protected readonly moduleEsm = `// module: "ESNext" — современные ES-модули. import/export остаются как есть,
// потому что и браузеры, и современный Node их понимают напрямую:
import { add } from "./math";
export const total = add(2, 3);`;

  protected readonly resolutionNote = `// moduleResolution — КАК компилятор ищет файл по строке импорта
// (например, куда смотреть при import ... from "./math" или from "lodash").
// Главные варианты:
//
//   "bundler"  — для проектов со сборщиком (Vite, webpack). Современный выбор
//                для фронтенда. Понимает пути без расширений: from "./math".
//   "NodeNext" — для проектов под Node.js с настоящими ES-модулями.
//   "node10"   — старое поведение классического Node (встречается в старых проектах).
//
// Важно: module и moduleResolution должны СОГЛАСОВАТЬСЯ между собой (см. ниже).`;

  protected readonly comboBrowser = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}`;

  protected readonly comboNode = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}`;
}
