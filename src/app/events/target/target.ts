import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-events-target',
  imports: [CodeBlock, RouterLink],
  templateUrl: './target.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventsTarget {
  protected readonly targetExample = `// <ul id="menu">
//   <li>Home <span class="badge">new</span></li>
//   <li>About</li>
// </ul>

menu.addEventListener('click', (event) => {
  console.log(event.currentTarget); // всегда <ul id="menu"> — тут висит обработчик
  console.log(event.target);        // то, по чему кликнули: <li> или <span class="badge">
});`;

  protected readonly bubbleExample = `// обработчик на КАЖДОМ уровне
span.addEventListener('click', (e) => console.log(e.currentTarget, e.target));
li.addEventListener('click', (e) => console.log(e.currentTarget, e.target));
ul.addEventListener('click', (e) => console.log(e.currentTarget, e.target));

// клик по span выведет (currentTarget меняется, target — нет):
// <span>  <span>
// <li>    <span>
// <ul>    <span>`;

  protected readonly thisExample = `// в обычной функции this === event.currentTarget
menu.addEventListener('click', function (event) {
  console.log(this === event.currentTarget); // true
  console.log(this); // <ul id="menu">
});

// у стрелочной функции своего this нет — он берётся из внешнего кода
menu.addEventListener('click', (event) => {
  console.log(this === event.currentTarget); // false
  // внутри стрелочной функции надёжно только event.currentTarget
});`;
}
