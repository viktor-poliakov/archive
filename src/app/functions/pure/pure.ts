import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-pure',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pure.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsPure {
  protected readonly pureExample = `// Чистая: результат зависит только от аргументов, без побочных эффектов
function add(a, b) {
  return a + b;
}

add(2, 3); // всегда 5 при тех же аргументах`;

  protected readonly impureStateExample = `let total = 0;

// Не чистая: меняет внешнюю переменную (побочный эффект)
function addToTotal(n) {
  total += n;
}

addToTotal(5); // total стал 5
addToTotal(5); // total стал 10 — тот же вызов, другой результат снаружи`;

  protected readonly impureExternalExample = `// Не чистая: зависит от внешнего мира — результат непредсказуем
function priceWithBonus(price) {
  return price + Math.random();
}

// Не чистая: пишет наружу (побочный эффект)
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}`;

  protected readonly pureRefactorExample = `// Было: функция и считает, и сохраняет (побочный эффект внутри)
function applyDiscount(order) {
  order.total = order.total * 0.9;
  localStorage.setItem('order', JSON.stringify(order));
}

// Стало: чистый расчёт отдельно, побочный эффект — снаружи
function withDiscount(order) {
  return { ...order, total: order.total * 0.9 };
}

const updated = withDiscount(order);
localStorage.setItem('order', JSON.stringify(updated));`;
}
