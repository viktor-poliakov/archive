import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-dates-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class DatesBasics {
  protected readonly createExample = `const now = new Date();          // текущие дата и время
const fromMs = new Date(0);      // 1 января 1970 UTC — точка отсчёта
const fromIso = new Date('2024-01-26'); // из строки ISO

// из компонентов — ВНИМАНИЕ: месяц считается с 0 (0 = январь)
const birthday = new Date(2024, 0, 26); // 26 января 2024
const wrong = new Date(2024, 1, 26);    // 26 ФЕВРАЛЯ — 1 это февраль!`;

  protected readonly readExample = `const d = new Date(2024, 0, 26, 14, 30); // 26 янв 2024, 14:30

d.getFullYear(); // 2024
d.getMonth();    // 0  — январь (0–11!)
d.getDate();     // 26 — день месяца (1–31)
d.getDay();      // 5  — день недели (0 = воскресенье, 5 = пятница)
d.getHours();    // 14
d.getMinutes();  // 30
d.getTime();     // timestamp: миллисекунды от 1970 года`;

  protected readonly setExample = `const d = new Date(2024, 1, 28); // 28 февраля 2024

// прибавим 2 дня — дата сама «перескочит» через границу месяца
d.setDate(d.getDate() + 2);

d.getDate();  // 1
d.getMonth(); // 2 — стало 1 марта (автоисправление)`;
}
