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

  protected readonly removeReplaceExample = `// удалить элемент из дерева
document.querySelector('.old').remove();

// заменить один элемент другим
const fresh = document.createElement('div');
fresh.textContent = 'fresh';
document.querySelector('.target').replaceWith(fresh);`;

  protected readonly cloneExample = `const card = document.querySelector('.card');

const shallow = card.cloneNode();  // копия БЕЗ потомков
const deep = card.cloneNode(true); // копия СО всем содержимым
document.body.append(deep);        // вставляем копию в страницу`;

  protected readonly fragmentExample = `const list = document.querySelector('ul');
const fragment = document.createDocumentFragment();

for (const name of ['a', 'b', 'c']) {
  const li = document.createElement('li');
  li.textContent = name;
  fragment.append(li); // копим во «временном» невидимом контейнере
}

list.append(fragment); // ОДНА вставка в дерево вместо трёх`;
}
