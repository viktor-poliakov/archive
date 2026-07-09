import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-regex-practical',
  imports: [CodeBlock, RouterLink],
  templateUrl: './practical.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RegexPractical {
  protected readonly validateExample = `// «только цифры» целиком
/^\\d+$/.test('12345'); // true

// простая проверка email (для UX-подсказки; ИДЕАЛЬНОГО regex для email нет)
const email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
email.test('ann@example.com'); // true
email.test('bad@@x');          // false

// пароль: минимум 8 символов, есть буква и цифра (через lookahead)
const strong = /^(?=.*[a-z])(?=.*\\d).{8,}$/;
strong.test('abc12345'); // true
strong.test('abcdefgh'); // false — нет цифры`;

  protected readonly extractExample = `const text = 'Люблю #js и #regex, а также #webdev!';

// вытащить все хештеги (matchAll + группа)
const tags = [...text.matchAll(/#(\\w+)/g)].map((m) => m[1]);
tags; // ['js', 'regex', 'webdev']

// все цены вида $5 или $12.50
'$5 и $12.50'.match(/\\$\\d+(\\.\\d+)?/g); // ['$5', '$12.50']`;

  protected readonly replaceFormatExample = `// схлопнуть лишние пробелы в один
'a    b   c'.replace(/\\s+/g, ' '); // 'a b c'

// замаскировать все цифры карты, кроме последних четырёх
'1234 5678 9012 3456'.replace(/\\d(?=(\\D*\\d){4})/g, '*');
// '**** **** **** 3456'`;

  protected readonly pitfallsExample = `// 1) global-регекс ХРАНИТ позицию (lastIndex) между вызовами test/exec!
const re = /\\d/g;
re.test('a1'); // true  (lastIndex стал 2)
re.test('a1'); // false (!) — ищет уже с позиции 2, а там конец строки
// не переиспользуйте /g-регекс в test; создавайте новую или сбрасывайте lastIndex

// 2) экранируйте пользовательский ввод перед вставкой в regex
const user = 'a.b';
new RegExp(user).test('axb'); // true (!) — точка сработала как «любой символ»`;
}
