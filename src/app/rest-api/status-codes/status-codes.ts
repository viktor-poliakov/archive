import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-status-codes',
  imports: [CodeBlock, RouterLink],
  templateUrl: './status-codes.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiStatusCodes {
  protected readonly responseLineExample = `HTTP/1.1 200 OK

HTTP/1.1 404 Not Found

HTTP/1.1 500 Internal Server Error`;

  protected readonly readStatusExample = `const response = await fetch('/api/users/42');

// Числовой код ответа: 200, 404, 500 и т. д.
console.log(response.status); // 200

// Текстовая расшифровка кода (может быть пустой)
console.log(response.statusText); // "OK"

// Удобный флаг: true только для диапазона 200–299
console.log(response.ok); // true`;

  protected readonly okBranchExample = `const response = await fetch('/api/users/42');

// fetch НЕ бросает исключение на 4xx и 5xx —
// промис успешно завершается даже для 404 или 500.
// Проверять исход нужно вручную через response.ok.
if (!response.ok) {
  // Сюда попадём при 400, 401, 404, 500 и любом другом коде вне 200–299
  throw new Error(\`HTTP \${response.status}\`);
}

const user = await response.json();
console.log(user);`;
}
