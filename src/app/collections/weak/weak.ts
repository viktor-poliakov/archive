import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-collections-weak',
  imports: [CodeBlock, RouterLink],
  templateUrl: './weak.html',
  styleUrls: ['../../content/doc.scss'],
})
export class CollectionsWeak {
  protected readonly weakMapExample = `const lastVisit = new WeakMap(); // ключи — только объекты, ссылки слабые

let user = { name: 'Anna' };
lastVisit.set(user, 'metadata');

lastVisit.get(user); // 'metadata'
lastVisit.has(user); // true

user = null;
// объект user больше нигде не нужен → он и запись в WeakMap исчезнут сами`;

  protected readonly keysObjectsExample = `const wm = new WeakMap();

wm.set({ id: 1 }, 'ok'); // ключ-объект — можно
wm.set('id', 'no');      // TypeError: ключом WeakMap может быть только объект`;

  protected readonly weakSetExample = `const visited = new WeakSet();

function visit(user) {
  if (visited.has(user)) return; // этот объект уже отмечен
  visited.add(user);             // помечаем объект как «посещённый»
  // ...обрабатываем в первый раз
}

// когда user удалится сборщиком, пометка исчезнет автоматически`;
}
