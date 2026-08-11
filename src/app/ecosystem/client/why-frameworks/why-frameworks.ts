import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-why-frameworks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './why-frameworks.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientWhyFrameworks {
  protected readonly counterHtml = `<!-- Вся разметка счётчика. Три строки, никаких инструментов.
     Файл можно открыть двойным щелчком прямо из папки — он заработает. -->
<p>Нажатий: <span id="value">0</span></p>
<button id="plus">Добавить</button>
<script src="counter.js"></script>`;

  protected readonly counterVanilla = `// counter.js — счётчик на чистом JavaScript, без единой библиотеки.

// 1. Находим на странице два нужных элемента по их id.
//    document — это объект, через который браузер даёт доступ к странице.
const valueEl = document.getElementById('value');
const button = document.getElementById('plus');

// 2. Заводим переменную — здесь живёт наше единственное «состояние».
//    Состояние — это данные, которые меняются со временем.
let count = 0;

// 3. Просим браузер: когда по кнопке кликнут — выполни эту функцию.
button.addEventListener('click', () => {
  count = count + 1;           // поменяли данные в памяти
  valueEl.textContent = count; // и отдельной строкой поменяли экран
});

// Обратите внимание на две последние строки: их ДВЕ, а не одна.
// Сначала мы правим данные, потом отдельно правим то, что видно.
// Пока место всего одно — это совершенно не мешает жить.`;

  protected readonly todoVanilla = `// Список дел на чистом JavaScript.
// Разметка на странице уже есть, в ней элементы с такими id:
//   form (форма), input (поле ввода), list (ul для дел),
//   counter (надпись «Осталось: N»), empty (надпись «Пока пусто»),
//   clearDone (кнопка «Очистить выполненные»).

// ЕДИНСТВЕННЫЙ источник правды — вот этот массив.
// Беда в том, что браузер про него ничего не знает: на экране
// живёт вторая, независимая копия тех же данных — в виде HTML-узлов.
const todos = [];

const form = document.getElementById('form');
const input = document.getElementById('input');
const list = document.getElementById('list');
const counterEl = document.getElementById('counter');
const emptyEl = document.getElementById('empty');
const clearBtn = document.getElementById('clearDone');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // иначе браузер перезагрузит страницу
  const text = input.value.trim();
  if (!text) return;

  // --- ШАГ 1: меняем данные ---
  const todo = { id: Date.now(), text, done: false };
  todos.push(todo);

  // --- ШАГ 2: руками строим кусок экрана ---
  // Здесь мы ВТОРОЙ раз описываем то, что уже описано в данных.
  const row = document.createElement('li');
  row.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    todo.done = checkbox.checked;            // данные
    row.classList.toggle('done', todo.done); // экран
    updateCounter();                         // и ещё одно место
    updateEmpty();                           // и ещё одно
    updateClearButton();                     // и ещё одно
  });

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'x';
  removeBtn.addEventListener('click', () => {
    todos.splice(todos.indexOf(todo), 1); // убрали из данных
    row.remove();                         // убрали с экрана
    updateCounter();                      // и снова те же три вызова
    updateEmpty();
    updateClearButton();
  });

  row.append(checkbox, document.createTextNode(text), removeBtn);
  list.append(row);

  input.value = '';
  updateCounter(); // и здесь тоже нельзя забыть
  updateEmpty();
  updateClearButton();
});

// Три функции, которые чинят три разных места на экране.
function updateCounter() {
  const left = todos.filter((t) => !t.done).length;
  counterEl.textContent = 'Осталось: ' + left;
}

function updateEmpty() {
  emptyEl.hidden = todos.length > 0;
}

function updateClearButton() {
  clearBtn.disabled = todos.every((t) => !t.done);
}

// Посчитайте, сколько раз в этом файле повторяется одна и та же
// тройка вызовов. Три раза. И это ещё БЕЗ фильтра.`;

  protected readonly todoVanillaFilter = `// Заказчик попросил добавить фильтр: «все / активные / выполненные».
// Одна строчка в задании — а вот что она делает с кодом.

let filter = 'all';

// 1. Нужна новая функция: пробежать по всем строкам на экране
//    и решить, показывать каждую или прятать.
function applyFilter() {
  for (const row of list.children) {
    const todo = todos.find((t) => t.id === Number(row.dataset.id));
    const visible =
      filter === 'all' ||
      (filter === 'active' && !todo.done) ||
      (filter === 'done' && todo.done);
    row.hidden = !visible;
  }
}

// 2. Теперь КАЖДЫЙ обработчик, который был написан раньше,
//    обязан дополнительно звать применитьФильтр().
//    Добавили дело — позвать. Сняли галочку — позвать.
//    Удалили — позвать. Переключили фильтр — позвать.
//    Забыли позвать хотя бы в одном месте — на экране ложь.

// 3. И функция обновитьПусто() тоже сломалась: раньше «пусто»
//    значило «дел нет вообще», а теперь ещё и «дел нет в этом
//    фильтре». Это два разных сообщения для пользователя.
function updateEmpty() {
  const anyVisible = todos.some((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });
  emptyEl.hidden = anyVisible;
}

// Итог: одна маленькая функция добавила обязанность
// в четыре уже написанных места. Следующая мелочь добавит в пять.`;

  protected readonly naiveRerender = `// «А давайте не мучиться и просто перерисовывать ВСЁ при каждом изменении!»
// Идея абсолютно правильная — именно её и реализует фреймворк.

function render() {
  list.innerHTML = ''; // стёрли всё содержимое списка
  for (const todo of visibleTodos()) {
    list.append(createRow(todo)); // и построили заново
  }
  updateCounter();
  updateEmpty();
  updateClearButton();
}

// Теперь любой обработчик становится в две строки:
// поменял данные -> позвал перерисовать(). Всё согласовано всегда.

// НО в лоб эта идея разбивается о браузер:
// - если внутри списка было поле ввода, оно теряет фокус
//   на КАЖДОЙ набранной букве — печатать невозможно;
// - выделенный мышью текст сбрасывается;
// - анимации начинаются с нуля;
// - позиция прокрутки прыгает наверх;
// - на списке в тысячу строк браузер заметно задумывается.

// Фреймворк решает ровно эту задачу: снаружи выглядит так,
// будто он перерисовал всё, а внутри он сравнивает «как было»
// и «как должно стать» и трогает только то, что реально изменилось.`;

  protected readonly todoReact = `// Тот же самый список дел — со всеми теми же требованиями — на React.
// Читайте медленно: здесь нет ни одного createElement и ни одного
// ручного обновления экрана. Вообще ни одного.

import { useState } from 'react';

export function TodoApp() {
  // Состояние. useState говорит React: «следи за этой переменной,
  // и если она изменится — перерисуй то, что от неё зависит».
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');

  // Всё производное считается ЗДЕСЬ И СЕЙЧАС из состояния.
  // Это не «обновляется» — это просто вычисляется заново каждый раз.
  const visible = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
    return true;
  });
  const left = todos.filter((todo) => !todo.done).length;

  function add(event) {
    event.preventDefault();
    if (!text.trim()) return;
    // Меняем ТОЛЬКО данные. Про экран здесь не сказано ни слова.
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setText('');
  }

  function toggle(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // А это — ОПИСАНИЕ экрана. Не инструкция «сделай», а картина
  // «вот как должно выглядеть при таких данных».
  return (
    <div>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button>Добавить</button>
      </form>

      <ul>
        {visible.map((todo) => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => remove(todo.id)}>x</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>Пока emptyEl</p>}

      <p>Осталось: {left}</p>

      <button onClick={() => setFilter('all')}>Все</button>
      <button onClick={() => setFilter('active')}>Активные</button>
      <button onClick={() => setFilter('done')}>Выполненные</button>

      <button
        disabled={todos.every((t) => !t.done)}
        onClick={() => setTodos(todos.filter((t) => !t.done))}
      >
        Очистить выполненные
      </button>
    </div>
  );
}

// Найдите здесь место, где надо «не забыть обновить счётчик».
// Его нет. Счётчик — это выражение {left}, оно пересчитывается само,
// потому что зависит от todos. Забыть невозможно в принципе.`;

  protected readonly componentIdea = `// Компонент — это кусочек интерфейса вместе с его разметкой и поведением,
// упакованный под одним именем. Дальше его используют как обычный тег.

function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li className={todo.done ? 'done' : ''}>
      <input type="checkbox" checked={todo.done} onChange={onToggle} />
      <span>{todo.text}</span>
      <button onClick={onRemove}>x</button>
    </li>
  );
}

// Используем в любом месте приложения — хоть в списке дел,
// хоть в архиве, хоть на странице поиска:
<TodoItem
  todo={todo}
  onToggle={() => toggle(todo.id)}
  onRemove={() => remove(todo.id)}
/>;

// Зачем это нужно на практике:
// 1. Правку («добавим дату рядом с делом») делаем в ОДНОМ файле,
//    и она появляется во всех трёх местах сразу.
// 2. Файл на 20 строк можно целиком удержать в голове.
// 3. Новый человек в команде ищет ошибку в карточке дела
//    и сразу знает, где смотреть: в файле TodoItem.`;

  protected readonly vanillaFormEnough = `// Форма обратной связи на лендинге: имя, телефон, кнопка «Отправить».
// Здесь фреймворк — из пушки по воробьям. Вот всё, что нужно.

const form = document.querySelector('#contact');
const button = form.querySelector('button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // FormData — встроенная в браузер вещь: сама собирает все поля формы.
  // Никакой библиотеки для этого не требуется.
  const formData = new FormData(form);

  button.disabled = true; // чтобы не отправили дважды подряд

  try {
    await fetch('/api/contact', { method: 'POST', body: formData });
    form.hidden = true;
    document.querySelector('#thanks').hidden = false;
  } catch {
    document.querySelector('#error').hidden = false;
    button.disabled = false;
  }
});

// Пятнадцать строк, ноль зависимостей, ноль сборки, мгновенная загрузка.
// Тащить сюда фреймворк — значит заставить посетителя скачать
// сотни килобайт кода ради одной кнопки.`;

  protected readonly lightAlternatives = `<!-- Между «голая ваниль» и «полноценный фреймворк» есть середина. -->

<!-- Alpine.js: крошечная библиотека, поведение пишется прямо в разметке.
     Подключается одним тегом script — ничего собирать не нужно. -->
<div x-data="{ open: false }">
  <button @click="open = !open">Показать подробности</button>
  <p x-show="open">Вот подробности.</p>
</div>

<!-- htmx: по клику библиотека сама сходит на сервер и вставит
     присланный кусок HTML в указанное место. JavaScript вы почти
     не пишете, а вся логика остаётся на сервере. -->
<button hx-get="/api/details" hx-target="#details">Показать подробности</button>
<div id="details"></div>

<!-- Веб-компоненты: свой собственный тег, встроенный прямо в браузер.
     Работает без единой библиотеки — это часть стандарта. -->
<script>
  class HelloBox extends HTMLElement {
    connectedCallback() {
      this.textContent = 'Привет, ' + this.getAttribute('name');
    }
  }
  customElements.define('hello-box', HelloBox);
</script>
<hello-box name="Аня"></hello-box>`;
}
