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

  protected readonly navExample = `const item = document.querySelector('.item');

item.parentElement;      // родитель-элемент
item.children;           // дети-элементы (HTMLCollection)
item.firstElementChild;  // первый ребёнок-элемент
item.nextElementSibling; // следующий сосед-элемент
item.closest('.list');   // ближайший подходящий предок (или сам элемент)`;
}
