import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-ecosystem-client-frameworks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './frameworks.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class EcosystemClientFrameworks {
  protected readonly componentIdea = `// Это не код какого-то конкретного фреймворка — это ИДЕЯ,
// одинаковая во всех четырёх. Компонент — это три вещи, собранные вместе.

component ProductCard(props) {
  // 1. ВХОД (по-английски props, по-русски говорят «пропсы») —
  //    данные, которые дал родитель. Менять их изнутри нельзя:
  //    они не ваши, вы их только показываете.
  //    props.name, props.price

  // 2. ПАМЯТЬ (состояние) — то, что компонент помнит сам о себе.
  //    Родитель может об этом вообще не знать.
  state cartCount = 0;

  // 3. ОПИСАНИЕ КАРТИНКИ — что должно быть на экране ПРЯМО СЕЙЧАС,
  //    при текущих значениях входа и памяти.
  render(
    heading(props.name),
    button('В корзину', onClick: () => cartCount = cartCount + 1),
    text('В корзине: ' + cartCount),
  );
}

// Главный фокус спрятан в пункте 3. Вы описываете, КАК ДОЛЖНО ВЫГЛЯДЕТЬ
// при таких-то данных, а не КАК ЭТО ПЕРЕРИСОВАТЬ после клика.
// Перерисовку берёт на себя фреймворк. Именно за это его и терпят.`;

  protected readonly dataDownEventsUp = `// «Данные вниз, события вверх» — на примере React.
// В трёх остальных это выглядит иначе на вид, но работает точно так же.

// РОДИТЕЛЬ. Здесь живёт состояние корзины: оно нужно сразу нескольким детям,
// значит, хранить его в одном ребёнке нельзя — остальные его не увидят.
function ProductPage() {
  const [cart, setCart] = useState([]);

  return (
    <div>
      {/* вниз отдаём данные, вверх ждём сообщение о событии */}
      <ProductCard
        product={mug}
        onAdd={(item) => setCart([...cart, item])}
      />
      <p>Товаров в корзине: {cart.length}</p>
    </div>
  );
}

// РЕБЁНОК. Он НЕ знает, что такое корзина, и не умеет её менять.
// Его дело — показать товар и крикнуть наверх: «нажали кнопку, вот товар».
function ProductCard({ product, onAdd }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAdd(product)}>В корзину</button>
    </div>
  );
}

// Почему так, а не «ребёнок сам лезет в корзину родителя»:
// когда одно и то же состояние меняют из десяти разных мест,
// найти виновника поломки становится почти невозможно.
// Один владелец данных — одно место, куда идти разбираться.`;

  protected readonly counterReact = `// React. Файл ProductCard.jsx — это обычный JavaScript, в котором
// разрешили писать разметку прямо посреди кода. Такая запись зовётся JSX.
import { useState } from 'react';

function ProductCard({ product }) {
  // product — вход компонента (пропс), пришёл снаружи, менять его нельзя.

  // count — собственное состояние. useState возвращает ПАРУ:
  // текущее значение и функцию, которой это значение положено менять.
  const [count, setCount] = useState(0);

  function add() {
    // Не count++ и не count = count + 1: React должен УЗНАТЬ об изменении.
    // Меняем только через setCount — иначе экран просто не перерисуется.
    setCount(count + 1);
  }

  return (
    <div className="card">
      <h3>{product.name}</h3>
      {/* onClick — похоже на атрибут, но значение здесь — настоящая функция */}
      <button onClick={add}>В корзину</button>
      <p>В корзине: {count}</p>
    </div>
  );
}

export default ProductCard;`;

  protected readonly counterVue = `<!-- Vue. Один файл .vue: сверху логика, ниже разметка, внизу стили.
     Такой файл называют однофайловым компонентом (SFC). -->
<script setup>
import { ref } from 'vue';

// Вход компонента — то, что приходит снаружи.
const props = defineProps({ product: Object });

// Собственное состояние. ref — это «коробка со значением».
// В скрипте до содержимого добираются через .value,
// а в разметке Vue разворачивает коробку сам.
const count = ref(0);

function add() {
  count.value += 1;
}
</script>

<template>
  <div class="card">
    <h3>{{ props.product.name }}</h3>
    <!-- @click — короткая запись для v-on:click, «подписаться на клик» -->
    <button @click="add">В корзину</button>
    <p>В корзине: {{ count }}</p>
  </div>
</template>

<style scoped>
/* scoped значит «эти стили не вылезут за пределы компонента»:
   класс .card из соседнего файла ничего здесь не испортит */
.card { border: 1px solid #44475a; }
</style>`;

  protected readonly counterAngular = `// Angular. Разметка живёт в поле template (в настоящем проекте её
// чаще выносят в отдельный файл .html рядом с компонентом).
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: \`
    <div class="card">
      <h3>{{ product().name }}</h3>
      <!-- (click) — так Angular подписывается на событие -->
      <button (click)="add()">В корзину</button>
      <p>В корзине: {{ count() }}</p>
    </div>
  \`,
  styles: \`.card { border: 1px solid #44475a; }\`,
})
export class ProductCard {
  // Вход компонента. required значит «без него компонент не имеет смысла»,
  // и TypeScript проверит это ещё до запуска.
  readonly product = input.required<Product>();

  // Собственное состояние. signal — «коробка со значением», которая
  // сама сообщает шаблону, что содержимое изменилось.
  readonly count = signal(0);

  add() {
    this.count.update((n) => n + 1);
  }
}

// Обратите внимание: product и count читаются как функции — product(),
// count(). Это не опечатка: у сигнала значение достают вызовом.`;

  protected readonly counterSvelte = `<!-- Svelte. Тоже один файл: .svelte -->
<script>
  // $props() — данные снаружи, $state() — собственное состояние.
  // Эти значки с долларом в Svelte называют «рунами» (runes).
  let { product } = $props();
  let count = $state(0);
</script>

<div class="card">
  <h3>{product.name}</h3>
  <!-- обычный onclick, ровно как в чистом HTML -->
  <button onclick={() => count += 1}>В корзину</button>
  <p>В корзине: {count}</p>
</div>

<style>
  /* стили и без всяких пометок действуют только внутри этого компонента */
  .card { border: 1px solid #44475a; }
</style>`;

  protected readonly setupCompare = `# React. Стартовый шаблон даёт вам только сам React —
# и дальше вы принимаете десяток решений подряд, ещё не написав
# ни строчки полезного кода.
npm create vite@latest my-shop -- --template react

npm install react-router                   # чем переключать страницы?
npm install @tanstack/react-query          # чем ходить на сервер?
npm install zustand                        # где держать общее состояние?
npm install vitest @testing-library/react  # чем тестировать?
# ...а ещё стили, формы, иконки, линтер, формат дат


# Angular. Одна команда — и маршрутизация, работа с сетью, формы,
# тесты, структура папок и правила именования уже внутри.
# Выбирать почти не из чего, и в этом весь смысл.
npm install -g @angular/cli
ng new my-shop`;

  protected readonly vuePinia = `// Vue: официальное хранилище общего состояния называется Pinia.
// «Официальное» значит, что его делает та же команда, что и сам Vue,
// а в документации Vue прямо написано: берите это. Спорить не о чем.
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  // Производное значение: пересчитается САМО, когда изменится items.
  // Вам не нужно помнить, что после каждого add надо обновить сумму.
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0));

  function add(product) {
    items.value.push(product);
  }

  return { items, total, add };
});

// В любом компоненте достаточно двух строк:
// const cart = useCartStore();
// cart.add(product);`;

  protected readonly angularService = `// Angular: «внедрение зависимостей» (dependency injection).
// Название пугает, а смысл бытовой: компоненту не надо самому
// создавать себе помощников — он просит их по имени, а фреймворк
// приносит готовый экземпляр. Как розетка в стене: вы не строите
// электростанцию, вы просто втыкаете вилку.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' }) // «этот сервис — один на всё приложение»
export class CartService {
  // HttpClient — встроенный в Angular способ ходить на сервер.
  // Его не нужно ставить отдельной библиотекой: он уже в комплекте.
  private readonly http = inject(HttpClient);

  readonly items = signal<Product[]>([]);

  add(product: Product) {
    this.items.update((list) => [...list, product]);
    this.http.post('/api/cart', { id: product.id }).subscribe();
  }
}

// А в компоненте — одна строка, и корзина у вас в руках:
// private readonly cart = inject(CartService);
//
// Плюс: в тестах сервис легко подменить на поддельный.
// Минус: ещё одно понятие, которое надо понять ДО первой строки кода.`;

  protected readonly svelteCompiled = `// Что делает компилятор Svelte. Очень упрощённо: он читает ваш
// .svelte-файл ещё НА ВАШЕМ КОМПЬЮТЕРЕ, во время сборки, и выдаёт
// обычный JavaScript примерно с таким смыслом:

const h3 = document.createElement('h3');
h3.textContent = product.name;

const p = document.createElement('p');
p.textContent = 'В корзине: 0';

const button = document.createElement('button');
button.textContent = 'В корзину';
button.addEventListener('click', () => {
  count = count + 1;
  // Компилятор ЗАРАНЕЕ разобрался, что от count зависит ровно один
  // кусочек текста на странице. Значит, обновить надо только его —
  // ни сравнивать деревья, ни обходить компоненты не нужно.
  p.textContent = 'В корзине: ' + count;
});

// Настоящий вывод компилятора выглядит длиннее и хитрее — здесь важна
// не буква, а мысль: в браузер уезжает код, который УЖЕ ЗНАЕТ,
// что и когда обновлять. Отдельной библиотеки-фреймворка,
// которая разбиралась бы в этом прямо во время работы, почти не нужно.`;
}
