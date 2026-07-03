import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dates-pitfalls',
  imports: [CodeBlock, RouterLink],
  templateUrl: './pitfalls.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DatesPitfalls {
  protected readonly diffExample = `const start = Date.now();
// ...какая-то работа...
const elapsed = Date.now() - start; // сколько миллисекунд прошло

// разница двух дат — тоже в миллисекундах
const ms = new Date(2024, 0, 10) - new Date(2024, 0, 1);
const days = ms / 86400000; // 9 дней (86 400 000 мс в сутках)`;

  protected readonly monthExample = `new Date(2024, 11, 31); // 31 декабря 2024 — декабрь это 11, а не 12
new Date(2024, 12, 1);  // 1 января 2025 — «13-го месяца» нет, перескочило

const d = new Date(2024, 0, 26);
d.getDate(); // 26 — день месяца
d.getDay();  // 5  — день недели (пятница). getDate и getDay легко перепутать!`;

  protected readonly mutabilityExample = `const d = new Date(2024, 0, 1);

const notACopy = d;   // это НЕ копия — та же самая ссылка на объект
notACopy.setDate(15);
d.getDate();          // 15 — оригинал тоже изменился!

// правильная копия — новый объект из старого:
const copy = new Date(d);`;

  protected readonly tzExample = `// строка 'YYYY-MM-DD' разбирается как ПОЛНОЧЬ по UTC
const d = new Date('2024-01-26');
d.toISOString(); // '2024-01-26T00:00:00.000Z'

// в поясе западнее UTC локальная дата может оказаться 25-м числом:
d.toLocaleDateString('en-US'); // например '1/25/2024' — сдвиг на день!

// нужна именно местная дата — создавайте из чисел:
new Date(2024, 0, 26); // местная полночь 26 января`;
}
