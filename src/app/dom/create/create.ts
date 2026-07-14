import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-create',
  imports: [CodeBlock, RouterLink],
  templateUrl: './create.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomCreate {
  protected readonly createExample = `// создать элемент, наполнить его и вставить в дерево
const li = document.createElement('li');
li.textContent = 'New item';
li.className = 'item';

const list = document.querySelector('ul');
list.append(li); // добавить последним ребёнком <ul>`;

  protected readonly insertPositionsExample = `const ref = document.querySelector('.ref');

// эти методы принимают и узлы, и строки (строка станет текстом)
ref.prepend('first'); // первым ребёнком ВНУТРИ ref
ref.append('last');   // последним ребёнком ВНУТРИ ref
ref.before('above');  // перед ref (снаружи, как сосед)
ref.after('below');   // после ref (снаружи, как сосед)`;

  protected readonly removeReplaceExample = `// было:
// <ul>
//   <li class="old">A</li>
//   <li class="target">B</li>
//   <li>C</li>
// </ul>

// удалить элемент из дерева (remove сам знает своего родителя)
document.querySelector('.old').remove();

// заменить один элемент другим
const fresh = document.createElement('li');
fresh.textContent = 'NEW';
document.querySelector('.target').replaceWith(fresh);

// стало:
// <ul>
//   <li>NEW</li>
//   <li>C</li>
// </ul>`;

  protected readonly cloneExample = `// <div class="card">
//   <h3>Title</h3>
//   <p>Text</p>
// </div>
const card = document.querySelector('.card');

const shallow = card.cloneNode();  // копия БЕЗ потомков
shallow.innerHTML;                 // '' — только сам <div class="card">, пустой
shallow.children.length;           // 0

const deep = card.cloneNode(true); // копия СО всем содержимым
deep.innerHTML;                    // '<h3>Title</h3><p>Text</p>'
deep.children.length;              // 2

document.body.append(deep);        // вставляем полную копию в страницу`;

  protected readonly cloneTemplateExample = `// скрытый в разметке шаблон карточки:
// <div class="card-template"><h3 class="title"></h3></div>
const tpl = document.querySelector('.card-template');

// под каждый элемент клонируем шаблон и заполняем
for (const name of ['A', 'B', 'C']) {
  const card = tpl.cloneNode(true); // глубокая копия шаблона
  card.querySelector('.title').textContent = name;
  document.body.append(card);
}
// на странице появятся три карточки с заголовками A, B, C`;

  protected readonly fragmentExample = `// было: <ul></ul> (пустой список)
const list = document.querySelector('ul');
const fruits = ['Apple', 'Banana', 'Cherry'];

const fragment = document.createDocumentFragment();
for (const fruit of fruits) {
  const li = document.createElement('li');
  li.textContent = fruit;
  fragment.append(li); // копим в невидимом контейнере, дерево пока не трогаем
}

list.append(fragment); // ОДНА вставка в дерево вместо трёх
fragment.childNodes.length; // 0 — содержимое «переехало» в список, а не скопировалось

// стало:
// <ul>
//   <li>Apple</li>
//   <li>Banana</li>
//   <li>Cherry</li>
// </ul>`;
}
