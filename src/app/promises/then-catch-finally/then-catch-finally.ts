import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-then-catch-finally',
  imports: [CodeBlock, RouterLink],
  templateUrl: './then-catch-finally.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesThenCatchFinally {
  protected readonly thenExample = `const user = Promise.resolve({ name: 'Anna', role: 'admin' });

// колбэк в then получает то, чем промис выполнился
user.then(function (value) {
  console.log(value.name); // "Anna"
  console.log(value.role); // "admin"
});`;

  protected readonly thenSecondArgExample = `function loadUser() {
  // промис, который отклоняется — имитация неудачного запроса
  return Promise.reject(new Error('Request failed'));
}

// второй аргумент then срабатывает при ошибке
loadUser().then(
  function (value) {
    console.log('got user', value); // не вызовется
  },
  function (error) {
    console.log(error.message); // "Request failed"
  },
);`;

  protected readonly catchExample = `loadUser()
  .then(function (value) {
    // если тут выбросить ошибку — её поймает catch ниже
    throw new Error('Broken data');
  })
  .catch(function (error) {
    // ловит и отклонение промиса, и throw из then выше
    console.log(error.message); // "Broken data"
  });

// .catch(fn) — это просто короткая запись для .then(null, fn)`;

  protected readonly finallyExample = `showSpinner();

loadUser()
  .then(function (value) {
    render(value);
  })
  .catch(function (error) {
    showError(error);
  })
  .finally(function () {
    // выполнится в любом случае: и при успехе, и при ошибке
    hideSpinner();
  });`;

  protected readonly finallyPassThroughExample = `Promise.resolve(42)
  .finally(function () {
    console.log('done'); // "done"
    return 'ignored';    // это значение НЕ повлияет на цепочку
  })
  .then(function (value) {
    console.log(value); // 42 — исходное значение прошло дальше
  });`;

  protected readonly chainExample = `loadUser()          // Promise<user>
  .then(function (user) {
    return user.name; // вернули строку
  })                  // then вернул НОВЫЙ Promise<string>
  .then(function (name) {
    console.log(name); // "Anna" — работаем с результатом прошлого шага
  });`;
}
