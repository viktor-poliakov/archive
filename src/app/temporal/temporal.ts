import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../code/code-block';

@Component({
  selector: 'app-temporal',
  imports: [CodeBlock, RouterLink],
  templateUrl: './temporal.html',
  styleUrls: ['../content/doc.scss'],
})
export class Temporal {
  protected readonly nowExample = `// текущий момент в разных представлениях
Temporal.Now.plainDateISO();     // 2024-01-26 — только дата
Temporal.Now.plainTimeISO();     // 14:30:15  — только время
Temporal.Now.zonedDateTimeISO(); // дата + время + таймзона
Temporal.Now.instant();          // точка на линии времени (наносекунды)`;

  protected readonly createReadExample = `const date = Temporal.PlainDate.from('2024-01-26');

date.year;      // 2024
date.month;     // 1  — январь это 1! месяцы с единицы, а не с нуля
date.day;       // 26
date.dayOfWeek; // 5  — день недели (понедельник = 1)`;

  protected readonly arithmeticExample = `const date = Temporal.PlainDate.from('2024-01-31');

// объекты неизменяемы: методы возвращают НОВЫЙ объект
const later = date.add({ months: 1, days: 3 });
later.toString(); // '2024-03-05'
date.toString();  // '2024-01-31' — оригинал не тронут

// заменить часть даты — with()
date.with({ day: 1 }).toString(); // '2024-01-01'

// разница между датами — это Duration
date.until('2024-02-10'); // P10D (10 дней)`;

  protected readonly zonedExample = `// момент с явной таймзоной
const zoned = Temporal.ZonedDateTime.from('2024-01-26T14:30[Europe/Moscow]');

zoned.hour;        // 14
zoned.timeZoneId;  // 'Europe/Moscow'

// пересчёт в другую таймзону — тот же момент, другое местное время
zoned.withTimeZone('Asia/Tokyo').hour; // 20`;

  protected readonly formatExample = `const date = Temporal.PlainDate.from('2024-01-26');

date.toString(); // '2024-01-26' — канонично
date.toLocaleString('ru-RU', { dateStyle: 'long' }); // '26 января 2024 г.'`;
}
