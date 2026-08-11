import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-meta-frameworks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './meta-frameworks.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientMetaFrameworks {
  protected readonly emptyHtml = `<!--
  Вот ВЕСЬ HTML, который сервер отдаёт браузеру у обычного приложения
  на React, Vue или Angular. Откройте любой такой сайт, нажмите
  «Просмотр исходного кода страницы» — и увидите примерно это.

  Найдите здесь слово «Кружка», цену, кнопку «Купить».
  Их нет. Совсем. Ни одного товара.
-->
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Магазин</title>
    <link rel="stylesheet" href="/assets/main-4f2a.css" />
  </head>
  <body>
    <!-- Пустая коробка. Всё содержимое появится ВНУТРИ неё. Но позже. -->
    <div id="root"></div>

    <!-- А вот файл, который эту коробку наполнит.
         Пока браузер его не скачает и не выполнит —
         пользователь смотрит на белый лист. -->
    <script type="module" src="/assets/main-9c1b.js"></script>
  </body>
</html>`;

  protected readonly ssrHtml = `<!--
  Тот же самый магазин, но HTML собран НА СЕРВЕРЕ до отправки.
  Разница видна невооружённым глазом: товары уже здесь, прямо в тексте.

  Браузеру ничего не нужно вычислять — он просто показывает то,
  что пришло. Первая же порция байт из сети уже содержит смысл.
-->
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Магазин — товары</title>
    <link rel="stylesheet" href="/assets/main-4f2a.css" />
  </head>
  <body>
    <div id="root">
      <h1>Товары</h1>
      <ul class="products">
        <li><span>Кружка</span> <b>490 ₽</b> <button>Купить</button></li>
        <li><span>Футболка</span> <b>1290 ₽</b> <button>Купить</button></li>
      </ul>
    </div>

    <!-- Скрипт всё равно приедет: без него кнопки не заработают.
         Но пользователь УЖЕ видит страницу, пока скрипт в пути. -->
    <script type="module" src="/assets/main-9c1b.js"></script>
  </body>
</html>`;

  protected readonly ssrServer = `// ЭТО РАБОТАЕТ НА СЕРВЕРЕ, на Node.js. Не в браузере.
// Задача: не отдавать пустую коробку, а собрать готовый HTML прямо здесь.

import express from 'express';
import { renderToString } from 'react-dom/server';
import { ProductList } from './ProductList.jsx';

const app = express();

app.get('/products', async (request, response) => {
  // 1. Данные берём СРАЗУ, здесь же, на сервере.
  //    Сервер стоит рядом с базой данных — этот запрос занимает миллисекунды.
  //    Браузеру не придётся делать ещё один круг по сети из метро.
  const products = await db.findActiveProducts();

  // 2. Превращаем компонент в обычную строку с HTML-тегами.
  //    Вот это превращение и называется «отрендерить на сервере».
  //    На выходе — текст вида "<ul><li>Кружка…</li></ul>", ничего волшебного.
  const markup = renderToString(<ProductList items={products} />);

  // 3. Вкладываем готовую разметку внутрь коробки и отправляем.
  //    Скрипт по-прежнему подключён: он понадобится, чтобы кнопки заработали.
  response.send(
    '<!doctype html><html lang="ru"><body><div id="root">' +
      markup +
      '</div><script type="module" src="/assets/main.js"></script></body></html>',
  );
});

// ЦЕНА ЭТОГО РЕШЕНИЯ: теперь у вас есть работающая программа,
// которая должна быть включена круглосуточно. Раздать папку с файлами
// уже недостаточно — а именно так работает самый дешёвый хостинг.`;

  protected readonly hydrateCode = `// ЭТО РАБОТАЕТ В БРАУЗЕРЕ — после того, как HTML с сервера уже показан.
// Пользователь в этот момент смотрит на готовую страницу.

import { hydrateRoot } from 'react-dom/client';
import { ProductList } from './ProductList.jsx';

// Данные сервер положил прямо в страницу, чтобы не запрашивать их второй раз.
const items = window.__PRODUCTS__;

// ГЛАВНАЯ СТРОЧКА. Обратите внимание: не createRoot, а hydrateRoot.
//
// createRoot сказал бы: «выкинь всё из коробки и нарисуй заново» —
//   экран мигнул бы, а работа сервера пропала бы зря.
// hydrateRoot говорит: «HTML уже правильный, не трогай его.
//   Просто пройдись по нему и повесь обработчики на кнопки».
//
// Отсюда и слово «гидратация»: сухой HTML заливают жизнью.
hydrateRoot(document.getElementById('root'), <ProductList items={items} />);

// ВАЖНОЕ СЛЕДСТВИЕ: разметка, которую нарисовал сервер, и разметка,
// которую ожидает браузер, обязаны СОВПАДАТЬ. Если на сервере вы
// вывели new Date().toLocaleTimeString(), а в браузере прошла секунда —
// React пожалуется на расхождение. Отсюда правило: всё случайное
// и зависящее от времени выносим за пределы первого рендера.`;

  protected readonly astroIsland = `---
// Это компонент Astro. Всё, что между тройными дефисами,
// выполняется НА СЕРВЕРЕ в момент сборки сайта.
// В браузер этот кусок кода не попадёт никогда — ни одного байта.
import Counter from '../components/Counter.jsx';
const posts = await getPosts();
---

<h1>Блог</h1>
<ul>
  {posts.map((post) => <li>{post.title}</li>)}
</ul>

<!--
  Всё, что выше — обычный статичный HTML. Ноль JavaScript в браузере.
  Список постов не нуждается в «оживлении»: его не нажимают, он просто текст.

  А вот эта строчка — «остров». Только для неё браузер скачает JavaScript,
  да и то лишь когда пользователь до неё доскроллит (client:visible).
  Остальная страница остаётся мёртвым, но мгновенным HTML.
-->
<Counter client:visible />`;

  protected readonly fileRouting = `# Структура папок в проекте на Next.js.
# Никакого файла со списком маршрутов нет и не нужно:
# РАСПОЛОЖЕНИЕ ФАЙЛА и есть адрес страницы.

app/
├── page.jsx                  # адрес /
├── about/
│   └── page.jsx              # адрес /about
├── products/
│   ├── page.jsx              # адрес /products
│   └── [slug]/
│       └── page.jsx          # /products/kruzhka, /products/futbolka — любой товар
└── api/
    └── subscribe/
        └── route.js          # НЕ страница! Кусочек сервера: POST /api/subscribe

# Квадратные скобки в имени папки означают «здесь может быть что угодно».
# Один файл обслуживает все десять тысяч товаров магазина.
#
# Папка api — отдельная история. Там лежат не страницы, а серверные
# обработчики: приём формы, оплата, отправка письма. Тот самый бэкенд,
# только маленький и живущий в одном проекте с фронтендом.`;

  protected readonly nextPage = `// app/products/page.jsx — страница списка товаров в Next.js.

// Одна строчка — и это уже стратегия ISR: страница собирается заранее,
// но сервер пересобирает её не чаще раза в час (3600 секунд).
// Хотите SSG — уберите строку и данные застынут до следующей сборки.
// Хотите SSR — поставьте 0, и страница будет собираться на каждый запрос.
export const revalidate = 3600;

// Компонент объявлен async — и это не опечатка.
// Он выполняется НА СЕРВЕРЕ, поэтому может спокойно дождаться данных
// прямо внутри себя. Никаких useEffect, никаких состояний загрузки.
export default async function ProductsPage() {
  const response = await fetch('https://api.magazin.ru/products');
  const products = await response.json();

  return (
    <main>
      <h1>Товары</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — {product.price} ₽
          </li>
        ))}
      </ul>
    </main>
  );
}

// Сравните с обычным приложением в браузере: там пришлось бы завести
// состояние «загружается», состояние «ошибка», нарисовать спиннер
// и всё равно показать пользователю пустой экран на первую секунду.`;

  protected readonly windowBad = `// ❌ Код, который безупречно работает в браузере и падает на сервере.

export function Header() {
  // window — это объект БРАУЗЕРА: окно, в котором открыта страница.
  // На сервере никакого окна нет. Там просто программа на Node.js,
  // у которой нет ни экрана, ни мыши, ни вкладок.
  const width = window.innerWidth;
  // ReferenceError: window is not defined

  // localStorage — хранилище В БРАУЗЕРЕ пользователя. На сервере
  // его тоже не существует: сервер один на всех, а хранилище у каждого своё.
  const theme = localStorage.getItem('theme');
  // ReferenceError: localStorage is not defined

  return <header className={theme}>…</header>;
}

// Это ошибка номер один у всех, кто впервые включает серверный рендеринг.
// Причина всегда одна и та же: код писали для одного мира,
// а выполнять его теперь приходится в двух.`;

  protected readonly windowGood = `// ✅ Два способа жить в двух мирах сразу.

import { useEffect, useState } from 'react';

export function Header() {
  // СПОСОБ 1 — отложить. Начальное значение должно быть таким,
  // которое честно можно посчитать И на сервере, И в браузере.
  const [theme, setTheme] = useState('light');

  // useEffect выполняется ТОЛЬКО в браузере и ТОЛЬКО после того,
  // как HTML уже показан. Сервер этот код не запускает вообще.
  // Значит, внутри можно смело трогать всё браузерное.
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  return <header className={theme}>…</header>;
}

// СПОСОБ 2 — спросить, где мы сейчас находимся.
// typeof не падает на несуществующей переменной — в этом весь приём.
const isBrowser = typeof window !== 'undefined';

export function getWidth() {
  if (!isBrowser) {
    return 1280; // разумное значение по умолчанию для сервера
  }
  return window.innerWidth;
}

// ПРАВИЛО, КОТОРОЕ СПАСАЕТ: первый рендер должен давать ОДИНАКОВЫЙ
// результат на сервере и в браузере. Всё, что зависит от конкретного
// пользователя, его экрана и его настроек, добавляем вторым шагом.`;
}
