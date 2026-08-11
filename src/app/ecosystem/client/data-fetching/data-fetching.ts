import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-data-fetching',
  imports: [CodeBlock, RouterLink],
  templateUrl: './data-fetching.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientDataFetching {
  protected readonly fetchGet = `// fetch — встроенная в браузер функция «сходи по адресу и принеси».
// Ставить её не надо, она есть в любом современном браузере.

// ШАГ 1. Отправляем запрос и ждём ответа.
// await означает «подожди здесь, пока не приедет» — иначе код
// побежал бы дальше с пустыми руками: сеть работает не мгновенно.
const response = await fetch('/api/products?page=1');

// ВНИМАНИЕ: сейчас у нас на руках ещё НЕ данные.
// Приехала только «шапка» ответа: код 200, заголовки, тип содержимого.
// Само тело письма может весить мегабайт и всё ещё едет по сети.

// ШАГ 2. Читаем тело и разбираем его из текста JSON в объект JavaScript.
// Поэтому здесь второй await — это отдельное ожидание.
const data = await response.json();

console.log(data.products);
// [{ id: 1, name: 'Кружка', price: 490 }, { id: 2, ... }]

// Итого два ожидания подряд, и это не опечатка:
// первое — «дошло ли письмо», второе — «прочитали ли мы его целиком».`;

  protected readonly fetchStatus = `// ❌ ТАК ПИШУТ ПОЧТИ ВСЕ, КТО ВИДИТ fetch ВПЕРВЫЕ. И это ловушка.
try {
  const response = await fetch('/api/products');
  const data = await response.json();
  renderProducts(data.products);
} catch (error) {
  renderError(); // сюда мы НЕ попадём, если сервер ответил 404 или 500
}

// ПОЧЕМУ. Для fetch «ошибка» — это только «письмо не доехало»:
// нет интернета, сервер вообще не отозвался, соединение оборвалось.
// А ответ «404 нет такой страницы» или «500 у меня всё сломалось» —
// это ДОЕХАВШЕЕ письмо. Содержимое плохое, но доставка состоялась.
// fetch честно рапортует «я справился» и исключение не бросает.
// В catch мы попадём разве что на строке response.json(),
// когда попробуем разобрать как JSON страницу с текстом ошибки.


// ✅ ПРАВИЛЬНО: статус ответа проверяем руками. Всегда. Каждый раз.
try {
  const response = await fetch('/api/products');

  if (!response.ok) {
    // response.ok — это true ТОЛЬКО для кодов 200–299.
    // response.status — само число: 404, 403, 500 и так далее.
    // Превращаем «плохой ответ» в настоящее исключение,
    // чтобы дальше был один общий путь обработки беды.
    throw new Error('Сервер ответил кодом ' + response.status);
  }

  const data = await response.json();
  renderProducts(data.products);
} catch (error) {
  // Теперь сюда приходят ОБА вида беды: и «сеть отвалилась»,
  // и «сервер ответил плохим кодом». Именно это нам и нужно.
  renderError(error);
}`;

  protected readonly fetchPost = `// POST — «прими и сохрани». От GET отличается тремя вещами.
const response = await fetch('/api/reviews', {
  // 1. Метод. Говорим явно: это не «дай», а «прими и запиши».
  method: 'POST',

  headers: {
    // 2. Заголовки — служебная шапка письма.
    // Здесь мы сообщаем серверу, в КАКОМ ФОРМАТЕ отправлено тело.
    // Без этой строки сервер часто не понимает, как его разбирать,
    // и отвечает ошибкой — а вы полдня ищете причину.
    'Content-Type': 'application/json',
  },

  // 3. Тело — сами данные. По сети умеет ездить только текст,
  // поэтому объект превращаем в строку методом JSON.stringify.
  body: JSON.stringify({ productId: 7, rating: 5, text: 'Отличная кружка' }),
});

// Проверка статуса нужна ровно так же, как и в запросе за данными.
if (!response.ok) {
  throw new Error('Не удалось сохранить отзыв: ' + response.status);
}

// Обычно сервер возвращает то, что получилось: с настоящим id,
// датой и всем, что он проставил сам. Это стоит взять и показать.
const createdReview = await response.json();`;

  protected readonly axiosExample = `import axios from 'axios';

// То же самое, что и на fetch, но короче: axios сам разбирает JSON
// и сам бросает исключение на кодах 4xx и 5xx — то есть ту самую
// проверку response.ok делать уже не надо, она встроена.
const { data } = await axios.get('/api/products', { timeout: 5000 });

// timeout: если сервер молчит 5 секунд — считаем это неудачей и бросаем.
// У обычного fetch такой настройки нет вообще: запрос может висеть
// минутами, а пользователь всё это время смотрит на крутилку.

// POST тоже короче: объект превращается в JSON сам,
// нужный заголовок Content-Type проставляется сам.
await axios.post('/api/reviews', { productId: 7, rating: 5 });

// Перехватчик — общая прослойка, через которую проходят ВСЕ запросы.
// Незаменимо, когда одно и то же надо делать в сотне мест.
axios.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + getTokenFromStorage();
  return config;
});

// А это — общая обработка ответа. Например, «выкинуло из аккаунта»:
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  },
);`;

  protected readonly naiveScreen = `// ❌ Наивный экран: обработан ровно один случай — когда всё хорошо.
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

// ЧТО ВИДИТ ЧЕЛОВЕК В МЕТРО С ОДНОЙ ПАЛОЧКОЙ СВЯЗИ:
// первые шесть секунд — пустой белый экран. Ни надписи, ни крутилки.
// Он решит, что приложение сломалось, и закроет вкладку.
//
// Если сервер ответил кодом 500 — пустой экран НАВСЕГДА.
// Ошибки никто не поймал, состояние осталось пустым массивом.
//
// Если товаров действительно нет — тот же самый пустой экран.
// Человек не отличит «пусто» от «сломалось» и от «ещё грузится».
// Три совершенно разные ситуации выглядят одинаково. Это провал.`;

  protected readonly manualStates = `function ProductList() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready
  const [error, setError] = useState(null);

  useEffect(() => {
    // Флажок «компонент ещё на экране». Если человек ушёл со страницы,
    // а ответ пришёл после — трогать состояние закрытого экрана нельзя.
    let cancelled = false;

    setStatus('loading');

    fetch('/api/products')
      .then((response) => {
        if (!response.ok) throw new Error('Код ' + response.status);
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products);
        setStatus('ready');
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Четыре ветки — четыре состояния. Ни одну нельзя пропустить.

  // 1. Грузится. Показываем скелетон — серые заготовки будущих карточек.
  if (status === 'loading') return <ProductsSkeleton />;

  // 2. Сломалось. Обязательно с кнопкой «повторить»: беда чаще всего
  //    временная, и человек должен иметь возможность попробовать ещё раз.
  if (status === 'error') {
    return <ErrorBox text="Не удалось загрузить товары" onRetry={reload} />;
  }

  // 3. Пусто. Это НЕ ошибка, а нормальный ответ «список пустой».
  //    Здесь уместно объяснить, что делать дальше.
  if (products.length === 0) {
    return <EmptyBox text="В этой категории пока ничего нет" />;
  }

  // 4. И только теперь — сами данные.
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

// Сорок строк. Ради одного списка. И это ещё НЕ полный набор:
// здесь нет отмены устаревших запросов, нет кэша, нет повтора
// при сбое сети и нет обновления данных, когда они протухли.`;

  protected readonly abortRace = `// ГОНКА ЗАПРОСОВ.
// Человек нажал вкладку «Одежда», через полсекунды передумал
// и нажал «Обувь». Ушли два запроса. Ответ по «Одежде» может
// вернуться ПОЗЖЕ ответа по «Обуви» — сеть не гарантирует порядок.
// В итоге на вкладке «Обувь» окажутся куртки. Ошибка, которую
// невозможно воспроизвести на быстром интернете разработчика.

useEffect(() => {
  // AbortController — это «пульт отмены» для запроса. Один на запрос.
  const controller = new AbortController();

  fetch('/api/products?category=' + category, { signal: controller.signal })
    .then((r) => r.json())
    .then(setProducts)
    .catch((e) => {
      // Отменённый запрос тоже прилетает сюда. Но это не поломка,
      // а наше собственное решение — такую «ошибку» просто пропускаем,
      // иначе покажем человеку красный экран на ровном месте.
      if (e.name === 'AbortError') return;
      setError(e);
    });

  // Эта функция вызывается ПЕРЕД следующим запуском эффекта
  // (то есть при смене категории) и при уходе со страницы.
  // Здесь мы обрываем устаревший запрос — его ответ уже никому не нужен.
  return () => controller.abort();
}, [category]);`;

  protected readonly queryScreen = `import { useQuery } from '@tanstack/react-query';

function ProductList({ category }) {
  const { data, isPending, isError } = useQuery({
    // Ключ — это «адрес полки в кэше». По нему библиотека понимает:
    // такой ответ уже лежит на складе, второй раз спрашивать не нужно.
    // Категория входит в ключ, поэтому у каждой категории своя полка.
    queryKey: ['products', category],

    // Функция, которая реально идёт в сеть.
    // КОГДА её вызвать — решает библиотека, а не вы.
    // signal она передаёт сама: отмена устаревших запросов уже внутри.
    queryFn: ({ signal }) =>
      fetch('/api/products?category=' + category, { signal }).then((r) => {
        if (!r.ok) throw new Error('Код ' + r.status);
        return r.json();
      }),
  });

  // Те же четыре состояния — но считать их уже не надо, они готовые.
  if (isPending) return <ProductsSkeleton />;
  if (isError) return <ErrorBox text="Не удалось загрузить товары" />;
  if (data.products.length === 0) return <EmptyBox text="Пока ничего нет" />;

  return (
    <ul>
      {data.products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

// Кода стало меньше, чем в ручном варианте, а умеет он БОЛЬШЕ:
// кэш, склейка одинаковых запросов, отмена, автоповтор при сбое сети,
// фоновое обновление при возврате на вкладку. Всё это уже включено.`;

  protected readonly queryMutation = `import { useMutation, useQueryClient } from '@tanstack/react-query';

// «Мутация» — любой запрос, который что-то МЕНЯЕТ на сервере:
// лайк, отправка формы, удаление. В отличие от чтения, повторять
// её просто так нельзя — второй лайк это уже другое действие.

function LikeButton({ postId }) {
  const queryClient = useQueryClient(); // доступ к общему складу-кэшу

  const like = useMutation({
    // 1. Что отправляем на сервер.
    mutationFn: () =>
      fetch('/api/posts/' + postId + '/like', { method: 'POST' }),

    // 2. Выполняется СРАЗУ по клику, ещё до ответа сервера.
    //    Это и есть «оптимистичное обновление»: мы заранее верим,
    //    что всё получится, потому что в 99 случаях из 100 так и есть.
    onMutate: async () => {
      // Останавливаем фоновые обновления этой полки, иначе
      // прилетевший старый ответ перетрёт нашу правку.
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Запоминаем, как было. Это наш путь назад.
      const previous = queryClient.getQueryData(['post', postId]);

      // Закрашиваем сердечко прямо в кэше — экран меняется мгновенно,
      // без ожидания сети. Человек не замечает никакой задержки.
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        liked: true,
        likes: old.likes + 1,
      }));

      return { previous }; // передаём «путь назад» дальше по цепочке
    },

    // 3. Сервер отказал (нет сети, нет прав, пост удалён) —
    //    возвращаем экран ровно в то состояние, что было до клика.
    onError: (err, variables, context) => {
      queryClient.setQueryData(['post', postId], context.previous);
      showNotification('Не удалось поставить лайк');
    },

    // 4. Чем бы дело ни кончилось — помечаем данные устаревшими.
    //    Библиотека перечитает их с сервера и покажет настоящую правду.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return <button onClick={() => like.mutate()}>♥</button>;
}`;

  protected readonly queryPagination = `// ВАРИАНТ 1. Обычные страницы: «1 2 3 ... 47».
// Номер страницы входит в ключ кэша, поэтому возврат на первую
// страницу происходит мгновенно — она уже лежит на своей полке.
const [page, setPage] = useState(1);

const { data } = useQuery({
  queryKey: ['products', page],
  queryFn: () => fetchJson('/api/products?page=' + page + '&limit=20'),
});


// ВАРИАНТ 2. Бесконечная лента: кнопка «показать ещё»
// или автоматическая подгрузка при прокрутке вниз.
const feed = useInfiniteQuery({
  queryKey: ['feed'],
  initialPageParam: 1,

  // pageParam — номер порции, которую сейчас просят.
  queryFn: ({ pageParam }) => fetchJson('/api/feed?page=' + pageParam),

  // Библиотека спрашивает: «а какой параметр брать для следующей порции?»
  // Возвращаем null, когда порции кончились — тогда кнопка «ещё» погаснет.
  // Сервер обычно сам подсказывает это в ответе.
  getNextPageParam: (lastPage) => lastPage.nextPage ?? null,
});

// Порции приходят по отдельности, перед выводом их склеивают в один список.
const items = feed.data?.pages.flatMap((page) => page.items) ?? [];

// Подгрузить следующую порцию:
// feed.fetchNextPage();
// Есть ли ещё что грузить:
// feed.hasNextPage;`;

  protected readonly humanErrors = `// ТАЙМАУТ. У fetch его по умолчанию НЕТ: запрос может висеть минутами,
// а человек всё это время смотрит на крутилку и не понимает, что делать.
const response = await fetch('/api/products', {
  signal: AbortSignal.timeout(5000), // молчит 5 секунд — обрываем
});
// При срабатывании прилетит ошибка с именем 'TimeoutError'.


// ЧЕЛОВЕЧЕСКИЙ ТЕКСТ. Технический текст ошибки нужен вам в журнале.
// Человеку нужен другой: что случилось и что теперь делать.
function humanMessage(error) {
  if (error.name === 'TimeoutError') {
    return 'Сервер долго не отвечает. Проверьте интернет и попробуйте ещё раз.';
  }
  if (error.status === 401) {
    return 'Похоже, вы вышли из аккаунта. Войдите снова.';
  }
  if (error.status === 403) {
    return 'У вас нет доступа к этому разделу.';
  }
  if (error.status === 404) {
    return 'Мы не нашли эти данные. Возможно, их удалили.';
  }
  if (error.status >= 500) {
    return 'У нас неполадки. Мы уже чиним — попробуйте через минуту.';
  }
  return 'Что-то пошло не так. Попробуйте ещё раз.';
}


// АВТОПОВТОР. Повторять автоматически можно только БЕЗОПАСНЫЕ запросы —
// те, что ничего не меняют, то есть чтение.
function shouldRetry(method, status) {
  if (method !== 'GET') return false;    // менять — только по клику человека
  if (status === undefined) return true; // сеть моргнула, ответа не было
  if (status >= 500) return true;        // серверу плохо, но это временно
  return false;                          // 401, 403, 404 — повтор не поможет
}

// ❌ НИКОГДА не повторяйте автоматически оплату, отправку сообщения,
//    создание заказа. Ответ мог потеряться уже ПОСЛЕ того, как сервер
//    всё сделал: деньги списаны, а вы не знаете. Повтор спишет их дважды.
//    Для таких случаев есть «ключ идемпотентности» — уникальный номер
//    попытки, по которому сервер узнаёт повтор. Но это уже тема бэкенда.`;
}
