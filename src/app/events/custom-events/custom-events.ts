import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-events-custom-events',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom-events.html',
  styleUrls: ['../../content/doc.scss'],
})
export class EventsCustomEvents {
  protected readonly createExample = `const buyButton = document.querySelector('#buy-coffee');

// в другом месте приложения независимо слушаем это событие
buyButton.addEventListener('cart:add', (event) => {
  showToast('Added to cart: ' + event.detail.title);
});

// пользователь нажал «Купить» — сообщаем об этом событием
buyButton.dispatchEvent(
  new CustomEvent('cart:add', {
    detail: { title: 'Latte', price: 4.5 },
  }),
);`;

  protected readonly bubblesExample = `// значок корзины в шапке слушает ВСЕ добавления через делегирование
document.addEventListener('cart:add', (event) => {
  cartBadge.textContent = Number(cartBadge.textContent) + 1;
  console.log('added:', event.detail.title);
});

// любая карточка товара запускает событие — значку не нужно
// знать про конкретные кнопки, лишь бы событие всплыло
productCard.dispatchEvent(
  new CustomEvent('cart:add', {
    detail: { title: 'Espresso' },
    bubbles: true, // без этого событие не всплывёт до document
  }),
);`;

  protected readonly cancelExample = `const card = document.querySelector('#product-42');

// склад может отменить добавление, если товар закончился
card.addEventListener('cart:add', (event) => {
  if (event.detail.stock === 0) {
    event.preventDefault();
  }
});

const event = new CustomEvent('cart:add', {
  detail: { title: 'Espresso', stock: 0 },
  cancelable: true,
});

// dispatchEvent вернёт false, если сработал preventDefault
if (card.dispatchEvent(event)) {
  addToCart(); // добавляем только если добавление не отменили
} else {
  showToast('Out of stock');
}`;
}
