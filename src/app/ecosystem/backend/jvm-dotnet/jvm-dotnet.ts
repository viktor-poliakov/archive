import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-backend-jvm-dotnet',
  imports: [CodeBlock, RouterLink],
  templateUrl: './jvm-dotnet.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemBackendJvmDotnet {
  protected readonly bytecodeIdea = `// ТРИ СПОСОБА ПРЕВРАТИТЬ ИСХОДНИК В РАБОТАЮЩУЮ ПРОГРАММУ.

// СПОСОБ 1 — ИНТЕРПРЕТАЦИЯ (Python, JavaScript).
// Программа читает ваш текст и выполняет его на ходу, строчка за строчкой.
//   исходник  →  интерпретатор читает и делает
// Плюс: запустил и работает. Минус: перечитывать текст каждый раз медленно.

// СПОСОБ 2 — КОМПИЛЯЦИЯ В МАШИННЫЙ КОД (Go, Rust, C++).
// Отдельный шаг превращает текст в команды конкретного процессора.
//   исходник  →  [компилятор]  →  файл для Linux x86
// Плюс: быстро выполняется. Минус: под каждую систему нужен свой файл.

// СПОСОБ 3 — КОМПИЛЯЦИЯ В БАЙТ-КОД (Java, Kotlin, C#).
// Компромисс: компилируем, но не под процессор, а под ВЫДУМАННУЮ машину.
//   исходник  →  [компилятор]  →  байт-код  →  [виртуальная машина]  →  процессор
//
// Байт-код — это команды несуществующего компьютера. Выполнять его умеет
// виртуальная машина: JVM для Java и Kotlin, CLR для C#.
// Их написали под Windows, Linux, macOS — и один и тот же байт-код
// работает везде, где стоит виртуальная машина.`;

  protected readonly jitExplained = `// ПОЧЕМУ ЭТО НЕ МЕДЛЕННО, ХОТЯ ЗВУЧИТ КАК ЛИШНИЙ СЛОЙ.

// Виртуальная машина не просто выполняет байт-код — она за ним НАБЛЮДАЕТ.
// Заметив, что какой-то кусок вызывается тысячи раз, она компилирует
// именно его в настоящий машинный код прямо во время работы.
// Приём называется JIT — компиляция «точно в срок».

// СЛЕДСТВИЕ ПЕРВОЕ, ПРИЯТНОЕ:
// разогретое Java-приложение по скорости сравнимо с Go и C++,
// потому что горячие места у него в итоге тоже машинный код.
// Более того, JIT знает то, чего не знает обычный компилятор:
// какие ветки реально выполняются на ЭТИХ данных, — и оптимизирует под них.

// СЛЕДСТВИЕ ВТОРОЕ, НЕПРИЯТНОЕ — «ПРОГРЕВ»:
//   первые секунды после запуска приложение работает медленно
//   через минуту-другую выходит на полную скорость
//
// На сервере, который живёт месяцами, это не важно вообще.
// А вот для serverless-функции, которая поднимается на каждый запрос,
// это беда — и поэтому в том мире Java исторически проигрывает Go.
// Частично лечится заранее скомпилированными сборками (GraalVM, .NET AOT).`;

  protected readonly javaVerbose = `// Классическая жалоба на Java: «слишком многословно». Вот честный пример.

// БЫЛО (Java 8, код такого вида вы встретите в живых проектах):
public class Product {
    private final int id;
    private final String name;
    private final int price;

    public Product(int id, String name, int price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public int getPrice() { return price; }

    @Override
    public boolean equals(Object o) { /* ещё десять строк */ }

    @Override
    public int hashCode() { /* ещё три строки */ }

    @Override
    public String toString() { /* ещё три строки */ }
}
// Сорок строк ради трёх полей.


// СТАЛО (современная Java, начиная с 17-й версии):
public record Product(int id, String name, int price) {}
// Одна строка. Конструктор, чтение полей, сравнение, хэш и печать —
// всё это компилятор напишет сам.

// ВЫВОД, ВАЖНЫЙ ДЛЯ ОЦЕНКИ ЯЗЫКА:
// репутация Java как многословной сложилась к 2010 году и с тех пор
// заметно устарела. Но в живых проектах десятилетней давности
// вы увидите именно верхний вариант — и это тоже правда.`;

  protected readonly threadsModel = `// ТРЕТИЙ ОТВЕТ НА ТОТ ЖЕ ВОПРОС про параллельность.
// Node: один поток и цикл событий. Go: горутины. Java: НАСТОЯЩИЕ ПОТОКИ ОС.

// Классическая модель: один запрос = один поток.
// Поток честно ЖДЁТ базу, ничего в это время не делая.
@GetMapping("/api/orders")
public List<Order> getOrders(@RequestParam long userId) {
    // Поток блокируется здесь на 40 миллисекунд. И это НОРМАЛЬНО:
    // операционная система в это время отдаст процессор другому потоку.
    return orderRepository.findByUserId(userId);
}

// ПЛЮС МОДЕЛИ: код пишется линейно, как обычная программа.
// Никаких async/await, никаких «а вдруг я заблокирую цикл событий».
// Тяжёлые вычисления тоже не проблема — они займут одно ядро из шестнадцати.

// МИНУС: поток ОС стоит около мегабайта памяти.
// Тысяча одновременных пользователей — тысяча потоков — гигабайт только на них.
// Поэтому потоки берут из пула ограниченного размера, и при большом
// количестве медленных запросов пул исчерпывается: новые пользователи ждут.


// ЧТО ИЗМЕНИЛОСЬ В JAVA 21 — ВИРТУАЛЬНЫЕ ПОТОКИ.
// Это, по сути, те же горутины: очень дешёвые потоки, которых
// можно создать миллион, а планировщик сам раскладывает их по ядрам.
Thread.startVirtualThread(() -> {
    sendEmail(address);
});

// Самое приятное: КОД НЕ МЕНЯЕТСЯ. Вы пишете обычный блокирующий код,
// а под капотом он перестаёт занимать настоящий поток на время ожидания.
// Java получила выгоду горутин, не заставляя переписывать программы.`;

  protected readonly springBoot = `// SPRING BOOT — самый распространённый каркас на JVM.
// Ключевая идея: вы описываете ЧТО нужно, а не КАК это создать.

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    // ВНЕДРЕНИЕ ЗАВИСИМОСТЕЙ. Мы НЕ создаём сервис через new.
    // Мы объявляем: «мне нужен вот такой» — и каркас сам его подставит.
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> create(
            @Valid @RequestBody CreateOrderRequest body,        // @Valid — проверка сама
            @AuthenticationPrincipal User user) {               // кто пришёл — тоже

        Order order = orderService.create(user.getId(), body);
        return ResponseEntity.status(201).body(order);
    }
}

// ОПИСАНИЕ ТОГО, ЧТО МОЖНО ПРИСЛАТЬ — обычный класс с пометками.
public record CreateOrderRequest(
    @NotNull Long productId,
    @Min(1) @Max(100) Integer qty
) {}

// Прислали количество 0 — Spring вернёт 400 сам, обработчик не вызовется.


// ЧТО ТАКОЕ ВНЕДРЕНИЕ ЗАВИСИМОСТЕЙ ПРОСТЫМИ СЛОВАМИ.
// Без него класс сам создаёт всё, что ему нужно:
//     var service = new OrderService(new Database("url"), new Mailer("key"));
// и тогда его невозможно протестировать, не подняв настоящую базу.
// С внедрением класс только ОБЪЯВЛЯЕТ потребность, а кто её удовлетворит —
// решает каркас: в бою настоящая база, в тестах — подделка.
// Ровно та же идея есть в Angular и в NestJS.`;

  protected readonly springEcosystem = `// ЗА ЧТО SPRING ЛЮБЯТ В БОЛЬШИХ КОМПАНИЯХ: типовые вещи уже написаны.

// РАБОТА С БАЗОЙ. Вы объявляете ИНТЕРФЕЙС — реализацию пишет Spring.
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Метода с таким телом нет. Spring читает ИМЯ метода
    // и сам собирает по нему SQL-запрос. Это не шутка.
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    List<Order> findByTotalGreaterThanOrderByCreatedAtDesc(int total);
}

// БЕЗОПАСНОСТЬ. Правила доступа описываются пометками над методами.
@PreAuthorize("hasRole('ADMIN')")
public void deleteProduct(Long id) { ... }

// НАСТРОЙКИ. Один файл на все окружения, значения берутся из переменных.
// application.yml:
//   spring:
//     datasource:
//       url: \${DATABASE_URL}
//   server:
//     port: \${PORT:8080}

// ГОТОВЫЕ ТЕХНИЧЕСКИЕ АДРЕСА. Подключили одну зависимость — и получили
// /actuator/health, /actuator/metrics и десяток других:
// проверку здоровья, метрики, состояние пула соединений с базой.

// ИМЕННО ЭТО и означает «батарейки в комплекте» в мире Java.
// Плата — размер: минимальное Spring-приложение стартует несколько секунд
// и занимает сотни мегабайт памяти. Для банка это неважно,
// для маленького сервиса — заметно.`;

  protected readonly kotlinExample = `// KOTLIN — «Java без боли». Работает на той же виртуальной машине,
// пользуется теми же библиотеками, но синтаксис заметно приятнее.

// ОТЛИЧИЕ 1: КРАТКОСТЬ. Тот же класс товара — одна строка.
data class Product(val id: Int, val name: String, val price: Int)

// ОТЛИЧИЕ 2 — ГЛАВНОЕ. Защита от пустых значений встроена в типы.
var name: String = "Кружка"
name = null              // ОШИБКА КОМПИЛЯЦИИ, программа не соберётся

var description: String? = null    // вопросительный знак = «может быть пустым»
println(description?.length)       // безопасное обращение: вернёт null, не упадёт

// Зачем это нужно: обращение к пустому значению — самая частая ошибка
// времени выполнения в Java за всю её историю. Её автор даже назвал
// эту идею «ошибкой на миллиард долларов». Kotlin убирает её на этапе сборки.

// ОТЛИЧИЕ 3: КОРУТИНЫ — те же горутины, только на JVM.
suspend fun buildProductPage(id: Long): ProductPage = coroutineScope {
    // Три запроса уходят ОДНОВРЕМЕННО, а не по очереди.
    val product = async { productService.find(id) }
    val reviews = async { reviewService.findByProduct(id) }
    val related = async { recommendationService.findSimilar(id) }

    // Ждём все три. Общее время — как у самого медленного, а не сумма.
    ProductPage(product.await(), reviews.await(), related.await())
}

// СЕРВЕР НА KOTLIN И SPRING — то же самое, что на Java, но короче:
@RestController
class OrderController(private val orderService: OrderService) {

    @PostMapping("/api/orders")
    fun create(@RequestBody body: CreateOrderRequest): Order =
        orderService.create(body)
}

// ГДЕ KOTLIN ГОСПОДСТВУЕТ БЕЗУСЛОВНО: разработка под Android.
// Google объявил его основным языком платформы, и Java там уже редкость.`;

  protected readonly csharpExample = `// C# и .NET — почти зеркальная история: своя виртуальная машина (CLR),
// свой огромный каркас, свой мир корпоративной разработки.

// СОВРЕМЕННЫЙ ASP.NET CORE. Обратите внимание, насколько это компактно —
// стереотип про «C# многословный» устарел так же, как и про Java.

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ShopContext>();
var app = builder.Build();

// Маршрут одной строкой. Зависимости подставляются в аргументы сами.
app.MapGet("/api/products/{id}", async (int id, ShopContext db) =>
{
    var product = await db.Products.FindAsync(id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});

app.MapPost("/api/orders", async (CreateOrderRequest body, ShopContext db) =>
{
    var product = await db.Products.FindAsync(body.ProductId);
    if (product is null) return Results.NotFound();
    if (product.Stock < body.Qty) return Results.Conflict("Мало на складе");

    var order = new Order
    {
        ProductId = body.ProductId,
        Qty = body.Qty,
        Total = product.Price * body.Qty,   // цена из базы, не от клиента
    };

    db.Orders.Add(order);
    await db.SaveChangesAsync();

    return Results.Created(\$"/api/orders/{order.Id}", order);
});

app.Run();


// ЗАПРОСЫ К БАЗЕ ЧЕРЕЗ LINQ — то, чему завидуют другие языки.
// Это не строки SQL, а настоящий код, который проверяет компилятор:
var cheap = await db.Products
    .Where(p => p.Price < 1000 && p.Stock > 0)
    .OrderByDescending(p => p.CreatedAt)
    .Take(10)
    .ToListAsync();

// Опечатка в имени поля — ошибка сборки, а не пустой результат в бою.`;

  protected readonly transactions = `// ТРАНЗАКЦИИ — то, ради чего эти платформы и стоят в банках.
// Транзакция означает «либо всё, либо ничего».

// ЗАДАЧА: перевести деньги с одного счёта на другой.
// Это два изменения, и они ОБЯЗАНЫ произойти вместе.

@Service
public class TransferService {

    private final AccountRepository accounts;

    // ОДНА ПОМЕТКА — и весь метод стал транзакцией.
    // Если внутри вылетит исключение, Spring отменит ВСЕ изменения.
    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accounts.findForUpdate(fromId);
        Account to = accounts.findForUpdate(toId);

        if (from.getBalance().compareTo(amount) < 0) {
            // Исключение отменит вообще всё, что было сделано выше.
            throw new InsufficientFundsException();
        }

        from.withdraw(amount);
        to.deposit(amount);

        accounts.save(from);
        accounts.save(to);
    }
}

// ЧТО БУДЕТ БЕЗ ТРАНЗАКЦИИ, если свет выключат между двумя строками:
// с одного счёта списали, на другой не зачислили. Деньги исчезли.
// Именно этот сценарий и есть причина, по которой транзакции придумали.


// ОБРАТИТЕ ВНИМАНИЕ НА BigDecimal, А НЕ double.
// Числа с плавающей точкой не умеют точно хранить десятичные дроби:
//     0.1 + 0.2 в double даёт 0.30000000000000004
// На одной операции незаметно, на миллионе — расхождение в отчётах.
// ПРАВИЛО: деньги никогда не хранят в double и float.
// Либо BigDecimal (Java) и decimal (C#), либо целые числа в копейках.
// Это одна из первых вещей, которые спрашивают на собеседовании в финтех.


// ВТОРАЯ ВАЖНАЯ ВЕЩЬ — БЛОКИРОВКА ПРИ ОДНОВРЕМЕННОМ ДОСТУПЕ.
// Два человека покупают последний товар в одну и ту же миллисекунду.
// Метод findForUpdate выше берёт строку «с замком»: второй запрос
// подождёт, пока первый закончит. Иначе оба увидят «остаток 1»,
// оба спишут — и склад уйдёт в минус.`;

  protected readonly enterpriseReality = `// ПОЧЕМУ БАНКИ ВЫБИРАЮТ ИМЕННО ЭТИ ПЛАТФОРМЫ.
// Причины почти не про язык — они про эксплуатацию и людей.

// 1. ГОРИЗОНТ ПЛАНИРОВАНИЯ. У версий Java и .NET есть официальные даты
//    окончания поддержки, объявленные на годы вперёд. Система, которую
//    писали в 2014 году, работает и обновляется до сих пор.
//    Для банка «проживёт ли это десять лет» — вопрос номер один.

// 2. ИНСТРУМЕНТЫ ДИАГНОСТИКИ. Здесь они лучшие в отрасли.
//    Можно подключиться к работающему в бою приложению и посмотреть,
//    что происходит внутри, не останавливая его:
//      - какой поток что делает прямо сейчас
//      - куда уходит память и что её держит
//      - какой метод съедает процессор
//    Когда простой стоит миллионы в час, это решающий аргумент.

// 3. НАЙМ. Разработчиков на Java и C# много, они есть в любом городе,
//    и они привыкли к длинным проектам с процессами и документацией.

// 4. ПРЕДСКАЗУЕМОСТЬ КОДА. Строгая типизация плюс общепринятая структура
//    означают, что проект пятилетней давности читается новым человеком.
//    В большой компании это стоит дороже краткости.

// ЧЕСТНАЯ ОБРАТНАЯ СТОРОНА:
//    • стартовать долго: настройка и обвязка съедают первые дни
//    • памяти нужно много: сотни мегабайт там, где Go обойдётся десятками
//    • культура тяжеловесная: слои, абстракции, паттерны — иногда сверх меры
//    • на маленьком проекте всё это чистые накладные расходы`;

  protected readonly tooling = `# ИНСТРУМЕНТЫ. Здесь у обеих платформ традиционно сильная сторона.

# СБОРКА. Аналог npm/pip, только описание в отдельном файле проекта.
mvn clean package          # Java, Maven — описание в pom.xml
./gradlew build            # Java и Kotlin, Gradle — гибче, описание кодом
dotnet build               # C# — описание в .csproj

# ЗАПУСК
java -jar shop-api.jar     # один архив со всем внутри, похоже на Go
dotnet run                 # или dotnet publish для боевой сборки

# СРЕДЫ РАЗРАБОТКИ — то, за что эти платформы хвалят особенно.
# IntelliJ IDEA (Java, Kotlin) и Visual Studio / Rider (C#) умеют то,
# чего нет в лёгких редакторах:
#   • переименовать метод сразу во всём проекте, не сломав ничего
#   • найти ВСЕ места вызова с гарантией полноты
#   • увидеть цепочку вызовов вглубь на десять уровней
#   • отладчик, который меняет код прямо в работающей программе
# На проекте в миллион строк это не удобство, а необходимое условие работы.

# ПРОФИЛИРОВЩИКИ — отдельная гордость:
#   JFR и async-profiler для JVM, dotnet-trace и dotMemory для .NET.
# Они показывают, куда уходят память и процессорное время,
# с точностью, которой в других экосистемах обычно нет.`;
}
