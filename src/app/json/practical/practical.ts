import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-json-practical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './practical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class JsonPractical {
  protected readonly deepCloneExample = `const original = {
  name: 'Anna',
  address: { city: 'Berlin' },
};

// быстрый глубокий клон: упаковать в JSON и тут же распаковать
const clone = JSON.parse(JSON.stringify(original));

clone.address.city = 'Munich';
original.address.city; // 'Berlin' — оригинал не тронут, вложенность скопирована`;

  protected readonly cloneLimitsExample = `const data = {
  when: new Date('2026-01-01'),
  greet: () => 'hi',
  count: undefined,
};

const clone = JSON.parse(JSON.stringify(data));

clone; // { when: '2026-01-01T00:00:00.000Z' }
// дата превратилась в строку, функция и undefined пропали`;

  protected readonly structuredCloneExample = `const data = {
  when: new Date('2026-01-01'),
  tags: new Set(['a', 'b']),
};

// structuredClone — встроенный «настоящий» глубокий клон
const clone = structuredClone(data);

clone.when instanceof Date; // true — дата осталась датой
clone.tags instanceof Set;  // true — Set сохранился`;

  protected readonly localStorageExample = `const settings = { theme: 'dark', fontSize: 14 };

// сохраняем: объект → строку JSON
localStorage.setItem('settings', JSON.stringify(settings));

// читаем: строку JSON → объект
const saved = JSON.parse(localStorage.getItem('settings'));
saved.theme; // 'dark'`;

  protected readonly prettyLogExample = `const user = { name: 'Anna', roles: ['admin', 'editor'] };

// удобно рассматривать вложенные объекты в консоли
console.log(JSON.stringify(user, null, 2));`;
}
