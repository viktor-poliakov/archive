import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-modules-export',
  imports: [CodeBlock, RouterLink],
  templateUrl: './export.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ModulesExport {
  protected readonly namedExample = `// math.js — именованных экспортов может быть сколько угодно

// 1) прямо при объявлении
export const PI = 3.14159;
export function square(x) {
  return x * x;
}

// 2) списком в конце файла (удобно видеть всё, что отдаём)
const E = 2.718;
function cube(x) {
  return x ** 3;
}
export { E, cube as cubed }; // cube отдаём под именем cubed`;

  protected readonly defaultExample = `// user.js — ОДИН export default на модуль (главная сущность файла)
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// default можно повесить на что угодно:
// export default function () { ... }
// export default 42;`;

  protected readonly mixedExample = `// api.js — default и именованные экспорты можно совмещать
export default function request(url) {
  // ...основная функция модуля
}

export const BASE_URL = 'https://api.example.com';
export function get(path) {
  return request(BASE_URL + path);
}`;

  protected readonly reexportExample = `// index.js — «бочка» (barrel): собирает экспорты папки в одну точку входа
export { User } from './user.js';
export { square, cubed } from './math.js';
export * from './helpers.js';                  // все именованные из helpers
export { default as request } from './api.js'; // пробросить чужой default

// теперь снаружи: import { User, square, request } from './index.js';`;
}
