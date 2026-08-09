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
const ответ = await fetch('/api/products?page=1');
const данные = await ответ.json();

// 2. Рисуем то, что пришло.
for (const товар of данные.products) {
  добавитьКарточкуНаСтраницу(товар.name, товар.price);
}

// 3. Ждём действий пользователя.
кнопкаКупить.addEventListener('click', () => {
  fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId: 1 }),
  });
});

// Заметьте: сам список товаров клиент НЕ ХРАНИТ и НЕ ПРИДУМЫВАЕТ.
// Он только просит его у сервера и красиво показывает.`;

  protected readonly serverCode = `// ЭТО РАБОТАЕТ НА СЕРВЕРЕ — на чужом компьютере в дата-центре.
// Задача сервера — принять запрос, проверить, посчитать, сходить в базу.

app.get('/api/products', async (запрос, ответ) => {
  // 1. Кто к нам пришёл? Проверяем, что человек вошёл в аккаунт.
  const пользователь = await найтиПользователяПоCookie(запрос.cookies.session);
  if (!пользователь) {
    return ответ.status(401).json({ error: 'Сначала войдите' });
  }

  // 2. Идём в базу данных за товарами.
  const товары = await база.запрос(
    'SELECT id, name, price FROM products WHERE active = true LIMIT 20',
  );

  // 3. Отдаём результат обратно в браузер.
  ответ.json({ products: товары, total: товары.length });
});

// Сервер — единственный, кто имеет право трогать базу данных.
// Браузер до неё не дотягивается никогда. И это НЕ случайность.`;

  protected readonly trustClientBad = `// ❌ ОПАСНО: считаем цену заказа в браузере и верим ей.

// В браузере:
const итог = корзина.reduce((сумма, товар) => сумма + товар.цена, 0);
fetch('/api/order', {
  method: 'POST',
  body: JSON.stringify({ товары: корзина, кОплате: итог }), // ← 1780 ₽
});

// На сервере:
app.post('/api/order', (запрос, ответ) => {
  создатьЗаказ(запрос.body.товары, запрос.body.кОплате); // просто верим
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
  body: JSON.stringify({ товары: [{ id: 1, кол: 2 }, { id: 7, кол: 1 }] }),
});

// На сервере — цены берём ИЗ БАЗЫ, а не из запроса:
app.post('/api/order', async (запрос, ответ) => {
  let итог = 0;
  for (const позиция of запрос.body.товары) {
    const товар = await база.найтиТовар(позиция.id); // ← настоящая цена
    итог += товар.price * позиция.кол;
  }
  await создатьЗаказ(запрос.body.товары, итог);
  ответ.json({ кОплате: итог });
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
}
