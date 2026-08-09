import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-intro-why',
  imports: [CodeBlock, RouterLink],
  templateUrl: './why.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemIntroWhy {
  protected readonly vacancy = `Frontend-разработчик

Требования:
  — уверенный JavaScript и TypeScript
  — опыт коммерческой разработки на React от 2 лет
  — Next.js, понимание SSR
  — Redux Toolkit или Zustand
  — работа с REST API, желательно GraphQL
  — вёрстка: CSS-модули, Tailwind
  — Git, code review, Jest / Vitest
  — плюсом: Docker, CI/CD, Sentry, Storybook`;

  protected readonly vacancyDecoded = `Frontend-разработчик

  — JavaScript и TypeScript ......... САМ ЯЗЫК (это вы уже знаете)
  — React .......................... чем рисовать интерфейс
  — Next.js, SSR ................... как и где страница собирается
  — Redux Toolkit / Zustand ........ где хранить данные на экране
  — REST API, GraphQL .............. как говорить с сервером
  — CSS-модули, Tailwind ........... чем красить кнопки
  — Git, code review ............... как работать в команде
  — Jest / Vitest .................. чем проверять, что не сломалось
  — Docker, CI/CD .................. как код попадает в интернет
  — Sentry ......................... как узнать, что упало
  — Storybook ...................... где показать компоненты отдельно

// Двадцать страшных слов свернулись в ДЕСЯТЬ ВОПРОСОВ.
// Вопросы вечные. Ответы (названия) — меняются каждые пару лет.`;

  protected readonly packageJson = `{
  "name": "moy-magazin",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-router": "^7.1.0",
    "@tanstack/react-query": "^5.62.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0",
    "eslint": "^9.17.0"
  }
}`;

  protected readonly packageJsonDecoded = `{
  "scripts": { ... },      // ← КОМАНДЫ проекта: запустить, собрать, проверить
  "dependencies": { ... }, // ← нужны САМОМУ САЙТУ, когда он работает у людей
  "devDependencies": { ... } // ← нужны ТОЛЬКО ВАМ, пока вы пишете код
}

// Разберём по ролям:
//
// react ................. рисует интерфейс          → роль «чем рисовать»
// react-router .......... меняет страницы по адресу → роль «навигация»
// @tanstack/react-query . грузит данные с сервера   → роль «работа с данными»
//
// typescript ............ проверяет типы            → роль «страховка»
// vite .................. собирает проект           → роль «сборщик»
// vitest ................ гоняет тесты              → роль «проверка»
// eslint ................ ищет плохой код           → роль «линтер»
//
// Заметьте: dependencies поедут к пользователю, devDependencies — нет.
// Поэтому сборщик и тесты в devDependencies: людям они не нужны.`;

  protected readonly roleThinking = `// ❌ Способ запоминать, который НЕ работает:
//    «Надо выучить React. И Vue. И Angular. И Svelte. И Solid.
//     И ещё Next, Nuxt, Remix, Astro... а завтра выйдет новый...»
//    → список бесконечный, паника гарантирована.

// ✅ Способ, который работает:
//    Сначала запомнить РОЛЬ и её вопрос. Потом — пару имён как примеры.

// РОЛЬ: «чем рисовать интерфейс»
//   Вопрос, который она решает:
//     «Как сделать, чтобы при изменении данных экран сам обновился,
//      и мне не пришлось руками дёргать каждый элемент?»
//   Кандидаты: React, Vue, Angular, Svelte, Solid...
//   Что важно понять: ВСЕ они решают ровно эту задачу.
//                     Разница — в стиле записи и размере, не в сути.

// РОЛЬ: «где хранить данные экрана»
//   Вопрос: «Корзина нужна и в шапке, и на странице заказа.
//            Где её держать, чтобы обе части видели одно и то же?»
//   Кандидаты: Redux, Zustand, MobX, Pinia...

// Выучили роль один раз — и новый модный инструмент
// перестаёт быть угрозой. Он просто занимает знакомый слот.`;
}
