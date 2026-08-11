import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-backend-python',
  imports: [CodeBlock, RouterLink],
  templateUrl: './python.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemBackendPython {
  protected readonly pythonLooks = `# Первое, что замечают: в Python нет фигурных скобок и точек с запятой.
# Вложенность задаётся ОТСТУПАМИ, и они — часть синтаксиса, а не оформление.

def calc_discount(amount, percent):
    if percent > 50:
        # Этот блок относится к if только потому, что он сдвинут вправо.
        raise ValueError("Скидка больше 50% требует согласования")

    discount = amount * percent / 100
    return amount - discount


# Тот же смысл на JavaScript — для сравнения:
#
#   function calcDiscount(amount, percent) {
#       if (percent > 50) {
#           throw new Error("Скидка больше 50% требует согласования");
#       }
#       const discount = amount * percent / 100;
#       return amount - discount;
#   }
#
# Отступы в JavaScript — вежливость. В Python — закон.
# Сдвинули строку не туда — получили другую программу или ошибку.`;

  protected readonly pythonBasics = `# Знакомые вещи под другими именами. Половина языка узнаётся сразу.

# Массив здесь называется списком
products = ["кружка", "кепка", "футболка"]
products.append("шарф")                          # push
long_names = [p for p in products if len(p) > 5] # аналог filter: «p для p из products, если...»

# Объект здесь называется словарём
product = {"id": 1, "name": "Кружка", "price": 490}
print(product["price"])                # 490
price = product.get("price", 0)        # с запасным значением, если ключа нет

# Строки со вставками — f-строки, аналог шаблонных строк
name = "Аня"
print(f"Привет, {name}! У тебя {len(products)} товара.")

# Ни одной точки с запятой, ни одной фигурной скобки.
# Функции объявляются словом def, классы — словом class.

class Order:
    def __init__(self, product, qty):   # это конструктор
        self.product = product           # self — это то же, что this
        self.qty = qty

    def total(self):
        return self.product["price"] * self.qty

order = Order(product, 3)
print(order.total())                   # 1470`;

  protected readonly typeHints = `# Python не требует указывать типы — но позволяет.
# Эти пометки называют «подсказками типов», и они полностью необязательны.

# БЕЗ подсказок: работает, но непонятно, что сюда класть
def calc(amount, percent):
    return amount - amount * percent / 100

# С подсказками: редактор подсказывает, а mypy проверит до запуска
def calc_discount(amount: float, percent: int) -> float:
    return amount - amount * percent / 100


# ВАЖНОЕ ОТЛИЧИЕ ОТ TYPESCRIPT — и оно удивляет.
# В TypeScript типы стираются, но код без них НЕ СОБЕРЁТСЯ.
# В Python типы не проверяются вообще никем, если вы сами не запустите проверку:
#
#   mypy app.py     ← вот только теперь ошибки типов найдутся
#
# Без этой команды строка ниже спокойно выполнится и упадёт уже во время работы:
calc_discount("сто рублей", "много")   # никакой ошибки заранее


# ЧТО ЭТО ЗНАЧИТ НА ПРАКТИКЕ.
# В серьёзном проекте подсказки типов ставят везде и включают mypy в проверки.
# В маленьком скрипте на двадцать строк ими обычно не пользуются.
# Это выбор команды, а не требование языка.`;

  protected readonly flaskExample = `# FLASK — самый маленький каркас. Похож по духу на Express:
# даёт маршруты и почти ничего больше.

from flask import Flask, jsonify, request

app = Flask(__name__)

# Декоратор @ над функцией означает «этот адрес обслуживает вот эта функция».
# Читается почти как английская фраза.
@app.route("/api/products", methods=["GET"])
def list_products():
    products = db.find_products()
    return jsonify(products)


@app.route("/api/products/<int:id>", methods=["GET"])
def get_product(id):
    # <int:id> в адресе означает «здесь целое число, положи его в id»
    product = db.find_product(id)
    if product is None:
        return jsonify({"error": "Не найдено"}), 404
    return jsonify(product)


@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json()
    order = db.create_order(data)
    return jsonify(order), 201


if __name__ == "__main__":
    app.run(port=3000)

# ПЛЮС: понятно с первой минуты, ничего лишнего.
# МИНУС: как и Express, ничего не навязывает — структуру придумываете сами.`;

  protected readonly fastapiExample = `# FASTAPI — современный выбор для новых проектов.
# Его главная идея: подсказки типов используются НЕ ДЛЯ КРАСОТЫ,
# а как настоящее описание того, что можно прислать.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()


# Описываем форму входящих данных обычным классом.
class CreateOrderRequest(BaseModel):
    product_id: int
    qty: int = Field(ge=1, le=100)    # ge = не меньше, le = не больше


class OrderResponse(BaseModel):
    id: int
    total: float


@app.post("/api/orders", response_model=OrderResponse, status_code=201)
async def create_order(data: CreateOrderRequest):
    # СЮДА МЫ ПОПАДЁМ, ТОЛЬКО ЕСЛИ ДАННЫЕ УЖЕ ПРОВЕРЕНЫ.
    # Прислали строку вместо числа или количество 0 — FastAPI сам вернул 422
    # с понятным описанием, какое поле не подошло. Мы этот код не писали.

    product = await db.find_product(data.product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")

    order = await db.create_order(
        product_id=data.product_id,
        qty=data.qty,
        total=product.price * data.qty,   # цена ИЗ БАЗЫ, не от клиента
    )
    return order


# БЕСПЛАТНЫЙ ПОДАРОК, РАДИ КОТОРОГО МНОГИЕ И БЕРУТ FASTAPI:
# запустите сервер и откройте http://localhost:8000/docs — там будет
# готовая интерактивная документация всех ваших адресов, с формами
# для пробных запросов. Она собрана из тех же классов. Писать её не надо.`;

  protected readonly djangoExample = `# DJANGO — каркас «всё в комплекте». Его философия: типовые задачи веба
# решены заранее, вы описываете только своё.

# ФАЙЛ models.py — описываем данные. Это же станет таблицами в базе.
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ЧТО ВЫ ПОЛУЧАЕТЕ ИЗ ЭТИХ ДЕСЯТИ СТРОК, НЕ НАПИСАВ БОЛЬШЕ НИЧЕГО:

# 1. Таблицу в базе данных — двумя командами:
#    python manage.py makemigrations   ← Django сам пишет файл миграции
#    python manage.py migrate          ← и применяет его к базе

# 2. Готовый язык запросов вместо SQL:
cheap = Product.objects.filter(price__lt=1000).order_by("-created_at")[:10]
in_stock = Product.objects.filter(stock__gt=0).count()

# 3. ПОЛНОЦЕННУЮ АДМИНКУ. Три строки — и у вас готовая панель управления
#    со списками, поиском, фильтрами, созданием и удалением записей.
from django.contrib import admin

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock")
    search_fields = ("name",)

# Вот этот пункт номер три — главная причина, по которой Django до сих пор
# выбирают для интернет-магазинов, CRM и всего, где есть «панель для сотрудников».
# На других языках такую админку пишут неделями.`;

  protected readonly gilExplained = `# GIL — Global Interpreter Lock, «глобальная блокировка интерпретатора».
# Звучит страшно, означает простое: в одном процессе Python
# байт-код выполняет ОДИН поток за раз, даже если потоков десять.

import threading

def heavy_compute():
    total = 0
    for i in range(50_000_000):
        total += i
    return total

# Наивная идея: запустим в четыре потока и получим ускорение в четыре раза.
threads = [threading.Thread(target=heavy_compute) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

# РЕЗУЛЬТАТ: ускорения почти нет. Потоки честно созданы, но GIL пропускает
# к процессору по одному. Четыре потока просто передают друг другу очередь.


# А ВОТ ЗДЕСЬ GIL НЕ МЕШАЕТ ВООБЩЕ.
# Когда поток ЖДЁТ (сеть, диск, база) — он отпускает блокировку.
import requests

def download(url):
    return requests.get(url).text        # ← на время ожидания GIL отпущен

# Четыре потока скачают четыре страницы почти одновременно. Ускорение реальное.


# ЗНАКОМО? Это ровно та же граница, что и в Node на прошлой странице:
#   ЖДЁМ    → параллельность работает
#   СЧИТАЕМ → упираемся в один поток
# Разные языки, разные механизмы, вывод для веб-приложения одинаковый.`;

  protected readonly gilWorkaround = `# ЧТО ДЕЛАТЬ, ЕСЛИ СЧИТАТЬ ВСЁ-ТАКИ НАДО. Три пути.

# ПУТЬ 1: несколько ПРОЦЕССОВ вместо потоков.
# У каждого процесса свой интерпретатор и свой GIL — они не мешают друг другу.
from multiprocessing import Pool

def process_chunk(chunk):
    return sum_numbers(chunk)

if __name__ == "__main__":
    with Pool(4) as pool:                    # четыре независимых процесса
        results = pool.map(process_chunk, chunks)
# Ускорение настоящее. Плата: процессы не делят память,
# данные между ними надо пересылать, и это не бесплатно.


# ПУТЬ 2: считать не на Python.
# Библиотеки для чисел написаны на C и внутри GIL отпускают.
import numpy as np

data = np.random.rand(10_000_000)
mean = data.mean()        # это выполняется на C, быстро и в несколько ядер

# ЭТО САМЫЙ ВАЖНЫЙ ПУНКТ ДЛЯ ПОНИМАНИЯ РЕПУТАЦИИ PYTHON.
# «Python медленный» — правда про сам язык и неправда про то, как его применяют.
# В машинном обучении Python — это ПУЛЬТ УПРАВЛЕНИЯ: вы пишете три строчки,
# а считает высокооптимизированный код на C и видеокарта.


# ПУТЬ 3: вынести тяжёлое из запроса в фоновую задачу.
# Ровно тот же приём, что и в Node: очередь плюс отдельный работник.
from celery import Celery

celery_app = Celery("tasks", broker="redis://localhost:6379")

@celery_app.task
def build_report(month):
    # Выполняется в отдельном процессе, пользователь не ждёт.
    ...

# В обработчике запроса просто ставим задачу в очередь и сразу отвечаем:
build_report.delay("2026-08")`;

  protected readonly syncAsync = `# В Python ДВА МИРА веб-разработки, и путать их — источник боли.

# МИР ПЕРВЫЙ: СИНХРОННЫЙ. Так работают Django (традиционно) и Flask.
# Каждый запрос занимает отдельный поток или процесс, и тот ЖДЁТ базу целиком.
def order_list(request):
    orders = Order.objects.filter(user=request.user)   # поток стоит и ждёт
    return render(request, "orders.html", {"orders": orders})

# Чтобы обслуживать сто одновременных пользователей, нужно сто «рабочих».
# Каждый рабочий занимает память. Отсюда настройка сервера:
#   gunicorn app:wsgi --workers 4 --threads 2


# МИР ВТОРОЙ: АСИНХРОННЫЙ. Так работают FastAPI и современный Django.
# Устроен ровно как Node: пока ждём, поток свободен.
async def order_list(user_id: int):
    orders = await db.find_orders(user_id)   # ждём, поток свободен
    return orders

# Тысяча одновременных ожиданий — и всего один рабочий процесс.
#   uvicorn app:app --workers 4


# ЛОВУШКА, НА КОТОРОЙ ОБЖИГАЮТСЯ ВСЕ. Смешивать миры нельзя.
async def bad():
    # requests — СИНХРОННАЯ библиотека. Внутри async-функции она
    # заблокирует весь цикл событий, и асинхронность превратится в тыкву.
    response = requests.get("https://api.example.com")     # ← беда
    return response.json()

async def good():
    # httpx — асинхронная. Она умеет отпускать поток на время ожидания.
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")
        return response.json()

# ПРАВИЛО: выбрав асинхронный каркас, следите, чтобы ВСЕ библиотеки,
# которые ходят в сеть или в базу, тоже были асинхронными.`;

  protected readonly ormExample = `# ORM — способ работать с базой через объекты языка вместо строк SQL.
# В Python это одна из самых сильных сторон экосистемы.

# ВМЕСТО ЭТОГО:
#   SELECT * FROM products WHERE price < 1000 ORDER BY created_at DESC LIMIT 10;

# ПИШУТ ЭТО (Django ORM):
cheap = Product.objects.filter(price__lt=1000).order_by("-created_at")[:10]

# ИЛИ ЭТО (SQLAlchemy — вторая популярная библиотека):
cheap = session.query(Product).filter(Product.price < 1000).order_by(Product.created_at.desc()).limit(10)


# ЗАЧЕМ. Три причины, и все практические:
# 1. Опечатку в имени поля заметит редактор, а не пользователь.
# 2. ORM сама экранирует значения — то есть закрывает целый класс атак,
#    когда в поле поиска пишут не текст, а кусок SQL-команды.
# 3. Один и тот же код работает с PostgreSQL, MySQL и SQLite.


# САМАЯ ЧАСТАЯ ОШИБКА ПРОИЗВОДИТЕЛЬНОСТИ В МИРЕ ORM — «N + 1».
# Выглядит невинно:
for order in Order.objects.all():        # 1 запрос: взяли 100 заказов
    print(order.user.name)                # + 100 запросов: по одному на каждого!

# Итого 101 поход в базу вместо одного. Страница отдаётся четыре секунды.
# Лечение — одна строка, которая говорит «забери связанные данные сразу»:
for order in Order.objects.select_related("user"):
    print(order.user.name)                # теперь 1 запрос на всё

# Эту ошибку делают на всех языках и во всех ORM. Она стоит первым пунктом
# в списке причин медленных страниц — и это самая дешёвая победа в оптимизации.`;

  protected readonly whereStrong = `# Настоящая суперсила Python — не веб. Это то, что рядом с вебом.

# 1. ДАННЫЕ И АНАЛИТИКА
import pandas as pd

orders = pd.read_csv("orders.csv")
by_month = orders.groupby("month")["total"].sum()
# Три строки вместо ста. На других языках такого удобства просто нет.

# 2. МАШИННОЕ ОБУЧЕНИЕ — здесь Python не «один из», а фактически единственный
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier()
model.fit(features, labels)
prediction = model.predict(new_data)

# 3. РАБОТА С ИИ-МОДЕЛЯМИ — все официальные библиотеки выходят сначала здесь
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Сделай выжимку из отзывов"}],
)

# 4. АВТОМАТИЗАЦИЯ И СКРИПТЫ — разобрать выгрузку, переименовать тысячу файлов,
#    сходить в три API и свести результат. Python здесь язык по умолчанию.

# ВЫВОД: если в проекте есть аналитика, отчёты, рекомендации или ИИ —
# Python на бэкенде перестаёт быть «одним из вариантов»
# и становится способом не держать в компании два разных языка.`;

  protected readonly deployment = `# Как Python-приложение запускают в бою. Здесь есть неочевидная деталь.

# Сам по себе Flask или Django НЕ ПРЕДНАЗНАЧЕНЫ для боевой работы.
# Команда python manage.py runserver — это сервер ДЛЯ РАЗРАБОТКИ,
# он однопоточный, медленный и небезопасный. В бою его не используют.

# Вместо него ставят отдельный сервер приложений:

# Для синхронных (Django, Flask):
gunicorn myapp.wsgi:application --workers 4 --bind 0.0.0.0:8000

# Для асинхронных (FastAPI, современный Django):
uvicorn myapp.main:app --workers 4 --host 0.0.0.0 --port 8000

# ЧТО ЗНАЧАТ WORKERS. Это количество процессов-копий вашего приложения.
# Помните GIL? Один процесс = один GIL = одно ядро.
# Четыре процесса используют четыре ядра. Обычный ориентир —
# по числу ядер процессора, иногда чуть больше.

# ЗАВИСИМОСТИ. Долгое время это была больная тема Python.
# Классический способ:
pip install -r requirements.txt

# Современный и гораздо более быстрый:
uv pip install -r requirements.txt

# ВИРТУАЛЬНОЕ ОКРУЖЕНИЕ — обязательная привычка.
# Без него пакеты ставятся в систему и проекты конфликтуют версиями.
python -m venv .venv
source .venv/bin/activate     # на Windows: .venv\\Scripts\\activate
# Это примерный аналог node_modules: своя папка пакетов у каждого проекта.`;
}
