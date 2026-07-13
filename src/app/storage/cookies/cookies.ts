import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-storage-cookies',
  imports: [CodeBlock, RouterLink],
  templateUrl: './cookies.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StorageCookies {
  protected readonly readWriteExample = `// запись — по одной паре за раз (присваивание НЕ затирает другие cookie)
document.cookie = 'theme=dark';
document.cookie = 'lang=ru';

// чтение — ВСЕ cookie одной строкой, без атрибутов
document.cookie; // 'theme=dark; lang=ru'`;

  protected readonly attributesExample = `// атрибуты дописывают через ';' в той же строке записи
document.cookie = 'token=abc; max-age=3600; path=/; Secure; SameSite=Strict';

// max-age  — сколько секунд жить (без него cookie исчезнет с закрытием браузера)
// path     — на каких путях сайта cookie доступна
// Secure   — отправлять только по HTTPS
// SameSite — не слать на сторонние сайты (защита от CSRF)`;

  protected readonly deleteExample = `// удалить cookie — задать ей истёкший срок (max-age=0).
// path и domain должны СОВПАДАТЬ с теми, что были при установке
document.cookie = 'theme=; max-age=0; path=/';`;
}
