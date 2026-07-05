import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-promises-error-handling',
  imports: [CodeBlock, RouterLink],
  templateUrl: './error-handling.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PromisesErrorHandling {
  protected readonly twoWaysExample = `// Способ 1: явный reject внутри executor
const p1 = new Promise((resolve, reject) => {
  reject(new Error("Request failed")); // передаём объект ошибки
});

// Способ 2: throw внутри executor
const p2 = new Promise((resolve, reject) => {
  throw new Error("Something broke"); // движок сам вызовет reject
});

// Способ 3: throw внутри .then — тоже приводит к rejected
Promise.resolve(1).then((value) => {
  throw new Error("Bad value"); // следующий промис в цепочке — rejected
});

// Все три промиса окажутся в состоянии rejected`;

  protected readonly whyErrorExample = `// Плохо: отклоняем строкой
Promise.reject("failed").catch((err) => {
  console.log(err);       // "failed"
  console.log(err.stack); // undefined — нет стека вызовов
});

// Хорошо: отклоняем объектом Error
Promise.reject(new Error("failed")).catch((err) => {
  console.log(err.message); // "failed"
  console.log(err.stack);   // есть стек — видно, где возникла ошибка
});`;

  protected readonly catchWholeChainExample = `fetchUser()
  .then((user) => loadOrders(user.id)) // может отклониться
  .then((orders) => render(orders))    // может бросить
  .catch((err) => {
    // сюда попадёт ошибка ЛЮБОГО звена выше:
    // из fetchUser, из loadOrders или из render
    console.log("Chain failed:", err.message);
  });`;

  protected readonly catchAndContinueExample = `fetchSettings()
  .catch((err) => {
    // сеть недоступна — подставляем значения по умолчанию
    console.log("Using defaults:", err.message);
    return { theme: "light", lang: "en" }; // возвращаем значение
  })
  .then((settings) => {
    // цепочка снова fulfilled: сюда придут либо настройки
    // с сервера, либо объект по умолчанию из catch
    applySettings(settings);
  });`;

  protected readonly thenSecondArgExample = `// then(f1, f2): f2 НЕ ловит ошибку, брошенную внутри f1
Promise.resolve(1)
  .then(
    (value) => {
      throw new Error("Boom"); // ошибка в первом колбэке
    },
    (err) => {
      // сюда НЕ попадём: этот обработчик ловит только
      // отклонение ПРЕДЫДУЩЕГО промиса, а не ошибку f1
      console.log("Never runs");
    },
  );

// .catch после цепочки поймает всё
Promise.resolve(1)
  .then((value) => {
    throw new Error("Boom");
  })
  .catch((err) => {
    console.log("Caught:", err.message); // "Caught: Boom"
  });`;

  protected readonly unhandledExample = `// Никто не поймал отклонение — сработает глобальное событие
Promise.reject(new Error("Nobody catches me"));

// В браузере можно перехватить это глобально:
window.addEventListener("unhandledrejection", (event) => {
  console.log("Unhandled:", event.reason.message);
  event.preventDefault(); // подавить вывод предупреждения в консоль
});

// Антипаттерн: "проглатывание" ошибки пустым catch
doWork()
  .catch(() => {}); // ошибка молча исчезла — так делать нельзя`;
}
