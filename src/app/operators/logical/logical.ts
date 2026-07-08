import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-operators-logical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './logical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class OperatorsLogical {
  protected readonly boolLogicExample = `// ! превращает значение в boolean и инвертирует
!true;   // false
!0;      // true  — 0 это falsy
!'text'; // false — непустая строка это truthy

// !! — двойное отрицание: быстрый способ привести к boolean
!!'text'; // true
!!0;      // false
!!'';     // false

// Напоминание: falsy-значений всего 8 (см. раздел «Типы»):
// false, 0, -0, 0n, '', null, undefined, NaN`;

  protected readonly shortCircuitExample = `// ВАЖНО: && и || возвращают ОДИН ИЗ ОПЕРАНДОВ, а не всегда true/false

// || возвращает первый truthy (или последний операнд, если все falsy)
'' || 'default';     // 'default'
'name' || 'default'; // 'name'
0 || null || 'last'; // 'last'

// && возвращает первый falsy (или последний, если все truthy)
'a' && 'b';          // 'b'
'a' && 0 && 'c';     // 0

// Короткое замыкание: правый операнд НЕ вычисляется, если исход уже ясен
isReady && start();  // start() вызовется, только если isReady истинно`;

  protected readonly nullishExample = `// ?? похож на ||, но срабатывает ТОЛЬКО на null и undefined
null ?? 'default';      // 'default'
undefined ?? 'default'; // 'default'

// разница с || видна на «falsy, но валидных» значениях: 0, '', false
0 || 'default'; // 'default' — а ведь ноль мог быть валидным значением!
0 ?? 'default'; // 0         — ?? пропускает только null/undefined
'' ?? 'x';      // ''
false ?? 'x';   // false

// часто идёт в паре с ?. (подробно — в разделе «Объекты»)
const user = { name: 'Ann' };
const city = user.address?.city ?? 'unknown'; // 'unknown'`;

  protected readonly ternaryExample = `// Тернарный оператор — единственный с ТРЕМЯ операндами: condition ? a : b
const age = 20;
const status = age >= 18 ? 'adult' : 'minor';
status; // 'adult'

// компактная замена if/else, когда нужно ВЫРАЖЕНИЕ (значение)
const n = 42;
const size = n < 10 ? 'S' : n < 100 ? 'M' : 'L'; // 'M'
// глубокую вложенность лучше не делать — читается плохо, замените на if`;

  protected readonly logicalAssignExample = `// Логическое присваивание: присвоить, только если выполнено условие

// ||= присвоит, если текущее значение falsy
let title = '';
title ||= 'Untitled'; // 'Untitled' (было пустым)

// ??= присвоит, только если null или undefined
let count = 0;
count ??= 10; // 0 — ноль остаётся! ?? не трогает 0

// &&= присвоит, только если текущее значение truthy
let name = 'Ann';
name &&= name.trim(); // 'Ann'`;
}
