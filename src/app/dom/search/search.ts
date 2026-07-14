import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-search',
  imports: [CodeBlock, RouterLink],
  templateUrl: './search.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomSearch {
  protected readonly querySelectorExample = `// querySelector — ПЕРВЫЙ элемент по CSS-селектору (или null)
document.querySelector('.btn');   // первый элемент с классом btn
document.querySelector('ul li');  // первый <li> внутри <ul>
document.querySelector('#login'); // элемент с id="login"
document.querySelector('.nope');  // null — ничего не нашлось

// querySelectorAll — ВСЕ совпавшие элементы (статический список)
const items = document.querySelectorAll('li');
items.length; // сколько элементов нашлось
items.forEach((li) => console.log(li.textContent));`;

  protected readonly getByIdExample = `// по id — самый короткий способ (id на странице уникален)
const form = document.getElementById('login'); // элемент с id="login"

// есть и старые методы поиска — getElementsByClassName / ...ByTagName;
// они возвращают «живую» коллекцию (о её особенностях — в подводных камнях)`;

  protected readonly scopedExample = `// искать можно не по всему документу, а ВНУТРИ элемента
const menu = document.querySelector('#menu');
const links = menu.querySelectorAll('a'); // только ссылки внутри #menu`;

  protected readonly navMarkupExample = `<nav class="list">
  <ul>
    <li class="item">
      <a href="/home">Home</a>
      <span class="badge">new</span>
    </li>
    <li class="item">
      <a href="/blog">Blog</a>
    </li>
  </ul>
</nav>`;

  protected readonly navExample = `// берём ПЕРВЫЙ <li class="item"> из разметки выше
const item = document.querySelector('.item');

item.parentElement;    // <ul> — прямой родитель
item.children;         // коллекция из двух элементов: [<a>, <span>]
item.children.length;  // 2
item.firstElementChild;             // <a href="/home"> — первый ребёнок-элемент
item.firstElementChild.textContent; // 'Home'
item.nextElementSibling; // второй <li> (со ссылкой Blog) — следующий сосед
item.closest('.list');   // <nav class="list"> — поднялись вверх, мимо <ul>`;
}
