import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomBasics {
  protected readonly introExample = `// document — точка входа в дерево страницы
document.title;           // заголовок вкладки
document.body;            // элемент <body>
document.documentElement; // элемент <html>

// у элемента есть тег, обычно родитель и, возможно, потомки
const h1 = document.querySelector('h1');
h1.tagName;       // 'H1' — имя тега всегда в верхнем регистре
h1.parentElement; // элемент-родитель`;

  protected readonly markupExample = `<html>
  <head></head>
  <body>
    <h1>Title</h1>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>`;

  protected readonly nodeTypesExample = `// Разметка на странице: <p>Hello <b>world</b></p>
const p = document.querySelector('p');

p.childNodes.length; // 2: текстовый узел 'Hello ' и элемент <b>

// nodeType — это ЧИСЛО-код вида узла: 1 — элемент, 3 — текст, 8 — комментарий
const text = p.childNodes[0]; // первый ребёнок — текст 'Hello '
text.nodeType;    // 3  (текстовый узел)
text.textContent; // 'Hello '

const bold = p.childNodes[1]; // второй ребёнок — элемент, то есть тег <b>
bold.nodeType;    // 1  (узел-элемент)
bold.tagName;     // 'B'
bold.textContent; // 'world'

// Node.ELEMENT_NODE и Node.TEXT_NODE — просто ИМЕНА для этих чисел:
Node.ELEMENT_NODE; // 1
Node.TEXT_NODE;    // 3

// children — только ЭЛЕМЕНТЫ, поэтому там лишь <b>:
p.children.length; // 1
p.children[0];     // <b> — тот же элемент, что и bold`;
}
