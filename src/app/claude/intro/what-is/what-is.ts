import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-intro-what-is',
  imports: [CodeBlock, RouterLink],
  templateUrl: './what-is.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeIntroWhatIs {
  protected readonly session = `> Почему падает тест cart.spec.ts? Почини.

  читает     src/cart/cart.ts, src/cart/cart.spec.ts
  запускает  npm test -- cart          → 1 тест упал
  правит     src/cart/cart.ts          (порядок округления)
  запускает  npm test -- cart          → все тесты прошли

  Готово: сумма округлялась до применения скидки.
  Перенёс округление в конец расчёта.`;
}
