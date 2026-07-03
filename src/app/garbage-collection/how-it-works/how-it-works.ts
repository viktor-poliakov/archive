import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-garbage-collection-how-it-works',
  imports: [CodeBlock, RouterLink],
  templateUrl: './how-it-works.html',
  styleUrls: ['../../content/doc.scss'],
})
export class GarbageCollectionHowItWorks {
  protected readonly reachExample = `let user = { name: 'Anna' }; // объект достижим через переменную user

user = null; // единственная ссылка убрана — объект больше недостижим
             // → рано или поздно сборщик мусора его удалит`;

  protected readonly sharedExample = `let user = { name: 'Anna' };
let admin = user; // теперь на ОДИН объект две ссылки

user = null;  // убрали одну ссылку,
              // но объект жив: на него ещё смотрит admin
admin.name;   // 'Anna'`;

  protected readonly islandExample = `function makeFamily() {
  const mother = {};
  const father = {};
  mother.husband = father; // объекты ссылаются друг на друга
  father.wife = mother;
  return { mother, father };
}

let family = makeFamily();

family = null;
// mother и father всё ещё ссылаются друг на друга,
// но снаружи к ним не добраться → весь «остров» удаляется целиком`;
}
