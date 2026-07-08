import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-modules-import',
  imports: [CodeBlock, RouterLink],
  templateUrl: './import.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ModulesImport {
  protected readonly namedImportExample = `// app.js — забираем именованные экспорты из math.js
import { PI, square } from './math.js';

square(4); // 16
PI;        // 3.14159

// имена должны совпадать с экспортированными; можно переименовать через as
import { cubed as cube } from './math.js';
cube(2); // 8`;

  protected readonly defaultImportExample = `// default импортируют БЕЗ фигурных скобок, а имя выбираете сами
import User from './user.js';
// в файле это был "export default class User", но назвать можно как угодно:
import Person from './user.js'; // тот же default, другое локальное имя

const u = new User('Ann');`;

  protected readonly combinedExample = `// default и именованные — в одном import (default идёт первым)
import request, { get, BASE_URL } from './api.js';

request(BASE_URL);
get('/users');`;

  protected readonly namespaceExample = `// импорт всего модуля как объекта-пространства имён
import * as math from './math.js';

math.PI;        // 3.14159
math.square(3); // 9

// удобно, когда экспортов много и хочется явно видеть их источник (math.*)`;

  protected readonly sideEffectExample = `// импорт без привязки — только чтобы ВЫПОЛНИТЬ код модуля,
// ничего из него не забирая
import './setup.js';    // запустить инициализацию
import './styles.css';  // подключить стили (через сборщик)`;
}
