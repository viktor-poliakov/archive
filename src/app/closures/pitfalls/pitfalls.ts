import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-closures-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ClosuresPitfalls {
  protected readonly loopBugExample = `// БАГ: var — это одна переменная на весь цикл
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}

// Ожидаем 1, 2, 3 — а получаем 4, 4, 4`;

  protected readonly loopFixExample = `// Решение 1: let создаёт свою привязку i на каждой итерации
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
// 1, 2, 3

// Решение 2 (приём до let): IIFE копирует значение в параметр
for (var j = 1; j <= 3; j++) {
  (function (copy) {
    setTimeout(function () {
      console.log(copy);
    }, 100);
  })(j);
}
// 1, 2, 3`;

  protected readonly sharedStateExample = `function createUser() {
  let role = 'guest';

  // обе функции замкнуты над одной переменной role
  return {
    promote() {
      role = 'admin';
    },
    describe() {
      return 'role: ' + role;
    },
  };
}

const user = createUser();
user.describe(); // 'role: guest'
user.promote();
user.describe(); // 'role: admin' — describe видит чужое изменение`;

  protected readonly memoryExample = `function setup(node) {
  const data = loadHugeData(); // что-то крупное

  function onClick() {
    console.log(data.length);
  }

  node.addEventListener('click', onClick);

  // Пока слушатель висит на node, замыкание onClick живо,
  // а значит data не освобождается. Снимаем, когда не нужно:
  // node.removeEventListener('click', onClick);
}`;
}
