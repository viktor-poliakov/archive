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

// childNodes — ВСЕ дочерние узлы, включая текстовые
p.childNodes.length;      // 2: текст 'Hello ' и элемент <b>
p.childNodes[0].nodeType; // 3 — текстовый узел (Node.TEXT_NODE)
p.childNodes[1].nodeType; // 1 — узел-элемент (Node.ELEMENT_NODE)

// children — только дочерние ЭЛЕМЕНТЫ
p.children.length;        // 1 — среди детей лишь один элемент, <b>`;
}
