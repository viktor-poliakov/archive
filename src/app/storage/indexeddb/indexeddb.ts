import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-storage-indexeddb',
  imports: [CodeBlock, RouterLink],
  templateUrl: './indexeddb.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StorageIndexeddb {
  protected readonly openExample = `// открыть (или создать) базу 'app' версии 1
const request = indexedDB.open('app', 1);

// onupgradeneeded — единственное место, где создают хранилища.
// срабатывает при первом открытии и при росте номера версии
request.onupgradeneeded = () => {
  const db = request.result;
  db.createObjectStore('users', { keyPath: 'id' }); // ключ записей — поле id
};

request.onsuccess = () => {
  const db = request.result; // база готова к работе
};`;

  protected readonly useExample = `// db — уже открытая база из примера выше

// ЗАПИСЬ: транзакция readwrite → хранилище → add
const writeTx = db.transaction('users', 'readwrite');
writeTx.objectStore('users').add({ id: 1, name: 'Anna' });

// ЧТЕНИЕ: транзакция readonly → get по ключу.
// результат приходит асинхронно, в onsuccess
const readTx = db.transaction('users', 'readonly');
const req = readTx.objectStore('users').get(1);
req.onsuccess = () => {
  console.log(req.result); // { id: 1, name: 'Anna' }
};`;

  protected readonly wrapperExample = `// на практике поверх «сырого» IndexedDB берут обёртку (например, idb),
// которая заменяет события на промисы — код становится линейным:
import { openDB } from 'idb';

const db = await openDB('app', 1, {
  upgrade(database) {
    database.createObjectStore('users', { keyPath: 'id' });
  },
});

await db.add('users', { id: 1, name: 'Anna' });
await db.get('users', 1); // { id: 1, name: 'Anna' }`;
}
