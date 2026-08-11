import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-package-managers',
  imports: [CodeBlock, RouterLink],
  templateUrl: './package-managers.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientPackageManagers {
  protected readonly packageJsonFull = `{
  "name": "shop-frontend",
  "version": "1.4.2",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "vitest": "^3.2.0",
    "eslint": "^9.0.0",
    "typescript": "~6.0.2"
  }
}`;

  protected readonly depsVsDev = `# Проверка на пальцах: «а если этот пакет исчезнет прямо сейчас —
# пользователь на сайте это заметит?»

# ДА, заметит: библиотека дат нужна, чтобы нарисовать «заказ от 14.03.2026».
# Значит, она едет вместе с приложением к пользователю -> dependencies.
npm install date-fns

# НЕТ, не заметит: тесты гоняются на вашем ноутбуке и на сервере сборки.
# Пользователь никогда их не запускает -> devDependencies.
npm install --save-dev vitest

# Флаг --save-dev (коротко -D) — это и есть вся разница между двумя списками.
# Он говорит менеджеру: запиши пакет во второй раздел package.json.

# Почему это не бюрократия, а экономия:
# 1. Сборщик кладёт в готовое приложение только то, что реально
#    используется кодом, а инструменты разработки туда не попадают вовсе.
# 2. На сервере, где приложение просто запускается (а не собирается),
#    можно поставить ТОЛЬКО боевые зависимости — это в разы быстрее:
npm install --omit=dev`;

  protected readonly semverBreak = `// Библиотека форматирования дат, версия 1.4.2.
// Вы написали вот такой вызов, и он работает:
formatDate(new Date(), 'dd.MM.yyyy'); // -> "14.03.2026"

// Вышла версия 1.4.3 — ПАТЧ (третье число).
// Автор починил ошибку с високосным годом. Снаружи ничего не изменилось.
// Ваш вызов работает точно так же. Обновляться безопасно.

// Вышла версия 1.5.0 — МИНОР (второе число).
// Автор ДОБАВИЛ третий необязательный аргумент — часовой пояс.
formatDate(new Date(), 'dd.MM.yyyy', { timeZone: 'Europe/Moscow' });
// Ключевое слово — «добавил». Старый вызов из двух аргументов
// продолжает работать, потому что новый аргумент необязательный.
// Это и есть обещание минорной версии: «стало больше, но не иначе».

// Вышла версия 2.0.0 — МАЖОР (первое число).
// Автор переименовал функцию и поменял порядок аргументов местами:
format('dd.MM.yyyy', new Date());
// Ваш старый код теперь падает с ошибкой «formatDate is not a function».
// Автор не злодей — он честно предупредил, увеличив первое число.
// Мажор — единственный случай, когда автор ИМЕЕТ ПРАВО вас сломать.`;

  protected readonly lockfileSnippet = `{
  "name": "shop-frontend",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/date-fns": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/date-fns/-/date-fns-4.1.0.tgz",
      "integrity": "sha512-Ukq0owbQXxa8sdVBkR1w7KOQ5gIBqdH2hkvknzZ..."
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb..."
    }
  }
}`;

  protected readonly installVsCi = `# КОМАНДА ПЕРВАЯ: обычная установка.
# Читает package.json, при необходимости ДОПОДБИРАЕТ версии по значкам ^ и ~,
# ставит пакеты и ПЕРЕЗАПИСЫВАЕТ lock-файл новыми номерами.
# Нужна, когда вы осознанно меняете состав зависимостей.
npm install

# КОМАНДА ВТОРАЯ: установка «строго по накладной».
# Читает ТОЛЬКО lock-файл, package.json используется лишь для сверки.
# Ставит ровно те версии, что записаны, и никогда не меняет lock-файл.
# Перед установкой удаляет node_modules целиком — результат всегда чистый.
npm ci

# Простое правило, кто где:
#   вы у себя на ноутбуке  -> npm install
#   сервер сборки (CI)     -> npm ci
# Название ci буквально от Continuous Integration — «сервер сборки».
# Если lock-файла нет, npm ci откажется работать. Это не баг, а защита:
# на сервере не должно быть «а давай подберём версии на своё усмотрение».`;

  protected readonly cheatsheet = `# --- Каждый день ---

# Установить всё, что перечислено в package.json. Первое, что делают
# после того, как скачали чужой проект: папки node_modules в репозитории нет.
npm install

# Добавить пакет, нужный приложению у пользователя.
npm install date-fns

# Добавить пакет, нужный только на вашей машине (тесты, линтер, сборщик).
npm install --save-dev vitest        # короткая форма: npm i -D vitest

# Удалить пакет: уберёт и папку, и строчку из package.json.
npm uninstall date-fns

# Запустить скрипт из раздела "scripts" файла package.json.
npm run build                        # npm run dev, npm run test, ...

# --- Изредка, осознанно ---

# Показать пакеты, у которых вышли версии новее установленных.
npm outdated

# Обновить пакеты В ГРАНИЦАХ, разрешённых значками ^ и ~ в package.json.
# Перейти с 1.x на 2.x эта команда сама не станет — и правильно сделает.
npm update

# Сверить установленные пакеты с базой известных уязвимостей.
npm audit

# Запустить утилиту разово, не устанавливая её в проект насовсем.
# npx скачает во временную папку, выполнит и забудет.
npx create-vite my-app

# --- Те же действия другими менеджерами ---
# pnpm:  pnpm install · pnpm add date-fns · pnpm add -D vitest · pnpm dev
# yarn:  yarn install · yarn add date-fns · yarn add -D vitest · yarn dev
# bun:   bun install  · bun add date-fns  · bun add -d vitest  · bun run dev`;

  protected readonly scriptsJson = `{
  "scripts": {
    "dev": "vite --port 4200 --open",
    "build": "tsc --noEmit && vite build --mode production",
    "test": "vitest run --coverage",
    "lint": "eslint src --max-warnings 0",
    "check": "npm run lint && npm run test && npm run build"
  }
}`;

  protected readonly inspectPackage = `# Пакет советуют в чате. Прежде чем ставить, потратьте две минуты.

# 1. Когда его в последний раз трогали?
#    Пакет, забытый три года назад, однажды сломается о новую версию Node —
#    и чинить его будет некому.
npm view date-fns time.modified

# 2. Сколько чужого кода приедет ВМЕСТЕ с ним?
#    Пустой ответ — прекрасно: пакет самодостаточен.
#    Список из тридцати имён — вы берёте не одну библиотеку, а тридцать одну.
npm view date-fns dependencies

# 3. Кто автор и под какой лицензией это выложено?
npm view date-fns

# 4. Что уже стоит в проекте и почему.
#    Команда покажет дерево: кто чей родитель. Полезно, когда непонятно,
#    откуда вообще взялся подозрительный пакет.
npm ls date-fns

# И самое главное — прочитайте название по буквам.
# Опечатка в имени пакета (react-dom против raect-dom) — это готовая
# ловушка, которую специально расставляют. Копируйте имя из документации.`;

  protected readonly workspacesJson = `{
  "name": "acme",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}`;

  protected readonly monorepoImport = `// Файл apps/shop/src/cart-page.ts — код приложения «Магазин».

// Кнопка НЕ скопирована в этот проект файлом. Она лежит в соседней папке
// packages/ui того же репозитория, а импортируется как обычный пакет.
// Работает это так: менеджер, увидев в package.json раздел workspaces,
// создал в node_modules ссылку на папку packages/ui.
// Для кода это неотличимо от пакета, скачанного из реестра.
import { Button } from '@acme/ui';
import { formatPrice } from '@acme/utils';

export function renderCart(items: CartItem[]): void {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  document.body.append(
    Button({ label: 'Оплатить ' + formatPrice(total) }),
  );
}

// Что это даёт на практике: вы правите отступ у кнопки в packages/ui,
// нажимаете «сохранить» — и правка мгновенно видна во ВСЕХ приложениях,
// которые её используют. Никакой публикации, никакого копирования.
// Цена: сломав кнопку, вы сломали сразу все приложения. Отсюда требование
// к монорепе — тесты на общие пакеты обязательны.`;

  protected readonly turboJson = `{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}`;
}
