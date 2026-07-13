import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-storage-basics',
  imports: [CodeBlock, RouterLink],
  templateUrl: './basics.html',
  styleUrls: ['../../content/doc.scss'],
})
export class StorageBasics {
  protected readonly quickExample = `// сохранить значение — оно переживёт перезагрузку страницы
localStorage.setItem('theme', 'dark');

// прочитать позже — даже после закрытия и повторного открытия браузера
localStorage.getItem('theme'); // 'dark'`;
}
