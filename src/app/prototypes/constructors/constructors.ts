import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-prototypes-constructors',
  imports: [CodeBlock, RouterLink],
  templateUrl: './constructors.html',
  styleUrls: ['../../content/doc.scss'],
})
export class PrototypesConstructors {
  protected readonly constructorFnExample = `// Функция-конструктор — обычная функция, вызванная через new.
// Соглашение: имя с большой буквы (Animal, а не animal).
function Animal(name) {
  // this — новый объект, который создал new. Дозаполняем его свойствами:
  this.name = name;
  this.legs = 4;
}

const cat = new Animal('Багира');
cat.name; // 'Багира'
cat.legs; // 4`;

  protected readonly newStepsExample = `// Что на самом деле делает new F(...) — по шагам (псевдокод):
function myNew(Constructor, ...args) {
  // 1. создаём пустой объект; его __proto__ сразу = Constructor.prototype
  const obj = Object.create(Constructor.prototype);

  // 2. вызываем конструктор с this = obj
  const result = Constructor.apply(obj, args);

  // 3. вернул объект — отдаём его; иначе — отдаём созданный obj
  return typeof result === 'object' && result !== null ? result : obj;
}

// то есть new Animal('Багира') — это примерно:
// const obj = Object.create(Animal.prototype);
// Animal.call(obj, 'Багира');`;

  protected readonly insideExample = `function Animal(name) {
  // Объект УЖЕ существует к этому моменту — new создал его ДО тела:
  console.log(this);                          // {} — пустой, но уже объект
  console.log(this.__proto__ === Animal.prototype); // true — прототип уже связан

  this.name = name; // конструктор просто ДОЗАПОЛНЯЕТ готовый объект
}

new Animal('Багира');`;

  protected readonly returnObjectExample = `// Если конструктор вернул ОБЪЕКТ — именно он станет результатом new
function Animal(name) {
  this.name = name;
  return { name: 'Другой объект', isFake: true };
}

const cat = new Animal('Багира');
cat.name;                           // 'Другой объект'
cat.isFake;                         // true
cat.__proto__ === Animal.prototype; // false!
cat.__proto__ === Object.prototype; // true — это прототип литерала {}`;

  protected readonly returnPrimitiveExample = `// Если конструктор вернул ПРИМИТИВ (или ничего) — return игнорируется
function Animal(name) {
  this.name = name;
  return 42; // примитив — просто отбрасывается
}

const cat = new Animal('Багира');
cat.name;              // 'Багира' — примитив не подменил this
cat instanceof Animal; // true`;

  protected readonly conditionalReturnExample = `// Никакой особой конструкции нет — это обычный if в теле конструктора
function Animal(name, useProxy) {
  this.name = name;
  if (useProxy) {
    return { name: 'Прокси', isFake: true }; // объект → подменит this
  }
  // иначе return нет → используется обычный this
}

new Animal('Багира', false).name; // 'Багира'
new Animal('Багира', true).name;  // 'Прокси'

// return this — валидно, но избыточно: new и так вернёт this`;

  protected readonly singletonExample = `// Синглтон: конструктор всегда возвращает один и тот же экземпляр
let instance;
function Singleton() {
  if (instance) return instance; // вернём уже созданный объект
  instance = this;
}

const a = new Singleton();
const b = new Singleton();
a === b; // true — оба указывают на один и тот же объект`;

  protected readonly cacheExample = `// Кэш инстансов: по ключу возвращаем готовый объект вместо нового
const cache = new Map();

function Connection(id) {
  if (cache.has(id)) return cache.get(id); // объект из кэша подменит this

  this.id = id;
  cache.set(id, this);
}

const c1 = new Connection('db-1');
const c2 = new Connection('db-1'); // тот же id
c1 === c2; // true — вернули закэшированное соединение`;

  protected readonly withoutNewExample = `// Если забыть new, this уже не новый объект
function Animal(name) {
  this.name = name; // в strict mode this === undefined
}

const cat = Animal('Багира'); // TypeError: Cannot set properties of undefined

// Старый приём-подстраховка: если вызвали без new — вызвать себя через new
function Animal2(name) {
  if (!(this instanceof Animal2)) return new Animal2(name);
  this.name = name;
}
Animal2('Багира').name; // 'Багира' — сработает даже без new

// Классы строже: вызов без new сразу бросает TypeError.`;
}
