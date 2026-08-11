import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-testing',
  imports: [CodeBlock, RouterLink],
  templateUrl: './testing.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientTesting {
  protected readonly formatPriceFn = `// Файл format-price.js
// Обычная функция без всякой магии. Она умеет ровно одно:
// превратить цену в копейках в строку, которую видит покупатель.
// Такие функции — самая благодарная цель для тестов:
// у них нет ни экрана, ни сети, ни базы — только вход и выход.

export function formatPrice(kopecks) {
  // Отдельно ловим ерунду на входе. Если этого не сделать,
  // ошибка вылезет где-то далеко и в непонятном виде.
  if (typeof kopecks !== 'number' || Number.isNaN(kopecks)) {
    throw new Error('Цена должна быть числом');
  }

  const rubles = Math.floor(kopecks / 100);

  // padStart дописывает ноль слева: 5 копеек должны стать «05», а не «5».
  // Именно на этой строчке чаще всего и ошибаются — её мы проверим тестом.
  const kopeckPart = String(kopecks % 100).padStart(2, '0');

  return \`\${rubles},\${kopeckPart} ₽\`;
}`;

  protected readonly formatPriceTest = `// Файл format-price.test.js
// Имя с «.test.» — не украшение: по нему запускалка находит файлы с тестами.

import { describe, it, expect } from 'vitest';
import { formatPrice } from './format-price.js';

// describe — «папка» для тестов. Она ничего не проверяет,
// а только группирует, чтобы в отчёте было видно, о чём идёт речь.
describe('formatPrice', () => {
  // it — один тест. Название пишут так, чтобы оно читалось предложением:
  // «formatPrice показывает рубли и копейки». Это название вы увидите
  // в терминале в момент падения, и от него зависит, поймёте ли вы, что сломалось.
  it('показывает рубли и копейки', () => {
    // expect(что получилось).toBe(что ожидали)
    // Если два значения не совпадут — тест упадёт и покажет оба.
    expect(formatPrice(149900)).toBe('1499,00 ₽');
  });

  it('дописывает ноль, если копеек меньше десяти', () => {
    expect(formatPrice(1005)).toBe('10,05 ₽');
  });

  // Проверять надо не только «когда всё хорошо».
  // Тут мы передаём в expect не результат, а СТРЕЛОЧНУЮ ФУНКЦИЮ:
  // иначе ошибка вылетела бы до того, как expect успел что-то поймать.
  it('ругается, если передали не число', () => {
    expect(() => formatPrice('сто рублей')).toThrow('Цена должна быть числом');
  });
});`;

  protected readonly terminalGreen = `$ npx vitest run

 ✓ src/format-price.test.js (3 tests) 4ms
   ✓ formatPrice > показывает рубли и копейки
   ✓ formatPrice > дописывает ноль, если копеек меньше десяти
   ✓ formatPrice > ругается, если передали не число

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Duration  412ms

# Зелёные галочки означают ровно одно: описанное поведение сохранилось.
# Три проверки заняли четыре миллисекунды — руками так не получится.`;

  protected readonly terminalRed = `$ npx vitest run

 ❯ src/format-price.test.js (3 tests | 1 failed) 6ms
   ✓ formatPrice > показывает рубли и копейки
   × formatPrice > дописывает ноль, если копеек меньше десяти
   ✓ formatPrice > ругается, если передали не число

 FAIL  src/format-price.test.js > formatPrice > дописывает ноль

 AssertionError: expected '10,5 ₽' to be '10,05 ₽'

 - Ожидали:  "10,05 ₽"
 + Получили: "10,5 ₽"

   at src/format-price.test.js:16:38

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)

# Красный вывод — это подробный отчёт, а не ругань.
# В нём сразу три вещи: КАКОЕ поведение сломалось (название теста),
# ЧЕМ отличается результат (две строки со знаками − и +)
# и ГДЕ смотреть (файл и номер строки).`;

  protected readonly componentTestBad = `// ❌ ПЛОХОЙ ТЕСТ формы входа: проверяет устройство, а не поведение.

import { test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { store } from '../store';
import { LoginForm } from './LoginForm';

test('форма входа', () => {
  const { container } = render(<LoginForm />);

  // Беда №1: элементы найдены по CSS-классам, то есть по деталям вёрстки.
  // Дизайнер переименует класс — тест упадёт, хотя форма работает прекрасно.
  const email = container.querySelector('.login-form__input--email');
  const button = container.querySelector('.btn.btn--primary');

  fireEvent.change(email, { target: { value: 'anna@example.com' } });
  fireEvent.click(button);

  // Беда №2: проверяем внутреннее поле хранилища состояния.
  // Пользователь его не видит. Завтра это поле переименуют при рефакторинге —
  // тест снова упадёт на ровном месте.
  expect(store.getState().auth.status).toBe('pending');
});

// Итог: тест кричит при каждой безобидной перестановке кода
// и при этом МОЛЧИТ, если кнопка перестала работать для человека —
// например, если она стала невидимой или перекрыта другим элементом.
// Такие тесты быстро начинают ненавидеть и удаляют всей папкой.`;

  protected readonly componentTestGood = `// ✅ ХОРОШИЙ ТЕСТ той же формы: описывает то, что видит и делает человек.

import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('без пароля показывает понятную ошибку и не отправляет форму', async () => {
  const onSubmit = vi.fn(); // подставная функция: запомнит, вызывали ли её
  render(<LoginForm onSubmit={onSubmit} />);

  // Ищем поле по видимой подписи, а кнопку — по роли и надписи.
  // Ровно так же их находит и живой человек, и программа чтения с экрана.
  await userEvent.type(screen.getByLabelText('Электронная почта'), 'anna@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

  // Проверяем ПОСЛЕДСТВИЯ, видимые на экране.
  expect(await screen.findByText('Введите пароль')).toBeVisible();
  // И то, что наружу ничего не ушло.
  expect(onSubmit).not.toHaveBeenCalled();
});

// Этот тест переживёт смену классов, переезд на другую библиотеку кнопок
// и переписывание внутреннего состояния — потому что он не знает
// НИЧЕГО о внутренностях. Он знает только про подпись поля,
// надпись на кнопке и текст ошибки. То есть про договор с пользователем.`;

  protected readonly mockTimeExample = `// Подделываем то, что нельзя предсказать: текущее время.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { greeting } from './greeting.js';

describe('greeting', () => {
  afterEach(() => {
    // ОБЯЗАТЕЛЬНО вернуть настоящие часы после теста,
    // иначе следующие тесты будут жить в подделанном времени
    // и падать по причинам, которые вы будете искать полдня.
    vi.useRealTimers();
  });

  it('утром здоровается по-утреннему', () => {
    vi.useFakeTimers();                                  // подменяем часы
    vi.setSystemTime(new Date('2026-03-14T08:00:00'));   // ставим 8 утра
    expect(greeting()).toBe('Доброе утро');
  });

  it('вечером здоровается по-вечернему', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-14T21:30:00'));
    expect(greeting()).toBe('Добрый вечер');
  });
});

// Без подмены такой тест был бы невозможен: он проходил бы только утром.
// Ровно та же история со случайными числами, генерацией идентификаторов
// и отправкой писем: в тесте они должны быть предсказуемыми и безобидными.`;

  protected readonly mswExample = `// MSW перехватывает сам сетевой запрос — код приложения остаётся нетронутым.
// Ваш компонент искренне вызывает fetch('/api/orders') и не подозревает,
// что на том конце не сервер, а описанное здесь правило.

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrdersPage } from './OrdersPage';

const server = setupServer(
  http.get('/api/orders', () => {
    return HttpResponse.json([
      { id: 1, total: 149900, status: 'paid' },
      { id: 2, total: 32000, status: 'shipping' },
    ]);
  }),
);

beforeAll(() => server.listen());   // включили перехват
afterEach(() => server.resetHandlers()); // вернули правила по умолчанию
afterAll(() => server.close());     // выключили

test('показывает список заказов', async () => {
  render(<OrdersPage />);
  expect(await screen.findByText('1499,00 ₽')).toBeVisible();
});

test('при ошибке сервера показывает сообщение, а не пустой экран', async () => {
  // Прямо внутри теста подменяем правило на «сервер сломался».
  // Проверить это на живом сервере вы бы просто не смогли.
  server.use(
    http.get('/api/orders', () => new HttpResponse(null, { status: 500 })),
  );

  render(<OrdersPage />);
  expect(await screen.findByText('Не удалось загрузить заказы')).toBeVisible();
});`;

  protected readonly e2eExample = `// Сквозной тест на Playwright: настоящий браузер, настоящий сервер.
// Никаких подделок — приложение собрано и запущено целиком.

import { test, expect } from '@playwright/test';

test('покупатель оформляет заказ', async ({ page }) => {
  // 1. Входим в аккаунт
  await page.goto('/login');
  await page.getByLabel('Электронная почта').fill('anna@example.com');
  await page.getByLabel('Пароль').fill('test-password-123');
  await page.getByRole('button', { name: 'Войти' }).click();

  // 2. Кладём товар в корзину
  await page.goto('/product/42');
  await page.getByRole('button', { name: 'В корзину' }).click();

  // 3. Оформляем
  await page.getByRole('link', { name: 'Корзина' }).click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  // 4. Проверяем результат так, как его увидит человек.
  // expect у Playwright сам ждёт появления элемента несколько секунд —
  // поэтому здесь НЕ НАДО писать «подожди две секунды».
  // Ожидание по условию вместо ожидания по таймеру —
  // главное лекарство от «мигающих» тестов.
  await expect(page.getByText('Заказ оформлен')).toBeVisible();
  await expect(page).toHaveURL(/\\/orders\\/\\d+/);
});

// Один такой тест проверяет разом: сборку, вёрстку, сеть, сервер,
// базу данных и права доступа. Ни один юнит-тест на это не способен.
// Цена: он идёт секунды или десятки секунд, а не миллисекунды.`;

  protected readonly coverageTrap = `// Функция скидки. В ней спрятана настоящая ошибка.
export function applyDiscount(price, percent) {
  return price - (price * percent) / 100;
}

// Тест, который её НЕ находит:
test('скидка 10 процентов уменьшает цену', () => {
  expect(applyDiscount(1000, 10)).toBe(900);
});

// Отчёт о покрытии скажет: 100% строк, 100% ветвлений. Идеально!
// А теперь передайте percent = 150 (например, из-за опечатки в админке):
//   applyDiscount(1000, 150) === -500
// Магазин доплатит покупателю пятьсот рублей за покупку.
//
// Единственная строка функции была выполнена тестом — значит, покрыта.
// Но проверили мы её ровно на одном значении из бесконечности возможных.
// Покрытие считает, СКОЛЬКО кода запустилось,
// и ничего не знает о том, НАСКОЛЬКО придирчиво его проверили.`;

  protected readonly testScripts = `{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "coverage": "vitest run --coverage",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}`;

  protected readonly regressionTest = `// Из поддержки пришла жалоба:
// «промокод SALE20 не применяется, если в корзине ровно один товар».
//
// ШАГ 1. Пишем тест, который ПАДАЕТ. Это и есть доказательство,
// что вы поняли жалобу правильно, а не чинили что-то соседнее.
test('SALE20 действует и для корзины из одного товара', () => {
  const cart = [{ id: 42, price: 100000, qty: 1 }];
  expect(applyPromo(cart, 'SALE20').total).toBe(80000);
});
// → красный: expected 100000 to be 80000. Отлично, баг воспроизведён.

// ШАГ 2. Чиним код, пока тест не станет зелёным.

// ШАГ 3. Оставляем тест в проекте навсегда.
// Теперь этот баг физически не может вернуться незамеченным —
// а это происходит чаще, чем кажется: кто-нибудь через год
// «упростит» условие и вернёт всё как было.`;
}
