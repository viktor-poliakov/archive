import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-functions-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class FunctionsPitfalls {
  protected readonly mutationExample = `function addTax(order) {
  order.total += 10; // меняем чужой объект — побочный эффект
}

const order = { total: 100 };
addTax(order);
console.log(order.total); // 110 — исходный объект изменён`;
}
