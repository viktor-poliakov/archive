import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesBasics {
  protected readonly taskClass = `// Класс Task — это ЧЕРТЁЖ задачи из списка дел.
// Он собирает в одном месте ДАННЫЕ (что за задача, сделана ли она)
// и ПОВЕДЕНИЕ (что с задачей можно делать).
class Task {
  // Поля — это данные КАЖДОЙ задачи. У поля есть имя и тип.
  title: string; // название задачи, строка
  done: boolean; // выполнена ли, да/нет

  // Конструктор — «сборочный цех»: он срабатывает в момент создания
  // объекта и заполняет поля переданными значениями.
  constructor(title: string, done: boolean) {
    this.title = title; // this — тот самый объект, который сейчас собираем
    this.done = done;
  }

  // Метод — это поведение. toggle переключает признак «сделано».
  toggle(): void {
    this.done = !this.done; // было false → станет true, и наоборот
  }
}`;

  protected readonly newTask = `// Класс сам по себе ничего не хранит — это лишь чертёж.
// Чтобы получить настоящий объект (экземпляр), пишут new и имя класса.
// new запускает конструктор и возвращает готовое «изделие».
const buyBread = new Task('Купить хлеб', false);
const callMom = new Task('Позвонить маме', true);

// Устройство у обоих одинаковое (поля title, done и метод toggle),
// а наполнение — своё, у каждого объекта отдельное:
buyBread.title; // 'Купить хлеб'
callMom.title; // 'Позвонить маме'

buyBread.toggle(); // переключили именно эту задачу
buyBread.done; // ✅ true — метод изменил данные ЭТОГО объекта
callMom.done; // ✅ true — второй объект не затронут, у него своё состояние`;

  protected readonly thisMethods = `// Тот же Task, но добавим ещё методов, чтобы разглядеть this.
// Внутри метода this — это как слово «я»: оно указывает на объект,
// У КОТОРОГО метод вызвали. Через this метод читает и меняет свои поля.
class Task {
  title: string;
  done: boolean;

  constructor(title: string, done: boolean) {
    this.title = title;
    this.done = done;
  }

  // rename МЕНЯЕТ поле title у того объекта, на котором вызван
  rename(newTitle: string): void {
    this.title = newTitle;
  }

  // describe ЧИТАЕТ поля через this и собирает из них строку-описание
  describe(): string {
    const mark = this.done ? '✓' : '·';
    return \`[\${mark}] \${this.title}\`;
  }
}

const task = new Task('Помыть посуду', false);
task.rename('Помыть посуду и убрать со стола'); // здесь this === task
task.describe(); // ✅ '[·] Помыть посуду и убрать со стола'`;

  protected readonly animalClass = `// Базовый («родительский») класс: то общее, что есть у ЛЮБОГО животного.
// У каждого животного есть имя и умение «издавать звук».
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): string {
    return \`\${this.name} издаёт какой-то звук\`;
  }
}

const someAnimal = new Animal('Зверь');
someAnimal.speak(); // ✅ 'Зверь издаёт какой-то звук'`;

  protected readonly dogClass = `class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  speak(): string {
    return \`\${this.name} издаёт какой-то звук\`;
  }
}

// Dog НАСЛЕДУЕТ Animal через extends: получает поле name и метод speak
// «в подарок», ничего не переписывая. И добавляет своё — поле breed.
class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    // super(...) вызывает конструктор БАЗОВОГО класса Animal —
    // именно он заполнит поле name. Без этого вызова не обойтись.
    super(name);
    // Обращаться к this можно ТОЛЬКО после super():
    this.breed = breed;
  }

  // override ЗАМЕНЯЕТ унаследованный от Animal метод speak своей версией.
  // Ключевое слово override здесь обязательно (см. следующий раздел).
  override speak(): string {
    return \`\${this.name} гавкает\`; // name достался от Animal
  }
}

const rex = new Dog('Рекс', 'корги');
rex.speak(); // ✅ 'Рекс гавкает' — сработала версия из Dog
rex.name; // ✅ 'Рекс'  — поле унаследовано от Animal
rex.breed; // ✅ 'корги' — собственное поле Dog`;

  protected readonly superCall = `class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  speak(): string {
    return \`\${this.name} издаёт какой-то звук\`;
  }
}

class Dog extends Animal {
  override speak(): string {
    // super.speak() зовёт СТАРУЮ версию метода из базового Animal.
    // Удобно, когда нужно ДОПОЛНИТЬ поведение родителя, а не выкинуть его.
    const base = super.speak(); // 'Рекс издаёт какой-то звук'
    return \`\${base}, а точнее — гавкает\`;
  }
}

const rex = new Dog('Рекс');
rex.speak();
// ✅ 'Рекс издаёт какой-то звук, а точнее — гавкает'`;

  protected readonly overrideRule = `class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  speak(): string {
    return \`\${this.name} издаёт звук\`;
  }
}

// (1) Переопределяем speak, но ЗАБЫЛИ ключевое слово override:
class Cat extends Animal {
  speak(): string {
    return \`\${this.name} мяукает\`;
  }
  // ❌ This member must have an 'override' modifier because it overrides
  //    a member in the base class 'Animal'.
  //    В проекте включён noImplicitOverride — override обязателен.
}

// (2) Наоборот: override стоит на методе, которого в базе НЕТ:
class Fish extends Animal {
  override swim(): string {
    return \`\${this.name} плывёт\`;
  }
  // ❌ This member cannot have an 'override' modifier because it is not
  //    declared in the base class 'Animal'.
  //    override ставят ТОЛЬКО когда реально перекрывают метод базы.
}

// ✅ Правильно: метод базы существует И стоит override:
class Dog extends Animal {
  override speak(): string {
    return \`\${this.name} гавкает\`;
  }
}`;

  protected readonly superRequired = `class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Наследник со СВОИМ конструктором ОБЯЗАН позвать super().
class DogBad extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    // super(name) пропущен — сразу две ошибки:
    this.breed = breed;
    // ❌ Constructors for derived classes must contain a 'super' call.
    // ❌ 'super' must be called before accessing 'this' in the constructor
    //    of a derived class. (обращаться к this до super() тоже нельзя)
  }
}

// ✅ Правильно: сначала super(name) — база заполнит name,
//    и только ПОТОМ свои поля через this.
class DogOk extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name); // ✅ сначала конструктор базового класса
    this.breed = breed; // ✅ теперь this уже можно
  }
}`;

  protected readonly classAsType = `// Имя класса — это ещё и ТИП. Им можно аннотировать переменные,
// параметры функций и возвращаемые значения — как любым другим типом.
class Task {
  title: string;
  done: boolean;
  constructor(title: string, done: boolean) {
    this.title = title;
    this.done = done;
  }
}

// Переменная типа Task — сюда подойдёт экземпляр Task:
const current: Task = new Task('Написать отчёт', false); // ✅

// Функция принимает Task и возвращает Task:
function complete(task: Task): Task {
  task.done = true;
  return task;
}

// Массив задач описывается как Task[]:
const backlog: Task[] = [new Task('A', false), new Task('B', true)];

// ⚠️ Тонкость: TypeScript сравнивает типы ПО ФОРМЕ (структурно).
// Поэтому обычный объект той же формы тоже подойдёт под тип Task:
const plain: Task = { title: 'Просто объект', done: false };
// ✅ ошибки НЕТ — у объекта те же поля title: string и done: boolean.
//    (методы вроде toggle такой объект не получит — это лишь данные)`;
}
