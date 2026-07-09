import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-errors-custom',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ErrorsCustom {
  protected readonly customExample = `// свой класс ошибки: наследуем Error, зовём super(message), задаём name
class ValidationError extends Error {
  constructor(message, field) {
    super(message);                // передаём message в Error
    this.name = 'ValidationError'; // иначе name останется 'Error'
    this.field = field;            // можно добавить свои поля
  }
}

const err = new ValidationError('Email обязателен', 'email');
err.message; // 'Email обязателен'
err.name;    // 'ValidationError'
err.field;   // 'email'`;

  protected readonly customUsageExample = `function saveUser(user) {
  if (!user.email) {
    throw new ValidationError('Email обязателен', 'email');
  }
  // ...сохранение
}

try {
  saveUser({});
} catch (err) {
  // разбираем: это наша ошибка или что-то неожиданное?
  if (err instanceof ValidationError) {
    console.log(\`Поле \${err.field}: \${err.message}\`); // 'Поле email: Email обязателен'
  } else {
    throw err; // чужие ошибки пробрасываем дальше
  }
}`;

  protected readonly hierarchyExample = `// базовый «зонтик» для всех ошибок приложения
class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name; // имя реального класса-потомка
  }
}

class NotFoundError extends AppError {}
class ValidationError extends AppError {}

const err = new NotFoundError('User not found');
err instanceof NotFoundError; // true
err instanceof AppError;      // true — можно ловить все «свои» одним instanceof
err instanceof Error;         // true
err.name;                     // 'NotFoundError'`;

  protected readonly formExample = `class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field; // какое поле не прошло проверку
  }
}

function validateSignup(form) {
  if (!form.email.includes('@')) {
    throw new ValidationError('Некорректный email', 'email');
  }
  if (form.password.length < 8) {
    throw new ValidationError('Пароль короче 8 символов', 'password');
  }
}

// в обработчике формы показываем ошибку прямо у нужного поля
try {
  validateSignup({ email: 'bad', password: '123' });
} catch (err) {
  if (err instanceof ValidationError) {
    showFieldError(err.field, err.message); // подсветить поле 'email'
  } else {
    throw err; // не наша ошибка — пробрасываем
  }
}`;

  protected readonly apiLayerExample = `// иерархия ошибок приложения
class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
}
class NotFoundError extends AppError {}  // 404
class ForbiddenError extends AppError {} // 403

async function loadUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (res.status === 404) throw new NotFoundError('Пользователь не найден');
  if (res.status === 403) throw new ForbiddenError('Нет доступа');
  return res.json();
}

// один обработчик решает, что показать — по ТИПУ ошибки
try {
  const user = await loadUser(42);
  render(user);
} catch (err) {
  if (err instanceof NotFoundError) showNotFoundPage();
  else if (err instanceof ForbiddenError) redirectToLogin();
  else throw err; // неизвестное — пусть всплывает выше
}`;
}
