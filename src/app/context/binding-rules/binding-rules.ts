import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-binding-rules',
  imports: [CodeBlock, RouterLink],
  templateUrl: './binding-rules.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextBindingRules {
  protected readonly fourWaysExample = `function whoAmI() {
  return this;
}

const user = { name: 'Ann', whoAmI };

// 1. по умолчанию — вызов без точки
whoAmI();          // this === undefined (strict) / globalThis (sloppy)

// 2. неявная — вызов через объект перед точкой
user.whoAmI();     // this === user

// 3. явная — мы сами назначаем this
whoAmI.call(user); // this === user

// 4. через new — создаётся новый объект
new whoAmI();      // this === новый пустой объект`;

  protected readonly precedenceExample = `function show() {
  return this.label;
}

const a = { label: 'A', show };
const b = { label: 'B' };

// явная привязка сильнее неявной:
a.show.call(b); // 'B' — call победил «точку» (a)

// new сильнее явной привязки:
const bound = show.bind(a); // намертво привязали к a
const obj = new bound();    // this — новый объект, а не a
// (значение a.label здесь уже не при чём)`;

  protected readonly bindNewArgsExample = `function Point(x, y) {
  this.x = x;
  this.y = y;
}

// предзаполняем первый аргумент через bind
const BoundPoint = Point.bind(null, 10);

const p = new BoundPoint(20);
// new перебил привязанный this (null) — создан новый объект,
// но предзаполненный аргумент x = 10 остался в силе
console.log(p.x, p.y); // 10 20`;
}
