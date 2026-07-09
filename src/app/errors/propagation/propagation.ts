import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-errors-propagation',
  imports: [CodeBlock, RouterLink],
  templateUrl: './propagation.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ErrorsPropagation {
  protected readonly propagationExample = `function c() {
  throw new Error('Сломалось в c()');
}
function b() {
  c();                    // b НЕ ловит — ошибка летит дальше вверх
  console.log('после c'); // не выполнится
}
function a() {
  try {
    b();                  // ловим здесь, хотя бросили в c()
  } catch (err) {
    console.log('Поймали в a():', err.message);
  }
}

a(); // 'Поймали в a(): Сломалось в c()'`;

  protected readonly unhandledExample = `function boom() {
  throw new Error('Никто не ловит');
}

boom(); // catch нигде нет — ошибка всплыла до самого верха

// В браузере: попадёт в консоль и в window.addEventListener('error', ...)
// В Node.js: процесс аварийно завершится (uncaughtException)`;

  protected readonly rethrowExample = `function loadConfig() {
  try {
    return JSON.parse(readFile());
  } catch (err) {
    // здесь мы не умеем ИСПРАВИТЬ ошибку — только добавим контекст
    console.error('Не удалось прочитать конфиг');
    throw err; // и пробросим дальше — пусть ловит тот, кто разберётся
  }
}`;
}
