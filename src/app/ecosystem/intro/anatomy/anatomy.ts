import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-intro-anatomy',
  imports: [CodeBlock, RouterLink],
  templateUrl: './anatomy.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemIntroAnatomy {
  protected readonly httpRequest = `GET /api/products?page=1 HTTP/1.1
Host: magazin.ru
Accept: application/json
Cookie: session=abc123`;

  protected readonly httpResponse = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "products": [
    { "id": 1, "name": "Кружка", "price": 490 },
    { "id": 2, "name": "Футболка", "price": 1290 }
  ],
  "total": 2
}`;

  protected readonly clientCode = `// ЭТО РАБОТАЕТ В БРАУЗЕРЕ, на компьютере пользователя.
// Задача клиента — показать данные и поймать действия человека.

// 1. Просим у сервера список товаров.
const res = await fetch('/api/products?page=1');
const data = await res.json();

// 2. Рисуем то, что пришло.
for (const product of data.products) {
  addProductCard(product.name, product.price);
}

// 3. Ждём действий пользователя.
buyButton.addEventListener('click', () => {
  fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId: 1 }),
  });
});

// Заметьте: сам список товаров клиент НЕ ХРАНИТ и НЕ ПРИДУМЫВАЕТ.
// Он только просит его у сервера и красиво показывает.`;

  protected readonly serverCode = `// ЭТО РАБОТАЕТ НА СЕРВЕРЕ — на чужом компьютере в дата-центре.
// Задача сервера — принять запрос, проверить, посчитать, сходить в базу.

app.get('/api/products', async (req, res) => {
  // 1. Кто к нам пришёл? Проверяем, что человек вошёл в аккаунт.
  const user = await findUserByCookie(req.cookies.session);
  if (!user) {
    return res.status(401).json({ error: 'Сначала войдите' });
  }

  // 2. Идём в базу данных за товарами.
  const products = await db.req(
    'SELECT id, name, price FROM products WHERE active = true LIMIT 20',
  );

  // 3. Отдаём результат обратно в браузер.
  res.json({ products: products, total: products.length });
});

// Сервер — единственный, кто имеет право трогать базу данных.
// Браузер до неё не дотягивается никогда. И это НЕ случайность.`;

  protected readonly trustClientBad = `// ❌ ОПАСНО: считаем цену заказа в браузере и верим ей.

// В браузере:
const total = cart.reduce((sum, product) => sum + product.price, 0);
fetch('/api/order', {
  method: 'POST',
  body: JSON.stringify({ products: cart, totalDue: total }), // ← 1780 ₽
});

// На сервере:
app.post('/api/order', (req, res) => {
  createOrder(req.body.products, req.body.totalDue); // просто верим
});

// ПОЧЕМУ ЭТО КАТАСТРОФА:
// Код в браузере находится НА КОМПЬЮТЕРЕ ПОЛЬЗОВАТЕЛЯ.
// Любой человек открывает инструменты разработчика (клавиша F12),
// правит переменную — и отправляет { кОплате: 1 }.
// Сервер послушно создаст заказ на 1 рубль.`;

  protected readonly trustClientGood = `// ✅ ПРАВИЛЬНО: клиент присылает НАМЕРЕНИЕ, сервер считает сам.

// В браузере — только «что человек хочет купить»:
fetch('/api/order', {
  method: 'POST',
  body: JSON.stringify({ products: [{ id: 1, qty: 2 }, { id: 7, qty: 1 }] }),
});

// На сервере — цены берём ИЗ БАЗЫ, а не из запроса:
app.post('/api/order', async (req, res) => {
  let total = 0;
  for (const line of req.body.products) {
    const product = await db.findProduct(line.id); // ← настоящая цена
    total += product.price * line.qty;
  }
  await createOrder(req.body.products, total);
  res.json({ totalDue: total });
});

// Теперь подделать цену невозможно: пользователь не управляет базой.
// ПРАВИЛО НА ВСЮ ЖИЗНЬ: клиенту нельзя верить. Никогда. Ни в чём.`;

  protected readonly sqlExample = `-- Это язык SQL — на нём разговаривают с базой данных.
-- Читается почти по-английски, поэтому смысл понятен без изучения.

-- «Дай мне имя и цену тех товаров, что сейчас продаются,
--  отсортируй по цене, верни первые 20 штук»
SELECT name, price
FROM products
WHERE active = true
ORDER BY price
LIMIT 20;

-- «Запиши новый заказ»
INSERT INTO orders (user_id, total, created_at)
VALUES (42, 1780, NOW());

-- База данных — это не просто файл. Это отдельная программа,
-- которая умеет быстро искать среди миллионов записей,
-- не терять данные при отключении света и обслуживать
-- тысячу одновременных запросов, ничего не перепутав.`;

  protected readonly dnsLookup = `# Справочную можно спросить и вручную — из терминала.
# Команда nslookup есть в Windows, macOS и Linux одинаково.

$ nslookup magazin.ru

Server:    192.168.1.1       # у КОГО спросили: домашний роутер,
Address:   192.168.1.1#53    # который передаст вопрос дальше провайдеру

Non-authoritative answer:    # «ответ не от хозяина имени, а из кэша»
Name:      magazin.ru
Address:   93.184.216.34     # вот он, числовой адрес сервера

# Обратите внимание на строчку «non-authoritative»: нам честно
# сообщили, что ответ достали из чужой памяти, а не сходили
# за ним к первоисточнику. Это норма — так работает почти всегда.`;

  protected readonly fileLink = `// Что на самом деле хранится в базе про фотографию товара.
// НЕ сама фотография, а короткая строчка — адрес, где её взять:

{
  id: 42,
  name: 'Кружка',
  photo: 'https://files.magazin.ru/products/42/main.jpg',
}

// Сервер отдаёт браузеру этот JSON — то есть просто ссылку,
// несколько десятков байт. Дальше браузер сам идёт по адресу:
//
//   <img src="https://files.magazin.ru/products/42/main.jpg" alt="Кружка">
//
// И два мегабайта пикселей едут из хранилища В БРАУЗЕР НАПРЯМУЮ.
// Ваш сервер в этой поездке не участвует вообще — он только
// назвал адрес. Поэтому тысяча человек может одновременно
// листать фотографии, а сервер этого даже не заметит.`;

  protected readonly uploadFlow = `// А как файл вообще попадает в хранилище?
// Обычный путь: браузер грузит его туда САМ, минуя ваш сервер.

// 1. Браузер: «хочу загрузить фото, дай куда».
const { uploadUrl, key } = await fetch('/api/upload-link').then((r) => r.json());
// Сервер выдал временный адрес: «лей сюда, ссылка живёт 15 минут».

// 2. Браузер отправляет мегабайты прямо в хранилище.
await fetch(uploadUrl, { method: 'PUT', body: file });

// 3. И только теперь говорит серверу: «готово, вот ключ файла».
await fetch('/api/products/42/photo', {
  method: 'POST',
  body: JSON.stringify({ key: key }),
});

// Итог: через ваш сервер прошли две крошечные строчки,
// а сам файл он ни разу не держал в руках. Так и задумано.`;
}
