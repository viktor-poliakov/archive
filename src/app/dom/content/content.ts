import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-content',
  imports: [CodeBlock, RouterLink],
  templateUrl: './content.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomContent {
  protected readonly readExample = `// На странице: <div id="box">Hello <b>world</b></div>
const box = document.getElementById('box');

box.textContent; // 'Hello world' — только текст, без тегов
box.innerHTML;   // 'Hello <b>world</b>' — текст ВМЕСТЕ с разметкой`;

  protected readonly writeExample = `const title = document.querySelector('h1');

// textContent — записать ТЕКСТ (теги не разбираются, попадут как символы)
title.textContent = 'New title';

// innerHTML — записать РАЗМЕТКУ (теги станут настоящими элементами)
const box = document.getElementById('box');
box.innerHTML = '<span class="tag">new</span>';

// присваивание innerHTML полностью ЗАМЕНЯЕТ прежнее содержимое`;

  protected readonly innerTextExample = `// <div id="box">Price: 100 <span style="display: none">USD</span></div>
// span с «USD» спрятан через CSS — на экране его не видно
const box = document.getElementById('box');

box.textContent; // 'Price: 100 USD' — весь текст из разметки, включая скрытый
box.innerText;   // 'Price: 100'     — только видимый на экране (без скрытого span)`;

  protected readonly insertAdjacentExample = `// было на странице:
// <ul>
//   <li>mid</li>
// </ul>
const list = document.querySelector('ul');

list.insertAdjacentHTML('beforebegin', '<p>before</p>'); // перед <ul>, снаружи
list.insertAdjacentHTML('afterbegin', '<li>first</li>'); // внутрь, в начало
list.insertAdjacentHTML('beforeend', '<li>last</li>');   // внутрь, в конец
list.insertAdjacentHTML('afterend', '<p>after</p>');     // после <ul>, снаружи

// стало:
// <p>before</p>
// <ul>
//   <li>first</li>
//   <li>mid</li>
//   <li>last</li>
// </ul>
// <p>after</p>`;
}
