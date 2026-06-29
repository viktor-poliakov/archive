import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-objects-destructuring',
  imports: [CodeBlock, RouterLink],
  templateUrl: './destructuring.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ObjectsDestructuring {
  protected readonly basicExample = `const user = { name: 'Ann', age: 30 };

// вместо двух строк user.name / user.age
const { name, age } = user;

console.log(name); // 'Ann'
console.log(age);  // 30`;

  protected readonly renameExample = `const user = { name: 'Ann' };

// достаём name, но кладём в переменную userName
const { name: userName } = user;

console.log(userName); // 'Ann'`;

  protected readonly defaultsExample = `const settings = { theme: 'dark' };

// lang нет в объекте — возьмётся значение по умолчанию
const { theme, lang = 'ru' } = settings;

console.log(theme); // 'dark'
console.log(lang);  // 'ru'`;

  protected readonly nestedExample = `const user = {
  name: 'Ann',
  address: { city: 'Moscow', zip: '101000' },
};

// вытаскиваем city из вложенного объекта address
const {
  name,
  address: { city },
} = user;

console.log(name); // 'Ann'
console.log(city); // 'Moscow'`;

  protected readonly restExample = `const user = { id: 1, name: 'Ann', age: 30 };

// id — отдельно, всё остальное — в объект rest
const { id, ...rest } = user;

console.log(id);   // 1
console.log(rest); // { name: 'Ann', age: 30 }`;

  protected readonly paramsExample = `// частый паттерн: «объект настроек» вместо длинного списка аргументов
function createUser({ name, role = 'user', active = true }) {
  return name + ' / ' + role + ' / ' + active;
}

createUser({ name: 'Ann' });               // 'Ann / user / true'
createUser({ name: 'Bob', role: 'admin' }); // 'Bob / admin / true'`;
}
