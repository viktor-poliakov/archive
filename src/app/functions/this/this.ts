import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-this',
  imports: [CodeBlock, RouterLink],
  templateUrl: './this.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsThis {
  protected readonly thisLostExample = `const user = {
  name: 'Anna',
  greet() {
    return 'Hello, ' + this.name;
  },
};

user.greet(); // 'Hello, Anna' — this === user

const fn = user.greet;
fn(); // 'Hello, undefined' — this потерян`;

  protected readonly thisArrowExample = `const timer = {
  seconds: 0,
  start() {
    // стрелочная берёт this из start(), а не создаёт свой
    setInterval(() => {
      this.seconds++;
    }, 1000);
  },
};`;
}
