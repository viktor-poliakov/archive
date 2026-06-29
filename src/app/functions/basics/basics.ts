import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsBasics {
  protected readonly basicExample = `function add(a, b) {
  return a + b;
}

const sum = add(2, 3); // 5`;
}
