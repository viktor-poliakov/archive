import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-bundlers',
  imports: [CodeBlock, RouterLink],
  templateUrl: './bundlers.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientBundlers {
  protected readonly oldScriptTags = `<!-- Так подключали код примерно до 2015 года.
     Каждый файл — отдельный тег, каждый тег — отдельная загрузка по сети. -->

<script src="libs/jquery.js"></script>
<script src="libs/slider.js"></script>
<script src="js/utils.js"></script>
<script src="js/cart.js"></script>
<script src="js/app.js"></script>

<!-- ПОРЯДОК ЭТИХ СТРОК — ЧАСТЬ ПРОГРАММЫ.
     Если slider.js окажется выше jquery.js, слайдер упадёт с ошибкой:
     он попытается воспользоваться тем, чего ещё нет.
     Компьютер об этом не предупредит — вы узнаете от пользователя.

     И заметьте: связей между файлами нигде не записано.
     Кто от кого зависит — знает только человек, который это писал.
     Через год он уволится, и знание уйдёт вместе с ним. -->`;

  protected readonly globalsClash = `// Файл js/utils.js — написал один разработчик
function formatPrice(value) {
  return value + ' ₽';
}

// Файл js/cart.js — написал ДРУГОЙ разработчик, месяцем позже
function formatPrice(value) {
  return (value / 100).toFixed(2) + ' руб.'; // у него копейки, а не рубли
}

// ЧТО ПРОИЗОЙДЁТ В БРАУЗЕРЕ:
// Оба файла подключены тегами <script>, а значит обе функции
// попадают в одно общее пространство имён — глобальное.
// Вторая молча затирает первую. Ошибки не будет НИ ОДНОЙ.
// Просто в половине магазина цены станут в сто раз меньше.

// Это не выдуманная беда. Именно от неё и родились модули.`;

  protected readonly modulesExample = `// ── utils.js ──
// export означает «этим можно пользоваться снаружи».
// Всё, что не помечено export, наружу не видно вообще — своя территория.

const CURRENCY_SYMBOL = '₽'; // приватная деталь, снаружи её не существует

export function formatPrice(rubles) {
  return rubles + ' ' + CURRENCY_SYMBOL;
}

// ── cart.js ──
// import означает «мне нужно вот это вот отсюда».
// Здесь ЯВНО написано, от чего этот файл зависит.

import { formatPrice } from './utils.js';

export function renderTotal(sum) {
  document.querySelector('#total').textContent = formatPrice(sum);
}

// Теперь связи между файлами записаны в самом коде.
// Их может прочитать не только человек, но и программа.
// Именно на этом и построен сборщик.`;

  protected readonly entryPoint = `// ── main.js ── это ТОЧКА ВХОДА: файл, с которого всё начинается.
// Сборщику вы называете только его. Дальше он разберётся сам.

import { App } from './App.js'; // ваш код
import './styles/main.css'; // ваши стили
import { createRoot } from 'react-dom/client'; // чужой пакет из node_modules

createRoot(document.querySelector('#root')).render(App());

// Сборщик прочитает этот файл, увидит три импорта и пойдёт в каждый.
// Внутри App.js найдёт ещё импорты — и пойдёт в них.
// И так, пока не кончатся новые файлы.
// Получившаяся карта связей называется ГРАФОМ ЗАВИСИМОСТЕЙ.`;

  protected readonly transpileExample = `// ── БЫЛО: файл cart.ts, который вы написали ──

type CartItem = { id: number; title: string; qty: number };

export function totalQty(items: CartItem[]): number {
  // ?. и ?? — сравнительно свежий синтаксис языка
  return items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;
}

// ── СТАЛО: то, что реально уедет в браузер ──

export function totalQty(items) {
  return items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;
}

// Что произошло: аннотации типов ПРОСТО ИСЧЕЗЛИ.
// Это важно понять раз и навсегда: типы существуют только
// во время разработки, чтобы ловить ваши ошибки. В готовом коде
// их нет ни одного — браузер о них никогда не узнаёт.
//
// А если бы вы попросили поддержку совсем старых браузеров,
// сборщик заодно переписал бы ?. и ?? на длинные проверки через if.
// Это называется ТРАНСПИЛЯЦИЯ — перевод с языка на язык,
// в отличие от компиляции, где на выходе получается машинный код.`;

  protected readonly jsxExample = `// ── БЫЛО: JSX. Выглядит как HTML внутри JavaScript. ──
// Никакой браузер в мире такое не выполнит: это не JavaScript.

function ProductCard(props) {
  return (
    <div className="card">
      <h3>{props.title}</h3>
      <span>{props.price} ₽</span>
    </div>
  );
}

// ── СТАЛО: обычные вызовы обычных функций. ──
// Вот теперь браузер понимает каждую строчку.

function ProductCard(props) {
  return jsx('div', {
    className: 'card',
    children: [
      jsx('h3', { children: props.title }),
      jsx('span', { children: [props.price, ' ₽'] }),
    ],
  });
}

// Вывод: JSX — это не «магия React», а просто удобная запись,
// которую сборщик разворачивает в скучный код перед отправкой.`;

  protected readonly assetImports = `// Сборщик работает не только с JavaScript.
// Любой файл проекта можно ИМПОРТИРОВАТЬ — и сборщик решит, что с ним делать.

import './card.css'; // стили: попадут в общий CSS-файл сборки
import logo from './logo.svg'; // картинка: сюда подставится готовый адрес
import data from './countries.json'; // данные: превратятся в обычный объект

console.log(logo);
// В исходнике здесь строка './logo.svg'.
// А после сборки будет '/assets/logo-C4vT9m2p.svg' — настоящий адрес файла,
// который сборщик скопировал в папку dist и переименовал.

// ЗАЧЕМ ТАК СЛОЖНО, ПОЧЕМУ НЕ НАПИСАТЬ АДРЕС РУКАМИ:
// 1. Если картинки не окажется на месте, вы узнаете об этом
//    во время сборки, а не от пользователя, увидевшего пустой квадрат.
// 2. Сборщик сам расставит правильные адреса, даже если сайт
//    лежит не в корне домена, а в подпапке.
// 3. Совсем маленькие картинки он может вставить прямо в код,
//    и тогда за ними не придётся ходить по сети отдельным запросом.`;

  protected readonly treeShakingExample = `// ── utils.js: в файле три функции ──

export function formatPrice(rubles) {
  return rubles + ' ₽';
}

export function formatDate(date) {
  return date.toLocaleDateString('ru-RU');
}

export function buildExcelReport(rows) {
  // 400 строк кода, и внутри — тяжёлая библиотека для таблиц
}

// ── main.js: а нужна нам ровно одна ──

import { formatPrice } from './utils.js';

console.log(formatPrice(1290));

// ЧТО ПОПАДЁТ В СБОРКУ: только formatPrice.
// formatDate и buildExcelReport (вместе с их тяжёлой библиотекой)
// в готовый файл не войдут — ими никто не пользуется.
//
// Такая уборка называется TREE SHAKING, «встряхивание дерева»:
// дерево зависимостей трясут, и всё, что ни на чём не держится,
// осыпается. Работает она только с import/export — потому что
// только по ним видно, кто кем пользуется на самом деле.`;

  protected readonly minifyExample = `// ── БЫЛО: 6 строк, 211 символов ──

export function formatPrice(amountInKopecks, currencySymbol) {
  const rubles = amountInKopecks / 100;
  const rounded = rubles.toFixed(2);
  return rounded + ' ' + currencySymbol;
}

// ── СТАЛО после минификации: 1 строка, 58 символов ──

export function o(n,c){return(n/100).toFixed(2)+" "+c}

// Что сделала программа-минификатор:
// убрала переносы строк, отступы и пробелы (браузеру они не нужны),
// выкинула промежуточные переменные и переименовала всё, что можно,
// в самые короткие имена.
//
// ГЛАВНОЕ: программа делает РОВНО ТО ЖЕ САМОЕ. Ни одно поведение
// не изменилось. Изменился только объём текста, который пользователь
// скачивает по мобильному интернету где-нибудь в электричке.
//
// Читать это невозможно — и не надо. Для чтения есть исходники,
// а чтобы отладка не превратилась в ад, существуют карты кода.`;

  protected readonly codeSplitting = `// ── БЫЛО: страница настроек приезжает вместе со всем остальным ──

import { SettingsPage } from './pages/SettingsPage.js';

// Этот import находится наверху файла, а значит код настроек
// попадёт в общий файл сборки и загрузится КАЖДОМУ посетителю.
// Даже тому, кто зашёл посмотреть один товар и ушёл.

// ── СТАЛО: код поедет к пользователю только по требованию ──

async function openSettings() {
  // Круглые скобки вместо обычного import — это динамический импорт.
  // Он возвращает обещание: «схожу за файлом и принесу».
  const { SettingsPage } = await import('./pages/SettingsPage.js');
  SettingsPage.render();
}

// Увидев такую запись, сборщик НЕ вкладывает настройки в общий файл,
// а откладывает их в отдельный — и подгружает его в момент вызова.
// Разделение на такие кусочки называется CODE SPLITTING.
//
// Цена решения: при первом открытии настроек будет крошечная пауза
// на загрузку. Поэтому так выносят только то, что открывают редко:
// админку, тяжёлый редактор, страницу с большими графиками.`;

  protected readonly projectTree = `my-shop/
├── node_modules/        # 40 установленных пакетов. В git не хранится,
│                        # восстанавливается командой npm install
├── public/
│   └── favicon.ico      # файлы, которые копируются в dist как есть
├── src/                 # ВАШИ ИСХОДНИКИ — вы работаете только здесь
│   ├── main.jsx         # точка входа: с этого файла начинается сборка
│   ├── App.jsx
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   └── Header.jsx
│   ├── pages/
│   │   └── SettingsPage.jsx
│   └── styles/
│       └── main.css
├── index.html           # каркас страницы, тоже часть сборки
├── package.json         # паспорт проекта: имя, команды, зависимости
├── vite.config.js       # настройки сборщика
└── dist/                # РЕЗУЛЬТАТ СБОРКИ. Появляется сам,
                         # в git не хранится, руками не правится`;

  protected readonly packageScripts = `{
  "name": "my-shop",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0"
  }
}`;

  protected readonly buildOutput = `$ npm run build

vite v7.0.0 building for production...
transforming...
✓ 214 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.46 kB │ gzip:  0.30 kB
dist/assets/logo-C4vT9m2p.svg       1.12 kB
dist/assets/index-DkP1a8Xz.css     14.83 kB │ gzip:  3.21 kB
dist/assets/Settings-B7hq2Lm4.js    6.02 kB │ gzip:  2.44 kB
dist/assets/index-Bq3f1Yc9.js     142.57 kB │ gzip: 46.10 kB
✓ built in 1.84s`;

  protected readonly viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Это и есть «конфиг сборщика», которого все боятся.
// Как видите, в обычном проекте он умещается в десять строк.

export default defineConfig({
  // Плагины — это дополнения, которые учат сборщик новым фокусам.
  // Вот этот объясняет ему, как превращать JSX в обычный JavaScript.
  plugins: [react()],

  server: {
    port: 3000, // на каком порту поднимать дев-сервер
  },

  build: {
    outDir: 'dist', // куда складывать результат
    sourcemap: true, // класть рядом карты кода (см. раздел про отладку)
  },
});`;

  protected readonly envExample = `# ── Файл .env, лежит рядом с package.json ──
# Здесь держат настройки, которые отличаются на вашем ноутбуке
# и на боевом сервере: адреса, ключи, режимы.

VITE_API_URL=https://api.magazin.ru

# ВАЖНОЕ ПРАВИЛО VITE: в браузер попадают ТОЛЬКО переменные,
# имя которых начинается на VITE_. Остальные сборщик игнорирует —
# ровно для того, чтобы вы случайно не отправили лишнего.

# ❌ ТАК НЕЛЬЗЯ НИКОГДА:
# VITE_STRIPE_SECRET_KEY=sk_live_9f3c...
# Слово «секретный» здесь ничего не защищает. Сборщик подставит
# значение прямо в текст файла, который скачает каждый посетитель.
# Открыть его сможет любой человек за десять секунд.
# Секретам место только на сервере.`;
}
