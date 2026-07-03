import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dates-format',
  imports: [CodeBlock, RouterLink],
  templateUrl: './format.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DatesFormat {
  protected readonly localeExample = `const d = new Date(2024, 0, 26, 14, 30);

d.toLocaleDateString('ru-RU'); // '26.01.2024'
d.toLocaleTimeString('ru-RU'); // '14:30:00'
d.toLocaleString('en-US');     // '1/26/2024, 2:30:00 PM'

// с опциями вывод гибко настраивается
d.toLocaleDateString('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}); // 'пятница, 26 января 2024 г.'`;

  protected readonly intlExample = `// форматтер создаётся один раз и переиспользуется — это быстрее
const fmt = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Moscow',
});

fmt.format(new Date(2024, 0, 26, 14, 30)); // '26 января 2024 г. в 14:30'`;

  protected readonly isoExample = `const d = new Date('2024-01-26T14:30:00Z');

d.toISOString();  // '2024-01-26T14:30:00.000Z' — канонично, UTC, для API и хранения
d.toString();     // длинная строка в местном времени
d.toDateString(); // 'Fri Jan 26 2024' — только дата`;

  protected readonly parseExample = `// ISO-формат разбирается надёжно во всех браузерах
new Date('2024-01-26');   // ок
Date.parse('2024-01-26'); // timestamp (число мс)

// прочие форматы — «как повезёт», лучше не полагаться
new Date('26.01.2024');   // где-то Invalid Date, где-то нет

// проверка на валидность
const d = new Date('nonsense');
Number.isNaN(d.getTime()); // true — это Invalid Date`;
}
