import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesBasics {
  protected readonly callbackHellExample = `// Три зависимые операции: результат каждой нужен следующей.
// На колбэках вложенность растёт вправо "лесенкой".
getUser(userId, function (user) {
  getOrders(user.id, function (orders) {
    getDetails(orders[0], function (details) {
      console.log(details);
    }, function (error) {
      console.error("Failed to load details", error);
    });
  }, function (error) {
    console.error("Failed to load orders", error);
  });
}, function (error) {
  console.error("Failed to load user", error);
});`;

  protected readonly createExample = `// Executor запускается СРАЗУ, синхронно, ещё при вызове new Promise.
const promise = new Promise(function (resolve, reject) {
  // Здесь начинаем асинхронную работу.
  setTimeout(function () {
    const ok = true;

    if (ok) {
      resolve("Coffee is ready"); // успех → fulfilled со значением
    } else {
      reject(new Error("Machine broke")); // ошибка → rejected с причиной
    }
  }, 1000);
});`;

  protected readonly consumeExample = `const promise = new Promise(function (resolve, reject) {
  setTimeout(() => resolve("Anna"), 1000);
});

promise
  .then(function (value) {
    console.log("User:", value); // "User: Anna" через секунду
  })
  .catch(function (error) {
    console.error("Something went wrong", error);
  });`;

  protected readonly fetchExample = `// Обычно промис не создают руками — его возвращает готовый API.
// fetch отдаёт промис ответа, у которого свой промис с телом.
fetch("/api/user")
  .then((response) => response.json())
  .then((user) => console.log(user))
  .catch((error) => console.error("Request failed", error));`;
}
