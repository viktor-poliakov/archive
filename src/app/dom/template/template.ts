import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-template',
  imports: [CodeBlock, RouterLink],
  templateUrl: './template.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomTemplate {
  protected readonly markupExample = `<!-- шаблон одной строки списка + пустой список -->
<template id="user-row">
  <li class="user">
    <span class="name"></span> — <span class="role"></span>
  </li>
</template>

<ul class="users"></ul>`;

  protected readonly contentExample = `const tpl = document.querySelector('#user-row');

// содержимое шаблона лежит в .content — это DocumentFragment
tpl.content;                        // #document-fragment
tpl.content.querySelector('.user'); // <li class="user"> — разметка внутри шаблона

// сам <template> НИЧЕГО не показывает на странице:
tpl.childNodes.length;            // 0 — прямых детей нет, вся разметка в .content
document.querySelector('.user');  // null — содержимого шаблона нет в «живой» странице`;

  protected readonly renderExample = `const tpl = document.querySelector('#user-row');
const list = document.querySelector('.users');
const users = [
  { name: 'Anna', role: 'admin' },
  { name: 'Bob', role: 'editor' },
];

for (const user of users) {
  const row = tpl.content.cloneNode(true);            // 1. клонируем содержимое шаблона
  row.querySelector('.name').textContent = user.name; // 2. заполняем данными
  row.querySelector('.role').textContent = user.role;
  list.append(row);                                   // 3. вставляем готовую строку
}

// на странице появятся две строки:
// Anna — admin
// Bob — editor`;
}
