import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-typescript-classes-implements',
  imports: [CodeBlock, RouterLink],
  templateUrl: './implements.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class TypescriptClassesImplements {
  protected readonly contractIntro = `// Интерфейс — это ТЗ (техзадание, контракт): СПИСОК требований к форме.
// Здесь ТЗ говорит одно: "у логгера обязан быть метод log(строка): void".
interface Logger {
  log(message: string): void;
}

// А теперь пишем класс, который ДОЛЖЕН соответствовать этому ТЗ.
// Но метку "implements Logger" пока НЕ ставим — и опечатываемся в имени:
class SilentLogger {
  logg(message: string): void {
    // ← хотели log, написали logg — опечатка
    console.log(message);
  }
}

// Класс сам по себе собрался без ошибок. Беда всплывёт лишь ПОЗЖЕ —
// в далёком месте, где объект попытаются использовать как Logger:
const logger: Logger = new SilentLogger();
// ❌ Property 'log' is missing in type 'SilentLogger' but required in type 'Logger'.
// Ошибку хочется ловить прямо в классе, а не за тридевять земель. Для этого и есть implements.`;

  protected readonly consoleOk = `interface Logger {
  log(message: string): void;
}

// implements Logger = класс БЕРЁТСЯ выполнить ТЗ Logger.
// Теперь компилятор-«приёмка» сверяет класс с контрактом прямо здесь,
// в самом объявлении, — а не где-то потом при использовании.
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(\`[LOG] \${message}\`); // ✅ метод log есть, сигнатура совпала
  }
}

const logger = new ConsoleLogger();
logger.log('привет'); // ✅ контракт выполнен — метод на месте`;

  protected readonly missingMember = `interface Logger {
  log(message: string): void;
}

// Класс обещал выполнить контракт (implements Logger),
// но метод log так и не написал — сделал что-то другое.
class BrokenLogger implements Logger {
  clear(): void {
    // почистили экран, а логировать нечем
  }
}
// ❌ Class 'BrokenLogger' incorrectly implements interface 'Logger'.
//    Property 'log' is missing in type 'BrokenLogger' but required in type 'Logger'.
//
// «Приёмка» отклонила работу: пункт ТЗ (метод log) не закрыт.
// Причём ошибка загорается ПРЯМО НА КЛАССЕ — там, где её и удобно чинить.`;

  protected readonly implementsNoBody = `interface Logger {
  log(message: string): void;
}

// Важно понять: implements НЕ приносит готовый код.
// Интерфейс — это лишь ОПИСАНИЕ формы (сигнатуры без тел).
// Поэтому тело метода log обязан написать САМ класс:
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message); // ← реализацию пишем МЫ; интерфейс её не дал
  }
}

// Если убрать этот метод, класс снова станет "incorrectly implements":
// контракт требует log, а взять реализацию неоткуда — интерфейс пуст на код.`;

  protected readonly extendsGivesCode = `// Для контраста — extends. Вот он как раз ДАЁТ готовый код.
class BaseLogger {
  log(message: string): void {
    console.log(message); // ← настоящая, рабочая реализация
  }
}

// Наследник получает метод log ГОТОВЫМ — писать его заново не нужно:
class TimeLogger extends BaseLogger {
  // тело намеренно пустое — log достался «в наследство» от BaseLogger
}

new TimeLogger().log('привет'); // ✅ работает: код пришёл сверху, от BaseLogger

// Итог: extends наследует РЕАЛИЗАЦИЮ (код), implements проверяет только ФОРМУ.`;

  protected readonly multipleInterfaces = `// У класса может быть сразу несколько ТЗ. Перечисляем их через запятую.
interface Logger {
  log(message: string): void;
}
interface Serializable {
  toJSON(): string;
}

// AuditRecord берётся выполнить ОБА контракта: и Logger, и Serializable.
class AuditRecord implements Logger, Serializable {
  constructor(private action: string) {}

  log(message: string): void {
    // пункт из Logger
    console.log(\`AUDIT: \${message}\`);
  }

  toJSON(): string {
    // пункт из Serializable
    return JSON.stringify({ action: this.action });
  }
}

const rec = new AuditRecord('delete');
rec.log('запись удалена'); // ✅ форма Logger соблюдена
rec.toJSON();             // ✅ форма Serializable соблюдена
// Забыли бы toJSON — снова "incorrectly implements interface 'Serializable'".`;

  protected readonly extendsImplements = `// extends и implements прекрасно работают ВМЕСТЕ.
// Порядок фиксирован: сначала extends (берём код), потом implements (сверяем форму).
interface Logger {
  log(message: string): void;
}

// Базовый класс с ГОТОВЫМ полем и вспомогательным методом.
class Device {
  constructor(protected readonly name: string) {}

  describe(): string {
    return \`Устройство \${this.name}\`;
  }
}

// extends Device — берём код Device; implements Logger — обещаем форму Logger.
class Printer extends Device implements Logger {
  // name и describe() достались от Device — их не пишем заново.
  // а метод log из контракта Logger обязаны написать сами:
  log(message: string): void {
    console.log(\`\${this.describe()}: \${message}\`);
  }
}

const p = new Printer('HP-1');
p.log('готово'); // ✅ метод из контракта Logger (написали сами)
p.describe();    // ✅ метод, унаследованный от Device (код пришёл готовым)`;

  protected readonly twoImpls = `interface Logger {
  log(message: string): void;
}

// Реализация №1 — пишет в консоль (боевой режим).
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(\`[console] \${message}\`);
  }
}

// Реализация №2 — копит сообщения в массиве (удобно в тестах).
class ArrayLogger implements Logger {
  readonly messages: string[] = [];

  log(message: string): void {
    this.messages.push(message);
  }
}

// Внутри классы РАЗНЫЕ, но снаружи — одинаковой формы Logger.
// Поэтому оба спокойно кладутся в переменную типа Logger:
const a: Logger = new ConsoleLogger(); // ✅
const b: Logger = new ArrayLogger();   // ✅`;

  protected readonly useLogger = `// Функция зависит только от КОНТРАКТА Logger, а не от конкретного класса.
// Ей всё равно, кто пришёл: ConsoleLogger, ArrayLogger или будущий FileLogger.
function processOrder(orderId: number, logger: Logger): void {
  logger.log(\`Заказ \${orderId} принят\`);
  logger.log(\`Заказ \${orderId} оплачен\`);
}

// В бою — логируем в консоль:
processOrder(1, new ConsoleLogger()); // ✅

// В тесте — подменяем реализацию на ArrayLogger и проверяем, что записалось:
const testLog = new ArrayLogger();
processOrder(2, testLog);             // ✅ тот же код — другая реализация
testLog.messages.length;              // 2 — обе строки легли в массив

// Вот ради чего всё затевалось: реализации ВЗАИМОЗАМЕНЯЕМЫ,
// пока каждая честно выполняет один контракт Logger.`;
}
