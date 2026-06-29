import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-default-binding',
  imports: [CodeBlock, RouterLink],
  templateUrl: './default-binding.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextDefaultBinding {
  protected readonly strictVsSloppyExample = `function show() {
  return this;
}

// в строгом режиме ('use strict', модули, классы):
show(); // undefined

// в нестрогом (старый <script> без 'use strict'):
show(); // globalThis (в браузере — window)`;

  protected readonly throwExample = `'use strict';

function getName() {
  // нет объекта перед точкой → this === undefined
  return this.name; // TypeError: Cannot read properties of undefined
}

getName(); // упадёт с ошибкой`;

  protected readonly globalThisExample = `// globalThis — единое имя глобального объекта в любой среде:
// window в браузере, global в Node, self в воркерах

console.log(typeof globalThis); // 'object'

// раньше приходилось писать по-разному под каждую среду,
// сейчас достаточно globalThis`;
}
