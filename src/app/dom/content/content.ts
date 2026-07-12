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

  protected readonly insertAdjacentExample = `const list = document.querySelector('ul');

// добавить разметку, НЕ затирая уже существующую
list.insertAdjacentHTML('beforeend', '<li>last</li>');   // внутрь, в конец
list.insertAdjacentHTML('afterbegin', '<li>first</li>'); // внутрь, в начало`;
}
