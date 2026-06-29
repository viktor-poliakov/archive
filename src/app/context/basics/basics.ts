import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-context-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class ContextBasics {
  protected readonly dotExample = `const user = {
  name: 'Ann',
  greet() {
    // this — это объект, стоящий перед точкой при вызове
    return 'Hi, ' + this.name;
  },
};

user.greet(); // 'Hi, Ann' — перед точкой стоит user, значит this === user`;

  protected readonly callerExample = `function describe() {
  return 'I am ' + this.role;
}

const admin = { role: 'admin', describe };
const guest = { role: 'guest', describe };

// одна и та же функция, но this зависит от того, кто перед точкой
admin.describe(); // 'I am admin' — this === admin
guest.describe(); // 'I am guest' — this === guest`;

  protected readonly lastDotExample = `const company = {
  name: 'Acme',
  ceo: {
    name: 'Ann',
    whoAmI() {
      return this.name;
    },
  },
};

// считается только ПОСЛЕДНЯЯ точка перед вызовом
company.ceo.whoAmI(); // 'Ann' — this === company.ceo, а не company`;
}
