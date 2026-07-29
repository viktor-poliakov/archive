import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-parameter-properties',
  imports: [CodeBlock, RouterLink],
  templateUrl: './parameter-properties.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesParameterProperties {
  protected readonly verbosePoint = `// «Точка на плоскости»: две координаты — x и y.
// Чтобы просто СОХРАНИТЬ их в объекте, каждую координату
// приходится упомянуть ТРИЖДЫ.
class Point {
  // 1) ОБЪЯВИТЬ поле — сказать, что у точки есть такое свойство
  x: number;
  y: number;

  constructor(x: number, y: number) {
    //          ↑ 2) ПРИНЯТЬ параметр конструктора с тем же именем
    this.x = x; // 3) ПРИСВОИТЬ параметр в поле — вручную
    this.y = y;
  }
}

const p = new Point(10, 20);
p.x.toFixed(1); // ✅ 10.0 — поле x доступно (оно public по умолчанию)

// Имя «x» встречается трижды: в объявлении, в параметре, в присваивании.
// Для двух полей — терпимо. Для десяти это стена однообразного кода,
// где легко опечататься (например, присвоить this.x = y).`;

  protected readonly shorthandPoint = `// То же самое, но КОРОЧЕ. Ставим модификатор доступа (здесь public)
// прямо перед параметром конструктора — и TypeScript сам:
//   • объявит поле x,
//   • примет параметр x,
//   • присвоит this.x = x.
// Тело конструктора может остаться пустым — { }.
class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

const p = new Point(10, 20);
p.x.toFixed(1); // ✅ поле x создано и доступно — как в длинной версии
p.y = 50;       // ✅ public-поле можно и читать, и менять снаружи

// Один и тот же класс, но имя координаты названо ОДИН раз вместо трёх.
// Это и есть «параметр-свойство»: три записи схлопнулись в одну строку.`;

  protected readonly pointPublicPrivate = `// Модификатор у каждого параметра — СВОЙ. Смешиваем:
// px делаем публичным, py — приватным.
class Point {
  constructor(
    public px: number,  // → создаст ПУБЛИЧНОЕ поле this.px
    private py: number, // → создаст ПРИВАТНОЕ поле this.py
  ) {}

  // приватное поле прекрасно видно ВНУТРИ класса
  distanceToOrigin(): number {
    return Math.hypot(this.px, this.py); // ✅ this.py доступно изнутри
  }
}

const pt = new Point(3, 4);
pt.px; // ✅ public — читается снаружи

pt.py;
// ❌ Property 'py' is private and only accessible within class 'Point'.
//    private-поле наружу не выходит — ровно как при обычном объявлении.`;

  protected readonly expansion = `// Параметр-свойство — это чистое СОКРАЩЕНИЕ записи. Компилятор
// разворачивает короткую версию в ту самую длинную, что мы писали руками.

// БЫЛО (то, что печатаете вы):
class User {
  constructor(private name: string) {}
}

// СТАЛО (как это понимает компилятор — полностью эквивалентный код):
class UserExpanded {
  private name: string;       // ← поле объявлено
  constructor(name: string) { // ← параметр принят
    this.name = name;         // ← параметр присвоен в поле
  }
}

// Обе версии ведут себя абсолютно одинаково.
// Разница только в объёме кода, который набираете вы.`;

  protected readonly userReadonly = `// Комбинируем модификаторы. Частый случай — «только для чтения»:
// значение задаётся при создании и потом не меняется.
class User {
  constructor(
    public readonly login: string, // публичное, но менять нельзя
    private readonly id: number,   // приватное И только для чтения
  ) {}

  describe(): string {
    return \`\${this.login} (#\${this.id})\`; // ✅ id виден внутри класса
  }
}

const u = new User('anna', 42);
u.login; // ✅ 'anna' — читать публичное поле можно

u.login = 'bob';
// ❌ Cannot assign to 'login' because it is a read-only property.
//    readonly запрещает переприсваивание после конструктора.

u.id;
// ❌ Property 'id' is private and only accessible within class 'User'.
//    private прячет поле от внешнего кода целиком.`;

  protected readonly mixedConstructor = `// Смешанный конструктор: часть параметров — свойства, часть — обычные.
// Поле создаёт ТОЛЬКО параметр с модификатором.
class BankAccount {
  constructor(
    public readonly owner: string, // ← модификатор есть → поле this.owner
    private balance: number,       // ← модификатор есть → поле this.balance
    startupNote: string,           // ← модификатора НЕТ → просто параметр
  ) {
    // обычный параметр можно использовать ВНУТРИ конструктора:
    console.log(\`Счёт «\${owner}» открыт. Заметка: \${startupNote}\`); // ✅

    // ...но полем он НЕ стал — this.startupNote не существует.
  }

  getBalance(): number {
    return this.balance; // ✅ balance — поле, живёт и после конструктора
  }
}

const acc = new BankAccount('Анна', 1000, 'первый вклад');
acc.owner; // ✅ 'Анна' — public-поле осталось на объекте`;

  protected readonly noModifier = `// Забыли модификатор — и поле НЕ создалось. Самая частая ловушка.
class Point {
  constructor(x: number, y: number) {} // ← ни одного модификатора!

  sum(): number {
    return this.x + this.y;
    // ❌ Property 'x' does not exist on type 'Point'.
    // ❌ Property 'y' does not exist on type 'Point'.
    //    x и y — обычные параметры конструктора. Они живут только
    //    внутри конструктора и исчезают после него. Полями не стали.
  }
}

const p = new Point(10, 20);
p.x;
// ❌ Property 'x' does not exist on type 'Point'.
//    Снаружи тоже пусто: сохранять координаты было нечем.
//    Лечится добавлением модификатора: constructor(public x, public y).`;

  protected readonly taskCase = `interface User {
  id: number;
  name: string;
}

// Реальный кейс: задача в трекере. Всё состояние описано в ОДНОЙ подписи
// конструктора — сразу видно, что хранит объект и как защищено каждое поле.
class Task {
  constructor(
    public readonly id: number,             // неизменный идентификатор
    public title: string,                   // заголовок можно править
    protected assignee: User | null = null, // защищённое, со значением по умолчанию
  ) {}

  reassign(user: User): void {
    this.assignee = user; // ✅ protected-поле доступно классу и наследникам
  }
}

const t = new Task(1, 'Купить хлеб');
t.title = 'Купить молоко'; // ✅ public — правится свободно
t.id;                      // ✅ читается снаружи (но переприсвоить нельзя — readonly)`;
}
