import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-chaining',
  imports: [CodeBlock, RouterLink],
  templateUrl: './chaining.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesChaining {
  protected readonly callbackHellExample = `// «Ад колбэков»: каждый следующий шаг вложен в предыдущий
loadUser(userId, function (user) {
  loadOrders(user, function (orders) {
    loadDetails(orders[0], function (details) {
      // лесенка уезжает вправо, обработка ошибок дублируется
      console.log(details);
    });
  });
});`;

  protected readonly flatChainExample = `// Та же логика, но плоской цепочкой .then
loadUser(userId)
  .then((user) => loadOrders(user))
  .then((orders) => loadDetails(orders[0]))
  .then((details) => {
    console.log(details);
  })
  .catch((error) => {
    // один .catch на все шаги сразу
    console.log(error.message);
  });`;

  protected readonly returnValueExample = `fetch('/api/user/1')
  .then((response) => response.json()) // вернули промис с разобранным JSON
  .then((user) => user.name)           // вернули строку — обычное значение
  .then((name) => name.toUpperCase())  // получили ту самую строку
  .then((upper) => {
    console.log(upper); // "ANNA"
  });`;

  protected readonly returnPromiseExample = `// Второй запрос зависит от результата первого
fetch('/api/user/1')
  .then((response) => response.json())
  .then((user) => {
    // возвращаем ПРОМИС — цепочка дождётся его завершения
    return fetch('/api/orders?user=' + user.id);
  })
  .then((response) => response.json()) // сюда придёт результат второго запроса
  .then((orders) => {
    console.log(orders.length);
  });`;

  protected readonly errorFallExample = `Promise.resolve('start')
  .then((value) => {
    throw new Error('Step failed'); // бросили ошибку в середине
  })
  .then((value) => {
    // этот обработчик ПРОПУСКАЕТСЯ — значения нет, есть ошибка
    console.log('never runs');
  })
  .catch((error) => {
    // управление прыгает сюда, к ближайшему .catch
    console.log(error.message); // "Step failed"
  });`;

  protected readonly forgotReturnExample = `// ПЛОХО: забыли return — следующий then получит undefined
fetch('/api/user/1')
  .then((response) => {
    response.json(); // промис создан, но не возвращён — цепочка его не ждёт
  })
  .then((user) => {
    console.log(user); // undefined
  });

// ХОРОШО: возвращаем промис
fetch('/api/user/1')
  .then((response) => {
    return response.json(); // цепочка дождётся разбора JSON
  })
  .then((user) => {
    console.log(user.name);
  });`;
}
