import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dom-attributes',
  imports: [CodeBlock, RouterLink],
  templateUrl: './attributes.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DomAttributes {
  protected readonly attrExample = `// <a id="link" href="/home" data-role="nav">Home</a>
const link = document.getElementById('link');

link.getAttribute('href');   // '/home' — прочитать атрибут
link.hasAttribute('target'); // false — есть ли атрибут
link.setAttribute('target', '_blank'); // добавить или изменить
link.removeAttribute('data-role');      // удалить`;

  protected readonly attrVsPropExample = `// <input id="name" value="Anna">
const input = document.getElementById('name');

input.getAttribute('value'); // 'Anna' — атрибут: НАЧАЛЬНОЕ значение из HTML
input.value = 'Bob';         // свойство: ТЕКУЩЕЕ значение
input.value;                 // 'Bob'
input.getAttribute('value'); // 'Anna' — атрибут так и не изменился!`;

  protected readonly classListExample = `// <div class="box hidden">
const box = document.querySelector('.box');

box.classList.add('active');      // добавить класс
box.classList.remove('hidden');   // убрать класс
box.classList.toggle('open');     // переключить: нет → есть, есть → нет
box.classList.contains('active'); // true — есть ли класс
box.className;                    // 'box active open' — все классы строкой`;

  protected readonly datasetExample = `// <div id="user" data-user-id="42" data-role="admin"></div>
const el = document.getElementById('user');

// свои data-* атрибуты доступны через dataset (имя — в camelCase)
el.dataset.userId; // '42'  (data-user-id → userId)
el.dataset.role;   // 'admin'
el.dataset.role = 'guest'; // запишет обратно в атрибут data-role`;

  protected readonly styleExample = `const box = document.querySelector('.box');

// инлайновые стили — через style (CSS-свойства в camelCase)
box.style.color = 'red';
box.style.backgroundColor = 'black'; // background-color → backgroundColor

// прочитать ИТОГОВЫЙ стиль (в т.ч. из CSS-файла) — getComputedStyle
const styles = getComputedStyle(box);
styles.color; // 'rgb(255, 0, 0)'`;
}
