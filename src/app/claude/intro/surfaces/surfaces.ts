import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-intro-surfaces',
  imports: [CodeBlock, RouterLink],
  templateUrl: './surfaces.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeIntroSurfaces {
  protected readonly install = `# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex`;

  protected readonly firstRun = `cd my-project
claude             # первый запуск откроет браузер для входа

claude --version   # проверить установку
claude doctor      # диагностика, если что-то не работает`;

  protected readonly handoff = `# запустить задачу в облаке прямо из терминала
claude --cloud "Обнови зависимости и почини тесты"

# забрать облачную сессию к себе в терминал
claude --teleport

# внутри сессии в терминале
/desktop          # продолжить в десктоп-приложении
/remote-control   # управлять с телефона или из браузера`;
}
