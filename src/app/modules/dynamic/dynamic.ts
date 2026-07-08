import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-modules-dynamic',
  imports: [CodeBlock, RouterLink],
  templateUrl: './dynamic.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ModulesDynamic {
  protected readonly dynamicBasicExample = `// import() — это функция, она возвращает ПРОМИС с объектом экспортов
const module = await import('./math.js');

module.square(5); // 25 — именованный экспорт
module.default;   // export default лежит в свойстве default

// чаще сразу разбирают деструктуризацией
const { square, PI } = await import('./math.js');`;

  protected readonly lazyExample = `// Тяжёлый модуль грузим ТОЛЬКО когда он реально нужен — например, по клику.
// Сборщик вынесет его в отдельный файл-чанк, и стартовый бандл останется лёгким.
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});`;

  protected readonly conditionalExample = `// Грузим модуль по условию — не тянем лишнее в основной бандл
if (!('IntersectionObserver' in window)) {
  await import('./intersection-polyfill.js'); // полифилл только старым браузерам
}

// путь можно собрать динамически — например, выбрать перевод по языку
const { messages } = await import(\`./i18n/\${lang}.js\`);`;

  protected readonly tlaExample = `// В модуле await можно писать на ВЕРХНЕМ уровне, без async-функции
const res = await fetch('/api/config');
export const config = await res.json();

// Удобно, но помните: пока этот await не завершится, модули, которые
// импортируют config, будут ждать его готовности.`;
}
