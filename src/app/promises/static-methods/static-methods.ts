import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-static-methods',
  imports: [CodeBlock, RouterLink],
  templateUrl: './static-methods.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesStaticMethods {
  protected readonly resolveRejectExample = `// уже выполненный промис со значением 42
const ready = Promise.resolve(42);
ready.then((value) => console.log(value)); // 42

// уже отклонённый промис с ошибкой
const failed = Promise.reject(new Error("Request failed"));
failed.catch((error) => console.log(error.message)); // "Request failed"

// нормализация: неважно, значение это или промис — получим промис
function normalize(input) {
  // если input уже промис, вернётся он же, а не обёртка над ним
  return Promise.resolve(input);
}`;

  protected readonly withResolversExample = `// withResolvers() возвращает сам промис и функции resolve/reject —
// теперь его можно завершить СНАРУЖИ исполнителя, откуда угодно
const { promise, resolve, reject } = Promise.withResolvers();

// например, промис «ждёт» внешнее событие
socket.addEventListener("message", (e) => resolve(e.data));
socket.addEventListener("error", () => reject(new Error("Socket error")));

// а потребитель просто ждёт результат
const data = await promise; // выполнится, когда придёт сообщение`;

  protected readonly deferredExample = `// Раньше для этого resolve/reject «вытаскивали» из исполнителя вручную —
// приём называли deferred:
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// withResolvers() делает ровно это, но встроенно и без лишнего кода:
// const { promise, resolve, reject } = Promise.withResolvers();`;

  protected readonly allExample = `// три независимых запроса стартуют сразу, параллельно
const user = fetch("/api/user").then((r) => r.json());
const posts = fetch("/api/posts").then((r) => r.json());
const tags = fetch("/api/tags").then((r) => r.json());

Promise.all([user, posts, tags])
  .then(([userData, postsData, tagsData]) => {
    // сюда попадём, только когда выполнятся ВСЕ три
    // порядок результатов совпадает с порядком в массиве
    console.log(userData, postsData, tagsData);
  })
  .catch((error) => {
    // сработает при первой же ошибке любого из промисов
    console.log("One request failed:", error.message);
  });`;

  protected readonly allFailFastExample = `const fast = new Promise((resolve) => setTimeout(() => resolve("ok"), 100));
const broken = Promise.reject(new Error("Boom"));
const slow = new Promise((resolve) => setTimeout(() => resolve("late"), 500));

Promise.all([fast, broken, slow])
  .then((results) => console.log(results)) // сюда не попадём
  .catch((error) => console.log(error.message)); // "Boom" — почти сразу

// slow продолжит выполняться в фоне, но его результат уже никто не ждёт`;

  protected readonly allSettledExample = `const results = await Promise.allSettled([
  Promise.resolve("Anna"),
  Promise.reject(new Error("Not found")),
  Promise.resolve("admin"),
]);

// массив всегда той же длины и всегда в исходном порядке
for (const item of results) {
  if (item.status === "fulfilled") {
    console.log("OK:", item.value);
  } else {
    console.log("FAIL:", item.reason.message);
  }
}
// OK: Anna
// FAIL: Not found
// OK: admin`;

  protected readonly raceExample = `// вспомогательный промис, который отклонится через ms миллисекунд
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
}

// кто первым завершится — тот и определит исход гонки
Promise.race([fetch("/api/slow"), timeout(3000)])
  .then((response) => console.log("Got response in time"))
  .catch((error) => console.log(error.message)); // "Timeout", если запрос дольше 3с`;

  protected readonly anyExample = `// зеркала одного и того же ресурса
const mirrors = [
  fetch("https://a.example/data"),
  fetch("https://b.example/data"),
  fetch("https://c.example/data"),
];

Promise.any(mirrors)
  .then((response) => console.log("First success:", response.url))
  .catch((error) => {
    // сюда попадём, только если упали ВСЕ зеркала
    console.log(error.name);              // "AggregateError"
    console.log(error.errors.length);     // 3 — по ошибке на каждое
  });`;
}
