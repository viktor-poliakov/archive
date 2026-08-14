import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-api-graphql',
  imports: [CodeBlock, RouterLink],
  templateUrl: './graphql.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemApiGraphql {
  protected readonly restOverFetch = `{
  "id": 42,
  "name": "Анна Петрова",
  "avatarUrl": "https://cdn.magazin.ru/avatars/42.jpg",
  "email": "anna.petrova@example.com",
  "phone": "+7 999 123-45-67",
  "birthDate": "1991-04-17",
  "registeredAt": "2019-11-02T08:14:33Z",
  "lastLoginAt": "2026-08-11T19:02:10Z",
  "isEmailConfirmed": true,
  "isPhoneConfirmed": false,
  "locale": "ru-RU",
  "timezone": "Europe/Moscow",
  "newsletterOptIn": true,
  "loyaltyLevel": "silver",
  "loyaltyPoints": 1840,
  "defaultAddressId": 7719,
  "billingAddressId": 7719,
  "preferredPaymentMethodId": 31,
  "referralCode": "ANNA2019",
  "referredByUserId": null,
  "ordersCount": 27,
  "totalSpent": 184900,
  "averageCheck": 6848,
  "supportTicketsCount": 2,
  "marketingSegment": "returning-mid",
  "abTestBucket": "checkout-v3",
  "deletedAt": null,
  "updatedAt": "2026-08-10T11:00:00Z"
}`;

  protected readonly waterfallCode = `// ЭКРАН «ПРОФИЛЬ»: аватар, имя и три последних заказа с названиями товаров.
// Смотрим, во что это превращается на обычном REST-адресном подходе.

async function loadProfileScreen(userId) {
  // ШАГ 1. Идём за пользователем.
  // Пока не придёт ответ — мы даже не знаем, есть ли такой человек,
  // поэтому следующий запрос отправить НЕЛЬЗЯ. Ждём.
  const user = await fetch('/api/users/' + userId).then((r) => r.json());

  // ШАГ 2. Только теперь можно спросить его заказы.
  // Это второй полный круг по сети: туда и обратно.
  const orders = await fetch('/api/users/' + userId + '/orders?limit=3').then((r) => r.json());

  // ШАГ 3. В заказе лежат позиции, но в позиции — только productId,
  //        а нам нужно НАЗВАНИЕ товара. Третий круг.
  const productIds = orders.flatMap((order) => order.items.map((item) => item.productId));
  const products = await fetch('/api/products?ids=' + productIds.join(',')).then((r) => r.json());

  // ШАГ 4. Склеиваем всё руками: раскладываем товары по id,
  //        подставляем их в позиции заказов. Этот код тоже надо писать,
  //        читать и чинить, когда формат чуть-чуть поменяется.
  const productById = new Map(products.map((p) => [p.id, p]));
  const screen = {
    name: user.name,
    avatarUrl: user.avatarUrl,
    orders: orders.map((order) => ({
      id: order.id,
      total: order.total,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        title: productById.get(item.productId).title,
      })),
    })),
  };

  return screen;
}

// ИТОГ: три круга по сети ОДИН ЗА ДРУГИМ (не параллельно — каждый следующий
// зависит от предыдущего) плюс ручная склейка. Это и называют «водопадом
// запросов»: пока верхняя ступенька не долилась, нижняя не начинается.
// На быстром офисном интернете это незаметно. В метро с телефона — заметно очень.`;

  protected readonly graphqlSingleQuery = `# Тот же самый экран — одним запросом. Читается сверху вниз почти как список
# покупок: «мне про меня — имя и аватар, и ещё три последних заказа,
# а в каждом заказе — сумма и позиции, а в каждой позиции — название товара».

query ProfileScreen {
  me {
    name
    avatarUrl
    orders(last: 3) {
      id
      total
      items {
        quantity
        product {
          title
        }
      }
    }
  }
}

# Обратите внимание, чего здесь НЕТ:
#   • нет ни одного лишнего поля — email, телефон и дата рождения не приедут;
#   • нет второго и третьего запроса — сервер сам сходит куда надо;
#   • нет ручной склейки — ответ придёт уже вложенным, ровно такой формы.`;

  protected readonly graphqlOverHttp = `POST /graphql HTTP/1.1
Host: api.magazin.ru
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{"query":"query ProfileScreen { me { name avatarUrl } }","variables":{}}


### А вот ответ. Заметьте код 200 и то, что данные лежат в поле "data".

HTTP/1.1 200 OK
Content-Type: application/json

{"data":{"me":{"name":"Анна Петрова","avatarUrl":"https://cdn.magazin.ru/avatars/42.jpg"}}}


### И — внимание — ошибка ТОЖЕ приезжает с кодом 200.
### Сам HTTP-разговор прошёл успешно: письмо дошло, ответ получен.
### А вот что внутри конверта — уже дело GraphQL, и он расскажет об этом
### не кодом ответа, а отдельным полем "errors" в теле.

HTTP/1.1 200 OK
Content-Type: application/json

{"data":{"me":null},"errors":[{"message":"Вы не вошли в аккаунт"}]}`;

  protected readonly schemaSdl = `# СХЕМА — это договор. Здесь перечислено ВСЁ, что вообще можно спросить
# у сервера, и в каком виде это придёт. Пишется на языке описания схемы —
# SDL, Schema Definition Language, «язык описания схемы».
# Строчка, начинающаяся с решётки, — это комментарий.

# "type" читается как «какие поля бывают у такой вещи».
type User {
  id: ID!              # ID — идентификатор. Восклицательный знак = «поле точно есть»
  name: String!        # строка, которая точно есть
  avatarUrl: String    # строки нет — значит, может прийти пустота (null)
  email: String!
  phone: String
  # У поля бывают собственные аргументы — как у функции.
  # last: Int = 5 означает «сколько последних заказов, по умолчанию пять».
  orders(last: Int = 5): [Order!]!
}

type Order {
  id: ID!
  createdAt: String!
  total: Int!            # сумму денег хранят целым числом в копейках
  status: OrderStatus!
  items: [OrderItem!]!   # квадратные скобки = «это список»
  user: User!            # ссылка обратно на человека — связи ходят в обе стороны
}

# enum — перечисление: значение может быть только одним из этих слов.
# Опечатка «SHIPPPED» не пройдёт даже до запуска кода.
enum OrderStatus {
  NEW
  PAID
  SHIPPED
  CANCELLED
}

type OrderItem {
  quantity: Int!
  product: Product!
}

type Product {
  id: ID!
  title: String!
  price: Int!
  inStock: Boolean!
}

# Query — точка входа для ЧТЕНИЯ. Всё, что можно спросить, начинается отсюда.
type Query {
  me: User                                          # текущий вошедший человек
  user(id: ID!): User                               # любой человек по номеру
  order(id: ID!): Order
  products(search: String, limit: Int = 20): [Product!]!
}

# Mutation — точка входа для ИЗМЕНЕНИЯ. Всё, что что-то меняет, — здесь.
type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  cancelOrder(id: ID!): Order!
}

# input — особый вид типа для того, что клиент ПРИСЫЛАЕТ.
# Отдельный он потому, что присылать можно только простые значения,
# а не вложенные объекты со ссылками друг на друга.
input CreateOrderInput {
  productId: ID!
  quantity: Int!
  comment: String
}

# Subscription — на что можно ПОДПИСАТЬСЯ, чтобы сервер сам присылал новости.
type Subscription {
  orderStatusChanged(orderId: ID!): Order!
}`;

  protected readonly queryShape = `# ЗАПРОС. Обратите внимание: это не JSON и не JavaScript.
# Это отдельный маленький язык, в котором есть только имена полей и вложенность.
# Никаких значений мы не пишем — только СПРАШИВАЕМ.

query ProfileScreen {
  me {
    name
    avatarUrl
    orders(last: 2) {
      id
      total
      status
      items {
        quantity
        product {
          title
          price
        }
      }
    }
  }
}`;

  protected readonly responseShape = `{
  "data": {
    "me": {
      "name": "Анна Петрова",
      "avatarUrl": "https://cdn.magazin.ru/avatars/42.jpg",
      "orders": [
        {
          "id": "8801",
          "total": 74000,
          "status": "SHIPPED",
          "items": [
            { "quantity": 1, "product": { "title": "Чайник", "price": 49000 } },
            { "quantity": 2, "product": { "title": "Кружка", "price": 12500 } }
          ]
        },
        {
          "id": "8790",
          "total": 19900,
          "status": "PAID",
          "items": [
            { "quantity": 1, "product": { "title": "Термос", "price": 19900 } }
          ]
        }
      ]
    }
  }
}`;

  protected readonly operationsExample = `# ============ 1. QUERY — «спросить». Ничего не меняет. ============
# Переменные объявляются в скобках после имени операции.
# Знак доллара перед словом означает «это дырка, значение подставит клиент».
query GetOrder($orderId: ID!) {
  order(id: $orderId) {
    id
    status
    total
  }
}

# Значения переменных едут ОТДЕЛЬНО от текста запроса — обычным JSON:
#   {"orderId": "8801"}
# Так и правильнее (текст запроса один и тот же, его можно закэшировать),
# и безопаснее: значение никогда не «вклеивается» в текст руками.


# ============ 2. MUTATION — «изменить». Создать, поправить, удалить. ============
# Технически это тот же самый POST на тот же самый адрес.
# Слово mutation — это обещание СЕРВЕРУ: «сейчас будет изменение».
# Сервер выполняет такие поля строго по очереди, а не параллельно,
# чтобы два изменения не полезли друг другу под руку.
mutation PlaceOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    # Сразу после изменения просим вернуть то, что нужно нарисовать.
    # Отдельный запрос «а покажи, что получилось» делать не нужно.
    id
    status
    total
    items {
      quantity
      product {
        title
      }
    }
  }
}

# Переменные к ней:
#   {"input": {"productId": "31", "quantity": 2, "comment": "не звонить"}}


# ============ 3. SUBSCRIPTION — «подписаться». ============
# Это единственная операция, которая работает НЕ по обычному запрос-ответу.
# Здесь соединение остаётся открытым, и сервер сам присылает новое сообщение
# каждый раз, когда что-то произошло. Под капотом — вебсокеты.
subscription WatchOrder($orderId: ID!) {
  orderStatusChanged(orderId: $orderId) {
    id
    status
  }
}

# Читается так: «пока я не отпишусь, присылай мне сюда новый статус
# этого заказа всякий раз, когда он поменяется».`;

  protected readonly resolversJs = `// РЕЗОЛВЕР (resolver, «тот, кто разрешает вопрос») — обычная функция,
// которая умеет добыть ОДНО поле. Схема говорит, ЧТО можно спросить;
// резолверы отвечают на вопрос, ОТКУДА это взять.

const resolvers = {
  // Резолверы полей типа Query — точки входа. С них начинается любой запрос.
  Query: {
    // Четыре аргумента у любого резолвера, и их стоит запомнить:
    //   parent  — объект «этажом выше» (для Query он пустой);
    //   args    — аргументы, которые написал клиент: user(id: 42) → args.id;
    //   context — общий ящик на весь запрос: кто пришёл, подключение к базе;
    //   info    — служебные подробности о запросе, нужны редко.
    me(parent, args, context) {
      return context.db.findUser(context.currentUserId);
    },

    user(parent, args, context) {
      return context.db.findUser(args.id);
    },

    products(parent, args, context) {
      return context.db.searchProducts(args.search, args.limit);
    },
  },

  // Резолверы полей типа User. Сюда сервер приходит только тогда,
  // когда клиент действительно попросил соответствующее поле.
  User: {
    // parent — это тот самый User, которого вернул резолвер выше.
    orders(parent, args, context) {
      return context.db.findOrdersByUser(parent.id, args.last);
    },
  },

  Order: {
    items(parent, args, context) {
      return context.db.findOrderItems(parent.id);
    },
  },

  OrderItem: {
    product(parent, args, context) {
      return context.db.findProduct(parent.productId);
    },
  },

  Mutation: {
    async createOrder(parent, args, context) {
      // Проверки здесь ровно те же, что и в обычном обработчике:
      // вошёл ли человек, существует ли товар, хватает ли остатка.
      // GraphQL НЕ отменяет ни одной из них.
      if (!context.currentUserId) {
        throw new Error('Сначала войдите в аккаунт');
      }
      const product = await context.db.findProduct(args.input.productId);
      if (!product) {
        throw new Error('Такого товара нет');
      }
      return context.db.createOrder({
        userId: context.currentUserId,
        productId: product.id,
        quantity: args.input.quantity,
        // Цену берём ИЗ БАЗЫ. Клиент прислал только намерение.
        total: product.price * args.input.quantity,
      });
    },
  },
};

// ВАЖНАЯ МЕЛОЧЬ, КОТОРАЯ ЭКОНОМИТ ПОЛОВИНУ КОДА.
// Если резолвера для поля нет, сервер просто возьмёт одноимённое свойство
// у parent. Поэтому для User.name и User.email писать ничего не нужно —
// эти поля уже лежат в объекте, который вернул findUser.
// Писать резолвер надо только там, где данные нужно ДОБЫВАТЬ отдельно.`;

  protected readonly nPlusOneProblem = `// ЭКРАН: лента из 50 последних заказов, и рядом с каждым — имя покупателя.
// Запрос клиента выглядит совершенно невинно:
//
//   query { recentOrders(limit: 50) { id total user { name } } }
//
// А вот что произойдёт на сервере с наивными резолверами.

const resolvers = {
  Query: {
    recentOrders(parent, args, context) {
      // ЗАПРОС В БАЗУ №1. Один-единственный, всё честно.
      // Вернулось 50 строк заказов.
      return context.db.query('SELECT * FROM orders ORDER BY id DESC LIMIT 50');
    },
  },

  Order: {
    user(parent, args, context) {
      // А ВОТ ЗДЕСЬ БЕДА, И ЕЁ НЕ ВИДНО ГЛАЗАМИ.
      // Этот резолвер вызовется ОТДЕЛЬНО для КАЖДОГО из 50 заказов.
      // Пятьдесят вызовов — пятьдесят походов в базу.
      return context.db.query('SELECT * FROM users WHERE id = $1', [parent.userId]);
    },
  },
};

// АРИФМЕТИКА:
//   1 запрос за списком заказов
// + 50 запросов за покупателями (по одному на заказ)
// = 51 поход в базу вместо двух.
//
// У проблемы есть общепринятое имя — «N плюс один»: один запрос за списком
// плюс по одному на каждый элемент списка. Она не привязана к GraphQL,
// её ловят и в обычных серверах, но в GraphQL она случается ОСОБЕННО легко:
// резолверы маленькие, каждый по отдельности выглядит безобидно,
// и никто не видит картину целиком.
//
// Отдельная подлость: заказы могут принадлежать одному и тому же человеку.
// Тогда вы 50 раз спросите базу об одних и тех же трёх покупателях.`;

  protected readonly dataLoaderFix = `import DataLoader from 'dataloader';

// DataLoader — маленькая библиотека, которая делает ровно две вещи:
//   1) СОБИРАЕТ в пачку все запрошенные идентификаторы;
//   2) ЗАПОМИНАЕТ уже полученное, чтобы не спрашивать дважды.

function createUserLoader(db) {
  // Функция получает СРАЗУ МАССИВ идентификаторов — все, что накопились.
  return new DataLoader(async (userIds) => {
    // ОДИН запрос за всеми людьми сразу, списком.
    const rows = await db.query('SELECT * FROM users WHERE id = ANY($1)', [userIds]);

    // Важное требование библиотеки: вернуть результаты В ТОМ ЖЕ ПОРЯДКЕ,
    // в каком пришли идентификаторы. База порядок не гарантирует,
    // поэтому раскладываем по словарю и собираем заново.
    const byId = new Map(rows.map((row) => [String(row.id), row]));
    return userIds.map((id) => byId.get(String(id)) ?? null);
  });
}

// Загрузчик кладут в context — и создают ЗАНОВО НА КАЖДЫЙ ЗАПРОС.
// Это не мелочь, а требование безопасности: если сделать его один раз
// на весь сервер, запомненные данные одного пользователя утекут другому.
function buildContext(req) {
  return {
    db,
    currentUserId: getUserIdFromRequest(req),
    loaders: {
      user: createUserLoader(db),
      product: createProductLoader(db),
    },
  };
}

// Резолвер меняется на одну строку:
const resolvers = {
  Order: {
    user(parent, args, context) {
      // Мы всё так же «просим одного человека».
      // Но загрузчик не бежит в базу немедленно: он дожидается конца текущего
      // круга работы, собирает все накопившиеся id и делает ОДИН запрос.
      return context.loaders.user.load(parent.userId);
    },
  },
};

// НОВАЯ АРИФМЕТИКА:
//   1 запрос за списком заказов
// + 1 запрос за всеми покупателями сразу
// = 2 похода в базу вместо 51.
//
// И повторы исчезают бесплатно: если один и тот же покупатель встретился
// в сорока заказах, его id попадёт в пачку один раз.`;

  protected readonly errorsAndStatus = `{
  "data": {
    "me": {
      "name": "Анна Петрова",
      "avatarUrl": "https://cdn.magazin.ru/avatars/42.jpg",
      "orders": null
    }
  },
  "errors": [
    {
      "message": "Нет доступа к списку заказов",
      "path": ["me", "orders"],
      "locations": [{ "line": 5, "column": 5 }],
      "extensions": { "code": "FORBIDDEN" }
    }
  ]
}`;

  protected readonly restScreenClient = `// ЭКРАН «ПРОФИЛЬ С ПОСЛЕДНИМИ ЗАКАЗАМИ» — ВАРИАНТ НА REST.

async function loadProfileScreen(userId) {
  // Три круга по сети один за другим, потому что каждый следующий
  // запрос нуждается в ответе предыдущего.
  const user = await fetch('/api/users/' + userId).then((r) => r.json());
  const orders = await fetch('/api/users/' + userId + '/orders?limit=3').then((r) => r.json());

  const productIds = orders.flatMap((order) => order.items.map((item) => item.productId));
  const products = await fetch('/api/products?ids=' + productIds.join(',')).then((r) => r.json());

  // Ручная склейка: разложить товары по номеру и подставить в позиции.
  const productById = new Map(products.map((product) => [product.id, product]));

  return {
    name: user.name,
    avatarUrl: user.avatarUrl,
    orders: orders.map((order) => ({
      id: order.id,
      total: order.total,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        title: productById.get(item.productId).title,
      })),
    })),
  };
}

// ЧТО ЗДЕСЬ ХОРОШО:
//   • всё понятно с первого взгляда, никаких новых слов;
//   • каждый адрес можно открыть в браузере и посмотреть глазами;
//   • ответы кэшируются браузером и промежуточными серверами сами собой.
//
// ЧТО ЗДЕСЬ ПЛОХО:
//   • три ожидания подряд вместо одного;
//   • пользователь приехал целиком, со всеми полями, включая ненужные;
//   • код склейки живёт на клиенте и ломается при каждом изменении формата.`;

  protected readonly graphqlScreenClient = `// ТОТ ЖЕ ЭКРАН — ВАРИАНТ НА GRAPHQL.
// Текст запроса держат в отдельном файле profile-screen.graphql:
// так его видят инструменты, подсветка и генератор типов.

import profileScreenQuery from './profile-screen.graphql';

async function loadProfileScreen() {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: profileScreenQuery,
      variables: { last: 3 },
    }),
  });

  const payload = await response.json();

  // ЛОВУШКА, НА КОТОРОЙ СПОТЫКАЮТСЯ ВСЕ НОВИЧКИ.
  // Проверять response.ok здесь почти бесполезно: код ответа будет 200
  // даже тогда, когда всё пошло не так. Настоящие ошибки лежат внутри тела.
  if (payload.errors) {
    // Ошибок может быть несколько сразу, и часть данных при этом может
    // приехать нормально — payload.data не обязательно пустой.
    throw new Error(payload.errors[0].message);
  }

  // Никакой склейки: ответ уже приехал ровно той формы, что и запрос.
  return payload.data.me;
}

// ЧТО ЗДЕСЬ ХОРОШО:
//   • один круг по сети вместо трёх;
//   • ни одного лишнего поля в ответе;
//   • форма данных описана в одном месте — в тексте запроса;
//   • при желании из схемы генерируются типы TypeScript, и опечатка
//     в имени поля перестаёт быть сюрпризом времени выполнения.
//
// ЧТО ЗДЕСЬ ПЛОХО:
//   • разбор ошибок стал ручным и непривычным;
//   • браузер такой ответ не закэширует — нужен клиентский кэш;
//   • в проекте появилась схема, генератор типов и целый новый словарь слов.`;
}
