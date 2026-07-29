import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-abstract',
  imports: [CodeBlock, RouterLink],
  templateUrl: './abstract.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesAbstract {
  protected readonly motivation = `// Хотим считать площадь у РАЗНЫХ фигур (круг, прямоугольник)
// и дать им общий вывод describe(). Попробуем обычным классом-родителем —
// и сразу упрёмся в две беды.
class Shape {
  area(): number {
    // Какое тут тело? У «фигуры вообще» площади не существует —
    // считать нечего, приходится вернуть бессмысленную заглушку.
    return 0;
  }
  describe(): string {
    return \`Площадь ≈ \${this.area().toFixed(2)}\`;
  }
}

// Беда 1: можно создать «фигуру вообще» — хотя это бессмыслица.
const nothing = new Shape();
nothing.describe(); // "Площадь ≈ 0.00" — мусор, но компилятор молчит

// Беда 2: если наследник ЗАБУДЕТ задать свою area(),
// он молча унаследует заглушку return 0 — и никто не предупредит.
// Нам нужен родитель, который САМ запретит оба промаха. Это abstract.`;

  protected readonly abstractDeclare = `// Ставим перед class слово abstract — получаем «недостроенный чертёж».
// Метод area() объявлен БЕЗ ТЕЛА и помечен abstract — это «дыра»,
// обязательный пропуск, который наследник ДОЛЖЕН заполнить.
// А describe() — обычный метод С ТЕЛОМ: общий код для всех фигур.
abstract class Shape {
  abstract area(): number; // ← дыра: ни тела, ни return; только сигнатура

  describe(): string {
    // describe() спокойно зовёт area(), хотя тела area() тут ещё нет:
    // TypeScript ГАРАНТИРУЕТ, что наследник его реализует.
    return \`Площадь ≈ \${this.area().toFixed(2)}\`;
  }
}`;

  protected readonly noNew = `// «Недостроенный чертёж» нельзя пустить в производство —
// создать экземпляр самого абстрактного класса запрещено.
const s = new Shape();
// ❌ Cannot create an instance of an abstract class.
//    Логично: area() пока «дыра», describe() позвал бы несуществующее тело.
//    Абстрактный класс живёт ТОЛЬКО как основа для наследников.`;

  protected readonly circle = `// Circle — конкретная фигура, «достраивает чертёж».
// extends Shape: наследуем готовый describe() и обязуемся закрыть дыру area().
class Circle extends Shape {
  // Параметр-свойство: radius сразу станет полем (см. Параметры-свойства).
  constructor(private radius: number) {
    super(); // конструктор наследника ОБЯЗАН позвать super() до работы с this
  }

  // Реализуем abstract-метод area(). Обратите внимание: слова override здесь НЕТ.
  // Мы ВПЕРВЫЕ даём area() тело (в базе тела не было), а не ПЕРЕопределяем.
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(10); // ✅ Circle — конкретный класс, создавать можно
c.area().toFixed(2);      // ✅ "314.16" — своя формула площади круга`;

  protected readonly missingArea = `// Забыли реализовать area() — компилятор не даст «сдать недоделку».
class Triangle extends Shape {
  constructor(
    private base: number,
    private height: number,
  ) {
    super();
  }
  // area() реализовать забыли...
}
// ❌ Non-abstract class 'Triangle' does not implement inherited
//    abstract member 'area'.
//    Выход: либо реализуй area(), либо сам стань abstract
//    (тогда дыру закроет уже ТВОЙ наследник).`;

  protected readonly templateMethod = `// Ещё одна фигура — прямоугольник. Своя area(), но describe() НЕ трогаем:
// общий describe() наследуется от Shape как есть.
class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number,
  ) {
    super();
  }
  area(): number {
    return this.width * this.height;
  }
}

// «Шаблонный метод» в действии: один и тот же describe() из базы
// у разных фигур даёт разный результат — потому что внутри зовёт СВОЮ area().
const shapes: Shape[] = [new Circle(10), new Rectangle(3, 4)];

for (const shape of shapes) {
  shape.describe();
  // Circle:    "Площадь ≈ 314.16" — describe() позвал area() круга
  // Rectangle: "Площадь ≈ 12.00"  — тот же describe(), но area() прямоугольника
}
// Общий каркас (describe) — в базе; переменная часть (area) — в наследниках.`;

  protected readonly overrideOnAbstract = `// Тонкость про override и abstract. Реализация abstract-метода — это НЕ
// переопределение готового кода (тела в базе не было), поэтому override
// на area() НЕ ОБЯЗАТЕЛЕН. Обычно его и не пишут:
class Circle2 extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    // ✅ без override — это реализация контракта, а не перекрытие
    return Math.PI * this.radius ** 2;
  }
}

// Написать override тут тоже МОЖНО — ошибки не будет (area() всё-таки
// объявлен в базе, пусть и как абстрактный). Просто это лишнее:
class Circle3 extends Shape {
  constructor(private radius: number) {
    super();
  }

  override area(): number {
    // ✅ тоже компилируется — override здесь необязателен, но не запрещён
    return Math.PI * this.radius ** 2;
  }
}`;

  protected readonly overrideWrong = `// А вот describe() в базе — ОБЫЧНЫЙ метод с телом. Если наследник хочет
// его переопределить, в проекте включён noImplicitOverride — и без слова
// override компилятор ругается:
class NamedCircle extends Shape {
  constructor(
    private radius: number,
    private name: string,
  ) {
    super();
  }

  area(): number {
    // ✅ реализация abstract-метода — override НЕ нужен
    return Math.PI * this.radius ** 2;
  }

  describe(): string {
    // ❌ забыли override у ПЕРЕопределения обычного метода
    return \`\${this.name}: \${super.describe()}\`;
  }
  // ❌ This member must have an override modifier because it overrides
  //    a member in the base class 'Shape'.
}`;

  protected readonly overrideRight = `// Правильно: у area() (реализация abstract) — БЕЗ override,
// у describe() (переопределение обычного метода) — СО словом override.
class NamedCircle extends Shape {
  constructor(
    private radius: number,
    private name: string,
  ) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  override describe(): string {
    // super.describe() зовёт общий describe() из базы и дополняет его.
    return \`\${this.name}: \${super.describe()}\`;
  }
}

const moon = new NamedCircle(1, 'Луна');
moon.describe(); // ✅ "Луна: Площадь ≈ 3.14"`;

  protected readonly abstractVsInterface = `// abstract-класс и interface оба задают «контракт формы».
// Разница: интерфейс — ТОЛЬКО форма (ни кода, ни состояния, стирается
// при компиляции). Абстрактный класс несёт и готовый код, и поля-состояние.

// interface: только сигнатуры — ни тел, ни полей со значением
interface Printable {
  area(): number;
  describe(): string; // придётся реализовать ВРУЧНУЮ в каждом классе
}

// abstract class: тот же контракт, НО describe() уже написан один раз
abstract class Shape2 {
  abstract area(): number;
  describe(): string {
    // общий код «в подарок» наследнику
    return \`Площадь ≈ \${this.area().toFixed(2)}\`;
  }
}

// implements — только ПРОВЕРКА формы, реализацию не даёт:
class C1 implements Printable {
  area(): number {
    return 1;
  }
  describe(): string {
    return 'пишу describe сам'; // дублируем руками
  }
}

// extends — НАСЛЕДУЕТ готовый describe(), дублировать не нужно:
class C2 extends Shape2 {
  area(): number {
    return 1;
  }
  // describe() достался от Shape2 бесплатно — переписывать не надо
}`;
}
