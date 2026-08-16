import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-data-object-storage',
  imports: [CodeBlock, RouterLink],
  templateUrl: './object-storage.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemDataObjectStorage {
  protected readonly naiveUploadToDisk = `// БОЛЬНОЙ КОД. Первое, что пишет каждый. На ноутбуке работает идеально.

import express from 'express';
import multer from 'multer';

// Складываем всё, что прислали, в папку uploads рядом с приложением.
const upload = multer({ dest: './uploads' });

const app = express();

app.post('/api/avatar', upload.single('file'), async (req, res) => {
  // multer уже положил файл на диск и сказал, куда именно.
  // req.file.path — это что-то вроде './uploads/a7f3c9e1b2'
  await db.query(
    'UPDATE users SET avatar_path = $1 WHERE id = $2',
    [req.file.path, req.user.id],
  );

  res.json({ ok: true });
});

// А отдаём мы файл своими руками — просто открываем его с диска.
app.get('/avatars/:name', (req, res) => {
  res.sendFile('/app/uploads/' + req.params.name);
});

app.listen(3000);

// ЧТО ЗДЕСЬ НЕ ТАК. Пять отдельных бед, и все пять случатся —
// не «когда-нибудь при большой нагрузке», а на первой же неделе в проде.

// БЕДА 1. КОПИЙ СЕРВЕРА НЕСКОЛЬКО, А ФАЙЛ ЛЕЖИТ НА ОДНОЙ.
//   Запрос на загрузку попал в копию №1 — файл оказался на её диске.
//   Пользователь обновил страницу, запрос попал в копию №2 —
//   а там на диске такого файла нет и никогда не было. Ответ: 404.
//   Ещё раз обновил — снова попал в №1 — картинка есть.
//   Файл «мигает»: то есть, то нет. Воспроизвести это на ноутбуке,
//   где сервер один, физически невозможно.

// БЕДА 2. ВЫКЛАДКА НОВОЙ ВЕРСИИ СТИРАЕТ ДИСК.
//   Контейнер — это не компьютер, а процесс с временной файловой системой.
//   Собрали новый образ, запустили — внутри чистая папка uploads.
//   Все аватары пользователей исчезли. Молча. Без единой ошибки в журнале.

// БЕДА 3. ДИСК КОНЧАЕТСЯ, И ЧИНИТСЯ ЭТО ТОЛЬКО РУКАМИ.
//   Диск не «замедляется», когда заполняется, — он просто кончается.
//   В этот момент падает не только загрузка файлов: перестаёт писаться
//   журнал, ломаются временные файлы, а иногда встаёт и сама база.

// БЕДА 4. БЭКАП БАЗЫ НЕ СОДЕРЖИТ ФАЙЛОВ.
//   В базе лежит СТРОКА './uploads/a7f3c9e1b2' — и только она.
//   Развернули вчерашний бэкап на новом сервере: пути на месте,
//   файлов нет ни одного. Каждая картинка на сайте — битая ссылка.

// БЕДА 5. ВЫ ТРАТИТЕ СВОЙ ПРОЦЕСС НА ПЕРЕКАЧКУ БАЙТОВ.
//   res.sendFile — это ваш сервер, читающий диск и льющий байты в сеть.
//   Пока он льёт видео на 300 МБ, он не обслуживает никого другого.`;

  protected readonly s3Cli = `# Самый быстрый способ почувствовать объектное хранилище руками —
# командная строка. Никакого кода, только четыре команды.

# Создаём бакет — «контейнер верхнего уровня» для наших объектов.
aws s3 mb s3://shop-media

# Кладём файл. Всё, что после имени бакета, — это КЛЮЧ, одна длинная строка.
# Косые черты внутри ключа — обычные символы, такие же, как буквы.
aws s3 cp avatar.webp s3://shop-media/users/42/avatars/8f3c1d.webp
aws s3 cp photo.jpg   s3://shop-media/products/1001/photos/main.jpg

# Забираем обратно по ключу.
aws s3 cp s3://shop-media/users/42/avatars/8f3c1d.webp ./local-copy.webp

# А теперь САМОЕ ИНТЕРЕСНОЕ — «список файлов в папке users/42/».
aws s3 ls s3://shop-media/users/42/
#                             PRE avatars/

# Обратите внимание на слово PRE. Это не «папка», это PREFIX — префикс.
# Хранилище не хранит никаких папок. Оно просто взяло ВСЕ ключи бакета,
# оставило те, что начинаются на 'users/42/', и сгруппировало остаток
# по первой косой черте. Каталог сочинён на лету, специально для вас.

# Проверить это можно так — попросим плоский список без группировки:
aws s3api list-objects-v2 --bucket shop-media --prefix users/42/ \\
  --query 'Contents[].Key' --output text
# users/42/avatars/8f3c1d.webp

# Один ключ. Одна строка. Никаких вложенных сущностей.

# И вот прямое следствие, которое обязательно надо прочувствовать:
# «переименовать папку users/42 в users/99» ОДНОЙ ОПЕРАЦИЕЙ НЕЛЬЗЯ.
# Придётся перечислить все ключи с этим префиксом, скопировать каждый
# под новым именем и удалить старый. Тысяча файлов — три тысячи операций.
aws s3 mv s3://shop-media/users/42/ s3://shop-media/users/99/ --recursive
# Команда одна, но внутри она делает ровно это, по объекту за раз.`;

  protected readonly minioLocal = `# «Совместимо с S3» — это не маркетинг, это буквально: тот же протокол,
# те же команды, тот же клиент. Меняется адрес и пара ключей.

# MinIO — объектное хранилище с S3-совместимым протоколом,
# которое можно поднять у себя одной командой. Идеально для разработки:
# не нужен интернет, не нужна карта, не нужен чужой аккаунт.
docker run -p 9000:9000 -p 9001:9001 \\
  -e MINIO_ROOT_USER=localadmin \\
  -e MINIO_ROOT_PASSWORD=localadmin123 \\
  -v ~/minio-data:/data \\
  quay.io/minio/minio server /data --console-address ":9001"

# Всё. На localhost:9000 теперь живёт хранилище, говорящее на языке S3,
# а на localhost:9001 — веб-интерфейс, где видно объекты глазами.

# Тот же самый aws cli, что ходит в Amazon, ходит и сюда —
# отличие ровно одно: мы говорим ему другой адрес.
export AWS_ACCESS_KEY_ID=localadmin
export AWS_SECRET_ACCESS_KEY=localadmin123

aws --endpoint-url http://localhost:9000 s3 mb s3://shop-media
aws --endpoint-url http://localhost:9000 s3 cp avatar.webp s3://shop-media/test.webp
aws --endpoint-url http://localhost:9000 s3 ls s3://shop-media/

# В коде приложения разница ровно такая же — три строки настроек.
# Ниже НЕ bash, а фрагмент .env, но идея видна лучше всего именно так:

# --- разработка, MinIO на своей машине ---
# S3_ENDPOINT=http://localhost:9000
# S3_BUCKET=shop-media
# S3_REGION=us-east-1

# --- прод, Cloudflare R2 ---
# S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
# S3_BUCKET=shop-media
# S3_REGION=auto

# Код приложения между этими двумя строчками не меняется НИ НА СИМВОЛ.
# Вот что на самом деле значит «S3 стал стандартом».`;

  protected readonly proxyUpload = `// БОЛЬНОЙ КОД НОМЕР ДВА. Мы уже поумнели и завели объектное хранилище.
// Но файл по-прежнему едет ЧЕРЕЗ НАС — и это почти так же плохо.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';

const s3 = new S3Client({ region: process.env.S3_REGION });

// Просим multer держать файл в ПАМЯТИ процесса, а не на диске.
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/videos', upload.single('file'), async (req, res) => {
  // К этому моменту ВЕСЬ файл уже целиком лежит в оперативной памяти
  // вашего Node.js-процесса. Все 300 мегабайт. В одном буфере.
  await s3.send(new PutObjectCommand({
    Bucket: 'shop-media',
    Key: 'videos/' + req.user.id + '/' + crypto.randomUUID() + '.mp4',
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }));

  res.json({ ok: true });
});

// ПОЧЕМУ ЭТО ПЛОХО. Посчитаем байты, которые куда-то едут.

// Файл 300 МБ проходит ЧЕТЫРЕ отрезка пути:
//   1. браузер  -> ваш сервер   (входящий трафик, медленный интернет клиента)
//   2. сеть     -> память процесса (300 МБ в куче Node.js)
//   3. память   -> хранилище    (исходящий трафик вашего сервера)
//   4. и только теперь — ответ пользователю
// Вместо ОДНОГО отрезка «браузер -> хранилище», который был бы нужен.

// ПАМЯТЬ. Один такой запрос — 300 МБ. Пять одновременных — 1,5 ГБ.
// Контейнеру обычно выдают 512 МБ или 1 ГБ, и он будет убит системой
// за превышение лимита. Не «замедлится» — будет УБИТ, вместе со всеми
// остальными запросами, которые он в этот момент обслуживал.

// ВРЕМЯ. Node.js — один поток. Пока он перекладывает байты,
// он не считает корзины, не отдаёт каталог и не отвечает на /health.
// Балансировщик решит, что сервер мёртв, и выведет его из строя.

// А главное — В ЭТОЙ РАБОТЕ НЕТ НИКАКОГО СМЫСЛА. Ваш код не смотрит
// в эти байты, не меняет их, не принимает по ним решений.
// Он работает бесплатным и очень медленным курьером.`;

  protected readonly presignPut = `// ПРАВИЛЬНО. Сервер не трогает байты — он выдаёт РАЗРЕШЕНИЕ.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT, // для MinIO/R2; для Amazon можно опустить
});

const ALLOWED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

app.post('/api/avatar/upload-url', requireAuth, async (req, res) => {
  const { contentType, size } = req.body;

  // ШАГ 1. ПРАВА И ЗДРАВЫЙ СМЫСЛ — здесь и только здесь.
  // Проверяем ДО выдачи ссылки: потом мы этот файл уже не увидим.
  const ext = ALLOWED.get(contentType);
  if (!ext) return res.status(400).json({ error: 'Только jpeg, png или webp' });
  if (size > 5 * 1024 * 1024) return res.status(400).json({ error: 'Не больше 5 МБ' });

  // ШАГ 2. КЛЮЧ ПРИДУМЫВАЕМ МЫ, А НЕ ПОЛЬЗОВАТЕЛЬ.
  // Имя файла с его машины в ключ не попадает вообще никогда —
  // там бывают косые черты, точки, пробелы, кириллица и '../'.
  const key = 'users/' + req.user.id + '/avatars/' + crypto.randomUUID() + '.' + ext;

  // ШАГ 3. Заводим в базе ЗАПИСЬ-ЧЕРНОВИК со статусом 'pending'.
  // Зачем — объясняется сразу под этим примером: связь между
  // «выдали ссылку» и «файл залит» рвётся, и без черновика
  // мы никогда не узнаем, какие объекты в хранилище лишние.
  const upload = await db.one(
    "INSERT INTO uploads (user_id, s3_key, status) VALUES ($1, $2, 'pending') RETURNING id",
    [req.user.id, key],
  );

  // ШАГ 4. Подписываем ОДНУ конкретную операцию.
  // Подписью накрыто: метод (PUT), бакет, ключ, тип содержимого
  // и момент истечения. Изменить в ссылке хоть один символ —
  // и подпись перестанет сходиться, хранилище ответит отказом.
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }, // пять минут. Не пять часов и не пять дней.
  );

  res.json({ uploadId: upload.id, uploadUrl: url, key });
});

// ЧТО ИМЕННО МЫ ОТДАЛИ БРАУЗЕРУ. Обычную ссылку с длинным хвостом:
//
//   https://shop-media.s3.amazonaws.com/users/42/avatars/8f3c.webp
//     ?X-Amz-Algorithm=AWS4-HMAC-SHA256
//     &X-Amz-Credential=AKIA.../20260815/eu-central-1/s3/aws4_request
//     &X-Amz-Date=20260815T101500Z
//     &X-Amz-Expires=300
//     &X-Amz-SignedHeaders=host;content-type
//     &X-Amz-Signature=6f2a...
//
// Последний параметр — ОТПЕЧАТОК всего остального, посчитанный
// с помощью СЕКРЕТНОГО КЛЮЧА, который есть только у вашего сервера
// и у хранилища. Подделать его нельзя: чтобы вычислить подпись
// для другого ключа объекта или для другого срока, нужен секрет.
// А поменять что-то в ссылке, не пересчитав подпись, тоже нельзя —
// хранилище само пересчитывает отпечаток и сравнивает.

// СЕКРЕТНЫЙ КЛЮЧ ПРИ ЭТОМ НИКУДА НЕ УЕЗЖАЕТ. В браузер уходит
// результат вычисления, а не сам секрет. Это принципиально:
// положить ключи от хранилища в код фронтенда — значит подарить
// всему интернету право писать в ваш бакет.`;

  protected readonly browserUpload = `<!-- КЛИЕНТ. Три сетевых обращения вместо одного, и это правильно. -->

<form id="avatar-form">
  <input type="file" id="avatar-input" accept="image/jpeg,image/png,image/webp" />
  <button type="submit">Загрузить аватар</button>
  <progress id="avatar-progress" value="0" max="100"></progress>
</form>

<script type="module">
  const form = document.getElementById('avatar-form');
  const input = document.getElementById('avatar-input');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = input.files[0];
    if (!file) return;

    // Проверка на клиенте — это ВЕЖЛИВОСТЬ, а не защита.
    // Она экономит человеку время: незачем гнать 80 МБ, чтобы услышать «нет».
    // Настоящая проверка всё равно живёт на сервере, потому что клиент
    // может быть какой угодно, включая curl из терминала.
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл больше 5 МБ');
      return;
    }

    // ОБРАЩЕНИЕ 1. Просим у СВОЕГО сервера разрешение.
    // Сюда едут только три числа и строка — никаких байтов файла.
    const permission = await fetch('/api/avatar/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: file.type, size: file.size }),
    }).then((r) => r.json());

    // ОБРАЩЕНИЕ 2. Льём файл НАПРЯМУЮ В ХРАНИЛИЩЕ.
    // Обратите внимание: адрес — не наш. Наш сервер про эти байты
    // не знает ничего и в этот момент спокойно обслуживает других людей.
    const put = await fetch(permission.uploadUrl, {
      method: 'PUT',
      // Заголовок ОБЯЗАН совпасть с тем, что мы подписали на сервере.
      // Не совпал — хранилище ответит 403, и это самая частая
      // ошибка первого дня: подписали image/webp, отправили image/jpeg.
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!put.ok) {
      alert('Хранилище отказало. Скорее всего, истекла ссылка — попробуйте ещё раз.');
      return;
    }

    // ОБРАЩЕНИЕ 3. Говорим своему серверу: «готово, забирай».
    // Без этого шага сервер никогда не узнает, что файл появился.
    const confirmed = await fetch('/api/avatar/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: permission.uploadId }),
    }).then((r) => r.json());

    document.getElementById('user-avatar').src = confirmed.avatarUrl;
  });
</script>`;

  protected readonly confirmUpload = `// ПОДТВЕРЖДЕНИЕ. Самый недооценённый обработчик во всей схеме.

import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';

app.post('/api/avatar/confirm', requireAuth, async (req, res) => {
  const upload = await db.oneOrNone(
    'SELECT * FROM uploads WHERE id = $1',
    [req.body.uploadId],
  );

  // ПРАВА. Черновик мог быть создан другим человеком: идентификаторы
  // угадываются, и «подтвердить чужую загрузку» — рабочая атака.
  if (!upload || upload.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Загрузка не найдена' });
  }

  // ДОВЕРЯЙ, НО ПРОВЕРЯЙ. Клиент говорит «залил» — а мы спрашиваем
  // у хранилища напрямую. HeadObject возвращает только МЕТАДАННЫЕ
  // (размер, тип, дату, ETag) и НЕ качает сам файл — это дёшево.
  let head;
  try {
    head = await s3.send(new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: upload.s3_key,
    }));
  } catch {
    return res.status(400).json({ error: 'Объекта нет в хранилище' });
  }

  // Размер знает только хранилище — клиент мог соврать в первом запросе.
  if (head.ContentLength > 5 * 1024 * 1024) {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: upload.s3_key,
    }));
    return res.status(400).json({ error: 'Файл больше 5 МБ' });
  }

  // Только ТЕПЕРЬ путь попадает в основную таблицу.
  // В БАЗУ КЛАДЁМ КЛЮЧ, А НЕ ПОЛНЫЙ АДРЕС. Адрес состоит из ключа
  // и домена раздачи, а домен однажды поменяется — переедете на другой
  // CDN, и все сохранённые ссылки в базе превратятся в мусор.
  await db.tx(async (t) => {
    await t.query("UPDATE uploads SET status = 'ready' WHERE id = $1", [upload.id]);
    await t.query('UPDATE users SET avatar_key = $1 WHERE id = $2', [
      upload.s3_key,
      req.user.id,
    ]);
  });

  // Тяжёлую работу — в очередь. Здесь мы её только назначаем.
  await imageQueue.add('make-thumbnails', { uploadId: upload.id });

  res.json({ avatarUrl: process.env.CDN_BASE + '/' + upload.s3_key });
});


// А ТЕПЕРЬ ПРО СИРОТ. Между «выдали ссылку» и «пришло подтверждение»
// связи нет никакой: браузер мог закрыться, интернет — отвалиться,
// человек — передумать. Поэтому в хранилище неизбежно копятся объекты,
// про которые приложение не знает. Их называют ОСИРОТЕВШИМИ.

// Чинится это не хитростью, а обычной уборкой раз в сутки.
// Запускать её надо по расписанию — как задачу из подраздела про очереди.
async function cleanupOrphans() {
  // Черновики старше суток: ссылка давно истекла, ждать больше нечего.
  const stale = await db.many(
    "SELECT id, s3_key FROM uploads WHERE status = 'pending' AND created_at < now() - interval '1 day'",
  );

  for (const row of stale) {
    // Удаление несуществующего объекта в S3 — НЕ ошибка, а успех.
    // Это очень удобно: уборку можно запускать сколько угодно раз.
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: row.s3_key,
    }));
    await db.query("UPDATE uploads SET status = 'abandoned' WHERE id = $1", [row.id]);
  }
}

// ЕСТЬ И ВТОРОЙ, БОЛЕЕ ЛЕНИВЫЙ СПОСОБ: правило жизненного цикла
// на префикс временных загрузок — хранилище само удалит всё старше
// суток, и писать уборку руками не придётся вовсе. См. ниже.`;

  protected readonly presignGet = `// РАЗДАЧА ПРИВАТНЫХ ФАЙЛОВ. Например, PDF-чека к заказу:
// его владелец видеть должен, а сосед по интернету — нет.

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

app.get('/api/orders/:orderId/receipt', requireAuth, async (req, res) => {
  const order = await db.oneOrNone('SELECT * FROM orders WHERE id = $1', [
    req.params.orderId,
  ]);

  // ПРАВА ПРОВЕРЯЕМ НА КАЖДОЕ СКАЧИВАНИЕ, А НЕ ОДИН РАЗ НА СПИСОК.
  // Классическая дыра: список чеков отдаётся только своих, а вот
  // конкретный чек по номеру отдаётся кому угодно, кто номер подобрал.
  if (!order || order.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: order.receipt_key,

      // Просим хранилище отдать файл как ВЛОЖЕНИЕ и с человеческим
      // именем. Ключ в хранилище — 'orders/1042/receipt-9f2c.pdf',
      // а в папке «Загрузки» окажется 'Чек по заказу 1042.pdf'.
      ResponseContentDisposition:
        'attachment; filename="receipt-1042.pdf"',
      ResponseContentType: 'application/pdf',
    }),
    { expiresIn: 60 }, // минута: ровно чтобы браузер успел начать качать
  );

  // Отдаём не файл, а перенаправление на подписанную ссылку.
  // Байты поедут из хранилища напрямую в браузер, мимо нас.
  res.redirect(url);
});

// ЧЕСТНО ПРО ГРАНИЦЫ ЭТОГО ПРИЁМА — их надо понимать.

// 1. Пока ссылка жива, она работает у ЛЮБОГО, кто её получил.
//    Скопировал из адресной строки, отправил в чат — сработает.
//    Именно поэтому срок жизни делают коротким: минуты, а не сутки.

// 2. Ссылку нельзя отозвать досрочно. Единственный способ обесценить
//    все выданные ссылки разом — сменить сам ключ доступа в хранилище.

// 3. Не ставьте такую ссылку в src картинки на странице, которую
//    держат открытой часами: через минуту она протухнет,
//    и после обновления вкладки вместо картинки будет крестик.
//    Для приватных картинок берут срок побольше и обновляют ссылку.`;

  protected readonly bucketPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadOnlyForPublicPrefix",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shop-media/public/*"
    }
  ]
}`;

  protected readonly lifecycleRule = `{
  "Rules": [
    {
      "ID": "brosennye-chernoviki-udalyaem-cherez-sutki",
      "Status": "Enabled",
      "Filter": { "Prefix": "tmp/" },
      "Expiration": { "Days": 1 }
    },
    {
      "ID": "cheki-ostyvayut-so-vremenem",
      "Status": "Enabled",
      "Filter": { "Prefix": "orders/receipts/" },
      "Transitions": [
        { "Days": 30,  "StorageClass": "STANDARD_IA" },
        { "Days": 180, "StorageClass": "GLACIER" }
      ]
    },
    {
      "ID": "starye-versii-ne-hranim-vechno",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "NoncurrentVersionExpiration": { "NoncurrentDays": 30 },
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }
  ]
}`;

  protected readonly processUpload = `// ОБРАБОТКА ЗАГРУЖЕННОГО. Правило одно: тяжёлое — в фон.

// БОЛЬНОЙ ВАРИАНТ (одна строка, зато какая):
//   app.post('/api/avatar/confirm', async (req, res) => {
//     await sharp(buffer).resize(512).webp().toBuffer();  // <- вот здесь
//     ...
//   });
// Изменение размера картинки — это работа ПРОЦЕССОРА, а не ожидание сети.
// В Node.js такая работа блокирует единственный поток: пока идёт
// пережатие, сервер не отвечает НИКОМУ. Один пользователь с фотографией
// в 40 мегапикселей останавливает весь сайт на несколько секунд.

// ЗДОРОВЫЙ ВАРИАНТ. Запрос только НАЗНАЧАЕТ работу (см. пример выше:
// imageQueue.add), а делает её отдельный процесс-работник.

import { Worker } from 'bullmq';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const SIZES = [
  { name: 'sm', width: 64 },
  { name: 'md', width: 256 },
  { name: 'lg', width: 512 },
];

new Worker(
  'images',
  async (job) => {
    const upload = await db.one('SELECT * FROM uploads WHERE id = $1', [
      job.data.uploadId,
    ]);

    // Работник качает оригинал из хранилища себе — и это нормально:
    // он никого не обслуживает и никуда не торопится.
    const original = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: upload.s3_key,
    }));
    const bytes = Buffer.from(await original.Body.transformToByteArray());

    for (const size of SIZES) {
      const resized = await sharp(bytes)
        .resize({ width: size.width })
        .webp({ quality: 82 })
        .toBuffer();

      // Превью кладём РЯДОМ с оригиналом, по предсказуемому ключу.
      // Тогда адрес превью можно собрать в шаблоне, не заглядывая в базу.
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: upload.s3_key.replace(/\\.\\w+$/, '') + '_' + size.name + '.webp',
        Body: resized,
        ContentType: 'image/webp',

        // Файл неизменяемый (в имени уникальный идентификатор),
        // поэтому разрешаем кэшировать его на год. Об этом — ниже.
        CacheControl: 'public, max-age=31536000, immutable',
      }));
    }

    await db.query("UPDATE uploads SET status = 'processed' WHERE id = $1", [
      upload.id,
    ]);
  },
  { connection, concurrency: 2 }, // пережатие ест процессор: не жадничаем
);

// ПОБОЧНОЕ СЛЕДСТВИЕ, К КОТОРОМУ НАДО БЫТЬ ГОТОВЫМ.
// Между «файл залит» и «превью готово» проходит время — секунды.
// Значит, интерфейс обязан уметь показывать состояние «обрабатывается»
// и не падать, если превью ещё нет. Это не недостаток схемы,
// а честная цена за то, что сайт не встаёт на время пережатия.`;

  protected readonly validateFile = `// БЕЗОПАСНОСТЬ. Четыре проверки, каждая закрывает свою дыру.

import { fileTypeFromBuffer } from 'file-type';

// ПРОВЕРКА 1. НЕ ВЕРИМ НИ РАСШИРЕНИЮ, НИ ЗАГОЛОВКУ ТИПА.
// И имя файла, и Content-Type присылает КЛИЕНТ. Клиентом может быть
// не браузер, а curl, где оба поля пишутся руками:
//   curl -X PUT --data-binary @shell.php -H 'Content-Type: image/png' ...
// Единственный источник правды — САМИ БАЙТЫ. У настоящих форматов
// в начале файла стоит опознавательная последовательность
// (её называют «магические байты»): PNG начинается с 89 50 4E 47,
// JPEG — с FF D8 FF, PDF — с символов '%PDF'.
async function assertRealImage(bytes) {
  const detected = await fileTypeFromBuffer(bytes);
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];

  if (!detected || !allowed.includes(detected.mime)) {
    throw new Error('Это не картинка, чем бы оно ни притворялось');
  }
  return detected.mime; // дальше пользуемся ЭТИМ, а не тем, что прислали
}

// ПРОВЕРКА 2. ОГРАНИЧИВАЕМ РАЗМЕР ДО ЗАГРУЗКИ, А НЕ ПОСЛЕ.
// «Проверить размер после» — значит сначала принять 4 гигабайта,
// заплатить за трафик и место, и только потом сказать «нельзя».
// В S3 для этого есть подписанная ФОРМА: в неё можно вшить условие
// на размер, и хранилище само откажет, не приняв лишних байтов.
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const form = await createPresignedPost(s3, {
  Bucket: process.env.S3_BUCKET,
  Key: key,
  Expires: 300,
  Conditions: [
    ['content-length-range', 1, 5 * 1024 * 1024], // от 1 байта до 5 МБ
    ['starts-with', '$Content-Type', 'image/'],
  ],
});

// ПРОВЕРКА 3. ФАЙЛЫ ПОЛЬЗОВАТЕЛЕЙ — НЕ С ВАШЕГО ДОМЕНА.
// Разбор дыры целиком, потому что она неочевидна:
//   1. злоумышленник загружает файл evil.html — вроде бы безобидный;
//   2. вы отдаёте его по адресу https://shop.example.com/files/evil.html;
//   3. жертва открывает ссылку. Браузер видит домен shop.example.com
//      и выполняет скрипт внутри страницы В КОНТЕКСТЕ ВАШЕГО ДОМЕНА;
//   4. а значит, скрипту доступны cookie, localStorage и все запросы
//      к вашему API от имени вошедшего пользователя. Это захват аккаунта.
// Лечится тремя независимыми способами, и берут обычно все три:
//   - раздавать пользовательские файлы с ОТДЕЛЬНОГО домена;
//   - отдавать их с заголовком Content-Disposition: attachment,
//     чтобы браузер скачивал файл, а не показывал;
//   - добавить X-Content-Type-Options: nosniff, чтобы браузер
//     не «угадывал» тип содержимого вопреки заголовку.

// ПРОВЕРКА 4. ПРАВА — НА КАЖДОЕ СКАЧИВАНИЕ.
// Ключ объекта не является секретом и не заменяет проверку прав.
// «Никто не угадает такой длинный адрес» — это не защита, а надежда:
// адреса утекают через историю браузера, чаты, заголовок Referer
// и журналы посредников.`;
}
