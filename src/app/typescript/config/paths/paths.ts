import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-config-paths',
  imports: [CodeBlock, RouterLink],
  templateUrl: './paths.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptConfigPaths {
  protected readonly relativeVsBare = `// В строке импорта бывает два вида путей.

// 1) ОТНОСИТЕЛЬНЫЙ — начинается с ./ или ../
//    Это путь к вашему файлу относительно текущего.
import { add } from './math';           // файл math.ts лежит рядом
import { User } from '../models/user';  // на папку выше, в models/

// 2) «ГОЛЫЙ» (bare) — просто имя, без ./ впереди.
//    Компилятор идёт искать его в папке node_modules (установленный пакет).
import express from 'express';          // пакет из node_modules
import { z } from 'zod';                // тоже пакет`;

  protected readonly resolutionSteps = `// Как компилятор ищет файл для import { add } from './math':
//
//   ./math  →  пробует ./math.ts
//           →  потом ./math.tsx, ./math.d.ts
//           →  потом папку ./math/ с файлом index.ts
//
// А для голого import { z } from 'zod':
//
//   'zod'   →  node_modules/zod/  → смотрит поле в package.json,
//              какой файл там главный, и берёт его.
//
// Всё это и есть «разрешение модулей» (module resolution).`;

  protected readonly pathsJson = `{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}`;

  protected readonly pathsBeforeAfter = `// БЕЗ псевдонимов — длинные и хрупкие пути из глубины проекта.
// Стоит переместить файл — и все ../../.. приходится чинить вручную:
import { formatDate } from '../../../utils/date';
import { Button } from '../../../../components/Button';

// С псевдонимами (@/ означает папку src) — коротко и не ломается при переносе:
import { formatDate } from '@/utils/date';
import { Button } from '@/components/Button';

// Читается как «@/ = от корня src»: @/utils/date — это src/utils/date.`;

  protected readonly gotchaSource = `// Файл src/main.ts — импортируем через псевдоним:
import { add } from '@utils/math';
console.log(add(2, 3));`;

  protected readonly gotchaEmit = `// Готовый dist/main.js ПОСЛЕ компиляции. Смотрим на путь импорта:
import { add } from '@utils/math';  // ← ПСЕВДОНИМ ОСТАЛСЯ КАК БЫЛ!
console.log(add(2, 3));

// TypeScript НЕ переписал '@utils/math' в реальный './utils/math.js'.
// Для него paths — это подсказка на время ПРОВЕРКИ ТИПОВ, а не команда
// переписать пути в собранном коде.`;

  protected readonly gotchaError = `# Запускаем собранный файл напрямую в Node — и он падает:
$ node dist/main.js

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@utils/math'
    imported from .../dist/main.js

# Node не знает ни про какой '@utils' — такого пакета в node_modules нет,
# а псевдоним ему никто не расшифровал. Вот она, ловушка.`;

  protected readonly fixNote = `// КАК ЗАСТАВИТЬ РАБОТАТЬ. Псевдоним @/ должен кто-то РАСШИФРОВАТЬ в рантайме:
//
//   • Сборщик (Vite, webpack, esbuild) — читает те же paths и подставляет
//     реальные пути при сборке. В проекте со сборщиком всё «просто работает».
//   • Тестовый раннер (Vitest, Jest) — ему псевдонимы настраивают отдельно.
//   • Отдельная утилита (например, tsc-alias) — переписывает пути после tsc.
//   • Для чистого Node без сборщика — используйте встроенные псевдонимы Node
//     (поле "imports" в package.json, см. ниже) вместо paths.`;

  protected readonly nodeImports = `{
  "type": "module",
  "imports": {
    "#utils/*": "./dist/utils/*.js"
  }
}`;

  protected readonly nodeImportsUsage = `// Псевдонимы из поля "imports" начинаются с # и понятны САМОМУ Node —
// он расшифрует их в рантайме без всякого сборщика:
import { add } from '#utils/math';
console.log(add(2, 3)); // ✅ работает при запуске node dist/main.js`;
}
