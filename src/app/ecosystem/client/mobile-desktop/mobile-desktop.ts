import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-mobile-desktop',
  imports: [CodeBlock, RouterLink],
  templateUrl: './mobile-desktop.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientMobileDesktop {
  protected readonly pwaManifest = `{
  "name": "Кофейня «Утро» — заказ с собой",
  "short_name": "Утро",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#282a36",
  "theme_color": "#ffb86c",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`;

  protected readonly manifestLink = `<!-- Одна строчка в <head> вашей обычной страницы.
     Именно по ней телефон понимает: этот сайт можно поставить
     на домашний экран, и вот как он должен при этом выглядеть. -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#ffb86c" />`;

  protected readonly serviceWorkerOffline = `// ---------- Часть 1. Обычный код на странице сайта ----------
// Один раз просим браузер «нанять» файл /sw.js в качестве диспетчера.
// После этого он будет жить своей жизнью — даже когда вкладка закрыта.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// ---------- Часть 2. Сам файл /sw.js ----------
// ВАЖНО: этот код выполняется ОТДЕЛЬНО от страницы. У него нет
// доступа к document и к элементам на экране — он ничего не рисует.
// Его работа — сидеть между страницей и сетью и решать, что делать.

const CACHE_NAME = 'utro-v1';

// Событие install срабатывает ОДИН РАЗ — когда браузер впервые
// установил диспетчера. Удобный момент, чтобы заранее скачать всё,
// без чего приложение вообще не откроется. Как собрать сумку заранее,
// а не бегать по квартире, когда уже надо выходить.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(['/', '/styles.css', '/app.js', '/icons/icon-192.png'])),
  );
});

// Событие fetch срабатывает на КАЖДЫЙ запрос страницы к сети.
// Вот здесь и рождается офлайн: сначала пробуем сходить в интернет,
// а если не вышло (метро, самолёт, деревня) — отдаём сохранённую копию.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});

// Почему это называют «диспетчером»: страница уверена, что говорит
// с сетью напрямую. На деле каждый её запрос сначала проходит через
// этот файл, и файл решает — сходить в сеть или отдать копию с диска.
// Отсюда и берётся способность открываться без интернета.`;

  protected readonly capacitorStart = `# Capacitor — это «рамка настоящего приложения» вокруг вашего сайта.
# Сначала собираем сайт ровно так же, как собирали для хостинга.
npm run build

# Ставим сам Capacitor и говорим ему, где лежит собранный сайт.
npm install @capacitor/core @capacitor/cli
npx cap init "Кофейня Утро" ru.utro.app --web-dir=dist

# Создаём две настоящие папки нативных проектов.
# Внутри — обычный проект для Xcode и обычный проект для Android Studio,
# и в каждом ровно один экран: окно браузера, растянутое на весь дисплей.
npx cap add ios
npx cap add android

# После каждой пересборки сайта копируем свежие файлы внутрь этих папок.
npx cap sync

# Открываем нативный проект в родной среде и жмём «запустить».
# Именно оттуда потом уходит сборка в App Store и Google Play.
npx cap open android`;

  protected readonly capacitorCamera = `// Это всё ещё обычный веб-код: файл вашего сайта, импорт, функция.
// Но зовём мы не браузерный API, а плагин Capacitor — он передаёт
// просьбу «вниз», в нативную часть приложения.
import { Camera, CameraResultType } from '@capacitor/camera';

async function captureReceipt() {
  // Здесь по-настоящему открывается системная камера телефона —
  // ровно та же, что и в штатном приложении «Камера».
  // Это не веб-страница, изображающая камеру: это она и есть.
  const photo = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Uri, // вернёт путь к файлу на телефоне
  });

  // А дальше снова начинается обычный веб: показываем картинку в теге img.
  document.querySelector('#preview').src = фото.webPath;
}

// Что произошло механически, по шагам:
// 1. JavaScript внутри окна-браузера позвал плагин;
// 2. плагин через «мост» разбудил нативный код (Swift или Kotlin);
// 3. нативный код открыл системную камеру и дождался снимка;
// 4. путь к снимку вернулся обратно в JavaScript.
// Мост — единственное место, где ваш веб-код встречается с телефоном.`;

  protected readonly webListScreen = `// Экран «мои заказы» для САЙТА. Обычный React, обычный браузер.
export function OrderList({ orders }) {
  return (
    <div className="orders">
      <h2 className="orders__title">Ваши заказы</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          className="order-card"
          onClick={() => openOrder(order.id)}
        >
          <span className="order-card__name">{order.name}</span>
          <span className="order-card__price">{order.price} ₽</span>
        </div>
      ))}
    </div>
  );
}

// Разметка — теги div, span, h2. Оформление — классы и отдельный
// CSS-файл. Всё привычное: каскад, медиазапросы, единицы вроде rem.`;

  protected readonly reactNativeScreen = `// Тот же самый экран, но для React Native.
// Логика и структура узнаваемы, а вот РАЗМЕТКА ДРУГАЯ —
// и это главное, что нужно заметить на этой странице.
import { View, Text, Pressable, StyleSheet } from 'react-native';

export function OrderList({ orders }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Ваши заказы</Text>
      {orders.map((order) => (
        <Pressable
          key={order.id}
          style={styles.card}
          onPress={() => openOrder(order.id)}
        >
          <Text style={styles.name}>{order.name}</Text>
          <Text style={styles.price}>{order.price} ₽</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Стили — это объект в коде, а не CSS-файл. Свойств заметно меньше,
// чем в вебе, и часть из них ведёт себя иначе.
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#1e1e28' },
  title: { fontSize: 20, fontWeight: '600', color: '#ffffff' },
  card: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  name: { fontSize: 16, color: '#ffffff' },
  price: { fontSize: 16, color: '#ffb86c' },
});

// ПОЧЕМУ ВЁРСТКУ НЕЛЬЗЯ ПРОСТО СКОПИРОВАТЬ С САЙТА:
// - тегов div и span не существует: есть View (коробка) и Text (текст);
// - любая буква ОБЯЗАНА лежать внутри Text, иначе приложение упадёт;
// - onClick называется onPress;
// - className и CSS-файлов нет вообще — только объекты стилей;
// - нет каскада, нет медиазапросов, нет процентов от высоты страницы;
// - а на экране в итоге не веб-страница, а настоящие системные элементы
//   iOS и Android — то самое «родное» ощущение при прокрутке и нажатии.`;

  protected readonly expoCommands = `# Expo — готовый набор инструментов вокруг React Native.
# Без него первый день уходит на настройку Xcode и Android Studio.
npx create-expo-app@latest my-app
cd my-app
npx expo start

# Дальше вы наводите камеру телефона на QR-код в терминале —
# и приложение запускается прямо на вашем настоящем телефоне,
# обновляясь при каждом сохранении файла. Ни Xcode, ни Android Studio
# на этом этапе открывать не нужно вообще.

# Когда пора выкладывать в магазины, сборка собирается в облаке.
# Это важно для тех, у кого нет компьютера Apple: без него
# собрать приложение для iPhone на своей машине невозможно.
npx eas build --platform ios
npx eas build --platform android

# А это — «обновление по воздуху»: исправленный JavaScript уезжает
# пользователям мимо магазина, без ревью и без ожидания.
# Работает только для JS-части: нативные библиотеки так не обновить.
npx eas update --branch production`;

  protected readonly electronMain = `// main.js — точка входа Electron-приложения.
// Этот файл выполняется в Node.js, а НЕ в браузере: у него есть
// доступ к файлам на диске, к процессам и к меню операционной системы.
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function createWindow() {
  // Мы буквально создаём окно, внутри которого работает Chromium —
  // тот же движок, что и в браузере Chrome.
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      // preload — тонкий мостик между окном и системой.
      // Сайту внутри окна из соображений безопасности НЕ дают
      // прямой доступ к файлам компьютера: он получает только те
      // функции, которые вы сами разрешили в этом файле.
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // А вот и весь трюк: внутрь окна загружается ваш обычный собранный
  // сайт. Тот же самый index.html, что вы выкладывали на хостинг.
  win.loadFile('dist/index.html');
}

app.whenReady().then(createWindow);

// Что получает пользователь: иконку в панели задач, окно с меню,
// автозапуск, перетаскивание файлов, работу без интернета.
// Что получаете вы: внутрь установщика уезжает целый браузер.
// Отсюда 120–200 мегабайт веса даже у самого простого приложения.`;

  protected readonly tauriStart = `# Tauri решает ту же задачу, что и Electron, но платит другую цену:
# он НЕ кладёт браузер внутрь пакета, а берёт тот, который уже
# установлен в системе (WebView2 в Windows, WebKit в macOS и Linux).
npm create tauri-app@latest

cd my-app
npm run tauri dev     # запуск в режиме разработки
npm run tauri build   # готовый установщик под текущую систему

# Разница по весу для одного и того же приложения:
#   Electron -> около 150 МБ (внутри лежит целый Chromium)
#   Tauri    -> около 10 МБ  (браузер уже есть у пользователя)
#
# Цена за лёгкость:
# 1. интерфейс рисуют РАЗНЫЕ браузеры на разных системах,
#    поэтому мелкие расхождения приходится проверять руками;
# 2. серверная часть приложения пишется на языке Rust,
#    а не на JavaScript — для части задач придётся его касаться;
# 3. готовых рецептов и ответов в интернете пока заметно меньше.`;

  protected readonly sharedLogic = `// Вот что действительно переезжает между сайтом, мобильным
// приложением и десктопом БЕЗ ЕДИНОЙ ПРАВКИ: типы, расчёты и
// работа с сервером. Обратите внимание: в этом файле нет ни слова
// про кнопки, экраны и вёрстку — поэтому он и работает везде.

export type Order = {
  id: string;
  items: { name: string; price: number; count: number }[];
  promoCode?: string;
};

// Правило скидки живёт в одном месте — и на сайте, и в приложении
// сумма посчитается одинаково. Если бы вы написали её дважды,
// рано или поздно они разошлись бы, и кто-то заплатил бы не ту цену.
export function orderTotal(order: Order): number {
  const sum = order.items.reduce((acc, item) => acc + item.price * item.count, 0);
  return order.promoCode === 'WELCOME' ? Math.round(sum * 0.9) : sum;
}

// fetch есть и в браузере, и в React Native, и в Electron —
// поэтому обращение к серверу тоже переносится как есть.
export async function fetchOrders(token: string): Promise<Order[]> {
  const response = await fetch('https://api.utro.ru/orders', {
    headers: { Authorization: 'Bearer ' + token },
  });
  if (!response.ok) {
    throw new Error('Не удалось загрузить заказы');
  }
  return response.json();
}

// А файл с ЭКРАНОМ заказов переехать не сможет: в вебе там div и CSS,
// в React Native — View и объекты стилей, в нативной версии вообще
// другой язык. Отсюда и честная цифра: общими остаются расчёты,
// типы и работа с сервером, а экраны пишутся заново под каждую платформу.`;
}
